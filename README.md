# Tutoring Match

Prototype de matching intelligent entre élèves et tuteurs, avec réservation automatique d'un créneau, sans intervention humaine.

Parcours parent : **matière + niveau + disponibilités → tuteurs classés par pertinence → réservation d'un créneau → confirmation immédiate.**

| Composant | Technologie |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Laravel 13 (PHP 8.4), API REST JSON |
| Base de données | PostgreSQL 16 |
| Lancement | Docker Compose (pile complète) ou natif |

## Installation et lancement

### Option 1 : tout en Docker (recommandé pour tester)

Prérequis : Docker avec Compose. Aucune installation de PHP ni de Node.

```bash
docker compose up --build
```

Puis ouvrir **http://localhost:5173**. Au premier démarrage, l'API applique les migrations et charge le jeu de données (13 tuteurs, créneaux sur 14 jours). Les ports sont modifiables si besoin : `API_PORT=8080 WEB_PORT=3000 docker compose up`.

Pour repartir d'une base vierge : `docker compose down -v`.

### Option 2 : en local

Prérequis : PHP ≥ 8.4 avec `pdo_pgsql` (le `composer.lock` est résolu pour PHP 8.4), Composer, Node ≥ 20, Docker (pour PostgreSQL uniquement).

```bash
# 1. Base de données (PostgreSQL sur le port 5434)
docker compose up -d db

# 2. API Laravel — http://localhost:8000
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed        # schéma + 13 tuteurs fictifs avec créneaux sur 14 jours
                                  # (relancer `php artisan db:seed` régénère les créneaux sans doublon)
php artisan serve

# 3. Interface — http://localhost:5173
cd ../frontend
npm install
npm run dev
```

En développement comme dans Docker, le serveur Vite relaie `/api` vers Laravel : pas de CORS ni de variable d'environnement côté navigateur. Pour un déploiement séparé, définir `VITE_API_URL`.

Tests backend (SQLite en mémoire, aucune base à préparer) :

```bash
cd backend && php artisan test
```

## Choix techniques

### Modèle de données

- `tutors` : prénom, accroche, présentation, photo, années d'expérience, note moyenne, nombre d'avis, nombre de cours donnés.
- `subjects`, `levels` (classe + cycle primaire / collège / lycée).
- `tutor_subject_level` : une ligne = « ce tuteur enseigne cette matière à ce niveau ». Permet un filtrage exact en une jointure et autorise des offres fines (ex. philosophie uniquement en Terminale).
- `availability_slots` : **créneaux datés d'une heure**, générés à partir d'un rythme hebdomadaire par tuteur. Un créneau concret peut être marqué réservé et disparaît alors des propositions, ce qu'une simple récurrence ne permettrait pas.
- `bookings` : référence lisible (`TM-XXXXXX`), prénom de l'élève, e-mail du parent, et **contrainte d'unicité sur le créneau** : la base elle-même interdit toute double réservation.

### Algorithme de matching (`app/Services/TutorMatcher.php`)

1. **Filtres obligatoires, éliminatoires** : le tuteur enseigne la matière au niveau demandé (requête SQL) **et** possède au moins un créneau libre à venir dans l'une des demi-journées souhaitées. Un tuteur qui ne remplit pas ces trois conditions n'est jamais classé.
2. **Classement** des tuteurs retenus par un score de 0 à 100, somme pondérée de critères normalisés :

   | Critère | Poids | Normalisation |
   |---|---|---|
   | Créneaux compatibles avec les souhaits du parent | 35 | plafonné à 6 créneaux |
   | Évaluations des élèves | 30 | note / 5, pondérée par la confiance (plafond 20 avis) |
   | Expérience | 20 | plafonnée à 10 ans |
   | Cours déjà donnés sur la plateforme | 15 | plafonnés à 300 |

   La pondération par la confiance évite qu'un 5/5 obtenu avec 3 avis passe devant un 4,9 obtenu avec 200 avis. Les poids et plafonds vivent dans `backend/config/matching.php` : la logique évolue sans toucher au code. Chaque résultat embarque des **atouts explicables** (« Très bien noté », « 7 créneaux pour vous ») affichés sous forme de badges, pour que le parent comprenne le classement.

Le parent exprime ses disponibilités en **demi-journées** (matin 8h–12h, après-midi 12h–18h, soir 18h–21h) par jour de semaine : c'est ainsi qu'une famille raisonne, et le backend fait la correspondance avec les créneaux horaires concrets des 14 prochains jours.

### Réservation

`POST /api/bookings` s'exécute dans une transaction : verrou du créneau (`SELECT … FOR UPDATE`), vérification qu'il est libre et que le tuteur enseigne bien la matière au niveau demandé, puis enregistrement. Si deux familles valident le même créneau, la seconde reçoit un **409** et l'interface lui propose de choisir un autre créneau après rafraîchissement des résultats. Aucune validation administrative.

### Interface

- **Un seul écran, trois temps**, sans rechargement : formulaire → résultats → confirmation, avec un panneau de réservation (modale sur ordinateur, bottom sheet sur mobile).
- **Le moins de saisie possible** : matière et classe en pastilles, disponibilités dans une grille cliquable (transposée sur mobile pour des cases larges) avec des raccourcis (« Soirs de semaine », « Week-end »). Le prénom de l'enfant est facultatif : il personnalise le parcours (« 2 tuteurs pour Léa ») et pré-remplit la réservation, où seul l'e-mail reste à saisir. Les coordonnées sont mémorisées pour la fois suivante.
- **Lisibilité des résultats** : meilleur match mis en avant, anneau de pertinence, atouts, créneaux groupés par jour, accès à toutes les disponibilités du tuteur.
- **Fluidité** : squelettes de chargement, transitions d'apparition (désactivées si le système demande moins d'animations), états de bouton, mobile-first sans débordement dès 360px, bouton « retour » du navigateur qui ramène à l'étape précédente.
- **Petit plus** : export iCalendar du cours réservé depuis l'écran de confirmation.

### API

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/meta` | Matières, niveaux par cycle, périodes, jours (alimente le formulaire) |
| GET | `/api/tutors` | Liste des tuteurs |
| GET | `/api/tutors/{id}/availabilities` | Créneaux encore libres d'un tuteur |
| POST | `/api/match` | Tuteurs compatibles classés, avec leurs créneaux correspondants |
| POST | `/api/bookings` | Réservation d'un créneau (201, ou 409 s'il vient d'être pris) |
| GET | `/api/bookings/{reference}` | Consultation d'une réservation |

Les dates sont renvoyées en ISO 8601 avec le fuseau Europe/Paris, accompagnées de libellés français prêts à afficher.

## Structure du dépôt

```
backend/   API Laravel : app/Services/TutorMatcher.php (matching), app/Http/Controllers/Api,
           database/seeders (13 tuteurs), tests (16 tests : matching, réservation, scoring, seeder)
frontend/  SPA React : src/components/{search,results,booking,ui,layout}, src/api/client.js
docker-compose.yml   pile complète (PostgreSQL 16, API, frontend) ; Dockerfile dans backend/ et frontend/
```

## Périmètre et évolutions possibles

Conformément à l'énoncé, l'authentification, le paiement, les e-mails et la visioconférence ne sont pas implémentés. Pistes naturelles : notification e-mail à la réservation, espace parent pour gérer ses cours, scoring enrichi (affinité avec les retours d'élèves du même niveau), disponibilités récurrentes éditables par les tuteurs.
