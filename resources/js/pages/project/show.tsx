import BudgetChart from '@/components/charts/budget-chart';
import CategoryChart from '@/components/charts/category-chart';
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
    expenses?: {
        id: number;
        description: string;
        amount: number;
        category: string;
        spent_at: string;
        receipt_path: string;
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

    const expenseForm = useForm({
        description: '',
        amount: '',
        category: 'material',
        spent_at: '',
        receipt: null as File | null,
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

    const handleExpenseSubmit = (e: FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('description', expenseForm.data.description);
        data.append('amount', expenseForm.data.amount);
        data.append('category', expenseForm.data.category);
        data.append('spent_at', expenseForm.data.spent_at);
        if (expenseForm.data.receipt) data.append('receipt', expenseForm.data.receipt);

        expenseForm.post(`/projects/${project.id}/expenses`, {
            preserveScroll: true,
            onSuccess: () => expenseForm.reset(),
        });
    };

    const totalSpent = project.expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    const budgetRemaining = project.budget - totalSpent;

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
                    <div>
                        <span className="font-semibold">Budget Used:</span> KES {Number(totalSpent).toLocaleString()}
                    </div>
                    <div>
                        <span className="font-semibold">Remaining:</span> KES {Number(budgetRemaining).toLocaleString()}
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
                {/* Tasks Section */}
                <a href={`/projects/${project.id}/tasks`} className="text-sm text-blue-600 hover:underline">
                    View Tasks
                </a>

                {/* Documents */}
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
                {/* Charts Section */}
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="mb-2 text-sm font-semibold">Budget Usage</h3>
                        <BudgetChart used={totalSpent} total={project.budget} />
                    </div>
                    <div>
                        <h3 className="mb-2 text-sm font-semibold">Expense Categories</h3>
                        <CategoryChart expenses={project.expenses || []} />
                    </div>
                </div>

                {/* Upload Document */}
                <div className="mt-10 rounded border p-4">
                    <h3 className="mb-3 text-sm font-semibold">Upload New Document</h3>
                    <form onSubmit={handleDocSubmit} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Document Name"
                            value={docForm.data.name}
                            onChange={(e) => docForm.setData('name', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                        <select
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
                            placeholder="Version (optional)"
                            value={docForm.data.version}
                            onChange={(e) => docForm.setData('version', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                        <input
                            type="file"
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

                {/* Expenses */}
                <div className="mt-12 space-y-4">
                    <h2 className="text-lg font-semibold">Expenses</h2>
                    <ul className="space-y-3 text-sm">
                        {project.expenses?.map((exp) => (
                            <li key={exp.id} className="rounded border p-3">
                                <div className="flex justify-between font-medium">
                                    <span>{exp.description}</span>
                                    <span>KES {Number(exp.amount).toLocaleString()}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Category: {exp.category} | Spent: {exp.spent_at} | Uploaded by: {exp.uploader?.name}
                                </div>
                                <a
                                    href={`/storage/${exp.receipt_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    View Receipt
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Add Expense Form */}
                <div className="mt-10 rounded border p-4">
                    <h3 className="mb-3 text-sm font-semibold">Log New Expense</h3>
                    <form onSubmit={handleExpenseSubmit} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Description"
                            value={expenseForm.data.description}
                            onChange={(e) => expenseForm.setData('description', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                        <input
                            type="number"
                            placeholder="Amount (KES)"
                            value={expenseForm.data.amount}
                            onChange={(e) => expenseForm.setData('amount', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                        <select
                            value={expenseForm.data.category}
                            onChange={(e) => expenseForm.setData('category', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                        >
                            <option value="material">Material</option>
                            <option value="labor">Labor</option>
                            <option value="logistics">Logistics</option>
                            <option value="misc">Misc</option>
                        </select>
                        <input
                            type="date"
                            value={expenseForm.data.spent_at}
                            onChange={(e) => expenseForm.setData('spent_at', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => expenseForm.setData('receipt', e.target.files?.[0] || null)}
                            className="w-full rounded border text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white"
                        />
                        <button
                            type="submit"
                            disabled={expenseForm.processing}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {expenseForm.processing ? 'Submitting…' : 'Add Expense'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
