import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

type Report = {
    id: number;
    title: string;
    type: 'progress' | 'financial' | 'task' | 'custom';
    content: string;
    report_date: string;
    user?: {
        id: number;
        name: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/reports' },
];

export default function Reports() {
    const { reports } = usePage().props as unknown as { reports: Report[] };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this report?')) {
            router.delete(`/reports/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Reports</h1>
                    <Link href="/reports/create" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                        Create Report
                    </Link>
                </div>

                {/* Reports List */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border"
                        >
                            <div className="text-lg font-semibold">{report.title}</div>
                            <div className="text-sm text-muted-foreground capitalize">{report.type}</div>
                            <div className="mt-2 line-clamp-3 text-sm">{report.content}</div>
                            <div className="mt-1 text-xs text-gray-500">
                                By: {report.user?.name || 'Unknown'} • {report.report_date}
                            </div>

                            {/* Edit + Delete Buttons */}
                            <div className="mt-4 flex items-center gap-4">
                                <Link href={`/reports/${report.id}/edit`} className="text-sm text-blue-600 hover:underline">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(report.id)} className="text-sm text-red-600 hover:underline">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Placeholder if none */}
                {reports.length === 0 && (
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="relative z-10 flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                            No reports available
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
