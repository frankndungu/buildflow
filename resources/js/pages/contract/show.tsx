import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Calendar, DollarSign, Download, Edit2, FileText, Info } from 'lucide-react';

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
    project: {
        id: number;
        name: string;
    };
};

export default function ContractShow() {
    const { contract } = usePage<PageProps<{ contract: Contract }>>().props;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400';
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-400';
            case 'expired':
                return 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400';
            default:
                return 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400';
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Contracts', href: '/contracts' },
                { title: contract.title, href: `/contracts/${contract.id}` },
            ]}
        >
            <Head title={contract.title} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{contract.title}</h1>
                            <div className="mt-2 flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Project: {contract.project.name}</span>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.visit(`/contracts/${contract.id}/edit`)}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit Contract
                        </motion.button>
                    </motion.div>

                    {/* Contract Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                        {/* Status Banner */}
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(contract.status)}`}
                            >
                                {contract.status}
                            </span>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {/* Key Information */}
                            <div className="grid gap-6 p-6 md:grid-cols-2">
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Parties Involved</span>
                                    </div>
                                    <p className="mt-2 text-gray-900 dark:text-white">{contract.parties_involved}</p>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contract Value</span>
                                    </div>
                                    <p className="mt-2 text-gray-900 dark:text-white">
                                        {contract.value ? `KES ${Number(contract.value).toLocaleString()}` : '—'}
                                    </p>
                                </div>
                            </div>

                            {/* Dates Section */}
                            <div className="grid gap-6 p-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</span>
                                    </div>
                                    <p className="text-gray-900 dark:text-white">{new Date(contract.start_date).toLocaleDateString()}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</span>
                                    </div>
                                    <p className="text-gray-900 dark:text-white">
                                        {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : '—'}
                                    </p>
                                </div>
                            </div>

                            {/* Description Section */}
                            {contract.description && (
                                <div className="p-6">
                                    <div className="mb-3 flex items-center gap-2">
                                        <Info className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</span>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
                                        {contract.description}
                                    </div>
                                </div>
                            )}

                            {/* Attachment Section */}
                            {contract.file_path && (
                                <div className="p-6">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contract Document</span>
                                    </div>
                                    <a
                                        href={`/storage/${contract.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download Contract
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
