import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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
    const { roles } = usePage().props as any as { roles: Role[] };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
