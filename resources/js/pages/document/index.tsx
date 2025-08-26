import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Download, ExternalLink, FileText, Folder, Plus, Settings, Trash2, Upload, User2 } from 'lucide-react';

type Document = {
    id: number;
    name: string;
    category: string;
    file_path: string;
    version?: string;
    uploader?: {
        name: string;
    };
    project?: {
        id: number;
        name: string;
    };
    created_at?: string;
};

type PageProps = {
    documents: Document[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Documents', href: '/documents' },
];

export default function GlobalDocumentIndex() {
    const { documents } = usePage().props as unknown as PageProps;

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'plan':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400';
            case 'contract':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400';
            case 'report':
                return 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400';
            case 'photo':
                return 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400';
            default:
                return 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'plan':
                return <FileText className="h-4 w-4" />;
            case 'contract':
                return <FileText className="h-4 w-4" />;
            case 'report':
                return <FileText className="h-4 w-4" />;
            case 'photo':
                return <Calendar className="h-4 w-4" />;
            default:
                return <Folder className="h-4 w-4" />;
        }
    };

    const formatCategory = (category: string) => {
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    const getFileExtension = (filePath: string) => {
        return filePath.split('.').pop()?.toUpperCase() || 'FILE';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Documents" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Documents</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Manage all project documents and files</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.visit('/documents/create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            <Plus className="h-4 w-4" />
                            Upload Document
                        </motion.button>
                    </motion.div>

                    {/* Documents Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {documents.map((document, index) => (
                            <motion.div
                                key={document.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="space-y-4">
                                    {/* Document Header */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryColor(document.category)}`}
                                            >
                                                {getCategoryIcon(document.category)}
                                                {formatCategory(document.category)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => router.visit(`/documents/${document.id}/edit`)}
                                                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this document?')) {
                                                            router.delete(`/documents/${document.id}`);
                                                        }
                                                    }}
                                                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{document.name}</h3>
                                    </div>

                                    {/* Document Details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Upload className="h-4 w-4" />
                                            <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700">
                                                {getFileExtension(document.file_path)}
                                            </span>
                                            {document.version && <span className="text-xs">v{document.version}</span>}
                                        </div>

                                        {document.uploader && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <User2 className="h-4 w-4" />
                                                <span>Uploaded by {document.uploader.name}</span>
                                            </div>
                                        )}

                                        {document.project && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Folder className="h-4 w-4" />
                                                <span>Project:</span>
                                                <button
                                                    onClick={() => router.visit(`/projects/${document.project?.id}`)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {document.project.name}
                                                </button>
                                            </div>
                                        )}

                                        {document.created_at && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(document.created_at).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-4">
                                        <a
                                            href={`/storage/${document.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            View
                                        </a>
                                        <a
                                            href={`/storage/${document.file_path}`}
                                            download
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-50 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {documents.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700"
                        >
                            <div className="mx-auto max-w-md">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No documents yet</h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Get started by uploading your first document to organize project files.
                                </p>
                                <button
                                    onClick={() => router.visit('/documents/create')}
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                                >
                                    <Plus className="h-4 w-4" />
                                    Upload Document
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
