<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;


Route::get('/', [HomeController::class, 'index']);

Route::fallback([\App\Http\Controllers\ShopifyController::class, 'fallback'])->middleware('shopify.installed');

Route::prefix('/api')->group(function () {
    Route::get('/auth', [\App\Http\Controllers\ShopifyController::class, 'auth']);
    Route::get('/auth/callback', [\App\Http\Controllers\ShopifyController::class, 'authCallback']);
    Route::get('/webhooks', [\App\Http\Controllers\ShopifyController::class, 'authCallback']);

    Route::prefix('/products')->middleware('shopify.auth')->group(function () {
        Route::get('/count', [\App\Http\Controllers\ProductController::class, 'count']);
        Route::get('/create', [\App\Http\Controllers\ProductController::class, 'create']);
    });
});
