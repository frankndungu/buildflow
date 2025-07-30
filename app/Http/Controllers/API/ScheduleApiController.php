<?php

namespace App\Http\Controllers\API;

use App\Models\Schedule;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ScheduleApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::with(['task.assignee', 'task.project', 'assignee']);

        if ($request->has('project_id')) {
            $query->whereHas('task', function ($q) use ($request) {
                $q->where('project_id', $request->project_id);
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'assigned_to' => 'nullable|exists:users,id',
            'scheduled_start' => 'required|date',
            'scheduled_end' => 'required|date|after_or_equal:scheduled_start',
            'status' => 'required|in:scheduled,in_progress,completed',
            'notes' => 'nullable|string',
        ]);

        $schedule = Schedule::create($validated);

        return response()->json($schedule->load(['task.assignee', 'task.project', 'assignee']), 201);
    }

    public function show(Schedule $schedule)
    {
        return response()->json($schedule->load(['task.assignee', 'task.project', 'assignee']));
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'task_id' => 'sometimes|exists:tasks,id',
            'assigned_to' => 'nullable|exists:users,id',
            'scheduled_start' => 'sometimes|date',
            'scheduled_end' => 'sometimes|date|after_or_equal:scheduled_start',
            'status' => 'sometimes|in:scheduled,in_progress,completed',
            'notes' => 'nullable|string',
        ]);

        $schedule->update($validated);

        return response()->json($schedule->load(['task.assignee', 'task.project', 'assignee']));
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted successfully.']);
    }
}
