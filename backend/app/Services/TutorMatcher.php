<?php

namespace App\Services;

use App\Enums\Period;
use App\Models\AvailabilitySlot;
use App\Models\Tutor;
use Illuminate\Support\Collection;

/**
 * Algorithme de matching élèves ↔ tuteurs.
 *
 * Étape 1 — filtres obligatoires (éliminatoires) :
 *   • le tuteur enseigne la matière demandée au niveau demandé (requête SQL) ;
 *   • il a au moins un créneau libre, à venir, dans l'une des demi-journées souhaitées.
 *
 * Étape 2 — classement des tuteurs retenus par un score de 0 à 100,
 *   somme pondérée de critères normalisés (poids et plafonds dans config/matching.php).
 */
final class TutorMatcher
{
    /**
     * @param  array<int, array{weekday: int, period: string}>  $windows  Demi-journées souhaitées (jour ISO 1-7 + période)
     * @return Collection<int, MatchResult>
     */
    public function match(int $subjectId, int $levelId, array $windows): Collection
    {
        $horizonEnd = now()->addDays((int) config('matching.horizon_days'))->endOfDay();

        $tutors = Tutor::query()
            ->teaching($subjectId, $levelId)
            ->with([
                'subjects',
                'availableSlots' => fn ($query) => $query->where('starts_at', '<=', $horizonEnd),
            ])
            ->get();

        return $tutors
            ->map(function (Tutor $tutor) use ($windows) {
                $matchingSlots = $tutor->availableSlots
                    ->filter(fn (AvailabilitySlot $slot) => $this->slotFitsWindows($slot, $windows))
                    ->values();

                if ($matchingSlots->isEmpty()) {
                    return null; // critère obligatoire non respecté : exclu avant classement
                }

                return new MatchResult(
                    tutor: $tutor,
                    slots: $matchingSlots,
                    score: $this->score($tutor, $matchingSlots->count()),
                    reasons: $this->reasons($tutor, $matchingSlots),
                );
            })
            ->filter()
            ->sortByDesc(fn (MatchResult $r) => [$r->score, $r->tutor->rating, $r->tutor->reviews_count])
            ->values();
    }

    /**
     * Un créneau convient si son jour ET sa période correspondent à l'une des demi-journées demandées.
     *
     * @param  array<int, array{weekday: int, period: string}>  $windows
     */
    public function slotFitsWindows(AvailabilitySlot $slot, array $windows): bool
    {
        $weekday = $slot->starts_at->dayOfWeekIso;
        $period = Period::fromHour($slot->starts_at->hour)?->value;

        foreach ($windows as $window) {
            if ((int) $window['weekday'] === $weekday && $window['period'] === $period) {
                return true;
            }
        }

        return false;
    }

    /** Score de pertinence entier de 0 à 100. */
    public function score(Tutor $tutor, int $matchingSlotsCount): int
    {
        $weights = config('matching.weights');
        $caps = config('matching.caps');

        $components = [
            'availability' => $this->ratio($matchingSlotsCount, $caps['availability']),
            'rating' => $this->ratio($tutor->rating, 5),
            'experience' => $this->ratio($tutor->years_experience, $caps['experience']),
            'lessons' => $this->ratio($tutor->lessons_count, $caps['lessons']),
        ];

        $score = 0;
        foreach ($components as $key => $value) {
            $score += $weights[$key] * $value;
        }

        return (int) round($score);
    }

    /**
     * Arguments courts et concrets expliquant le classement, affichés sous forme de badges.
     *
     * @return array<int, string>
     */
    private function reasons(Tutor $tutor, Collection $slots): array
    {
        $reasons = [];

        if ($tutor->rating >= 4.8 && $tutor->reviews_count >= 30) {
            $reasons[] = sprintf('Noté %s/5 par %d élèves', number_format($tutor->rating, 1, ',', ''), $tutor->reviews_count);
        }

        if ($tutor->years_experience >= 8) {
            $reasons[] = sprintf("%d ans d'expérience", $tutor->years_experience);
        }

        if ($slots->count() >= 3) {
            $reasons[] = sprintf('%d créneaux qui vous conviennent', $slots->count());
        }

        if ($tutor->lessons_count >= 300) {
            $reasons[] = sprintf('Plus de %d cours donnés', (int) floor($tutor->lessons_count / 100) * 100);
        }

        return array_slice($reasons, 0, 3);
    }

    private function ratio(float|int $value, float|int $cap): float
    {
        return $cap > 0 ? min($value, $cap) / $cap : 0.0;
    }
}
