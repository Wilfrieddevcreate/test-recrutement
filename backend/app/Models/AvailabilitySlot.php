<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AvailabilitySlot extends Model
{
    protected $fillable = ['tutor_id', 'starts_at', 'ends_at', 'is_booked'];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_booked' => 'boolean',
        ];
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(Tutor::class);
    }

    public function booking(): HasOne
    {
        return $this->hasOne(Booking::class);
    }
}
