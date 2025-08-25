import BudgetChart from '@/components/charts/budget-chart';
import CategoryChart from '@/components/charts/category-chart';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Calendar, DollarSign, Download, Eye, FileText, Plus, TrendingUp, Upload, Users } from 'lucide-react';
import type { FormEvent } from 'react';

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

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'on-hold':
            case 'on_hold': // Handle both underscore and hyphen formats
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'plan':
                return <FileText className="h-4 w-4" />;
            case 'contract':
                return <FileText className="h-4 w-4" />;
            case 'report':
                return <TrendingUp className="h-4 w-4" />;
            case 'photo':
                return <Eye className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const formatStatus = (status: string) => {
        return status
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/-/g, ' ') // Replace hyphens with spaces
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                            <p className="mt-2 text-lg text-gray-600">{project.description || 'No description provided'}</p>
                        </div>
                        <div className="flex gap-3">
                            <span
                                className={`inline-flex items-center rounded-full border px-4 py-2 text-base font-semibold ${getStatusColor(project.status)}`}
                            >
                                {formatStatus(project.status)}
                            </span>
                            <a
                                href={`/projects/${project.id}/edit`}
                                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Edit Project
                            </a>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                                <p className="text-2xl font-bold text-gray-900">KES {Number(project.budget).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TrendingUp className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Spent</p>
                                <p className="text-2xl font-bold text-gray-900">KES {Number(totalSpent).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <DollarSign className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Remaining</p>
                                <p className="text-2xl font-bold text-gray-900">KES {Number(budgetRemaining).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Team Members</p>
                                <p className="text-2xl font-bold text-gray-900">{project.users?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
                    {/* Main Content */}
                    <div className="space-y-8 xl:col-span-3">
                        {/* Project Details */}
                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <h2 className="mb-6 text-xl font-semibold text-gray-900">Project Details</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Start Date</p>
                                        <p className="text-sm text-gray-900">{project.start_date || 'Not set'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">End Date</p>
                                        <p className="text-sm text-gray-900">{project.end_date || 'Not set'}</p>
                                    </div>
                                </div>
                                {project.creator && (
                                    <div className="flex items-center space-x-3">
                                        <Users className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Created By</p>
                                            <p className="text-sm text-gray-900">{project.creator.name}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Tasks</p>
                                        <a href={`/projects/${project.id}/tasks`} className="text-sm text-blue-600 hover:text-blue-800">
                                            View Tasks →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <h3 className="mb-6 text-xl font-semibold text-gray-900">Budget Usage</h3>
                                <div className="h-80">
                                    <BudgetChart used={totalSpent} total={project.budget} />
                                </div>
                            </div>
                            <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <h3 className="mb-6 text-xl font-semibold text-gray-900">Expense Categories</h3>
                                <div className="h-80">
                                    <CategoryChart expenses={project.expenses || []} />
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        {project.documents && project.documents.length > 0 && (
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                                <h2 className="mb-6 text-xl font-semibold text-gray-900">Project Documents</h2>
                                <div className="space-y-4">
                                    {project.documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0 text-gray-400">{getCategoryIcon(doc.category)}</div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{doc.name}</p>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <span className="capitalize">{doc.category}</span>
                                                        {doc.version && <span>v{doc.version}</span>}
                                                        <span>by {doc.uploader?.name || 'Unknown'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <a
                                                href={`/storage/${doc.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                <Download className="h-4 w-4" />
                                                <span>Download</span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Expenses Section */}
                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <h2 className="mb-6 text-xl font-semibold text-gray-900">Recent Expenses</h2>
                            <div className="space-y-4">
                                {project.expenses?.map((exp) => (
                                    <div
                                        key={exp.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium text-gray-900">{exp.description}</p>
                                                <p className="text-lg font-semibold text-gray-900">KES {Number(exp.amount).toLocaleString()}</p>
                                            </div>
                                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="capitalize">{exp.category}</span>
                                                <span>{exp.spent_at}</span>
                                                <span>by {exp.uploader?.name}</span>
                                            </div>
                                        </div>
                                        <a
                                            href={`/storage/${exp.receipt_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-4 inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>Receipt</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 xl:col-span-1">
                        {/* Team Members */}
                        {project.users && project.users.length > 0 && (
                            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Team Members</h2>
                                <div className="space-y-3">
                                    {project.users.map((user) => (
                                        <div key={user.id} className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                                    <span className="text-xs font-medium text-gray-600">{user.name.charAt(0).toUpperCase()}</span>
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="truncate text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 capitalize">
                                                {user.pivot.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Document Form */}
                        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Upload Document</h3>
                            <form onSubmit={handleDocSubmit} className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Document Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter document name"
                                        value={docForm.data.name}
                                        onChange={(e) => docForm.setData('name', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        value={docForm.data.category}
                                        onChange={(e) => docForm.setData('category', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="plan">Plan</option>
                                        <option value="contract">Contract</option>
                                        <option value="report">Report</option>
                                        <option value="photo">Photo</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Version (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 1.0, v2.1"
                                        value={docForm.data.version}
                                        onChange={(e) => docForm.setData('version', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">File</label>
                                    <input
                                        type="file"
                                        accept="application/pdf,image/*"
                                        onChange={(e) => docForm.setData('file', e.target.files?.[0] || null)}
                                        className="w-full rounded-lg border border-gray-300 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 file:hover:bg-blue-100"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={docForm.processing}
                                    className="inline-flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Upload className="h-4 w-4" />
                                    <span>{docForm.processing ? 'Uploading...' : 'Upload Document'}</span>
                                </button>
                            </form>
                        </div>

                        {/* Add Expense Form */}
                        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Log Expense</h3>
                            <form onSubmit={handleExpenseSubmit} className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                    <input
                                        type="text"
                                        placeholder="What was this expense for?"
                                        value={expenseForm.data.description}
                                        onChange={(e) => expenseForm.setData('description', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Amount (KES)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={expenseForm.data.amount}
                                        onChange={(e) => expenseForm.setData('amount', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        value={expenseForm.data.category}
                                        onChange={(e) => expenseForm.setData('category', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="material">Material</option>
                                        <option value="labor">Labor</option>
                                        <option value="logistics">Logistics</option>
                                        <option value="misc">Miscellaneous</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Date Spent</label>
                                    <input
                                        type="date"
                                        value={expenseForm.data.spent_at}
                                        onChange={(e) => expenseForm.setData('spent_at', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Receipt</label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => expenseForm.setData('receipt', e.target.files?.[0] || null)}
                                        className="w-full rounded-lg border border-gray-300 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-green-700 file:hover:bg-green-100"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={expenseForm.processing}
                                    className="inline-flex w-full items-center justify-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>{expenseForm.processing ? 'Adding...' : 'Add Expense'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
