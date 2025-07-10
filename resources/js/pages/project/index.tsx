import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <a href="/projects/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        + New Project
                    </a>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {projects.map((project) => (
                        <div key={project.id} className="flex flex-col justify-between rounded-xl border bg-white p-4 shadow dark:bg-gray-900">
                            <div className="space-y-2">
                                <div className="text-lg font-semibold">{project.name}</div>
                                <div className="text-sm text-muted-foreground">Budget: KES {Number(project.budget).toLocaleString()}</div>
                                <div className="text-xs">
                                    Status: <span className="font-medium">{project.status}</span>
                                </div>
                                {project.creator && <div className="text-xs text-gray-500">Created by: {project.creator.name}</div>}
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                <a href={`/projects/${project.id}`} className="text-sm text-gray-700 hover:underline">
                                    View
                                </a>
                                <a href={`/projects/${project.id}/edit`} className="text-sm text-blue-600 hover:underline">
                                    Edit
                                </a>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this project?')) {
                                            router.delete(`/projects/${project.id}`);
                                        }
                                    }}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects available yet.</p>}
            </div>
        </AppLayout>
    );
}
