import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    BarChart3,
    Calendar,
    CheckSquare,
    Clock,
    DollarSign,
    Download,
    Edit3,
    FileText,
    FolderOpen,
    Settings,
    Share2,
    User,
} from 'lucide-react';

type Report = {
    id: number;
    title: string;
    type: 'progress' | 'financial' | 'task' | 'custom';
    content: string;
    report_date: string;
    created_at: string;
    project?: {
        id: number;
        name: string;
    };
    user?: {
        id: number;
        name: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/reports' },
];

export default function ReportShow() {
    const { report } = usePage().props as unknown as { report: Report };

    const getReportTypeInfo = (type: string) => {
        const typeMap = {
            progress: {
                icon: BarChart3,
                label: 'Progress Report',
                color: 'bg-blue-500',
                lightColor: 'bg-blue-50 dark:bg-blue-900/20',
                textColor: 'text-blue-700 dark:text-blue-300',
            },
            financial: {
                icon: DollarSign,
                label: 'Financial Report',
                color: 'bg-green-500',
                lightColor: 'bg-green-50 dark:bg-green-900/20',
                textColor: 'text-green-700 dark:text-green-300',
            },
            task: {
                icon: CheckSquare,
                label: 'Task Report',
                color: 'bg-purple-500',
                lightColor: 'bg-purple-50 dark:bg-purple-900/20',
                textColor: 'text-purple-700 dark:text-purple-300',
            },
            custom: {
                icon: Settings,
                label: 'Custom Report',
                color: 'bg-orange-500',
                lightColor: 'bg-orange-50 dark:bg-orange-900/20',
                textColor: 'text-orange-700 dark:text-orange-300',
            },
        };
        return typeMap[type as keyof typeof typeMap] || typeMap.custom;
    };

    const typeInfo = getReportTypeInfo(report.type);
    const TypeIcon = typeInfo.icon;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: report.title, href: `/reports/${report.id}` }]}>
            <Head title={report.title} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/reports"
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                                <div>
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className={`rounded-lg p-2 ${typeInfo.lightColor}`}>
                                            <TypeIcon className={`h-6 w-6 ${typeInfo.textColor}`} />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{report.title}</h1>
                                            <div
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${typeInfo.lightColor} ${typeInfo.textColor}`}
                                            >
                                                {typeInfo.label}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    <Share2 className="h-4 w-4" />
                                    Share
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </motion.button>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        href={`/reports/${report.id}/edit`}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        Edit Report
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2"
                        >
                            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="mb-6 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Report Content</h2>
                                </div>

                                <div className="prose prose-gray dark:prose-invert max-w-none">
                                    <div className="leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">{report.content}</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sidebar */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                            {/* Report Details Card */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Report Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Report Date</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(report.report_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                                            <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Generated By</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{report.user?.name ?? 'Unknown User'}</p>
                                        </div>
                                    </div>

                                    {report.project && (
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
                                                <FolderOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">Associated Project</p>
                                                <Link
                                                    href={`/projects/${report.project.id}`}
                                                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {report.project.name}
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700">
                                            <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(report.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                                        <Download className="h-4 w-4" />
                                        Download PDF
                                    </button>

                                    <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                                        <Share2 className="h-4 w-4" />
                                        Share Report
                                    </button>

                                    {report.project && (
                                        <Link
                                            href={`/projects/${report.project.id}`}
                                            className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <FolderOpen className="h-4 w-4" />
                                            View Project
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
