<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of documents for a specific project.
     */
    public function index(Project $project)
    {
        $project->load('documents.uploader');

        return Inertia::render('project/documents', [
            'project' => $project,
        ]);
    }

    /**
     * Show the form for creating a new document (optional).
     */
    public function create(Project $project)
    {
        return Inertia::render('project/documents-create', [
            'project' => $project,
        ]);
    }

    /**
     * Store a newly uploaded document.
     */
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'category' => 'required|string|in:plan,contract,report,photo,other',
            'name' => 'required|string|max:255',
            'file' => 'required|file|max:10240',
            'version' => 'nullable|string|max:50',
        ]);

        $path = $request->file('file')->store("documents/project-{$project->id}", 'public');

        Document::create([
            'project_id' => $project->id,
            'category' => $validated['category'],
            'name' => $validated['name'],
            'file_path' => $path,
            'uploaded_by' => Auth::id(),
            'version' => $validated['version'],
        ]);

        return redirect()->route('projects.show', $project->id)->with('success', 'Document uploaded successfully.');
    }

    /**
     * Display a single document and details.
     */
    public function show(Document $document)
    {
        $document->load('uploader', 'project');

        return Inertia::render('project/documents-show', [
            'document' => $document,
        ]);
    }

    /**
     * Show the form for editing a document.
     */
    public function edit(Document $document)
    {
        $document->load('project');

        return Inertia::render('project/documents-edit', [
            'document' => $document,
        ]);
    }

    /**
     * Update a document's metadata (not the file itself).
     */
    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'category' => 'required|string|in:plan,contract,report,photo,other',
            'name' => 'required|string|max:255',
            'version' => 'nullable|string|max:50',
        ]);

        $document->update($validated);

        return redirect()->route('projects.show', $document->project_id)->with('success', 'Document updated.');
    }

    /**
     * Remove the document file and record.
     */
    public function destroy(Document $document)
    {
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return redirect()->back()->with('success', 'Document deleted.');
    }
}
