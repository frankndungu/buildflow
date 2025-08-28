import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, CheckSquare, FileText, Save, Trash2, User2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

export default function EditTask({ project, task, users }: any) {
    const [form, setForm] = useState({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        due_date: task.due_date || '',
        assigned_to: task.assigned_to || '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Filter out empty assigned_to to send null instead of empty string
        const formData = {
            ...form,
            assigned_to: form.assigned_to || null,
            due_date: form.due_date || null,
        };

        router.put(route('projects.tasks.update', [project.id, task.id]), formData, {
            onError: (err) => setErrors(err),
            onSuccess: () => {
                console.log('Task updated successfully');
            },
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            router.delete(route('projects.tasks.destroy', [project.id, task.id]), {
                onSuccess: () => {
                    console.log('Task deleted successfully');
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Tasks', href: `/projects/${project.id}/tasks` },
        { title: 'Edit Task', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Task" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Task</h1>
                            <p className="mt-3 text-base text-gray-600 dark:text-gray-400">Modify task details for project: {project.name}</p>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Task
                        </button>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >
                        {/* Task Information */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="border-b border-gray-200 bg-gray-50 px-8 py-5 dark:border-gray-700 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Task Information</h2>
                                </div>
                            </div>

                            <div className="space-y-8 p-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-3 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {errors.title && (
                                        <div className="mt-2.5 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.title}
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
                                        className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-3 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Task Details */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="border-b border-gray-200 bg-gray-50 px-8 py-5 dark:border-gray-700 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <CheckSquare className="h-5 w-5 text-gray-400" />
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Task Details</h2>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid gap-8 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                                        <div className="relative mt-2">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                name="due_date"
                                                value={form.due_date}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-gray-300 py-3 pr-4 pl-12 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-3 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign To</label>
                                        <div className="relative mt-2">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <User2 className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <select
                                                name="assigned_to"
                                                value={form.assigned_to}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-gray-300 py-3 pr-4 pl-12 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="">Unassigned</option>
                                                {users?.map((user: any) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => router.get(route('projects.tasks.index', project.id))}
                                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                <Save className="h-4 w-4" />
                                Update Task
                            </motion.button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </AppLayout>
    );
}
