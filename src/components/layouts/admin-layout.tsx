'use client';

import { Settings, Users, Trophy, BarChart3, Calendar, MapPin, Bell, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Header } from '@/components/common/header';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useAuth } from '@/contexts/auth-context';
import { ThemeSwitcher, QuickThemeToggle } from '@/components/common/theme-switcher';
import { NavItem } from '@/types';

const adminNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: BarChart3, href: '/admin' },
  { id: 'tournaments', label: 'Giải đấu', icon: Trophy, href: '/admin/tournaments' },
  { id: 'users', label: 'Người dùng', icon: Users, href: '/admin/users' },
  { id: 'venues', label: 'Địa điểm', icon: MapPin, href: '/admin/venues' },
  { id: 'schedule', label: 'Lịch thi đấu', icon: Calendar, href: '/admin/schedule' },
  { id: 'notifications', label: 'Thông báo', icon: Bell, href: '/admin/notifications' },
  { id: 'settings', label: 'Cài đặt', icon: Settings, href: '/admin/settings' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const headerActions = (
    <div className="flex items-center space-x-2">
      {actions}
      <ThemeSwitcher />
      <QuickThemeToggle />
      <button
        onClick={handleLogout}
        className={cn(
          'p-2 rounded-lg transition-colors',
          'hover:bg-accent text-muted-foreground hover:text-foreground',
          'focus:outline-none focus:ring-4 focus:ring-ring/75',
          'min-h-[44px] min-w-[44px]'
        )}
        aria-label="Đăng xuất"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Header title={`${title} - ${user?.displayName || 'Admin'}`} actions={headerActions} />
        
        <div className="flex">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 lg:bg-card lg:border-r lg:border-border">
            <div className="flex-1 flex flex-col min-h-0 pt-6">
              <nav className="flex-1 px-4 space-y-2">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href!);
                  
                  return (
                    <Link
                      key={item.id}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      href={item.href! as any}
                      className={cn(
                        'flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors',
                        'focus:outline-none focus:ring-4 focus:ring-ring/75',
                        'min-h-[44px]',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >
                      <Icon className={cn('w-5 h-5 mr-3', active ? 'text-primary-foreground' : 'text-muted-foreground')} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              
              {/* User info at bottom */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {user?.displayName?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">
                      {user?.displayName || 'Admin User'}
                    </p>
                    <p className="text-xs text-muted-foreground">Quản trị viên</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Navigation */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
            <div className="flex items-center justify-around px-2 py-1">
              {adminNavItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href!);
                
                return (
                  <Link
                    key={item.id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    href={item.href! as any}
                    className={cn(
                      'flex flex-col items-center justify-center',
                      'min-h-[60px] px-2 py-2 rounded-lg',
                      'transition-colors duration-200',
                      'focus:outline-none focus:ring-4 focus:ring-ring/75',
                      active 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 lg:pl-64">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              {subtitle && (
                <div className="py-6 border-b border-border">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {subtitle}
                  </p>
                </div>
              )}
              
              <div className="py-6 pb-20 lg:pb-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
