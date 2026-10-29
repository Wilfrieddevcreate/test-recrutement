<?php

namespace Tests\Unit;

use App\Models\Tutor;
use App\Services\TutorMatcher;
use Tests\TestCase;

class TutorMatcherTest extends TestCase
{
    public function test_score_is_bounded_between_0_and_100(): void
    {
        $matcher = new TutorMatcher;

        $none = new Tutor(['rating' => 0, 'reviews_count' => 0, 'years_experience' => 0, 'lessons_count' => 0]);
        $best = new Tutor(['rating' => 5, 'reviews_count' => 500, 'years_experience' => 30, 'lessons_count' => 2000]);

        $this->assertSame(0, $matcher->score($none, 0));
        $this->assertSame(100, $matcher->score($best, 50));
    }

    public function test_a_well_reviewed_tutor_outranks_a_perfect_score_with_few_reviews(): void
    {
        $matcher = new TutorMatcher;

        $fewReviews = new Tutor(['rating' => 5.0, 'reviews_count' => 3, 'years_experience' => 5, 'lessons_count' => 100]);
        $manyReviews = new Tutor(['rating' => 4.9, 'reviews_count' => 200, 'years_experience' => 5, 'lessons_count' => 100]);

        $this->assertGreaterThan($matcher->score($fewReviews, 3), $matcher->score($manyReviews, 3));
    }

    public function test_more_compatible_slots_raise_the_score(): void
    {
        $matcher = new TutorMatcher;
        $tutor = new Tutor(['rating' => 4.5, 'reviews_count' => 40, 'years_experience' => 4, 'lessons_count' => 150]);

        $this->assertGreaterThan($matcher->score($tutor, 1), $matcher->score($tutor, 6));
    }
}
