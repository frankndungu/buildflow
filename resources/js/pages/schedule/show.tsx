import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, CheckCircle2, Clock, Edit2, FileText, Folder, User2 } from 'lucide-react';

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400';
            case 'in_progress':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400';
            default:
                return 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Schedule #${schedule.id}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Schedule Details</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">View and manage schedule information</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.visit(`/schedules/${schedule.id}/edit`)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit Schedule
                        </motion.button>
                    </motion.div>

                    {/* Schedule Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                        {/* Status Banner */}
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(schedule.status)}`}
                            >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1).replace('_', ' ')}
                            </span>
                        </div>

                        {/* Main Content */}
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {/* Task Information */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <FileText className="h-5 w-5" />
                                    Task Details
                                </div>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Folder className="mt-1 h-5 w-5 text-gray-400" />
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{schedule.task?.title}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{schedule.task?.project?.name}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Information */}
                            <div className="grid gap-6 p-6 sm:grid-cols-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</span>
                                    </div>
                                    <div className="mt-2 text-gray-900 dark:text-white">{new Date(schedule.scheduled_start).toLocaleString()}</div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">End Time</span>
                                    </div>
                                    <div className="mt-2 text-gray-900 dark:text-white">{new Date(schedule.scheduled_end).toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Assignee Information */}
                            <div className="p-6">
                                <div className="flex items-center gap-2">
                                    <User2 className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To</span>
                                </div>
                                <div className="mt-2 flex items-center gap-3">
                                    {schedule.assignee ? (
                                        <>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    {schedule.assignee.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-gray-900 dark:text-white">{schedule.assignee.name}</div>
                                        </>
                                    ) : (
                                        <div className="text-gray-500 dark:text-gray-400">Unassigned</div>
                                    )}
                                </div>
                            </div>

                            {/* Notes Section */}
                            {schedule.notes && (
                                <div className="p-6">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</span>
                                    </div>
                                    <div className="mt-2 rounded-lg bg-gray-50 p-4 whitespace-pre-wrap text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                                        {schedule.notes}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
