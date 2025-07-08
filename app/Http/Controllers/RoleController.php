<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $roles = Role::all();

        return Inertia::render('role/index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): \Inertia\Response
    {
        return \Inertia\Inertia::render('role/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
        'name' => 'required|string|unique:roles,name',
        'label' => 'required|string',
        ]);

        Role::create($validated);

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }
    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        //
    }
}
