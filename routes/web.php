<?php

use App\Http\Controllers\UwongController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('/uwong')->group(function () {
        Route::patch('/', [UwongController::class, 'datas']);
        Route::get('/', [UwongController::class, 'index']);
        Route::get('/create', [UwongController::class, 'create']);
        Route::post('/', [UwongController::class, 'store']);
        Route::get('/{uwong}', [UwongController::class, 'show']);
        Route::get('/{uwong}/edit', [UwongController::class, 'edit']);
        Route::put('/{uwong}', [UwongController::class, 'update']);
        Route::delete('/{uwong}', [UwongController::class, 'destroy']);
    });

});

Route::get('/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
})->name('csrf.token');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
