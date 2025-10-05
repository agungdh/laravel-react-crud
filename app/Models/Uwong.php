<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Uwong extends Model
{
    /** @use HasFactory<\Database\Factories\UwongFactory> */
    use HasFactory;

    protected static function booted()
    {
        static::creating(function ($uwong) {
            $uwong->uuid = (string) Str::uuid();
        });
    }
}
