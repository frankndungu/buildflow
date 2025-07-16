<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskApiController extends Controller
{
    // GET /api/v1/projects/{project}/tasks
    public function index($projectId)
    {
        $tasks = Task::where('project_id', $projectId)
            ->orderBy('order')
            ->with(['assignee', 'creator'])
            ->get();

        return response()->json($tasks);
    }

    // POST /api/v1/projects/{project}/tasks
    public function store(Request $request, $projectId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'order' => 'nullable|integer',
        ]);

        $task = Task::create([
            ...$validated,
            'project_id' => $projectId,
            'created_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Task created successfully.',
            'task' => $task,
        ], 201);
    }

    // GET /api/v1/tasks/{task}
    public function show(Task $task)
    {
        $task->load(['assignee', 'creator']);
        return response()->json($task);
    }

    // PUT /api/v1/tasks/{task}
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'order' => 'nullable|integer',
        ]);

        $task->update($validated);

        return response()->json([
            'message' => 'Task updated successfully.',
            'task' => $task,
        ]);
    }

    // DELETE /api/v1/tasks/{task}
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(['message' => 'Task deleted.']);
    }
}
