import BudgetChart from '@/components/charts/budget-chart';
import CategoryChart from '@/components/charts/category-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold">Project KPIs</h1>

                {/* KPI Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <KpiCard label="Total Projects" value={projectStats.total} />
                    <KpiCard label="Active" value={projectStats.active} />
                    <KpiCard label="Completed" value={projectStats.completed} />
                    <KpiCard label="On Hold" value={projectStats.on_hold} />
                </div>

                <div className="mt-6">
                    <KpiCard label="Total Budget (KES)" value={Number(projectStats.total_budget).toLocaleString()} full />
                </div>

                {/* Charts */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="mb-2 text-sm font-semibold">Overall Budget Usage</h3>
                        <BudgetChart used={projectStats.budget_used} total={projectStats.total_budget} />
                    </div>
                    <div>
                        <h3 className="mb-2 text-sm font-semibold">Expense Category Breakdown</h3>
                        <CategoryChart expenses={projectStats.expenses} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function KpiCard({ label, value, full = false }: { label: string; value: string | number; full?: boolean }) {
    return (
        <div className={`rounded-xl border bg-white p-4 shadow dark:bg-gray-900 ${full ? 'md:col-span-2 lg:col-span-4' : ''}`}>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}
