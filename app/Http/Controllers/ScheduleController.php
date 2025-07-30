<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(): Response
    {
        $schedules = Schedule::with(['task.project', 'assignee'])->get();

        return Inertia::render('schedule/index', [
            'schedules' => $schedules
        ]);
    }

    public function create(): Response
    {
        $tasks = Task::with('project')->get(['id', 'title', 'project_id']);
        $users = User::select('id', 'name')->get();

        return Inertia::render('schedule/create', [
            'tasks' => $tasks,
            'users' => $users,
        ]);
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

        Schedule::create($validated);

        return redirect()->route('schedules.index')->with('success', 'Schedule created successfully.');
    }

    public function edit(Schedule $schedule): Response
    {
        $schedule->load(['task.project', 'assignee']);
        $tasks = Task::with('project')->get(['id', 'title', 'project_id']);
        $users = User::select('id', 'name')->get();

        return Inertia::render('schedule/edit', [
            'schedule' => $schedule,
            'tasks' => $tasks,
            'users' => $users,
        ]);
    }

    public function show(Schedule $schedule)
    {
        $schedule->load('task.project', 'assignee');

        return Inertia::render('schedule/show', [
            'schedule' => $schedule,
        ]);
    }


    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'assigned_to' => 'nullable|exists:users,id',
            'scheduled_start' => 'required|date',
            'scheduled_end' => 'required|date|after_or_equal:scheduled_start',
            'status' => 'required|in:scheduled,in_progress,completed',
            'notes' => 'nullable|string',
        ]);

        $schedule->update($validated);

        return redirect()->route('schedules.index')->with('success', 'Schedule updated successfully.');
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return redirect()->route('schedules.index')->with('success', 'Schedule deleted successfully.');
    }
}
