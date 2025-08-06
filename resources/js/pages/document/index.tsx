import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Documents" />

            <div className="mx-auto max-w-7xl p-6">
                <h1 className="mb-6 text-2xl font-bold">All Documents</h1>

                {documents.length === 0 ? (
                    <p className="text-sm text-gray-600">No documents found.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {documents.map((doc) => (
                            <div key={doc.id} className="rounded border border-gray-200 p-4 text-sm shadow-sm transition hover:shadow-md">
                                <div className="mb-2 flex justify-between">
                                    <span className="font-semibold">{doc.name}</span>
                                    <span className="text-xs text-muted-foreground capitalize">{doc.category}</span>
                                </div>

                                <div className="mb-2 text-xs text-gray-500">
                                    Uploaded by: {doc.uploader?.name || '—'}
                                    {doc.version && <> | Version: {doc.version}</>}
                                    {doc.project && (
                                        <>
                                            {' '}
                                            | Project:{' '}
                                            <a href={`/projects/${doc.project.id}`} className="text-blue-600 hover:underline">
                                                {doc.project.name}
                                            </a>
                                        </>
                                    )}
                                </div>

                                <a
                                    href={`/storage/${doc.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    View File
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
