import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Project = {
    id: number;
    name: string;
};

type PageProps = {
    projects: Project[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/reports' },
    { title: 'Create Report', href: '/reports/create' },
];

export default function CreateReport() {
    const { projects } = usePage<PageProps>().props;

    const [projectId, setProjectId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'progress' | 'financial' | 'task' | 'custom'>('progress');
    const [content, setContent] = useState('');
    const [reportDate, setReportDate] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        router.post(
            '/reports',
            {
                project_id: projectId,
                title,
                type,
                content,
                report_date: reportDate,
            },
            {
                onError: (err) => setErrors(err),
                onSuccess: () => {
                    router.visit('/reports');
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Report" />

            <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
                <h1 className="text-2xl font-bold">Create Report</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
                        <select
                            value={projectId ?? ''}
                            onChange={(e) => setProjectId(Number(e.target.value))}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">Select a project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        {errors.project_id && <p className="mt-1 text-sm text-red-600">{errors.project_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder="e.g., Weekly Summary"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="progress">Progress</option>
                            <option value="financial">Financial</option>
                            <option value="task">Task</option>
                            <option value="custom">Custom</option>
                        </select>
                        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            rows={4}
                        />
                        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Date</label>
                        <input
                            type="date"
                            value={reportDate}
                            onChange={(e) => setReportDate(e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.report_date && <p className="mt-1 text-sm text-red-600">{errors.report_date}</p>}
                    </div>

                    <div className="flex justify-between">
                        <Link href="/reports" className="text-sm text-blue-600 hover:underline">
                            Cancel
                        </Link>
                        <button type="submit" className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                            Create Report
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
