import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart4Icon, CalendarDays, Construction, FileSignature, FileTextIcon, LayoutGrid, UserRoundCheckIcon } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Projects',
        href: '/projects',
        icon: Construction,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart4Icon, // Optional for later
    },
    {
        title: 'Documents',
        href: '/documents',
        icon: FileTextIcon, // Or appropriate icon
    },
    {
        title: 'Scheduling',
        href: '/schedules',
        icon: CalendarDays,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Roles & Access',
        href: '/roles',
        icon: UserRoundCheckIcon,
    },
    {
        title: 'Contract',
        href: '/contract',
        icon: FileSignature,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
