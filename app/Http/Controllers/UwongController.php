<?php

namespace App\Http\Controllers;

use App\Models\Uwong;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UwongController extends Controller
{
    public function datas()
    {
        return Uwong::orderBy('id', 'desc')->get();
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
        $data = $this->validate($request);

        return Uwong::create($data);
    }

    public function show(Uwong $uwong)
    {
        return $uwong;
    }

    public function edit(Uwong $uwong)
    {
        return Inertia::render('uwong/form', [
            'uwong_uuid' => $uwong->uuid,
        ]);
    }

    function update(Request $request, Uwong $uwong) {
        $data = $this->validate($request);

        return $uwong->update($data);
    }

    private function validate(Request $request) {
        return $request->validate([
            'name' => 'required',
            'gender' => 'required|boolean',
            'birthday' => 'required|date',
            'phone' => 'required|numeric',
            'address' => 'required',
        ]);
    }
}
