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

    Route::patch('/uwong', [UwongController::class, 'datas']);
    Route::get('/uwong', [UwongController::class, 'index']);
    Route::get('/uwong/create', [UwongController::class, 'create']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
