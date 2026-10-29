<?php

namespace Tests\Feature;

use App\Models\AvailabilitySlot;
use App\Models\Level;
use App\Models\Subject;
use App\Models\Tutor;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    private function payloadFor(AvailabilitySlot $slot): array
    {
        $tutor = $slot->tutor;

        return [
            'slot_id' => $slot->id,
            'subject_id' => $tutor->subjects->first()->id,
            'level_id' => $tutor->levels->first()->id,
            'child_first_name' => 'Léo',
            'parent_email' => 'Parent@Example.com',
        ];
    }

    public function test_a_parent_can_book_a_slot_and_it_is_no_longer_available(): void
    {
        $slot = AvailabilitySlot::where('is_booked', false)->first();

        $response = $this->postJson('/api/bookings', $this->payloadFor($slot))
            ->assertCreated()
            ->assertJsonPath('data.child_first_name', 'Léo')
            ->assertJsonPath('data.parent_email', 'parent@example.com')
            ->assertJsonPath('data.slot.id', $slot->id);

        $this->assertStringStartsWith('TM-', $response->json('data.reference'));
        $this->assertTrue($slot->fresh()->is_booked);

        // Le créneau n'est plus proposé dans les disponibilités du tuteur…
        $ids = collect($this->getJson("/api/tutors/{$slot->tutor_id}/availabilities")->json('data'))->pluck('id');
        $this->assertNotContains($slot->id, $ids);

        // …ni dans les résultats du matching.
        $windows = collect(range(1, 7))
            ->flatMap(fn ($d) => collect(['morning', 'afternoon', 'evening'])->map(fn ($p) => ['weekday' => $d, 'period' => $p]))
            ->all();
        $tutor = $slot->tutor;
        $match = $this->postJson('/api/match', [
            'subject_id' => $tutor->subjects->first()->id,
            'level_id' => $tutor->levels->first()->id,
            'windows' => $windows,
        ])->assertOk();
        $matchedSlotIds = collect($match->json('data'))->flatMap(fn ($r) => collect($r['slots'])->pluck('id'));
        $this->assertNotContains($slot->id, $matchedSlotIds);
    }

    public function test_a_slot_cannot_be_booked_twice(): void
    {
        $slot = AvailabilitySlot::where('is_booked', false)->first();
        $payload = $this->payloadFor($slot);

        $this->postJson('/api/bookings', $payload)->assertCreated();
        $this->postJson('/api/bookings', $payload)->assertStatus(409);

        $this->assertDatabaseCount('bookings', 1);
    }

    public function test_booking_requires_the_tutor_to_teach_the_requested_subject_and_level(): void
    {
        // Julien : maths au lycée uniquement. On tente une réservation en CP.
        $julien = Tutor::where('first_name', 'Julien')->first();
        $slot = $julien->availableSlots()->first();

        $this->postJson('/api/bookings', [
            'slot_id' => $slot->id,
            'subject_id' => Subject::where('slug', 'mathematiques')->first()->id,
            'level_id' => Level::where('slug', 'cp')->first()->id,
            'child_first_name' => 'Léo',
            'parent_email' => 'parent@example.com',
        ])->assertStatus(422);

        $this->assertFalse($slot->fresh()->is_booked);
    }

    public function test_booking_can_be_retrieved_by_reference(): void
    {
        $slot = AvailabilitySlot::where('is_booked', false)->first();
        $reference = $this->postJson('/api/bookings', $this->payloadFor($slot))->json('data.reference');

        $this->getJson("/api/bookings/{$reference}")
            ->assertOk()
            ->assertJsonPath('data.reference', $reference);
    }

    public function test_booking_request_is_validated(): void
    {
        $this->postJson('/api/bookings', ['parent_email' => 'not-an-email'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slot_id', 'subject_id', 'level_id', 'child_first_name', 'parent_email']);
    }
}
