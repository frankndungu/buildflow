import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, BarChart3, Calendar, FileText, Save, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Project = {
    id: number;
    name: string;
};

type Report = {
    id: number;
    project_id: number | null;
    title: string;
    type: 'progress' | 'financial' | 'task' | 'custom';
    content: string;
    report_date: string;
};

type PageProps = {
    report: Report;
    projects: Project[];
};

const EditReport = () => {
    const { report, projects } = usePage<PageProps>().props;

    const [form, setForm] = useState({
        project_id: report.project_id?.toString() || '',
        title: report.title,
        type: report.type,
        content: report.content,
        report_date: report.report_date,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        router.put(`/reports/${report.id}`, form, {
            onError: (err) => setErrors(err),
            onSuccess: () => {
                router.visit('/reports');
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reports', href: '/reports' },
        { title: 'Edit', href: '#' },
    ];

    const reportTypeOptions = [
        { value: 'progress', label: 'Progress Report', description: 'Track project milestones and completion status' },
        { value: 'financial', label: 'Financial Report', description: 'Budget tracking and expense analysis' },
        { value: 'task', label: 'Task Report', description: 'Detailed task completion and assignments' },
        { value: 'custom', label: 'Custom Report', description: 'Create a customized report format' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${report.title}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Report</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Update report details and configuration</p>
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
                        {/* Basic Info Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
                                    <select
                                        name="project_id"
                                        value={form.project_id}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="">Select a project</option>
                                        {projects.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.project_id && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.project_id}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                        placeholder="Enter report title"
                                        required
                                    />
                                    {errors.title && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.title}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Report Configuration Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Report Configuration</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Type</label>
                                    <div className="mt-3 space-y-3">
                                        {reportTypeOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                                                    form.type === option.value
                                                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value={option.value}
                                                    checked={form.type === option.value}
                                                    onChange={handleChange}
                                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.type && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.type}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Date</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            name="report_date"
                                            value={form.report_date}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    {errors.report_date && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.report_date}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Report Content</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                                <textarea
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    rows={8}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Update your report content here. Include key findings, progress updates, metrics, and any relevant observations..."
                                    required
                                />
                                {errors.content && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.content}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.visit('/reports')}
                                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
                            >
                                <Save className="h-4 w-4" />
                                Update Report
                            </motion.button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </AppLayout>
    );
};

export default EditReport;
