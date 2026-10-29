<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Créneaux concrets (datés) d'une heure proposés par un tuteur.
 * Un créneau réservé passe is_booked = true et n'est plus proposé.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availability_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained()->cascadeOnDelete();
            $table->timestampTz('starts_at');
            $table->timestampTz('ends_at');
            $table->boolean('is_booked')->default(false);
            $table->timestamps();

            $table->unique(['tutor_id', 'starts_at']);
            $table->index(['is_booked', 'starts_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availability_slots');
    }
};
