<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ReportApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::with('project', 'user');

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->latest()->get());
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

        $report = Report::create($validated);

        return response()->json($report, 201);
    }

    public function show(Report $report)
    {
        return response()->json($report->load('project', 'user'));
    }

    public function update(Request $request, Report $report)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:progress,financial,task,custom',
            'content' => 'sometimes',
            'report_date' => 'sometimes|date',
        ]);

        $report->update($validated);

        return response()->json($report);
    }

    public function destroy(Report $report)
    {
        $report->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
