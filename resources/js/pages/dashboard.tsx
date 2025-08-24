import BudgetChart from '@/components/charts/budget-chart';
import CategoryChart from '@/components/charts/category-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Calculator, CheckCircle2, DollarSign, Layers, Pause, PieChart, Target, TrendingUp, Zap } from 'lucide-react';

type ProjectStats = {
    total: number;
    active: number;
    completed: number;
    on_hold: number;
    total_budget: number;
    budget_used: number;
    expenses: {
        category: string;
        amount: number;
    }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { projectStats } = usePage().props as any as { projectStats: ProjectStats };

    // Calculate metrics
    const budgetUtilization = ((projectStats.budget_used / projectStats.total_budget) * 100).toFixed(1);
    const remainingBudget = projectStats.total_budget - projectStats.budget_used;
    const successRate = ((projectStats.completed / projectStats.total) * 100).toFixed(1);
    const avgBudgetPerProject = Math.round(projectStats.total_budget / projectStats.total);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Project Dashboard</h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Overview of project performance and budget utilization
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 rounded-full bg-green-50 px-3 py-1.5 dark:bg-green-900/20">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-xs font-medium text-green-700 dark:text-green-400">Real-time</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KPI Grid */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            title="Total Projects"
                            value={projectStats.total.toString()}
                            icon={BarChart3}
                            trend="+12%"
                            trendDirection="up"
                            iconBg="bg-blue-50"
                            iconColor="text-blue-600"
                            darkIconBg="dark:bg-blue-900/20"
                            darkIconColor="dark:text-blue-400"
                        />
                        <MetricCard
                            title="Active Projects"
                            value={projectStats.active.toString()}
                            icon={Zap}
                            trend="+8%"
                            trendDirection="up"
                            iconBg="bg-emerald-50"
                            iconColor="text-emerald-600"
                            darkIconBg="dark:bg-emerald-900/20"
                            darkIconColor="dark:text-emerald-400"
                            highlighted
                        />
                        <MetricCard
                            title="Completed"
                            value={projectStats.completed.toString()}
                            icon={CheckCircle2}
                            trend="+15%"
                            trendDirection="up"
                            iconBg="bg-green-50"
                            iconColor="text-green-600"
                            darkIconBg="dark:bg-green-900/20"
                            darkIconColor="dark:text-green-400"
                        />
                        <MetricCard
                            title="On Hold"
                            value={projectStats.on_hold.toString()}
                            icon={Pause}
                            trend="-5%"
                            trendDirection="down"
                            iconBg="bg-amber-50"
                            iconColor="text-amber-600"
                            darkIconBg="dark:bg-amber-900/20"
                            darkIconColor="dark:text-amber-400"
                        />
                    </div>

                    {/* Enhanced Budget Overview Section */}
                    <div className="mb-8">
                        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/20">
                                        <DollarSign className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Overview</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total allocation and current usage</p>
                                    </div>
                                </div>

                                {/* Budget health indicator */}
                                <div
                                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                                        parseFloat(budgetUtilization) > 80
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                            : parseFloat(budgetUtilization) > 60
                                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    }`}
                                >
                                    {parseFloat(budgetUtilization) > 80 ? 'High Usage' : parseFloat(budgetUtilization) > 60 ? 'Moderate' : 'Healthy'}
                                </div>
                            </div>

                            {/* Budget Statistics Grid */}
                            <div className="grid gap-6 lg:grid-cols-4">
                                <div className="lg:col-span-1">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                                Total Budget
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                KES {Number(projectStats.total_budget).toLocaleString()}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                                Budget Used
                                            </div>
                                            <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                                KES {Number(projectStats.budget_used).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">{budgetUtilization}% of total</div>
                                        </div>

                                        <div>
                                            <div className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                                Remaining
                                            </div>
                                            <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                                                KES {Number(remainingBudget).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {(100 - parseFloat(budgetUtilization)).toFixed(1)}% available
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-3">
                                    <div className="h-80">
                                        <BudgetChart used={projectStats.budget_used} total={projectStats.total_budget} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-10"
                    >
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/20">
                                        <PieChart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Distribution</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Breakdown by category across all projects</p>
                                    </div>
                                </div>

                                {/* Expense summary - Fixed formatting */}
                                <div className="grid grid-cols-2 gap-6 lg:flex lg:gap-8">
                                    <div className="text-center lg:text-right">
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            KES{' '}
                                            {(() => {
                                                const total = (projectStats.expenses || []).reduce((sum, exp) => {
                                                    const amount = Number(exp?.amount) || 0;
                                                    return sum + amount;
                                                }, 0);
                                                return total.toLocaleString();
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CategoryChart Container */}
                            <div className="rounded-xl bg-gradient-to-br from-gray-50/50 to-white p-6 dark:from-gray-800/30 dark:to-gray-700/30">
                                <CategoryChart expenses={projectStats.expenses} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Project Performance Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-10"
                    >
                        <h3 className="mb-8 text-lg font-semibold text-gray-900 dark:text-white">Project Performance</h3>
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                {/* Background decoration */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-green-900/20 dark:to-emerald-800/20"></div>

                                <div className="relative">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/20">
                                            <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{successRate}%</div>
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {projectStats.completed} of {projectStats.total} completed
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                {/* Background decoration */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-900/20 dark:to-indigo-800/20"></div>

                                <div className="relative">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/20">
                                            <Calculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">KES</div>
                                        <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                            {avgBudgetPerProject.toLocaleString()}
                                        </div>
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Budget/Project</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Across {projectStats.total} projects</div>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                {/* Background decoration */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-purple-900/20 dark:to-violet-800/20"></div>

                                <div className="relative">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/20">
                                            <Layers className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{projectStats.expenses?.length || 0}</div>
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Expense Categories</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Active spending areas</div>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                {/* Background decoration */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-indigo-900/20 dark:to-purple-800/20"></div>

                                <div className="relative">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/20">
                                            <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{budgetUtilization}%</div>
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Utilization</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            KES {Number(remainingBudget).toLocaleString()} remaining
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Budget Insights */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">Budget Insights</h4>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div
                                        className={`mt-1 h-2 w-2 rounded-full ${
                                            parseFloat(budgetUtilization) > 80
                                                ? 'bg-red-500'
                                                : parseFloat(budgetUtilization) > 60
                                                  ? 'bg-amber-500'
                                                  : 'bg-green-500'
                                        }`}
                                    ></div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {parseFloat(budgetUtilization) > 80
                                                ? 'High Budget Usage Alert'
                                                : parseFloat(budgetUtilization) > 60
                                                  ? 'Moderate Budget Usage'
                                                  : 'Budget Usage is Healthy'}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            {parseFloat(budgetUtilization) > 80
                                                ? 'Consider reviewing expenses to avoid budget overruns'
                                                : parseFloat(budgetUtilization) > 60
                                                  ? 'Monitor spending closely for remaining projects'
                                                  : 'Current spending is well within budget limits'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900 dark:text-white">Average Project Cost</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            Each project averages KES {avgBudgetPerProject.toLocaleString()} in budget allocation
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">Project Status Summary</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Active Projects</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {projectStats.active} ({((projectStats.active / projectStats.total) * 100).toFixed(0)}%)
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {projectStats.completed} ({successRate}%)
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">On Hold</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {projectStats.on_hold} ({((projectStats.on_hold / projectStats.total) * 100).toFixed(0)}%)
                                    </span>
                                </div>

                                <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Total projects: {projectStats.total} • Success rate: {successRate}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: string;
    trendDirection?: 'up' | 'down';
    iconBg: string;
    iconColor: string;
    darkIconBg: string;
    darkIconColor: string;
    highlighted?: boolean;
}

function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    trendDirection = 'up',
    iconBg,
    iconColor,
    darkIconBg,
    darkIconColor,
    highlighted = false,
}: MetricCardProps) {
    return (
        <div
            className={`rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
                highlighted
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/10'
                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
            }`}
        >
            <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${iconBg} ${darkIconBg}`}>
                    <Icon className={`h-5 w-5 ${iconColor} ${darkIconColor}`} />
                </div>
                {trend && (
                    <div
                        className={`flex items-center space-x-1 rounded-full px-2 py-1 text-xs font-medium ${
                            trendDirection === 'up'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                    >
                        <Activity className={`h-3 w-3 ${trendDirection === 'up' ? 'rotate-0' : 'rotate-180'}`} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <div className={`text-2xl font-bold ${highlighted ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-900 dark:text-white'}`}>
                    {value}
                </div>
                <div className={`text-sm font-medium ${highlighted ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    {title}
                </div>
            </div>
        </div>
    );
}
