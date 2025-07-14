<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\API\AuthApiController;
use App\Http\Controllers\API\RoleApiController;
use App\Http\Controllers\API\ProjectApiController;
use App\Http\Controllers\API\DocumentApiController;

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

        // Project Routes
        Route::get('/projects', [ProjectApiController::class, 'index']);
        Route::post('/projects', [ProjectApiController::class, 'store']);
        Route::get('/projects/{project}', [ProjectApiController::class, 'show']);
        Route::put('/projects/{project}', [ProjectApiController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectApiController::class, 'destroy']);

        // Document Routes
        Route::post('/projects/{project}/documents', [DocumentApiController::class, 'store']);
    });
});
