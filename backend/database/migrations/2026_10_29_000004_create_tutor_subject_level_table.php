<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Offre pédagogique d'un tuteur : une ligne = "ce tuteur enseigne cette matière à ce niveau".
 * Permet un filtrage exact (matière ET niveau) en une seule jointure.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tutor_subject_level', function (Blueprint $table) {
            $table->foreignId('tutor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('level_id')->constrained()->cascadeOnDelete();
            $table->primary(['tutor_id', 'subject_id', 'level_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tutor_subject_level');
    }
};
