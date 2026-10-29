<?php

namespace Tests\Feature;

use App\Models\AvailabilitySlot;
use App\Models\Tutor;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeding_twice_does_not_duplicate_tutors_or_slots(): void
    {
        $this->seed(DatabaseSeeder::class);
        $tutors = Tutor::count();
        $slots = AvailabilitySlot::count();

        $this->seed(DatabaseSeeder::class);

        $this->assertGreaterThanOrEqual(10, $tutors);
        $this->assertSame($tutors, Tutor::count());
        $this->assertSame($slots, AvailabilitySlot::count());
    }

    public function test_all_seeded_slots_are_in_the_future(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(0, AvailabilitySlot::where('starts_at', '<=', now())->count());
    }
}
