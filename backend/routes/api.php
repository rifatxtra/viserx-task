<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SettingController;

Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
Route::get('stats', [DashboardController::class, 'stats'])->middleware('auth:api');

Route::get('settings', [SettingController::class, 'show'])->middleware('auth:api');
Route::put('settings', [SettingController::class, 'update'])->middleware('auth:api');



Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::post('/', [ProductController::class, 'store'])->middleware('auth:api');
    Route::get('/{product}/edit', [ProductController::class, 'edit'])->middleware('auth:api');
    Route::get('/{slug}', [ProductController::class, 'show']);
    Route::put('/{product}', [ProductController::class, 'update'])->middleware('auth:api');
    Route::delete('/{product}', [ProductController::class, 'destroy'])->middleware('auth:api');
});

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store'])->middleware('auth:api');
    Route::get('/{category}', [CategoryController::class, 'show'])->middleware('auth:api');
    Route::put('/{category}', [CategoryController::class, 'update'])->middleware('auth:api');
    Route::delete('/{category}', [CategoryController::class, 'destroy'])->middleware('auth:api');
});
