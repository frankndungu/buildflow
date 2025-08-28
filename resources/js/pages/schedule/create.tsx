import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Task, type User } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, Clock, FileText, Plus, Settings, User as UserIcon } from 'lucide-react';
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

    const statusOptions = [
        { value: 'scheduled', label: 'Scheduled', description: 'Task is scheduled for future execution' },
        { value: 'in_progress', label: 'In Progress', description: 'Task is currently being worked on' },
        { value: 'completed', label: 'Completed', description: 'Task has been finished' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Schedule" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create New Schedule</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Schedule tasks and assign them to team members</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >
                        {/* Task Selection Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Information</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task</label>
                                    <select
                                        value={data.task_id}
                                        onChange={(e) => setData('task_id', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="">Select a task</option>
                                        {tasks.map((task) => (
                                            <option key={task.id} value={task.id}>
                                                {task.title} ({task.project?.name})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.task_id && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.task_id}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign To</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            value={data.assigned_to ?? ''}
                                            onChange={(e) => setData('assigned_to', e.target.value === '' ? null : e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Unassigned</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.assigned_to && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.assigned_to}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Schedule Configuration Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Configuration</h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled Start</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="datetime-local"
                                            value={data.scheduled_start}
                                            onChange={(e) => setData('scheduled_start', e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    {errors.scheduled_start && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.scheduled_start}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled End</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="datetime-local"
                                            value={data.scheduled_end}
                                            onChange={(e) => setData('scheduled_end', e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    {errors.scheduled_end && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.scheduled_end}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <Settings className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Status & Notes</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                    <div className="mt-3 space-y-3">
                                        {statusOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                                                    data.status === option.value
                                                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={option.value}
                                                    checked={data.status === option.value}
                                                    onChange={(e) => setData('status', e.target.value as ScheduleFormData['status'])}
                                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.status && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.status}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                        placeholder="Add any additional notes or instructions for this schedule..."
                                    />
                                    {errors.notes && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-4">
                            <Link
                                href="/schedules"
                                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
                            >
                                <Plus className="h-4 w-4" />
                                {processing ? 'Creating...' : 'Create Schedule'}
                            </motion.button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </AppLayout>
    );
}
