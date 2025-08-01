import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Head, router } from '@inertiajs/react';
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
    todo: 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600',
    in_progress: 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600',
    done: 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-600',
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
        return new Date(dateString).toLocaleDateString();
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
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tasks for {project.name}</h1>
                    <button
                        onClick={() => router.get(route('projects.tasks.create', project.id))}
                        className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                        + Create Task
                    </button>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid gap-6 md:grid-cols-3">
                        {columnsOrder.map((status) => (
                            <Droppable droppableId={status} key={status}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`min-h-[400px] rounded-lg border-2 p-4 transition-colors ${
                                            snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : statusColors[status]
                                        }`}
                                     >
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-lg font-semibold">{statusLabels[status]}</h2>
                                            <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium dark:bg-gray-700">
                                                {columns[status].length}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {columns[status].map((task, index) => (
                                                <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`group rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-600 dark:bg-gray-800 ${
                                                                snapshot.isDragging ? 'rotate-2 transform shadow-lg' : ''
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div {...provided.dragHandleProps} className="flex-1 cursor-move">
                                                                    <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                                                                    {task.description && (
                                                                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                                                            {task.description}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                                    <button
                                                                        onClick={() => handleEdit(task)}
                                                                        className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                                                        title="Edit task"
                                                                    >
                                                                        <svg
                                                                            className="h-4 w-4"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(task)}
                                                                        className="rounded p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                                                                        title="Delete task"
                                                                    >
                                                                        <svg
                                                                            className="h-4 w-4"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                                <div className="flex items-center space-x-2">
                                                                    {task.assignee && (
                                                                        <div className="flex items-center space-x-1">
                                                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                                                                                {task.assignee.name.charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <span className="hidden sm:inline">{task.assignee.name}</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {task.due_date && (
                                                                    <div
                                                                        className={`flex items-center space-x-1 ${
                                                                            isOverdue(task.due_date) ? 'text-red-600 dark:text-red-400' : ''
                                                                        }`}
                                                                    >
                                                                        <svg
                                                                            className="h-3 w-3"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                            />
                                                                        </svg>
                                                                        <span>{formatDate(task.due_date)}</span>
                                                                        {isOverdue(task.due_date) && (
                                                                            <span className="font-medium text-red-600 dark:text-red-400">
                                                                                (Overdue)
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </div>
                                        {provided.placeholder}

                                        {columns[status].length === 0 && (
                                            <div className="flex h-32 items-center justify-center text-gray-400 dark:text-gray-500">
                                                <div className="text-center">
                                                    <svg className="mx-auto mb-2 h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                        />
                                                    </svg>
                                                    <p className="text-sm">No tasks</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </AppLayout>
    );
}
