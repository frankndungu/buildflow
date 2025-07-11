import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Project = {
    id: number;
    name: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    budget: number;
    status: 'active' | 'completed' | 'on_hold';
};

type User = {
    id: number;
    name: string;
    email: string;
};

type AssignedUser = {
    id: number;
    name: string;
    email: string;
    role: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
    { title: 'Edit', href: '#' },
];

export default function EditProject() {
    const { project, users, assignedUsers } = usePage().props as any as {
        project: Project;
        users: User[];
        assignedUsers: AssignedUser[];
    };

    const [form, setForm] = useState({
        name: project.name,
        description: project.description || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        budget: project.budget.toString(),
        status: project.status,
        assigned_users: assignedUsers.map((u) => ({ id: u.id, role: u.role })),
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUserAssign = (userId: number, role: string) => {
        setForm((prev) => {
            const existing = prev.assigned_users.find((u) => u.id === userId);
            const updated = existing
                ? prev.assigned_users.map((u) => (u.id === userId ? { ...u, role } : u))
                : [...prev.assigned_users, { id: userId, role }];
            return { ...prev, assigned_users: updated };
        });
    };

    const handleUserRemove = (userId: number) => {
        setForm((prev) => ({
            ...prev,
            assigned_users: prev.assigned_users.filter((u) => u.id !== userId),
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        router.put(`/projects/${project.id}`, form, {
            onError: (err) => setErrors(err),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${project.name}`} />

            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Edit Project</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium">Project Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                            required
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    {/* Dates & Budget */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={form.start_date}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                            />
                            {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={form.end_date}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                            />
                            {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Budget (KES)</label>
                        <input
                            type="number"
                            name="budget"
                            value={form.budget}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                            required
                        />
                        {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="on_hold">On Hold</option>
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                    </div>

                    {/* Assign Users */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Assign Team Members</label>
                        <div className="space-y-3">
                            {users.map((user) => {
                                const assigned = form.assigned_users.find((u) => u.id === user.id);
                                return (
                                    <div key={user.id} className="flex items-center gap-3">
                                        <label className="flex-1 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={!!assigned}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        handleUserAssign(user.id, 'member');
                                                    } else {
                                                        handleUserRemove(user.id);
                                                    }
                                                }}
                                            />
                                            <span className="ml-2">
                                                {user.name} ({user.email})
                                            </span>
                                        </label>
                                        {assigned && (
                                            <select
                                                value={assigned.role}
                                                onChange={(e) => handleUserAssign(user.id, e.target.value)}
                                                className="rounded-md border px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
                                            >
                                                <option value="member">Member</option>
                                                <option value="manager">Manager</option>
                                            </select>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Update Project
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
