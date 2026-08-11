'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap, Menu, X, LogOut, Bell, ChevronDown, User,
  LayoutDashboard, Clock, CheckCircle2, BookOpen, Users,
  CheckSquare, FileEdit, Calendar, UserCog, ClipboardList, Image,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAvatarUrl } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  clock: Clock,
  'check-circle': CheckCircle2,
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  bell: Bell,
  users: Users,
  'check-square': CheckSquare,
  'file-edit': FileEdit,
  calendar: Calendar,
  'user-cog': UserCog,
  'clipboard-list': ClipboardList,
  image: Image,
  'file-text': FileText,
};

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userName: string;
  userRole: string;
  notifications?: number;
  basePath: string;
  extraHeader?: React.ReactNode;
}

export function DashboardShell({ children, navItems, userName, userRole, notifications = 0, basePath, extraHeader }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const roleLabel = userRole.charAt(0) + userRole.slice(1).toLowerCase();

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 gradient-navy text-white transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block text-sm font-bold">Sri Chaitanya</span>
              <span className="block text-[10px] text-gold-400">Learn. Grow. Excel.</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-xs text-navy-300 uppercase tracking-wider">{roleLabel} Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== basePath && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-navy-200 hover:bg-white/5 hover:text-white'
                )}
              >
                {(() => {
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  return <Icon className="h-4 w-4 flex-shrink-0" />;
                })()}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-200 transition-colors hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-100 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-navy-600 hover:bg-navy-50 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            {extraHeader}
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative rounded-lg p-2 text-navy-600 hover:bg-navy-50"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {notifications}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-lg border border-navy-100 bg-white shadow-lg animate-fade-in z-50">
                  <div className="border-b border-navy-50 px-4 py-3">
                    <p className="font-semibold text-navy-900 text-sm">Notifications</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 text-sm text-navy-500 text-center">No new notifications</div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-navy-50"
              >
                <img src={getAvatarUrl(userName)} alt={userName} className="h-8 w-8 rounded-full" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-navy-900">{userName}</p>
                  <p className="text-xs text-navy-500">{roleLabel}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-navy-400 hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-navy-100 bg-white shadow-lg animate-fade-in z-50">
                  <div className="border-b border-navy-50 px-4 py-3">
                    <p className="font-semibold text-navy-900 text-sm">{userName}</p>
                    <p className="text-xs text-navy-500">{roleLabel} Account</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
