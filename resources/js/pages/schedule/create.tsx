import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Task, type User } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

type ScheduleFormData = {
    task_id: string;
    assigned_to: string | null;
    scheduled_start: string;
    scheduled_end: string;
    status: 'scheduled' | 'in_progress' | 'completed';
    notes: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Schedules', href: '/schedules' },
    { title: 'Create', href: '/schedules/create' },
];

export default function ScheduleCreate() {
    const { tasks, users } = usePage().props as unknown as {
        tasks: Task[];
        users: User[];
    };

    const { data, setData, post, processing, errors } = useForm<ScheduleFormData>({
        task_id: '',
        assigned_to: '',
        scheduled_start: '',
        scheduled_end: '',
        status: 'scheduled',
        notes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/schedules');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Schedule" />

            <div className="flex max-w-2xl flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold">Create New Schedule</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Task Dropdown */}
                    <div>
                        <label className="mb-1 block font-medium">Task</label>
                        <select value={data.task_id} onChange={(e) => setData('task_id', e.target.value)} className="w-full rounded border px-3 py-2">
                            <option value="">Select a task</option>
                            {tasks.map((task) => (
                                <option key={task.id} value={task.id}>
                                    {task.title} ({task.project?.name})
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.task_id} />
                    </div>

                    {/* Assignee Dropdown */}
                    <div>
                        <label className="mb-1 block font-medium">Assign To (Optional)</label>
                        <select
                            value={data.assigned_to ?? ''}
                            onChange={(e) => setData('assigned_to', e.target.value === '' ? null : e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="">Unassigned</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.assigned_to} />
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="mb-1 block font-medium">Scheduled Start</label>
                        <input
                            type="datetime-local"
                            value={data.scheduled_start}
                            onChange={(e) => setData('scheduled_start', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <InputError message={errors.scheduled_start} />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="mb-1 block font-medium">Scheduled End</label>
                        <input
                            type="datetime-local"
                            value={data.scheduled_end}
                            onChange={(e) => setData('scheduled_end', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <InputError message={errors.scheduled_end} />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-1 block font-medium">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value as ScheduleFormData['status'])}
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <InputError message={errors.status} />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="mb-1 block font-medium">Notes (Optional)</label>
                        <textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="w-full rounded border px-3 py-2" />
                        <InputError message={errors.notes} />
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Create Schedule
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
