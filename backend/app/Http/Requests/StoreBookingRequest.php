<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'slot_id' => ['required', 'integer', 'exists:availability_slots,id'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'level_id' => ['required', 'integer', 'exists:levels,id'],
            'child_first_name' => ['required', 'string', 'max:60'],
            'parent_email' => ['required', 'email:rfc', 'max:150'],
        ];
    }
}
