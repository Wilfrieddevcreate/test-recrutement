<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MatchRequest;
use App\Http\Resources\MatchResultResource;
use App\Services\TutorMatcher;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MatchController extends Controller
{
    public function __invoke(MatchRequest $request, TutorMatcher $matcher): AnonymousResourceCollection
    {
        $results = $matcher->match(
            subjectId: (int) $request->integer('subject_id'),
            levelId: (int) $request->integer('level_id'),
            windows: $request->validated('windows'),
        );

        return MatchResultResource::collection($results);
    }
}
