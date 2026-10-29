<?php

namespace App\Http\Controllers\Api;

use App\Enums\Period;
use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

/** Données de référence nécessaires au formulaire de recherche, en un seul appel. */
class MetaController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $levels = Level::orderBy('sort_order')->get(['id', 'name', 'slug', 'cycle']);

        return response()->json([
            'subjects' => Subject::orderBy('sort_order')->get(['id', 'name', 'slug']),
            'cycles' => collect(Level::CYCLES)->map(fn ($label, $slug) => [
                'slug' => $slug,
                'label' => $label,
                'levels' => $levels->where('cycle', $slug)->values()->map->only(['id', 'name', 'slug']),
            ])->values(),
            'periods' => Period::options(),
            'weekdays' => collect(range(1, 7))->map(fn ($iso) => [
                'iso' => $iso,
                'label' => ucfirst(Carbon::now()->locale('fr')->isoWeekday($iso)->isoFormat('dddd')),
                'short' => ucfirst(Carbon::now()->locale('fr')->isoWeekday($iso)->isoFormat('dd')),
            ]),
        ]);
    }
}
