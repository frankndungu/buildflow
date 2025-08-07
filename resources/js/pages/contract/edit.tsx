import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';

type Project = {
    id: number;
    name: string;
};

type Contract = {
    id: number;
    title: string;
    parties_involved: string;
    start_date: string;
    end_date: string | null;
    value: number | null;
    status: string;
    description: string | null;
    file_path: string | null;
    project_id: number;
};

export default function ContractEdit() {
    const { contract, projects } = usePage<PageProps<{ contract: Contract; projects: Project[] }>>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        title: contract.title,
        parties_involved: contract.parties_involved,
        start_date: contract.start_date,
        end_date: contract.end_date ?? '',
        value: contract.value ?? '',
        status: contract.status,
        description: contract.description ?? '',
        file: null as File | null,
        project_id: contract.project_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(
            `/contracts/${contract.id}`,
            {
                ...data,
                _method: 'PUT',
            },
            {
                forceFormData: true,
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Contracts', href: '/contracts' },
                { title: contract.title, href: `/contracts/${contract.id}` },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title={`Edit Contract - ${contract.title}`} />

            <div className="mx-auto max-w-3xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Edit Contract</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-medium">Title</label>
                        <input type="text" className="input" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        {errors.title && <div className="text-sm text-red-600">{errors.title}</div>}
                    </div>

                    <div>
                        <label className="block font-medium">Parties Involved</label>
                        <input
                            type="text"
                            className="input"
                            value={data.parties_involved}
                            onChange={(e) => setData('parties_involved', e.target.value)}
                        />
                        {errors.parties_involved && <div className="text-sm text-red-600">{errors.parties_involved}</div>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block font-medium">Start Date</label>
                            <input type="date" className="input" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                        </div>

                        <div>
                            <label className="block font-medium">End Date</label>
                            <input type="date" className="input" value={data.end_date || ''} onChange={(e) => setData('end_date', e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium">Value (KES)</label>
                        <input type="number" className="input" value={data.value ?? ''} onChange={(e) => setData('value', Number(e.target.value))} />
                        {errors.value && <div className="text-sm text-red-600">{errors.value}</div>}
                    </div>

                    <div>
                        <label className="block font-medium">Status</label>
                        <select className="input" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="terminated">Terminated</option>
                        </select>
                        {errors.status && <div className="text-sm text-red-600">{errors.status}</div>}
                    </div>

                    <div>
                        <label className="block font-medium">Project</label>
                        <select className="input" value={data.project_id} onChange={(e) => setData('project_id', Number(e.target.value))}>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        {errors.project_id && <div className="text-sm text-red-600">{errors.project_id}</div>}
                    </div>

                    <div>
                        <label className="block font-medium">Attach New File (Optional)</label>
                        <input type="file" className="input" onChange={(e) => setData('file', e.target.files?.[0] || null)} />
                        {errors.file && <div className="text-sm text-red-600">{errors.file}</div>}
                    </div>

                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea className="input" value={data.description || ''} onChange={(e) => setData('description', e.target.value)} />
                        {errors.description && <div className="text-sm text-red-600">{errors.description}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
