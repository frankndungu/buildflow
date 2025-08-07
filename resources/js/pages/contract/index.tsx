import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

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

export default function ContractIndex() {
    const { contracts } = usePage().props as any as { contracts: Contract[] };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contracts" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Contracts</h1>
                    <a href="/contracts/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        + New Contract
                    </a>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {contracts.map((contract) => (
                        <div key={contract.id} className="flex flex-col justify-between rounded-xl border bg-white p-4 shadow dark:bg-gray-900">
                            <div className="space-y-2">
                                <div className="text-lg font-semibold">{contract.title}</div>
                                <div className="text-sm text-muted-foreground">Parties: {contract.parties_involved}</div>
                                {contract.project && <div className="text-sm text-gray-500">Project: {contract.project.name}</div>}
                                {contract.creator && <div className="text-sm text-gray-500">Created by: {contract.creator.name}</div>}
                                <div className="text-sm">
                                    Status: <span className="font-medium">{contract.status}</span>
                                </div>
                                <div className="text-sm">
                                    Start: {contract.start_date} <br />
                                    End: {contract.end_date ?? 'N/A'}
                                </div>
                                {contract.value !== null && (
                                    <div className="text-sm text-muted-foreground">Value: KES {Number(contract.value).toLocaleString()}</div>
                                )}
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                <a href={`/contracts/${contract.id}`} className="text-sm text-gray-700 hover:underline">
                                    View
                                </a>
                                <a href={`/contracts/${contract.id}/edit`} className="text-sm text-blue-600 hover:underline">
                                    Edit
                                </a>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this contract?')) {
                                            router.delete(`/contracts/${contract.id}`);
                                        }
                                    }}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {contracts.length === 0 && <p className="text-sm text-muted-foreground">No contracts available yet.</p>}
            </div>
        </AppLayout>
    );
}
