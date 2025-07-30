import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Task = {
    id: number;
    title: string;
    project?: {
        id: number;
        name: string;
    };
};

export type User = {
    id: number;
    name: string;
};

export type ScheduleFormData = {
    task_id: string;
    assigned_to: string | null;
    scheduled_start: string;
    scheduled_end: string;
    status: 'scheduled' | 'in_progress' | 'completed';
    notes: string;
};

export type PageProps<T = Record<string, unknown>> = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    ziggy: Ziggy;
} & T;
