<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/env', function (Request $request) {
        return response()->json(env('APP_ENV'));
    });
});

