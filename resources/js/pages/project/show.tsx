import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

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
    documents?: {
        id: number;
        name: string;
        category: string;
        file_path: string;
        version?: string;
        uploader?: {
            name: string;
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

    const docForm = useForm({
        name: '',
        category: 'plan',
        version: '',
        file: null as File | null,
    });

    const handleDocSubmit = (e: FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', docForm.data.name);
        data.append('category', docForm.data.category);
        if (docForm.data.version) data.append('version', docForm.data.version);
        if (docForm.data.file) data.append('file', docForm.data.file);

        docForm.post(`/projects/${project.id}/documents`, {
            preserveScroll: true,
            onSuccess: () => docForm.reset(),
        });
    };

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

                {/* Project Info */}
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

                {/* Assigned Users */}
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

                {/* Document List */}
                {project.documents && project.documents.length > 0 && (
                    <div className="mt-10 space-y-2">
                        <h2 className="text-lg font-semibold">Project Documents</h2>
                        <ul className="space-y-3">
                            {project.documents.map((doc) => (
                                <li key={doc.id} className="rounded border p-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">{doc.name}</span>
                                        <span className="text-xs text-muted-foreground capitalize">{doc.category}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Uploaded by: {doc.uploader?.name || '—'}
                                        {doc.version && <> | Version: {doc.version}</>}
                                    </div>
                                    <a
                                        href={`/storage/${doc.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        View File
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Upload Form */}
                <div className="mt-10 rounded border p-4">
                    <h3 className="mb-3 text-sm font-semibold">Upload New Document</h3>
                    <form onSubmit={handleDocSubmit} className="space-y-3">
                        <input
                            type="text"
                            name="name"
                            placeholder="Document Name"
                            value={docForm.data.name}
                            onChange={(e) => docForm.setData('name', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                        <select
                            name="category"
                            value={docForm.data.category}
                            onChange={(e) => docForm.setData('category', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                        >
                            <option value="plan">Plan</option>
                            <option value="contract">Contract</option>
                            <option value="report">Report</option>
                            <option value="photo">Photo</option>
                            <option value="other">Other</option>
                        </select>
                        <input
                            type="text"
                            name="version"
                            placeholder="Version (optional)"
                            value={docForm.data.version}
                            onChange={(e) => docForm.setData('version', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                        <input
                            type="file"
                            name="file"
                            accept="application/pdf,image/*"
                            onChange={(e) => docForm.setData('file', e.target.files?.[0] || null)}
                            className="w-full rounded border text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white"
                        />
                        <button
                            type="submit"
                            disabled={docForm.processing}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {docForm.processing ? 'Uploading…' : 'Upload Document'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
