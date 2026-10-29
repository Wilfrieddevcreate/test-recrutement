<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\AvailabilitySlot;
use App\Models\Booking;
use App\Models\Tutor;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Réservation automatique, sans validation humaine.
     * Le créneau est verrouillé puis marqué réservé dans une transaction ; la contrainte
     * d'unicité en base reste la garantie finale contre une double réservation.
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $booking = DB::transaction(function () use ($data) {
                $slot = AvailabilitySlot::whereKey($data['slot_id'])->lockForUpdate()->firstOrFail();

                if ($slot->is_booked || $slot->starts_at->isPast()) {
                    abort(409, "Ce créneau vient d'être réservé. Choisissez-en un autre.");
                }

                $teaches = Tutor::whereKey($slot->tutor_id)
                    ->teaching((int) $data['subject_id'], (int) $data['level_id'])
                    ->exists();

                if (! $teaches) {
                    abort(422, "Ce tuteur n'enseigne pas cette matière à ce niveau.");
                }

                $slot->update(['is_booked' => true]);

                return Booking::create([
                    'availability_slot_id' => $slot->id,
                    'tutor_id' => $slot->tutor_id,
                    'subject_id' => $data['subject_id'],
                    'level_id' => $data['level_id'],
                    'child_first_name' => trim($data['child_first_name']),
                    'parent_email' => mb_strtolower(trim($data['parent_email'])),
                ]);
            });
        } catch (UniqueConstraintViolationException) {
            abort(409, "Ce créneau vient d'être réservé. Choisissez-en un autre.");
        }

        return (new BookingResource($booking->load(['tutor', 'slot', 'subject', 'level'])))
            ->response()
            ->setStatusCode(201);
    }

    /** Consultation d'une réservation par sa référence (lien de confirmation). */
    public function show(Booking $booking): BookingResource
    {
        return new BookingResource($booking->load(['tutor', 'slot', 'subject', 'level']));
    }
}
