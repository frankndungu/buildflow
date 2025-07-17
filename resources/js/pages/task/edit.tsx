import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
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

            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Task</h1>
                    <button onClick={handleDelete} className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
                        Delete Task
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium">Due Date</label>
                            <input
                                type="date"
                                name="due_date"
                                value={form.due_date}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                            />
                            {errors.due_date && <p className="text-sm text-red-600">{errors.due_date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Assign To</label>
                        <select
                            name="assigned_to"
                            value={form.assigned_to}
                            onChange={handleChange}
                            className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">Select a user (optional)</option>
                            {users?.map((user: any) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        {errors.assigned_to && <p className="text-sm text-red-600">{errors.assigned_to}</p>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => router.get(route('projects.tasks.index', project.id))}
                            className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
