import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Building2, Calendar, DollarSign, FileText, FolderOpen, Save, Settings } from 'lucide-react';

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

    const statusOptions = [
        { value: 'active', label: 'Active', description: 'Contract is currently active and in effect' },
        { value: 'completed', label: 'Completed', description: 'Contract has been successfully completed' },
        { value: 'terminated', label: 'Terminated', description: 'Contract has been terminated before completion' },
    ];

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

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Contract</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Update contract details and documentation</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >
                        {/* Basic Information */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.title && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.title}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
                                        <select
                                            value={data.project_id}
                                            onChange={(e) => setData('project_id', Number(e.target.value))}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        >
                                            {projects.map((project) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.project_id && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.project_id}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Parties Involved</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Building2 className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.parties_involved}
                                            onChange={(e) => setData('parties_involved', e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter all parties involved in this contract"
                                        />
                                    </div>
                                    {errors.parties_involved && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.parties_involved}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Schedule & Financial Details */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule & Financial Details</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                className="block w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        {errors.start_date && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.start_date}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                className="block w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        {errors.end_date && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.end_date}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contract Value (KES)</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            value={data.value ?? ''}
                                            onChange={(e) => setData('value', Number(e.target.value))}
                                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter contract value"
                                        />
                                    </div>
                                    {errors.value && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.value}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <Settings className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contract Status</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <div className="mt-3 space-y-3">
                                    {statusOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                                                data.status === option.value
                                                    ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                value={option.value}
                                                checked={data.status === option.value}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.status && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.status}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <FolderOpen className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                    <textarea
                                        value={data.description || ''}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                        placeholder="Provide additional details about the contract..."
                                    />
                                    {errors.description && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attach New File (Optional)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 dark:text-gray-400 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Upload a new contract document (PDF, DOC, DOCX files supported)
                                    </p>
                                    {errors.file && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.file}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.visit(`/contracts/${contract.id}`)}
                                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Saving Changes...' : 'Save Changes'}
                            </motion.button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </AppLayout>
    );
}
