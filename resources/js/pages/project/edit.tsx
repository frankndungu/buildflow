import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, DollarSign, FileText, Save, Users, X } from 'lucide-react';
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

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Project</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Update project details and team members</p>
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
                        {/* Basic Info Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                        required
                                    />
                                    {errors.name && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Timeline & Budget Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Timeline & Budget</h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={form.start_date}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={form.end_date}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget (KES)</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="budget"
                                            value={form.budget}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status & Team Section */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center gap-2">
                                <Users className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Status & Team</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Status</label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="on_hold">On Hold</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Members</label>
                                    <div className="mt-3 space-y-3">
                                        {users.map((user) => {
                                            const assigned = form.assigned_users.find((u) => u.id === user.id);
                                            return (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                                                >
                                                    <label className="flex flex-1 items-center gap-3 text-sm">
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
                                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                                                        <span className="text-gray-500 dark:text-gray-400">{user.email}</span>
                                                    </label>
                                                    {assigned && (
                                                        <select
                                                            value={assigned.role}
                                                            onChange={(e) => handleUserAssign(user.id, e.target.value)}
                                                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.visit('/projects')}
                                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
                            >
                                <Save className="h-4 w-4" />
                                Update Project
                            </motion.button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </AppLayout>
    );
}
