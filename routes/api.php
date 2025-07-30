<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\API\AuthApiController;
use App\Http\Controllers\API\RoleApiController;
use App\Http\Controllers\API\ProjectApiController;
use App\Http\Controllers\API\DocumentApiController;
use App\Http\Controllers\API\ExpenseApiController;
use App\Http\Controllers\API\TaskApiController;
use App\Http\Controllers\API\ReportApiController;
use App\Http\Controllers\API\ScheduleApiController;

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

        // Expense Routes
        Route::post('/projects/{project}/expenses', [ExpenseApiController::class, 'store']);

        // Task Routes
        Route::get('/projects/{project}/tasks', [TaskApiController::class, 'index']);
        Route::post('/projects/{project}/tasks', [TaskApiController::class, 'store']);
        Route::get('/tasks/{task}', [TaskApiController::class, 'show']);
        Route::put('/tasks/{task}', [TaskApiController::class, 'update']);
        Route::delete('/tasks/{task}', [TaskApiController::class, 'destroy']);

        // Report Routes
        Route::apiResource('reports', ReportApiController::class);

        // Schedule Routes
        Route::apiResource('schedules', ScheduleApiController::class);
        
    });
});
