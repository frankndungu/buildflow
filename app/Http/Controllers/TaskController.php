<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Project $project)
    {
        return Inertia::render('task/index', [
            'project' => $project,
            'tasks' => $project->tasks()->with('assignee')->get(),
        ]);
    }
    
    public function create(Project $project)
    {
        return Inertia::render('task/create', [
            'project' => $project,
            'users' => \App\Models\User::all(), 
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|in:todo,in_progress,done',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $validated['project_id'] = $project->id;
        $validated['created_by'] = auth()->id();
        $validated['order'] = Task::where('project_id', $project->id)->max('order') + 1;

        Task::create($validated);

        return redirect()->route('projects.tasks.index', $project->id)->with('success', 'Task created.');
    }

    public function edit(Project $project, Task $task)
    {
        return Inertia::render('task/edit', [
            'project' => $project,
            'task' => $task,
            'users' => \App\Models\User::all(),
        ]);
    }

    public function update(Request $request, Project $project, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|in:todo,in_progress,done',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $task->update($validated);

        return redirect()->route('projects.tasks.index', $project->id)->with('success', 'Task updated.'); // Changed from 'projects.tasks' to 'projects.tasks.index'
    }

    // Add this method to TaskController.php
    public function updateStatus(Request $request, Project $project, Task $task)
    {
        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,done',
        ]);

        $task->update($validated);

        return back();
    }

    public function destroy(Project $project, Task $task)
    {
        $task->delete();

        return back()->with('success', 'Task deleted.');
    }
}
