<?php

namespace App\Console\Commands;

use App\Models\Tutor;
use Illuminate\Console\Command;

/** Charge le jeu de données fictif au premier démarrage, sans écraser des réservations existantes ensuite. */
class SeedIfEmpty extends Command
{
    protected $signature = 'app:seed-if-empty';

    protected $description = 'Charge le jeu de données fictif si aucun tuteur n\'existe encore';

    public function handle(): int
    {
        if (Tutor::query()->exists()) {
            $this->info('Jeu de données déjà présent, seed ignoré.');

            return self::SUCCESS;
        }

        return $this->call('db:seed', ['--force' => true]);
    }
}
