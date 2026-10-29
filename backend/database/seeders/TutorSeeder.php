<?php

namespace Database\Seeders;

use App\Enums\Period;
use App\Models\AvailabilitySlot;
use App\Models\Level;
use App\Models\Subject;
use App\Models\Tutor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * 12 tuteurs fictifs aux profils variés (matières, niveaux, disponibilités, expérience).
 *
 * Les disponibilités sont décrites comme un rythme hebdomadaire (jour ISO 1-7 + période)
 * puis matérialisées en créneaux datés d'une heure sur les prochains jours, afin que
 * la réservation porte sur un créneau concret qui disparaît une fois pris.
 */
class TutorSeeder extends Seeder
{
    private const PHOTO = 'https://randomuser.me/api/portraits/%s/%d.jpg';

    public function run(): void
    {
        $subjects = Subject::pluck('id', 'slug');
        $levelsByCycle = Level::all()->groupBy('cycle')->map->pluck('id', 'slug');
        $horizon = (int) config('matching.horizon_days');
        $firstDay = Carbon::today()->addDay();

        foreach ($this->tutors() as $index => $data) {
            $tutor = Tutor::create([
                'first_name' => $data['first_name'],
                'headline' => $data['headline'],
                'bio' => $data['bio'],
                'photo_url' => sprintf(self::PHOTO, $data['photo'][0], $data['photo'][1]),
                'years_experience' => $data['years_experience'],
                'rating' => $data['rating'],
                'reviews_count' => $data['reviews_count'],
                'lessons_count' => $data['lessons_count'],
            ]);

            // Offre pédagogique : matière × niveaux. Une matière peut restreindre ses niveaux
            // (ex. philosophie uniquement en Terminale), sinon elle couvre tous les cycles du tuteur.
            $rows = [];
            foreach ($data['subjects'] as $slug => $onlyLevels) {
                $levelIds = $onlyLevels
                    ? Level::whereIn('slug', array_map(Str::slug(...), $onlyLevels))->pluck('id')
                    : collect($data['cycles'])->flatMap(fn ($c) => $levelsByCycle[$c]->values());

                foreach ($levelIds as $levelId) {
                    $rows[] = ['tutor_id' => $tutor->id, 'subject_id' => $subjects[$slug], 'level_id' => $levelId];
                }
            }
            DB::table('tutor_subject_level')->insert($rows);

            // Créneaux : générateur pseudo-aléatoire figé par tuteur pour un jeu de données reproductible.
            mt_srand(1000 + $index);
            $slots = [];
            for ($d = 0; $d < $horizon; $d++) {
                $day = $firstDay->copy()->addDays($d);
                foreach ($data['windows'] as [$weekday, $period]) {
                    if ($day->dayOfWeekIso !== $weekday) {
                        continue;
                    }
                    // Bloc de 2 à 3 heures consécutives à l'intérieur de la demi-journée.
                    $length = mt_rand(2, 3);
                    $start = mt_rand($period->startHour(), $period->endHour() - $length);
                    for ($h = $start; $h < $start + $length; $h++) {
                        $startsAt = $day->copy()->setTime($h, 0);
                        $slots[] = [
                            'tutor_id' => $tutor->id,
                            'starts_at' => $startsAt,
                            'ends_at' => $startsAt->copy()->addHour(),
                            'is_booked' => false,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }
            AvailabilitySlot::insert($slots);
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function tutors(): array
    {
        [$mo, $tu, $we, $th, $fr, $sa, $su] = [1, 2, 3, 4, 5, 6, 7];
        [$am, $pm, $ev] = [Period::Morning, Period::Afternoon, Period::Evening];

        return [
            [
                'first_name' => 'Camille', 'photo' => ['women', 44],
                'headline' => 'Ingénieure, spécialiste maths & physique',
                'bio' => "Diplômée de l'INSA, j'accompagne depuis 8 ans des collégiens et lycéens pour redonner confiance en sciences. Méthode progressive, beaucoup d'exercices corrigés ensemble.",
                'years_experience' => 8, 'rating' => 4.9, 'reviews_count' => 87, 'lessons_count' => 412,
                'subjects' => ['mathematiques' => null, 'physique-chimie' => null],
                'cycles' => ['college', 'lycee'],
                'windows' => [[$mo, $ev], [$we, $pm], [$sa, $am]],
            ],
            [
                'first_name' => 'Julien', 'photo' => ['men', 32],
                'headline' => 'Professeur agrégé de mathématiques',
                'bio' => "Enseignant en lycée depuis 12 ans, je prépare au bac et aux concours post-bac. J'insiste sur la rigueur du raisonnement et la gestion du temps en épreuve.",
                'years_experience' => 12, 'rating' => 4.8, 'reviews_count' => 143, 'lessons_count' => 690,
                'subjects' => ['mathematiques' => null],
                'cycles' => ['lycee'],
                'windows' => [[$tu, $ev], [$th, $ev], [$sa, $pm]],
            ],
            [
                'first_name' => 'Léa', 'photo' => ['women', 65],
                'headline' => 'Lettres modernes, préparation au bac',
                'bio' => "Master de lettres, 5 ans de soutien scolaire. J'aide à structurer une dissertation, à analyser un texte et à prendre plaisir à lire. Philosophie en Terminale.",
                'years_experience' => 5, 'rating' => 4.7, 'reviews_count' => 52, 'lessons_count' => 238,
                'subjects' => ['francais' => null, 'philosophie' => ['Terminale']],
                'cycles' => ['lycee'],
                'windows' => [[$mo, $pm], [$we, $ev], [$su, $am]],
            ],
            [
                'first_name' => 'Thomas', 'photo' => ['men', 75],
                'headline' => 'Langues vivantes : anglais & espagnol',
                'bio' => "Bilingue après 4 ans à Londres et 2 à Madrid. Mes cours privilégient l'oral et la confiance : on parle dès la première minute, à tous les niveaux.",
                'years_experience' => 6, 'rating' => 4.6, 'reviews_count' => 61, 'lessons_count' => 305,
                'subjects' => ['anglais' => null, 'espagnol' => null],
                'cycles' => ['college', 'lycee'],
                'windows' => [[$tu, $pm], [$th, $pm], [$sa, $am]],
            ],
            [
                'first_name' => 'Sarah', 'photo' => ['women', 21],
                'headline' => 'Professeure des écoles, français & histoire-géo',
                'bio' => "Institutrice pendant 10 ans, je sais rendre la grammaire et l'histoire vivantes pour les plus jeunes. Patience et bienveillance sont mes maîtres mots.",
                'years_experience' => 10, 'rating' => 4.9, 'reviews_count' => 118, 'lessons_count' => 534,
                'subjects' => ['francais' => null, 'histoire-geographie' => null],
                'cycles' => ['primaire', 'college'],
                'windows' => [[$we, $am], [$we, $pm], [$sa, $pm]],
            ],
            [
                'first_name' => 'Mehdi', 'photo' => ['men', 11],
                'headline' => 'Étudiant en médecine, maths & SVT au collège',
                'bio' => "En 3e année de médecine, je donne des cours depuis 3 ans. J'explique avec des schémas et des exemples concrets, idéal pour les collégiens qui décrochent.",
                'years_experience' => 3, 'rating' => 4.5, 'reviews_count' => 29, 'lessons_count' => 96,
                'subjects' => ['mathematiques' => null, 'svt' => null],
                'cycles' => ['college'],
                'windows' => [[$mo, $ev], [$fr, $ev], [$su, $pm]],
            ],
            [
                'first_name' => 'Inès', 'photo' => ['women', 90],
                'headline' => 'Docteure en biologie, physique-chimie & SVT',
                'bio' => "Chercheuse de formation, j'enseigne les sciences au lycée depuis 7 ans. Spécialité SVT et physique-chimie : TP expliqués, méthodologie des épreuves du bac.",
                'years_experience' => 7, 'rating' => 4.8, 'reviews_count' => 74, 'lessons_count' => 351,
                'subjects' => ['physique-chimie' => null, 'svt' => null],
                'cycles' => ['lycee'],
                'windows' => [[$tu, $ev], [$we, $pm], [$sa, $am]],
            ],
            [
                'first_name' => 'Lucas', 'photo' => ['men', 52],
                'headline' => "Anglais du primaire au lycée, certifié CELTA",
                'bio' => "Formateur certifié CELTA, 4 ans d'expérience. Je m'adapte à chaque âge : jeux et chansons pour les petits, préparation au bac et au TOEIC pour les grands.",
                'years_experience' => 4, 'rating' => 4.4, 'reviews_count' => 38, 'lessons_count' => 172,
                'subjects' => ['anglais' => null],
                'cycles' => ['primaire', 'college', 'lycee'],
                'windows' => [[$mo, $pm], [$th, $ev], [$sa, $pm], [$su, $am]],
            ],
            [
                'first_name' => 'Chloé', 'photo' => ['women', 12],
                'headline' => 'Spécialiste du primaire : maths & français',
                'bio' => "Orthopédagogue, j'accompagne les élèves de primaire depuis 9 ans, y compris avec des troubles de l'apprentissage. Chaque séance est ludique et structurée.",
                'years_experience' => 9, 'rating' => 5.0, 'reviews_count' => 96, 'lessons_count' => 458,
                'subjects' => ['mathematiques' => null, 'francais' => null],
                'cycles' => ['primaire'],
                'windows' => [[$tu, $pm], [$we, $am], [$fr, $pm]],
            ],
            [
                'first_name' => 'Antoine', 'photo' => ['men', 86],
                'headline' => 'Histoire-géo & philosophie, 15 ans au lycée',
                'bio' => "Professeur certifié d'histoire-géographie, j'enseigne aussi la philosophie en Terminale. Mon objectif : apprendre à argumenter et à construire une pensée claire.",
                'years_experience' => 15, 'rating' => 4.7, 'reviews_count' => 131, 'lessons_count' => 612,
                'subjects' => ['histoire-geographie' => null, 'philosophie' => ['Terminale']],
                'cycles' => ['lycee'],
                'windows' => [[$mo, $ev], [$th, $pm], [$su, $pm]],
            ],
            [
                'first_name' => 'Nadia', 'photo' => ['women', 33],
                'headline' => "Élève ingénieure, maths & physique au lycée",
                'bio' => "En dernière année à CentraleSupélec, je donne des cours depuis 2 ans. Proche des élèves, je partage mes astuces de méthode et de révision efficaces.",
                'years_experience' => 2, 'rating' => 4.3, 'reviews_count' => 17, 'lessons_count' => 54,
                'subjects' => ['mathematiques' => null, 'physique-chimie' => null],
                'cycles' => ['lycee'],
                'windows' => [[$we, $pm], [$fr, $ev], [$sa, $pm]],
            ],
            [
                'first_name' => 'Hugo', 'photo' => ['men', 22],
                'headline' => 'Espagnol & français, collège et lycée',
                'bio' => "Franco-espagnol, diplômé en lettres. Depuis 5 ans j'aide collégiens et lycéens à progresser en expression écrite et orale, dans les deux langues.",
                'years_experience' => 5, 'rating' => 4.6, 'reviews_count' => 45, 'lessons_count' => 201,
                'subjects' => ['espagnol' => null, 'francais' => null],
                'cycles' => ['college', 'lycee'],
                'windows' => [[$tu, $ev], [$sa, $am], [$su, $am]],
            ],
            [
                'first_name' => 'Émilie', 'photo' => ['women', 57],
                'headline' => 'Maths au collège, remise à niveau et confiance',
                'bio' => "Ancienne professeure de collège, 11 ans d'expérience. Je travaille les bases avec méthode pour que l'élève retrouve le plaisir de réussir en mathématiques.",
                'years_experience' => 11, 'rating' => 4.8, 'reviews_count' => 102, 'lessons_count' => 487,
                'subjects' => ['mathematiques' => null],
                'cycles' => ['college'],
                'windows' => [[$mo, $pm], [$we, $pm], [$fr, $pm], [$sa, $am]],
            ],
        ];
    }
}
