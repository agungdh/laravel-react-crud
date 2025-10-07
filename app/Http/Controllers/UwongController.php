<?php

namespace App\Http\Controllers;

use App\Models\Uwong;
use Inertia\Inertia;

class UwongController extends Controller
{
    public function datas()
    {
        return Uwong::all();
    }

    public function index()
    {
        return Inertia::render('uwong/index');
    }

    public function create()
    {
        return Inertia::render('uwong/form');
    }

    public function show(Uwong $uwong)
    {
        return $uwong;
    }
}
