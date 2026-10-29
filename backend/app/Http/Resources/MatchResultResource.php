<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Services\MatchResult */
class MatchResultResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'score' => $this->score,
            'reasons' => $this->reasons,
            'tutor' => new TutorResource($this->tutor),
            'slots' => SlotResource::collection($this->slots),
        ];
    }
}
