<?php

namespace App\Http\Controllers;

use App\Models\Uwong;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class UwongController extends Controller
{
    /**
     * Ambil semua data Uwong (dipakai di React pakai PATCH)
     */
    public function datas()
    {
        return Uwong::orderBy('id', 'desc')->get();
    }

    /**
     * Halaman utama Uwong (daftar)
     */
    public function index()
    {
        return Inertia::render('uwong/index');
    }

    /**
     * Halaman tambah Uwong
     */
    public function create()
    {
        return Inertia::render('uwong/form');
    }

    /**
     * Simpan data baru Uwong
     */
    public function store(Request $request)
    {
        $data = $this->validateUwong($request);
        $uwong = Uwong::create($data);
        return response()->json($uwong, 201);
    }

    /**
     * Tampilkan data Uwong (JSON, dipakai untuk edit)
     */
    public function show(Uwong $uwong)
    {
        return response()->json($uwong);
    }

    /**
     * Halaman edit Uwong
     */
    public function edit(Uwong $uwong)
    {
        return Inertia::render('uwong/form', [
            'uwong_uuid' => $uwong->uuid,
        ]);
    }

    /**
     * Update data Uwong
     */
    public function update(Request $request, Uwong $uwong)
    {
        $data = $this->validateUwong($request);
        $uwong->update($data);
        return response()->json($uwong);
    }

    /**
     * Hapus data Uwong
     */
    public function destroy(Uwong $uwong)
    {
        $uwong->delete();
        return response()->noContent();
    }

    /**
     * Validasi field Uwong
     */
    private function validateUwong(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|boolean',
            'birthday' => 'required|date',
            'phone' => 'required|numeric',
            'address' => 'required|string',
        ]);
    }
}
