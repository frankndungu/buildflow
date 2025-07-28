<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\TaskController; 
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('roles', RoleController::class);
    Route::resource('projects', ProjectController::class);

    // Project Document routes
    Route::get('/projects/{project}/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::get('/projects/{project}/documents/create', [DocumentController::class, 'create'])->name('documents.create');
    Route::post('/projects/{project}/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document}', [DocumentController::class, 'show'])->name('documents.show');
    Route::get('/documents/{document}/edit', [DocumentController::class, 'edit'])->name('documents.edit');
    Route::put('/documents/{document}', [DocumentController::class, 'update'])->name('documents.update');
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // Project Expense routes
    Route::post('/projects/{project}/expenses', [ProjectController::class, 'storeExpense'])->name('projects.expenses.store');

    // Project Task routes 
    Route::prefix('/projects/{project}/tasks')->name('projects.tasks.')->group(function () {
        Route::get('/', [TaskController::class, 'index'])->name('index');             
        Route::get('/create', [TaskController::class, 'create'])->name('create');      
        Route::post('/', [TaskController::class, 'store'])->name('store');             
        Route::get('/{task}/edit', [TaskController::class, 'edit'])->name('edit');
        Route::patch('/{task}/status', [TaskController::class, 'updateStatus'])->name('update-status');   
        Route::put('/{task}', [TaskController::class, 'update'])->name('update');     
        Route::delete('/{task}', [TaskController::class, 'destroy'])->name('destroy');
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
