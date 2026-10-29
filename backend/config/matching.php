<?php

/*
|--------------------------------------------------------------------------
| Paramètres de l'algorithme de matching
|--------------------------------------------------------------------------
| Les critères obligatoires (matière, niveau, disponibilité) sont des filtres
| stricts appliqués en base. Les poids ci-dessous ne servent qu'au classement
| des tuteurs déjà compatibles. Leur somme fait 100 : le score est donc une
| note de pertinence directement lisible, de 0 à 100.
*/

return [
    // Nombre de jours à venir pendant lesquels on cherche des créneaux.
    'horizon_days' => 14,

    'weights' => [
        'availability' => 35, // nombre de créneaux compatibles avec les souhaits du parent
        'rating' => 30,       // évaluations des élèves (0 à 5)
        'experience' => 20,   // années d'expérience
        'lessons' => 15,      // nombre de cours déjà donnés sur la plateforme
    ],

    // Valeurs au-delà desquelles un critère est considéré comme "maximal".
    'caps' => [
        'availability' => 6,
        'experience' => 10,
        'lessons' => 300,
    ],
];
