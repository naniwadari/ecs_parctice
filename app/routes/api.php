<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/user/{user_id}', function (string $user_id) {
        $user = User::find($user_id);

        if (is_null($user)) {
            return response()->json(["not found"], 404);
        }

        return response()->json("hello ".$user->name, 200);
    });
});

