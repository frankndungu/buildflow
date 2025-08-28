import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Building2, Calendar, CheckCircle2, DollarSign, Edit3, Eye, FileText, Plus, Trash2, User, XCircle } from 'lucide-react';
import { useState } from 'react';

type Contract = {
    id: number;
    title: string;
    parties_involved: string;
    start_date: string;
    end_date: string | null;
    value: number | null;
    status: 'draft' | 'active' | 'completed' | 'terminated';
    creator?: {
        id: number;
        name: string;
    };
    project?: {
        id: number;
        name: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contracts', href: '/contracts' },
];

const statusConfig = {
    draft: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        icon: AlertCircle,
    },
    active: {
        label: 'Active',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        icon: CheckCircle2,
    },
    completed: {
        label: 'Completed',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        icon: CheckCircle2,
    },
    terminated: {
        label: 'Terminated',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        icon: XCircle,
    },
};

export default function ContractIndex() {
    const { contracts } = usePage().props as any as { contracts: Contract[] };
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setDeleteId(id);
        router.delete(`/contracts/${id}`, {
            onFinish: () => setDeleteId(null),
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contracts" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Contracts</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Manage your project contracts and agreements</p>
                            </div>
                            <Link
                                href="/contracts/create"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
                            >
                                <Plus className="h-4 w-4" />
                                New Contract
                            </Link>
                        </div>
                    </motion.div>

                    {/* Contracts Grid */}
                    {contracts.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {contracts.map((contract, index) => {
                                const StatusIcon = statusConfig[contract.status].icon;

                                return (
                                    <motion.div
                                        key={contract.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        {/* Header */}
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">{contract.title}</h3>
                                                <div className="mt-2 flex items-center gap-1.5">
                                                    <StatusIcon className="h-4 w-4" />
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusConfig[contract.status].color}`}
                                                    >
                                                        {statusConfig[contract.status].label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <User className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">Parties: {contract.parties_involved}</span>
                                            </div>

                                            {contract.project && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Building2 className="h-4 w-4 flex-shrink-0" />
                                                    <span className="truncate">Project: {contract.project.name}</span>
                                                </div>
                                            )}

                                            {contract.creator && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <User className="h-4 w-4 flex-shrink-0" />
                                                    <span className="truncate">Created by: {contract.creator.name}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                                <span>
                                                    {formatDate(contract.start_date)} -{' '}
                                                    {contract.end_date ? formatDate(contract.end_date) : 'Ongoing'}
                                                </span>
                                            </div>

                                            {contract.value !== null && (
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                                                    <span>{formatCurrency(contract.value)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-6 flex items-center gap-3">
                                            <Link
                                                href={`/contracts/${contract.id}`}
                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Link>
                                            <Link
                                                href={`/contracts/${contract.id}/edit`}
                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
                                                        handleDelete(contract.id);
                                                    }
                                                }}
                                                disabled={deleteId === contract.id}
                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 transition-colors hover:text-red-700 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                {deleteId === contract.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        // Empty State
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col items-center justify-center py-16"
                        >
                            <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                                <FileText className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">No contracts yet</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Get started by creating your first contract</p>
                            <Link
                                href="/contracts/create"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
                            >
                                <Plus className="h-4 w-4" />
                                Create Contract
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
