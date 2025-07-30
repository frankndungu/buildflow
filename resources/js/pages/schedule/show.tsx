import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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
    { title: 'Schedule Details', href: '#' },
];

export default function ScheduleShow() {
    const { schedule } = usePage().props as unknown as { schedule: Schedule };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Schedule #${schedule.id}`} />

            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-bold">Schedule Details</h1>

                <div className="space-y-4 rounded border bg-white p-4 shadow">
                    <div>
                        <strong>Task:</strong> {schedule.task?.title} ({schedule.task?.project?.name})
                    </div>

                    <div>
                        <strong>Assigned To:</strong> {schedule.assignee?.name ?? 'Unassigned'}
                    </div>

                    <div>
                        <strong>Scheduled Start:</strong> {schedule.scheduled_start}
                    </div>

                    <div>
                        <strong>Scheduled End:</strong> {schedule.scheduled_end}
                    </div>

                    <div>
                        <strong>Status:</strong> <span className="capitalize">{schedule.status.replace('_', ' ')}</span>
                    </div>

                    {schedule.notes && (
                        <div>
                            <strong>Notes:</strong>
                            <p className="whitespace-pre-wrap text-gray-700">{schedule.notes}</p>
                        </div>
                    )}
                </div>

                <a href={`/schedules/${schedule.id}/edit`} className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Edit Schedule
                </a>
            </div>
        </AppLayout>
    );
}
