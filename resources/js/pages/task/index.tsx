import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

type Task = {
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
};

type Project = {
    id: number;
    name: string;
};

const columnsOrder = ['todo', 'in_progress', 'done'] as const;

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
        const destList = [...columns[destId]];
        const [moved] = sourceList.splice(source.index, 1);

        moved.status = destId;
        destList.splice(destination.index, 0, moved);

        setColumns({
            ...columns,
            [sourceId]: sourceList,
            [destId]: destList,
        });
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
                <h1 className="text-2xl font-bold">Tasks for {project.name}</h1>
                <a href={`/projects/${project.id}/tasks/create`} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    + Create Task
                </a>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid gap-4 md:grid-cols-3">
                        {columnsOrder.map((status) => (
                            <Droppable droppableId={status} key={status}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="min-h-[300px] rounded-lg border bg-white p-4 dark:bg-gray-900"
                                    >
                                        <h2 className="mb-3 text-lg font-semibold capitalize">{status.replace('_', ' ')}</h2>
                                        {columns[status].map((task, index) => (
                                            <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mb-3 rounded border border-gray-300 bg-white p-3 shadow-sm dark:bg-gray-800"
                                                    >
                                                        <div className="font-semibold">{task.title}</div>
                                                        <div className="text-xs text-muted-foreground">{task.description}</div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
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
