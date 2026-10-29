<?php

namespace App\Http\Resources;

use App\Enums\Period;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\AvailabilitySlot */
class SlotResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $start = $this->starts_at->locale('fr');

        return [
            'id' => $this->id,
            'tutor_id' => $this->tutor_id,
            'starts_at' => $this->starts_at->toIso8601String(),
            'ends_at' => $this->ends_at->toIso8601String(),
            'weekday' => $start->dayOfWeekIso,
            'period' => Period::fromHour($start->hour)?->value,
            // Libellés prêts à afficher, pour ne pas dépendre d'une lib de dates côté front.
            'date_label' => ucfirst($start->isoFormat('dddd D MMMM')),
            'short_date_label' => ucfirst($start->isoFormat('ddd D MMM')),
            'time_label' => $start->format('H\hi').' – '.$this->ends_at->format('H\hi'),
        ];
    }
}
