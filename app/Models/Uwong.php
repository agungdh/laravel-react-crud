<?php

namespace App\Models;

use App\Models\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Uwong extends Model
{
    /** @use HasFactory<\Database\Factories\UwongFactory> */
    use HasFactory, HasUuid;
}
