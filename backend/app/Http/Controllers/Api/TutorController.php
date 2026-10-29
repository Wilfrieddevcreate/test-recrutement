<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SlotResource;
use App\Http\Resources\TutorResource;
use App\Models\Tutor;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TutorController extends Controller
{
    /** Liste de tous les tuteurs avec leurs matières et cycles. */
    public function index(): AnonymousResourceCollection
    {
        return TutorResource::collection(
            Tutor::with(['subjects', 'levels'])->orderByDesc('rating')->get()
        );
    }

    /** Créneaux encore réservables d'un tuteur, sur l'horizon de recherche. */
    public function availabilities(Tutor $tutor): AnonymousResourceCollection
    {
        $horizonEnd = now()->addDays((int) config('matching.horizon_days'))->endOfDay();

        return SlotResource::collection(
            $tutor->availableSlots()->where('starts_at', '<=', $horizonEnd)->get()
        );
    }
}
