<?php

namespace App\Enums;

/**
 * Demi-journées proposées au parent dans le formulaire.
 * Un créneau horaire appartient à la période qui contient son heure de début.
 */
enum Period: string
{
    case Morning = 'morning';
    case Afternoon = 'afternoon';
    case Evening = 'evening';

    public function label(): string
    {
        return match ($this) {
            self::Morning => 'Matin',
            self::Afternoon => 'Après-midi',
            self::Evening => 'Soir',
        };
    }

    /** Heure de début incluse. */
    public function startHour(): int
    {
        return match ($this) {
            self::Morning => 8,
            self::Afternoon => 12,
            self::Evening => 18,
        };
    }

    /** Heure de fin exclue. */
    public function endHour(): int
    {
        return match ($this) {
            self::Morning => 12,
            self::Afternoon => 18,
            self::Evening => 21,
        };
    }

    public static function fromHour(int $hour): ?self
    {
        foreach (self::cases() as $period) {
            if ($hour >= $period->startHour() && $hour < $period->endHour()) {
                return $period;
            }
        }

        return null;
    }

    /** @return array<int, array{value: string, label: string, hours: string}> */
    public static function options(): array
    {
        return array_map(fn (self $p) => [
            'value' => $p->value,
            'label' => $p->label(),
            'hours' => sprintf('%dh – %dh', $p->startHour(), $p->endHour()),
        ], self::cases());
    }
}
