<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tutor extends Model
{
    protected $fillable = [
        'first_name', 'headline', 'bio', 'photo_url',
        'years_experience', 'rating', 'reviews_count', 'lessons_count',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'float',
            'years_experience' => 'integer',
            'reviews_count' => 'integer',
            'lessons_count' => 'integer',
        ];
    }

    /** Matières enseignées (dédoublonnées, le pivot contenant une ligne par niveau). */
    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'tutor_subject_level')->distinct();
    }

    /** Niveaux couverts (dédoublonnés). */
    public function levels(): BelongsToMany
    {
        return $this->belongsToMany(Level::class, 'tutor_subject_level')->distinct();
    }

    public function slots(): HasMany
    {
        return $this->hasMany(AvailabilitySlot::class);
    }

    /** Créneaux encore réservables, à venir, triés chronologiquement. */
    public function availableSlots(): HasMany
    {
        return $this->slots()
            ->where('is_booked', false)
            ->where('starts_at', '>', now())
            ->orderBy('starts_at');
    }

    /** Tuteurs dont l'offre pédagogique couvre exactement cette matière à ce niveau. */
    public function scopeTeaching(Builder $query, int $subjectId, int $levelId): Builder
    {
        return $query->whereExists(fn ($sub) => $sub
            ->selectRaw('1')
            ->from('tutor_subject_level')
            ->whereColumn('tutor_subject_level.tutor_id', 'tutors.id')
            ->where('tutor_subject_level.subject_id', $subjectId)
            ->where('tutor_subject_level.level_id', $levelId));
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
