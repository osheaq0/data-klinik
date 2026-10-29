<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DataKlinikController;

Route::get('/', fn() => redirect()->route('klinik.index'));

Route::get('/klinik',                          [DataKlinikController::class, 'index'])->name('klinik.index');
Route::get('/klinik/create',                   [DataKlinikController::class, 'create'])->name('klinik.create');
Route::post('/klinik',                         [DataKlinikController::class, 'store'])->name('klinik.store');
Route::get('/klinik/{id}/edit',                [DataKlinikController::class, 'edit'])->name('klinik.edit');
Route::put('/klinik/{id}',                     [DataKlinikController::class, 'update'])->name('klinik.update');
Route::delete('/klinik/{id}',                  [DataKlinikController::class, 'destroy'])->name('klinik.destroy');
Route::post('/klinik/{id}/hitung-unit-cost',   [DataKlinikController::class, 'hitungUnitCost'])->name('klinik.hitungUnitCost');
