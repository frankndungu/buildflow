import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

type Schedule = {
    id: number;
    task: {
        id: number;
        title: string;
        project: {
            name: string;
        };
    };
    assignee?: {
        id: number;
        name: string;
    };
    scheduled_start: string;
    scheduled_end: string;
    status: 'scheduled' | 'in_progress' | 'completed';
    notes: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Schedules', href: '/schedules' },
];

export default function ScheduleIndex() {
    const { schedules } = usePage().props as unknown as { schedules: Schedule[] };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            router.delete(`/schedules/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // You can also add a toast or alert here
                    console.log('Schedule deleted');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Schedules</h1>
                    <a href="/schedules/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        + New Schedule
                    </a>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {schedules.map((schedule) => (
                        <div key={schedule.id} className="relative rounded border bg-white p-4 shadow transition hover:ring-2 hover:ring-blue-400">
                            {/* Make card clickable to show page */}
                            <Link href={`/schedules/${schedule.id}`} className="absolute inset-0 z-0" />

                            <div className="relative z-10 space-y-2">
                                <div className="text-lg font-semibold">{schedule.task?.title ?? 'Untitled Task'}</div>
                                <div className="text-sm text-muted-foreground">Project: {schedule.task?.project?.name ?? 'Unknown Project'}</div>
                                <div className="text-sm text-muted-foreground">Assigned to: {schedule.assignee?.name ?? 'Unassigned'}</div>
                                <div className="text-xs text-gray-500">
                                    From: {schedule.scheduled_start}
                                    <br />
                                    To: {schedule.scheduled_end}
                                </div>
                                <div className="text-xs">
                                    Status: <span className="font-medium">{schedule.status}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Link
                                        href={`/schedules/${schedule.id}/edit`}
                                        className="z-10 rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(schedule.id)}
                                        className="z-10 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {schedules.length === 0 && <p className="text-sm text-muted-foreground">No schedules available yet.</p>}
            </div>
        </AppLayout>
    );
}
