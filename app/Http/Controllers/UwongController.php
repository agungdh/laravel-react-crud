<?php

namespace App\Http\Controllers;

use App\Models\Uwong;
use Illuminate\Http\Request;
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

    function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'gender' => 'required|boolean',
            'birthday' => 'required|date',
            'phone' => 'required|numeric',
            'address' => 'required',
        ]);

        return Uwong::create($data);
    }

    public function show(Uwong $uwong)
    {
        return $uwong;
    }
}
