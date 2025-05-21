<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/ping', function () {
    return response("pong", 200);
});

Route::get('/app_env', function () {
    return response(env('APP_ENV'));
});
