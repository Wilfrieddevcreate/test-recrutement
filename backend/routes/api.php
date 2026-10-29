<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\MetaController;
use App\Http\Controllers\Api\TutorController;
use Illuminate\Support\Facades\Route;

// Données de référence du formulaire (matières, niveaux, périodes, jours)
Route::get('/meta', MetaController::class);

// Tuteurs et disponibilités
Route::get('/tutors', [TutorController::class, 'index']);
Route::get('/tutors/{tutor}/availabilities', [TutorController::class, 'availabilities']);

// Matching : filtrage strict puis classement
Route::post('/match', MatchController::class);

// Réservation automatique
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{booking:reference}', [BookingController::class, 'show']);
