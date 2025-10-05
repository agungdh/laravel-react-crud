<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UwongController extends Controller
{
    public function index()
    {
        return Inertia::render('uwong/index');
    }
}
