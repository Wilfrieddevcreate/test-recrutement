<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 12)->unique();   // ex. "TM-7F3K9Q", affiché au parent
            // unique() : garantie en base qu'un créneau ne peut être réservé qu'une seule fois
            $table->foreignId('availability_slot_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('tutor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained();
            $table->foreignId('level_id')->constrained();
            $table->string('child_first_name');
            $table->string('parent_email');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
