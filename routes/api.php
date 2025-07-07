<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\API\AuthApiController;
use App\Http\Controllers\API\RoleApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    
    Route::post('/login', [AuthApiController::class, 'login']);
    Route::post('/register', [AuthApiController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        // Auth Routes
        Route::post('/logout', [AuthApiController::class, 'logout']);
        
        // Role Routes
        Route::get('/roles', [RoleApiController::class, 'index']);
        Route::post('/roles', [RoleApiController::class, 'store']);
        Route::get('/roles/{role}', [RoleApiController::class, 'show']);
        Route::put('/roles/{role}', [RoleApiController::class, 'update']);
        Route::delete('/roles/{role}', [RoleApiController::class, 'destroy']);
    });
});
