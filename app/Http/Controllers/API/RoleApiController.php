<?php

namespace App\Http\Controllers\API;

use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoleApiController extends Controller
{
    public function index()
    {
        return response()->json(Role::all());
    }

    public function store(Request $request)
    {
        //  Check if user is an admin
        if (!$request->user()->roles()->where('name', 'admin')->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'label' => 'required|string',
        ]);

        $role = Role::create($validated);

        return response()->json($role, 201);
    }


    public function show(Role $role)
    {
        return response()->json($role);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|unique:roles,name,' . $role->id,
            'label' => 'sometimes|required|string',
        ]);

        $role->update($validated);

        return response()->json($role);
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return response()->json(null, 204);
    }
}
