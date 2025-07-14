<?php

namespace App\Http\Controllers\API;

use App\Models\Document;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DocumentApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
        public function store(Request $request, Project $project)
        {
            $validated = $request->validate([
                'category' => 'required|string|in:plan,contract,report,photo,other',
                'name' => 'required|string|max:255',
                'file' => 'required|file|max:10240', // max 10MB
                'version' => 'nullable|string|max:50',
            ]);

            $path = $request->file('file')->store("documents/project-{$project->id}", 'public');

            $document = Document::create([
                'project_id' => $project->id,
                'category' => $validated['category'],
                'name' => $validated['name'],
                'file_path' => $path,
                'uploaded_by' => Auth::id(),
                'version' => $validated['version'],
            ]);

            return response()->json([
                'message' => 'Document uploaded successfully.',
                'document' => $document,
            ], 201);
        }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
