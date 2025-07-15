<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ExpenseApiController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string|max:100',
            'spent_at' => 'nullable|date',
            'receipt' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240', // 10MB
        ]);

        $path = $request->file('receipt')->store("receipts/project-{$project->id}", 'public');

        $expense = Expense::create([
            'project_id' => $project->id,
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'spent_at' => $validated['spent_at'],
            'uploaded_by' => Auth::id(),
            'receipt_path' => $path,
        ]);

        return response()->json([
            'message' => 'Expense logged successfully.',
            'expense' => $expense,
        ], 201);
    }
}
