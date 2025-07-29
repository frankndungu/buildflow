<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with('project', 'user')->latest()->get();
        $projects = Project::select('id', 'name')->get();

        return Inertia::render('report/index', [
            'reports' => $reports,
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        $projects = Project::select('id', 'name')->get();

        return Inertia::render('report/create', [
            'projects' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'nullable|exists:projects,id',
            'title' => 'required|string|max:255',
            'type' => 'required|in:progress,financial,task,custom',
            'content' => 'required',
            'report_date' => 'required|date',
        ]);

        $validated['generated_by'] = auth()->id();

        Report::create($validated);

        return redirect()->route('reports.index')->with('success', 'Report created successfully.');
    }

    public function edit(Report $report)
    {
        $projects = Project::select('id', 'name')->get();

        return Inertia::render('report/edit', [
            'report' => $report,
            'projects' => $projects,
        ]);
    }

    public function update(Request $request, Report $report)
    {
        $validated = $request->validate([
            'project_id' => 'nullable|exists:projects,id',
            'title' => 'required|string|max:255',
            'type' => 'required|in:progress,financial,task,custom',
            'content' => 'required',
            'report_date' => 'required|date',
        ]);

        $report->update($validated);

        return redirect()->route('reports.index')->with('success', 'Report updated successfully.');
    }

    public function destroy(Report $report)
    {
        $report->delete();

        return redirect()->route('reports.index')->with('success', 'Report deleted.');
    }
}
