<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Booking */
class BookingResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'reference' => $this->reference,
            'child_first_name' => $this->child_first_name,
            'parent_email' => $this->parent_email,
            'subject' => $this->subject->name,
            'level' => $this->level->name,
            'tutor' => new TutorResource($this->tutor),
            'slot' => new SlotResource($this->slot),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
