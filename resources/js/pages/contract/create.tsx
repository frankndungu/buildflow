import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Project {
    id: number;
    name: string;
}

interface Props {
    projects: Project[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contracts', href: '/contracts' },
    { title: 'Create', href: '/contracts/create' },
];

export default function CreateContract({ projects }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        parties_involved: '',
        start_date: '',
        end_date: '',
        value: '',
        status: 'draft',
        project_id: '',
        description: '',
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/contracts', {
            forceFormData: true, // Required to upload files
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Contract" />

            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-4 text-2xl font-bold">New Contract</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block font-medium">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
                    </div>

                    {/* Parties */}
                    <div>
                        <label className="block font-medium">Parties Involved</label>
                        <input
                            type="text"
                            value={data.parties_involved}
                            onChange={(e) => setData('parties_involved', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.parties_involved && <div className="text-sm text-red-500">{errors.parties_involved}</div>}
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block font-medium">Start Date</label>
                        <input
                            type="date"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.start_date && <div className="text-sm text-red-500">{errors.start_date}</div>}
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block font-medium">End Date</label>
                        <input
                            type="date"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.end_date && <div className="text-sm text-red-500">{errors.end_date}</div>}
                    </div>

                    {/* Value */}
                    <div>
                        <label className="block font-medium">Value (KES)</label>
                        <input
                            type="number"
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.value && <div className="text-sm text-red-500">{errors.value}</div>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                            rows={4}
                            placeholder="Enter contract description..."
                        />
                        {errors.description && <div className="text-sm text-red-500">{errors.description}</div>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block font-medium">Status</label>
                        <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="w-full rounded border px-3 py-2">
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="terminated">Terminated</option>
                        </select>
                        {errors.status && <div className="text-sm text-red-500">{errors.status}</div>}
                    </div>

                    {/* Project dropdown */}
                    <div>
                        <label className="block font-medium">Project</label>
                        <select
                            value={data.project_id}
                            onChange={(e) => setData('project_id', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="">Select Project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        {errors.project_id && <div className="text-sm text-red-500">{errors.project_id}</div>}
                    </div>

                    {/* File upload */}
                    <div>
                        <label className="block font-medium">Attach Contract File</label>
                        <input type="file" onChange={(e) => setData('file', e.target.files?.[0] || null)} className="w-full" />
                        {errors.file && <div className="text-sm text-red-500">{errors.file}</div>}
                    </div>

                    {/* Submit button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                        >
                            Create Contract
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
