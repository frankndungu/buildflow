<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Models\Task;
use App\Models\Document;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $projects = Project::with('creator')->latest()->get();

        return Inertia::render('project/index', [
            'projects' => $projects,
        ]);
    }

    public function create(): \Inertia\Response
    {
        return Inertia::render('project/create', [
            'users' => User::select('id', 'name', 'email')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'required|numeric|min:0',
            'status' => 'required|in:active,completed,on_hold',
            'assigned_users' => 'nullable|array',
            'assigned_users.*.id' => 'required|exists:users,id',
            'assigned_users.*.role' => 'required|string',
        ]);

        $project = Project::create([
            ...$validated,
            'created_by' => Auth::id(),
        ]);

        if (!empty($validated['assigned_users'])) {
            $project->users()->sync(
                collect($validated['assigned_users'])->mapWithKeys(fn($u) => [
                    $u['id'] => ['role' => $u['role']],
                ])->toArray()
            );
        }

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    public function show(Project $project): Response
    {
        return Inertia::render('project/show', [
            'project' => $project->load('creator', 'users', 'documents.uploader', 'expenses.uploader'),
        ]);
    }

    public function edit(Project $project): \Inertia\Response
    {
        $assigned = $project->users()->select('users.id', 'users.name', 'users.email', 'project_user.role')->get();

        return Inertia::render('project/edit', [
            'project' => $project,
            'users' => User::select('id', 'name', 'email')->get(),
            'assignedUsers' => $assigned,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'required|numeric|min:0',
            'status' => 'required|in:active,completed,on_hold',
            'assigned_users' => 'nullable|array',
            'assigned_users.*.id' => 'required|exists:users,id',
            'assigned_users.*.role' => 'required|string',
        ]);

        $project->update($validated);

        $project->users()->sync(
            collect($validated['assigned_users'] ?? [])->mapWithKeys(fn($u) => [
                $u['id'] => ['role' => $u['role']],
            ])->toArray()
        );

        return redirect()->route('projects.index')->with('success', 'Project updated successfully.');
    }

    public function storeExpense(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string|max:100',
            'spent_at' => 'nullable|date',
            'receipt' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        $path = $request->file('receipt')->store("receipts/project-{$project->id}", 'public');

        $project->expenses()->create([
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'spent_at' => $validated['spent_at'],
            'receipt_path' => $path,
            'uploaded_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Expense logged successfully.');
    }

    public function tasks(Project $project): \Inertia\Response
    {
        $project->load('tasks');

        return Inertia::render('project/tasks', [
            'project' => $project,
        ]);
    }


    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }
}
