import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Contracts', href: '/contracts' },
                { title: contract.title, href: `/contracts/${contract.id}` },
            ]}
        >
            <Head title={contract.title} />

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">{contract.title}</h1>

                <div className="text-sm text-muted-foreground">
                    Linked Project: <span className="font-medium">{contract.project.name}</span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <strong>Parties Involved:</strong>
                        <p>{contract.parties_involved}</p>
                    </div>
                    <div>
                        <strong>Status:</strong>
                        <p>{contract.status}</p>
                    </div>
                    <div>
                        <strong>Start Date:</strong>
                        <p>{contract.start_date}</p>
                    </div>
                    <div>
                        <strong>End Date:</strong>
                        <p>{contract.end_date ?? '—'}</p>
                    </div>
                    <div>
                        <strong>Value:</strong>
                        <p>{contract.value ? `KES ${Number(contract.value).toLocaleString()}` : '—'}</p>
                    </div>
                    <div className="col-span-2">
                        <strong>Description:</strong>
                        <p>{contract.description ?? '—'}</p>
                    </div>
                </div>

                {contract.file_path && (
                    <div>
                        <strong>Attached File:</strong>
                        <p>
                            <a href={`/storage/${contract.file_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                Download/View File
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
