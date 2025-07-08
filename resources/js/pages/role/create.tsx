import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Create Role',
        href: '/roles/create',
    },
];

export default function CreateRole() {
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
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />

            <div className="mx-auto max-w-xl space-y-6 p-6">
                <h1 className="text-2xl font-bold">Create Role</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Create Role
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
