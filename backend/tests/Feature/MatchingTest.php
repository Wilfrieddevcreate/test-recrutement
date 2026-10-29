<?php

namespace Tests\Feature;

use App\Models\Level;
use App\Models\Subject;
use App\Models\Tutor;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MatchingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_only_tutors_teaching_the_subject_at_the_level_with_a_fitting_slot_are_returned(): void
    {
        $maths = Subject::where('slug', 'mathematiques')->first();
        $quatrieme = Level::where('slug', '4e')->first();

        // Toutes les demi-journées : seul le filtre matière + niveau joue.
        $allWindows = collect(range(1, 7))
            ->flatMap(fn ($d) => collect(['morning', 'afternoon', 'evening'])->map(fn ($p) => ['weekday' => $d, 'period' => $p]))
            ->all();

        $response = $this->postJson('/api/match', [
            'subject_id' => $maths->id,
            'level_id' => $quatrieme->id,
            'windows' => $allWindows,
        ])->assertOk();

        $names = collect($response->json('data'))->pluck('tutor.first_name');

        // Camille, Mehdi et Émilie font des maths au collège ; Julien et Nadia uniquement au lycée.
        $this->assertEqualsCanonicalizing(['Camille', 'Mehdi', 'Émilie'], $names->all());

        foreach ($response->json('data') as $result) {
            $this->assertNotEmpty($result['slots']);
            $this->assertIsInt($result['score']);
            $this->assertGreaterThanOrEqual(0, $result['score']);
            $this->assertLessThanOrEqual(100, $result['score']);
        }
    }

    public function test_results_are_sorted_by_descending_score(): void
    {
        $response = $this->postJson('/api/match', [
            'subject_id' => Subject::where('slug', 'mathematiques')->first()->id,
            'level_id' => Level::where('slug', 'terminale')->first()->id,
            'windows' => [['weekday' => 6, 'period' => 'afternoon'], ['weekday' => 3, 'period' => 'afternoon']],
        ])->assertOk();

        $scores = collect($response->json('data'))->pluck('score')->all();
        $sorted = $scores;
        rsort($sorted);

        $this->assertNotEmpty($scores);
        $this->assertSame($sorted, $scores);
    }

    public function test_availability_is_a_hard_filter(): void
    {
        // Julien n'enseigne que le mardi soir, jeudi soir et samedi après-midi.
        $response = $this->postJson('/api/match', [
            'subject_id' => Subject::where('slug', 'mathematiques')->first()->id,
            'level_id' => Level::where('slug', 'terminale')->first()->id,
            'windows' => [['weekday' => 1, 'period' => 'morning']], // lundi matin : personne
        ])->assertOk();

        $this->assertSame([], $response->json('data'));
    }

    public function test_every_returned_slot_matches_a_requested_window(): void
    {
        $response = $this->postJson('/api/match', [
            'subject_id' => Subject::where('slug', 'anglais')->first()->id,
            'level_id' => Level::where('slug', '6e')->first()->id,
            'windows' => [['weekday' => 6, 'period' => 'morning']],
        ])->assertOk();

        foreach ($response->json('data') as $result) {
            foreach ($result['slots'] as $slot) {
                $this->assertSame(6, $slot['weekday']);
                $this->assertSame('morning', $slot['period']);
            }
        }
    }

    public function test_match_request_is_validated(): void
    {
        $this->postJson('/api/match', ['subject_id' => 999, 'windows' => []])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['subject_id', 'level_id', 'windows']);
    }

    public function test_tutor_list_and_availabilities_endpoints_work(): void
    {
        $this->getJson('/api/tutors')->assertOk()->assertJsonCount(Tutor::count(), 'data');

        $tutor = Tutor::first();
        $this->getJson("/api/tutors/{$tutor->id}/availabilities")
            ->assertOk()
            ->assertJsonCount($tutor->availableSlots()->count(), 'data');
    }
}
