<?php

namespace App\Http\Resources;

use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Tutor */
class TutorResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'headline' => $this->headline,
            'bio' => $this->bio,
            'photo_url' => $this->photo_url,
            'years_experience' => $this->years_experience,
            'rating' => $this->rating,
            'reviews_count' => $this->reviews_count,
            'lessons_count' => $this->lessons_count,
            'subjects' => $this->whenLoaded('subjects', fn () => $this->subjects->sortBy('sort_order')->pluck('name')->values()),
            'cycles' => $this->whenLoaded('levels', fn () => $this->levels
                ->pluck('cycle')->unique()
                ->sortBy(fn ($c) => array_search($c, array_keys(Level::CYCLES)))
                ->map(fn ($c) => Level::CYCLES[$c])->values()),
            'available_slots' => SlotResource::collection($this->whenLoaded('availableSlots')),
        ];
    }
}
