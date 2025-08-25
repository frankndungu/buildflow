import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, FileText, Plus, Settings, Trash2, TrendingUp, User2 } from 'lucide-react';

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

    const getTypeColor = (type: Report['type']) => {
        switch (type) {
            case 'progress':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400';
            case 'financial':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400';
            case 'task':
                return 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400';
            case 'custom':
                return 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400';
            default:
                return 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400';
        }
    };

    const getTypeIcon = (type: Report['type']) => {
        switch (type) {
            case 'progress':
                return <TrendingUp className="h-4 w-4" />;
            case 'financial':
                return <BarChart3 className="h-4 w-4" />;
            case 'task':
                return <Calendar className="h-4 w-4" />;
            case 'custom':
                return <FileText className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const formatReportType = (type: Report['type']) => {
        return type.charAt(0).toUpperCase() + type.slice(1) + ' Report';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Reports</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Generate and manage project reports and analytics</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.visit('/reports/create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            <Plus className="h-4 w-4" />
                            Create Report
                        </motion.button>
                    </motion.div>

                    {/* Reports Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {reports.map((report, index) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="space-y-4">
                                    {/* Report Header */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getTypeColor(report.type)}`}
                                            >
                                                {getTypeIcon(report.type)}
                                                {formatReportType(report.type)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => router.visit(`/reports/${report.id}/edit`)}
                                                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this report?')) {
                                                            router.delete(`/reports/${report.id}`);
                                                        }
                                                    }}
                                                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                                    </div>

                                    {/* Report Content Preview */}
                                    <div className="space-y-3">
                                        <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                                            {report.content || 'No content preview available'}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="h-4 w-4" />
                                            <span>{report.report_date ? new Date(report.report_date).toLocaleDateString() : 'No date set'}</span>
                                        </div>
                                        {report.user && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <User2 className="h-4 w-4" />
                                                <span>Created by {report.user.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4">
                                        <button
                                            onClick={() => router.visit(`/reports/${report.id}`)}
                                            className="w-full rounded-lg bg-gray-50 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:bg-gray-700/50 dark:text-white dark:hover:bg-gray-700"
                                        >
                                            View Report
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {reports.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700"
                        >
                            <div className="mx-auto max-w-md">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No reports yet</h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Get started by creating your first report to track progress and generate insights.
                                </p>
                                <button
                                    onClick={() => router.visit('/reports/create')}
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Report
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
