<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubjectSeeder extends Seeder
{
    public const SUBJECTS = [
        'Mathématiques',
        'Français',
        'Physique-Chimie',
        'Anglais',
        'Histoire-Géographie',
        'SVT',
        'Espagnol',
        'Philosophie',
    ];

    public function run(): void
    {
        foreach (self::SUBJECTS as $i => $name) {
            Subject::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'sort_order' => $i],
            );
        }
    }
}
