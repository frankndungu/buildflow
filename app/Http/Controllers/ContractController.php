<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contracts = Contract::with('project', 'creator')
            ->latest()
            ->get();

        return Inertia::render('contract/index', [
            'contracts' => $contracts,
        ]);
    }

    public function create()
    {
        $projects = Project::select('id', 'name')->get();

        return Inertia::render('contract/create', [
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'parties_involved' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'value' => 'required|numeric',
            'status' => 'required|in:draft,active,completed,terminated',
            'project_id' => 'nullable|exists:projects,id',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:20480',
        ]);

        if ($request->hasFile('file')) {
            $validated['file_path'] = $request->file('file')->store('contracts');
        }

        Contract::create($validated);

        return redirect()->route('contracts.index')->with('success', 'Contract created.');
    }

    public function show(Contract $contract)
    {
        $contract->load('project'); // eager load project relationship

        return Inertia::render('contract/show', [
            'contract' => $contract,
        ]);
    }

    public function edit(Contract $contract)
    {
        return Inertia::render('contract/edit', [
            'contract' => $contract->load('project'),
            'projects' => Project::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contract $contract)
    {
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'parties_involved' => 'sometimes|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'value' => 'nullable|numeric',
            'status' => 'sometimes|in:draft,active,completed,terminated',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx',
        ]);

        if ($request->hasFile('file')) {
            // Delete old file
            if ($contract->file_path) {
                Storage::disk('public')->delete($contract->file_path);
            }

            $data['file_path'] = $request->file('file')->store('contracts', 'public');
        }

        $contract->update($data);

        return redirect()->route('contracts.index')->with('success', 'Contract updated successfully.');
    }

    public function destroy(Contract $contract)
    {
        if ($contract->file_path) {
            Storage::disk('public')->delete($contract->file_path);
        }

        $contract->delete();

        return redirect()->back()->with('success', 'Contract deleted successfully.');
    }
}
