
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  LayoutDashboard,
  BarChart3,
  Briefcase,
  FileCheck,
  Sparkles,
  FileText,
  Mail,
  Target,
  MessageSquare,
  Map,
  User,
  Settings,
  Bell,
  History,
  Menu,
  X,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';

import { useAuth } from '@/constants/AuthContext';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  Briefcase,
  FileCheck,
  Sparkles,
  FileText,
  Mail,
  Target,
  MessageSquare,
  Map,
  User,
  Settings,
  Bell,
  History,
};

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: 'LayoutDashboard',
      },
      {
        label: 'Analytics',
        href: '/dashboard/analytics',
        icon: 'BarChart3',
      },
    ],
  },
  {
    label: 'Job Search',
    items: [
      {
        label: 'Jobs',
        href: '/dashboard/jobs',
        icon: 'Briefcase',
      },
      {
        label: 'Applications',
        href: '/dashboard/applications',
        icon: 'FileCheck',
      },
      {
        label: 'Matches',
        href: '/dashboard/jobs/matches',
        icon: 'Sparkles',
      },
    ],
  },
  {
    label: 'Tools',
    items: [
      {
        label: 'Resumes',
        href: '/dashboard/resumes',
        icon: 'FileText',
      },
      {
        label: 'Resume History',
        href: '/dashboard/resumes/history',
        icon: 'History',
      },
      {
        label: 'Cover Letters',
        href: '/dashboard/cover-letters',
        icon: 'Mail',
      },
      {
        label: 'Skills',
        href: '/dashboard/skills',
        icon: 'Target',
      },
      {
        label: 'Interviews',
        href: '/dashboard/interviews',
        icon: 'MessageSquare',
      },
      {
        label: 'Roadmap',
        href: '/dashboard/roadmap',
        icon: 'Map',
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: 'User',
      },
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: 'Settings',
      },
      {
        label: 'Notifications',
        href: '/dashboard/notifications',
        icon: 'Bell',
      },
    ],
  },
];

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const {
    user,
    logout: authLogout,
  } = useAuth();

  const logout = () => {
    authLogout();
    router.push('/login');
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background">

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border/60 bg-card lg:flex lg:flex-col">
        <SidebarContent
          pathname={pathname}
          user={user}
          logout={logout}
        />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="absolute inset-y-0 left-0 w-64 border-r border-border/60 bg-card">

            <button
              type="button"
              className="absolute right-4 top-4"
              onClick={() =>
                setMobileOpen(false)
              }
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>

            <SidebarContent
              pathname={pathname}
              user={user}
              logout={logout}
              onNavigate={() =>
                setMobileOpen(false)
              }
            />

          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col lg:pl-64">

        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur lg:hidden">

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setMobileOpen(true)
            }
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <span className="font-display text-lg font-bold">
            ResumeIQ
          </span>

          <div className="ml-auto">
            <ThemeToggle />
          </div>

        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}

interface SidebarContentProps {
  pathname: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
  } | null;
  logout: () => void;
  onNavigate?: () => void;
}

function SidebarContent({
  pathname,
  user,
  logout,
  onNavigate,
}: SidebarContentProps) {

  const initials =
    user
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
          .toUpperCase()
      : 'U';

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border/60 px-6">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FileText className="h-5 w-5" />
        </div>

        <span className="font-display text-lg font-bold">
          ResumeIQ
        </span>

      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">

        {navGroups.map((group) => (

          <div
            key={group.label}
            className="mb-4"
          >

            <p className="px-3 text-xs uppercase text-muted-foreground">
              {group.label}
            </p>

            <div className="mt-2 space-y-1">

              {group.items.map((item) => {

                const Icon =
                  iconMap[item.icon];

                const active =
                  pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-secondary'
                    )}
                  >

                    <Icon className="h-4 w-4" />

                    {item.label}

                    {active && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}

                  </Link>
                );
              })}

            </div>
          </div>
        ))}

      </nav>

     
{/* Current User */}
<div className="border-t p-4">
  <div className="flex items-center gap-3">

    <Link
      href="/dashboard/profile"
      className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 transition hover:bg-secondary"
      onClick={onNavigate}
    >
      <Avatar className="h-10 w-10 shrink-0">

        {user?.profileImage ? (
          <AvatarImage
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            className="object-cover"
          />
        ) : null}

        <AvatarFallback>
          {initials}
        </AvatarFallback>

      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {user
            ? `${user.firstName} ${user.lastName}`
            : 'Loading...'}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {user?.email}
        </p>
      </div>
    </Link>

    <Button
      variant="ghost"
      size="icon"
      onClick={logout}
      aria-label="Logout"
    >
      <LogOut className="h-4 w-4" />
    </Button>

    <ThemeToggle />

  </div>
</div>


    </>
  );
}

