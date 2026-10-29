<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    public const CYCLES = [
        'primaire' => 'Primaire',
        'college' => 'Collège',
        'lycee' => 'Lycée',
    ];

    protected $fillable = ['name', 'slug', 'cycle', 'sort_order'];
}
