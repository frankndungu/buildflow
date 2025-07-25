import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Role = {
    id: number;
    name: string;
    label: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
];

export default function Roles() {
    const { roles } = usePage().props as unknown as { roles: Role[] };

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [label, setLabel] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        router.post(
            '/roles',
            { name, label },
            {
                onError: (err) => setErrors(err),
                onSuccess: () => {
                    setName('');
                    setLabel('');
                    setErrors({});
                    setShowForm(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Roles</h1>
                    <button onClick={() => setShowForm(!showForm)} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                        {showForm ? 'Cancel' : 'Create Role'}
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-gray-200 p-4 dark:border-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="e.g., admin"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role Label</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="e.g., Administrator"
                            />
                            {errors.label && <p className="mt-1 text-sm text-red-600">{errors.label}</p>}
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                                Submit
                            </button>
                        </div>
                    </form>
                )}

                {/* Roles List */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border"
                        >
                            <div className="text-lg font-semibold">{role.label}</div>
                            <div className="text-sm text-muted-foreground">{role.name}</div>
                        </div>
                    ))}
                </div>

                {/* Placeholder if none */}
                {roles.length === 0 && (
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="relative z-10 flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                            No roles available
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
