<?php

namespace App\Services;

use App\Models\Tutor;
use Illuminate\Support\Collection;

/** Résultat du matching pour un tuteur : le tuteur, ses créneaux compatibles, son score et ses atouts. */
final readonly class MatchResult
{
    /**
     * @param  Collection<int, \App\Models\AvailabilitySlot>  $slots
     * @param  array<int, string>  $reasons
     */
    public function __construct(
        public Tutor $tutor,
        public Collection $slots,
        public int $score,
        public array $reasons,
    ) {}
}
