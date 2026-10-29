<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Booking extends Model
{
    protected $fillable = [
        'reference', 'availability_slot_id', 'tutor_id', 'subject_id', 'level_id',
        'child_first_name', 'parent_email',
    ];

    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            $booking->reference ??= self::generateReference();
        });
    }

    /** Référence courte et lisible, affichée dans la confirmation. */
    public static function generateReference(): string
    {
        do {
            $reference = 'TM-'.Str::upper(Str::random(6));
        } while (self::where('reference', $reference)->exists());

        return $reference;
    }

    public function slot(): BelongsTo
    {
        return $this->belongsTo(AvailabilitySlot::class, 'availability_slot_id');
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(Tutor::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }
}
