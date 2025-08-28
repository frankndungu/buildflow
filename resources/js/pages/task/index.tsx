import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Task = {
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    due_date?: string;
    assignee?: {
        id: number;
        name: string;
        email: string;
    };
};

type Project = {
    id: number;
    name: string;
};

const columnsOrder = ['todo', 'in_progress', 'done'] as const;

const statusLabels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
};

const statusColors = {
    todo: 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    in_progress: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-600',
    done: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-600',
};

const statusHeaderColors = {
    todo: 'text-gray-700 dark:text-gray-300',
    in_progress: 'text-blue-700 dark:text-blue-300',
    done: 'text-green-700 dark:text-green-300',
};

export default function TaskIndex({ project, tasks }: { project: Project; tasks: Task[] }) {
    const grouped = {
        todo: tasks.filter((t) => t.status === 'todo'),
        in_progress: tasks.filter((t) => t.status === 'in_progress'),
        done: tasks.filter((t) => t.status === 'done'),
    };

    const [columns, setColumns] = useState(grouped);

    const onDragEnd = (result: any) => {
        const { source, destination } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceId = source.droppableId as keyof typeof columns;
        const destId = destination.droppableId as keyof typeof columns;

        const sourceList = [...columns[sourceId]];
        const destList = sourceId === destId ? sourceList : [...columns[destId]];
        const [moved] = sourceList.splice(source.index, 1);

        // Update task status
        moved.status = destId;
        destList.splice(destination.index, 0, moved);

        setColumns({
            ...columns,
            [sourceId]: sourceList,
            [destId]: destList,
        });

        // Send API request to update task status
        router.patch(
            route('projects.tasks.update-status', [project.id, moved.id]),
            {
                status: destId,
            },
            {
                preserveState: true,
                onError: () => {
                    // Revert the change if API call fails
                    setColumns(grouped);
                },
            },
        );
    };

    const handleEdit = (task: Task) => {
        router.get(route('projects.tasks.edit', [project.id, task.id]));
    };

    const handleDelete = (task: Task) => {
        if (confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`)) {
            router.delete(route('projects.tasks.destroy', [project.id, task.id]), {
                onSuccess: () => {
                    // Update local state to remove the task
                    setColumns((prev) => ({
                        ...prev,
                        [task.status]: prev[task.status].filter((t) => t.id !== task.id),
                    }));
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const isOverdue = (dueDateString: string) => {
        if (!dueDateString) return false;
        const dueDate = new Date(dueDateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Tasks', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tasks - ${project.name}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Tasks for {project.name}</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Manage and organize project tasks using drag and drop</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.get(route('projects.tasks.create', project.id))}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
                            >
                                <Plus className="h-4 w-4" />
                                Create Task
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Kanban Board */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="grid gap-6 lg:grid-cols-3">
                                {columnsOrder.map((status) => (
                                    <Droppable droppableId={status} key={status}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`min-h-[500px] rounded-xl border-2 p-4 transition-all ${
                                                    snapshot.isDraggingOver
                                                        ? 'border-blue-400 bg-blue-50 shadow-lg dark:bg-blue-900/20'
                                                        : statusColors[status]
                                                }`}
                                            >
                                                {/* Column Header */}
                                                <div className="mb-6 flex items-center justify-between">
                                                    <h2 className={`text-lg font-semibold ${statusHeaderColors[status]}`}>{statusLabels[status]}</h2>
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-medium text-gray-600 shadow-sm dark:bg-gray-700 dark:text-gray-300">
                                                        {columns[status].length}
                                                    </span>
                                                </div>

                                                {/* Tasks */}
                                                <div className="space-y-3">
                                                    {columns[status].map((task, index) => (
                                                        <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                                                            {(provided, snapshot) => (
                                                                <motion.div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className={`group rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-600 dark:bg-gray-800 ${
                                                                        snapshot.isDragging ? 'rotate-1 transform shadow-xl ring-2 ring-blue-500' : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex items-start justify-between">
                                                                        <div {...provided.dragHandleProps} className="flex-1 cursor-move">
                                                                            <h3 className="leading-tight font-medium text-gray-900 dark:text-white">
                                                                                {task.title}
                                                                            </h3>
                                                                            {task.description && (
                                                                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                                                                    {task.description}
                                                                                </p>
                                                                            )}
                                                                        </div>

                                                                        <div className="ml-2 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.1 }}
                                                                                whileTap={{ scale: 0.9 }}
                                                                                onClick={() => handleEdit(task)}
                                                                                className="rounded p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                                                                title="Edit task"
                                                                            >
                                                                                <Edit2 className="h-4 w-4" />
                                                                            </motion.button>
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.1 }}
                                                                                whileTap={{ scale: 0.9 }}
                                                                                onClick={() => handleDelete(task)}
                                                                                className="rounded p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                                                                                title="Delete task"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </motion.button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Task Meta */}
                                                                    <div className="mt-4 flex items-center justify-between">
                                                                        <div className="flex items-center space-x-2">
                                                                            {task.assignee && (
                                                                                <div className="flex items-center space-x-2">
                                                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                                                                                        {task.assignee.name.charAt(0).toUpperCase()}
                                                                                    </div>
                                                                                    <span className="hidden text-xs text-gray-500 sm:block dark:text-gray-400">
                                                                                        {task.assignee.name}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {task.due_date && (
                                                                            <div
                                                                                className={`flex items-center space-x-1 text-xs ${
                                                                                    isOverdue(task.due_date)
                                                                                        ? 'font-medium text-red-600 dark:text-red-400'
                                                                                        : 'text-gray-500 dark:text-gray-400'
                                                                                }`}
                                                                            >
                                                                                <Calendar className="h-3 w-3" />
                                                                                <span>{formatDate(task.due_date)}</span>
                                                                                {isOverdue(task.due_date) && (
                                                                                    <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                                                                        Overdue
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                </div>
                                                {provided.placeholder}

                                                {/* Empty State */}
                                                {columns[status].length === 0 && (
                                                    <div className="flex h-32 items-center justify-center text-gray-400 dark:text-gray-500">
                                                        <div className="text-center">
                                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <p className="text-sm font-medium">No tasks</p>
                                                            <p className="mt-1 text-xs">Tasks will appear here</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                            </div>
                        </DragDropContext>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
