<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $projectStats = Project::selectRaw("
            count(*) as total,
            count(case when status = 'active' then 1 end) as active,
            count(case when status = 'completed' then 1 end) as completed,
            count(case when status = 'on_hold' then 1 end) as on_hold,
            coalesce(sum(budget), 0) as total_budget
        ")->first();

        return Inertia::render('dashboard', [
            'projectStats' => $projectStats,
        ]);
    }
}
