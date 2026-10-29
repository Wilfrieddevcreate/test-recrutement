# Tutoring Match

Prototype de matching intelligent entre élèves et tuteurs, avec réservation automatique d'un créneau.

- `backend/` : API REST Laravel 13 + PostgreSQL
- `frontend/` : interface React + Vite + Tailwind CSS
- `docker-compose.yml` : base PostgreSQL 16

## Démarrage rapide

```bash
# 1. Base de données
docker compose up -d

# 2. Backend (port 8000)
cd backend
composer install
cp .env.example .env && php artisan key:generate
php artisan migrate --seed
php artisan serve

# 3. Frontend (port 5173)
cd frontend
npm install
npm run dev
```

Puis ouvrir http://localhost:5173.

_README complet (choix techniques, algorithme de matching) à venir._
