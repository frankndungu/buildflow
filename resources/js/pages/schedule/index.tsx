import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, MapPin, PlayCircle, Plus, Settings, Trash2, User2, Users } from 'lucide-react';

type Schedule = {
    id: number;
    task: {
        id: number;
        title: string;
        project: {
            id: number;
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

    const getStatusColor = (status: Schedule['status']) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400';
            case 'in_progress':
                return 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400';
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400';
            default:
                return 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400';
        }
    };

    const getStatusIcon = (status: Schedule['status']) => {
        switch (status) {
            case 'scheduled':
                return <Clock className="h-4 w-4" />;
            case 'in_progress':
                return <PlayCircle className="h-4 w-4" />;
            case 'completed':
                return <CheckCircle2 className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const formatStatus = (status: Schedule['status']) => {
        return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }),
        };
    };

    const isToday = (dateString: string) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.toDateString() === today.toDateString();
    };

    const isOverdue = (dateString: string, status: Schedule['status']) => {
        if (status === 'completed') return false;
        const today = new Date();
        const date = new Date(dateString);
        return date < today;
    };

    // Group schedules by date
    const groupedSchedules = schedules.reduce(
        (groups, schedule) => {
            const dateKey = new Date(schedule.scheduled_start).toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(schedule);
            return groups;
        },
        {} as Record<string, Schedule[]>,
    );

    const sortedDates = Object.keys(groupedSchedules).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Work Schedules</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Manage task assignments and project timelines</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.visit('/schedules/create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            <Plus className="h-4 w-4" />
                            Schedule Task
                        </motion.button>
                    </motion.div>

                    {/* Summary Stats */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {schedules.filter((s) => s.status === 'scheduled').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <PlayCircle className="h-6 w-6 text-amber-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {schedules.filter((s) => s.status === 'in_progress').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {schedules.filter((s) => s.status === 'completed').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline View */}
                    {sortedDates.length > 0 ? (
                        <div className="space-y-6">
                            {sortedDates.map((dateKey, dateIndex) => {
                                const dateSchedules = groupedSchedules[dateKey];
                                const date = new Date(dateKey);
                                const isCurrentDay = isToday(dateKey);

                                return (
                                    <motion.div
                                        key={dateKey}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: dateIndex * 0.1 }}
                                        className="space-y-4"
                                    >
                                        {/* Date Header */}
                                        <div
                                            className={`flex items-center gap-3 rounded-lg p-3 ${
                                                isCurrentDay
                                                    ? 'border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                                                    : 'border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                                            }`}
                                        >
                                            <Calendar className={`h-5 w-5 ${isCurrentDay ? 'text-blue-600' : 'text-gray-600'}`} />
                                            <h2
                                                className={`text-lg font-semibold ${
                                                    isCurrentDay ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                                                }`}
                                            >
                                                {date.toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                                {isCurrentDay && (
                                                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                                        Today
                                                    </span>
                                                )}
                                            </h2>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {dateSchedules.length} task{dateSchedules.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>

                                        {/* Schedules for this date */}
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {dateSchedules.map((schedule, index) => {
                                                const startTime = formatDateTime(schedule.scheduled_start);
                                                const endTime = formatDateTime(schedule.scheduled_end);
                                                const overdue = isOverdue(schedule.scheduled_end, schedule.status);

                                                return (
                                                    <motion.div
                                                        key={schedule.id}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: dateIndex * 0.1 + index * 0.05 }}
                                                        className={`group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:bg-gray-800 ${
                                                            overdue ? 'border-red-200 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'
                                                        }`}
                                                    >
                                                        <div className="space-y-4">
                                                            {/* Schedule Header */}
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <span
                                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(schedule.status)}`}
                                                                    >
                                                                        {getStatusIcon(schedule.status)}
                                                                        {formatStatus(schedule.status)}
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => router.visit(`/schedules/${schedule.id}/edit`)}
                                                                            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                                                        >
                                                                            <Settings className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                if (confirm('Are you sure you want to delete this schedule?')) {
                                                                                    router.delete(`/schedules/${schedule.id}`, {
                                                                                        preserveScroll: true,
                                                                                    });
                                                                                }
                                                                            }}
                                                                            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    {schedule.task?.title ?? 'Untitled Task'}
                                                                </h3>
                                                            </div>

                                                            {/* Schedule Details */}
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <button
                                                                        onClick={() => router.visit(`/projects/${schedule.task.project.id}`)}
                                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                                    >
                                                                        {schedule.task?.project?.name ?? 'Unknown Project'}
                                                                    </button>
                                                                </div>

                                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                    <Clock className="h-4 w-4" />
                                                                    <span>
                                                                        {startTime.time} - {endTime.time}
                                                                        {overdue && <span className="ml-2 font-medium text-red-600">Overdue</span>}
                                                                    </span>
                                                                </div>

                                                                {schedule.assignee ? (
                                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                                        <User2 className="h-4 w-4" />
                                                                        <span>Assigned to {schedule.assignee.name}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                                                        <Users className="h-4 w-4" />
                                                                        <span>Unassigned</span>
                                                                    </div>
                                                                )}

                                                                {schedule.notes && (
                                                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                                                                        <p className="text-sm text-gray-700 dark:text-gray-300">{schedule.notes}</p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Action Button */}
                                                            <div className="pt-4">
                                                                <button
                                                                    onClick={() => router.visit(`/schedules/${schedule.id}`)}
                                                                    className="w-full rounded-lg bg-gray-50 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:bg-gray-700/50 dark:text-white dark:hover:bg-gray-700"
                                                                >
                                                                    View Details
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700"
                        >
                            <div className="mx-auto max-w-md">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No schedules yet</h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Create your first work schedule to organize tasks and assignments.
                                </p>
                                <button
                                    onClick={() => router.visit('/schedules/create')}
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                                >
                                    <Plus className="h-4 w-4" />
                                    Schedule Task
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
