<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

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

        // Total expenses used across all projects
        $budgetUsed = Expense::sum('amount');

        // Expenses grouped by category
        $expensesByCategory = Expense::select('category', DB::raw('SUM(amount) as amount'))
            ->groupBy('category')
            ->get();

        return Inertia::render('dashboard', [
            'projectStats' => [
                'total' => $projectStats->total,
                'active' => $projectStats->active,
                'completed' => $projectStats->completed,
                'on_hold' => $projectStats->on_hold,
                'total_budget' => $projectStats->total_budget,
                'budget_used' => $budgetUsed,
                'expenses' => $expensesByCategory,
            ]
        ]);
    }
}
