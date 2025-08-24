import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, Settings, Trash2, User2 } from 'lucide-react';

type Project = {
    id: number;
    name: string;
    description: string | null;
    budget: number;
    status: 'active' | 'completed' | 'on_hold';
    start_date: string | null;
    end_date: string | null;
    creator?: {
        id: number;
        name: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
];

export default function ProjectIndex() {
    const { projects } = usePage().props as any as { projects: Project[] };

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400';
            case 'completed':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400';
            case 'on_hold':
                return 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Projects</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Manage and track all your project activities</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.visit('/projects/create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            <Plus className="h-4 w-4" />
                            New Project
                        </motion.button>
                    </motion.div>

                    {/* Projects Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="space-y-4">
                                    {/* Project Header */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(project.status)}`}
                                            >
                                                {project.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => router.visit(`/projects/${project.id}/edit`)}
                                                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this project?')) {
                                                            router.delete(`/projects/${project.id}`);
                                                        }
                                                    }}
                                                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                                    </div>

                                    {/* Project Details */}
                                    <div className="space-y-3">
                                        {project.description && <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>}
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Start date not set'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            <span>Budget: KES {Number(project.budget).toLocaleString()}</span>
                                        </div>
                                        {project.creator && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <User2 className="h-4 w-4" />
                                                <span>Created by {project.creator.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4">
                                        <button
                                            onClick={() => router.visit(`/projects/${project.id}`)}
                                            className="w-full rounded-lg bg-gray-50 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:bg-gray-700/50 dark:text-white dark:hover:bg-gray-700"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {projects.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700"
                        >
                            <div className="mx-auto max-w-md">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No projects yet</h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Get started by creating your first project to track your work and budget.
                                </p>
                                <button
                                    onClick={() => router.visit('/projects/create')}
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Project
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
