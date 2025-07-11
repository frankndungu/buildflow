import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type Project = {
    id: number;
    name: string;
    description: string | null;
    budget: number;
    start_date: string | null;
    end_date: string | null;
    status: string;
    creator?: {
        id: number;
        name: string;
    };
    users?: {
        id: number;
        name: string;
        email: string;
        pivot: {
            role: string;
        };
    }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
    { title: 'View', href: '#' },
];

export default function ShowProject() {
    const { project } = usePage().props as any as { project: Project };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />

            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    <a href={`/projects/${project.id}/edit`} className="text-sm text-blue-600 hover:underline">
                        Edit
                    </a>
                </div>

                <div className="space-y-4 text-sm">
                    <div>
                        <span className="font-semibold">Description:</span> {project.description || '—'}
                    </div>
                    <div>
                        <span className="font-semibold">Budget:</span> KES {Number(project.budget).toLocaleString()}
                    </div>
                    <div>
                        <span className="font-semibold">Start Date:</span> {project.start_date || '—'}
                    </div>
                    <div>
                        <span className="font-semibold">End Date:</span> {project.end_date || '—'}
                    </div>
                    <div>
                        <span className="font-semibold">Status:</span> {project.status}
                    </div>
                    {project.creator && (
                        <div>
                            <span className="font-semibold">Created By:</span> {project.creator.name}
                        </div>
                    )}
                </div>

                {project.users && project.users.length > 0 && (
                    <div className="mt-8 space-y-2">
                        <h2 className="text-lg font-semibold">Assigned Team</h2>
                        <ul className="space-y-1 text-sm">
                            {project.users.map((user) => (
                                <li key={user.id} className="flex justify-between border-b py-2">
                                    <div>
                                        <span className="font-medium">{user.name}</span> ({user.email})
                                    </div>
                                    <div className="text-gray-500 capitalize">{user.pivot.role}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
