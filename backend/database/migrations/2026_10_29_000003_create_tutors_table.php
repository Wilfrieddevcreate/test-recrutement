<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tutors', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('headline');                 // ex. "Professeur agrégé de mathématiques"
            $table->text('bio');                        // courte présentation
            $table->string('photo_url')->nullable();
            $table->unsignedSmallInteger('years_experience')->default(0);
            $table->decimal('rating', 2, 1)->default(0); // moyenne des évaluations élèves (0 à 5)
            $table->unsignedInteger('reviews_count')->default(0);
            $table->unsignedInteger('lessons_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tutors');
    }
};
