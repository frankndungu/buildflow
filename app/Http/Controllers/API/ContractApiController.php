<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContractApiController extends Controller
{
    public function index()
    {
        return Contract::with('project')->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'parties_involved' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'value' => 'nullable|numeric',
            'status' => 'required|in:draft,active,completed,terminated',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx',
        ]);

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('contracts', 'public');
        }

        $data['created_by'] = auth()->id();

        $contract = Contract::create($data);

        return response()->json($contract, 201);
    }

    public function show(Contract $contract)
    {
        return $contract->load('project');
    }

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
            // Optionally delete old file
            if ($contract->file_path) {
                Storage::disk('public')->delete($contract->file_path);
            }

            $data['file_path'] = $request->file('file')->store('contracts', 'public');
        }

        $contract->update($data);

        return response()->json($contract);
    }

    public function destroy(Contract $contract)
    {
        if ($contract->file_path) {
            Storage::disk('public')->delete($contract->file_path);
        }

        $contract->delete();

        return response()->json(['message' => 'Contract deleted.']);
    }
}
