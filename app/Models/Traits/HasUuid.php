<?php

namespace App\Models\Traits;

use Illuminate\Support\Str;

trait HasUuid
{
    // Dipanggil otomatis oleh Eloquent saat model di-instantiate
    public function initializeHasUuid(): void
    {
        // merge default hidden
        $this->hidden = array_values(array_unique(array_merge(
            $this->hidden,
            ['id', 'created_at', 'updated_at']
        )));
    }

    // Route model binding pakai 'uuid'
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    // Isi uuid otomatis saat creating
    protected static function bootHasUuid(): void
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }
}
