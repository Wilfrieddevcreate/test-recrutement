<?php

namespace App\Http\Requests;

use App\Enums\Period;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'level_id' => ['required', 'integer', 'exists:levels,id'],
            'windows' => ['required', 'array', 'min:1', 'max:21'],
            'windows.*.weekday' => ['required', 'integer', 'between:1,7'],
            'windows.*.period' => ['required', Rule::enum(Period::class)],
        ];
    }
}
