'use client';

import { Home, Trophy, Calendar, User, Award, Bell, Settings, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { cn } from '@/lib/utils';
import { Header } from '@/components/common/header';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useAuth } from '@/contexts/auth-context';
import { NavItem } from '@/types';

const userNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Trang chủ', icon: Home, href: '/dashboard' },
  { id: 'tournaments', label: 'Giải đấu', icon: Trophy, href: '/dashboard/tournaments' },
  { id: 'matches', label: 'Trận đấu', icon: Calendar, href: '/dashboard/matches' },
  { id: 'achievements', label: 'Thành tích', icon: Award, href: '/dashboard/achievements' },
  { id: 'profile', label: 'Cá nhân', icon: User, href: '/dashboard/profile' },
];

interface UserLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function UserLayout({ children, title, subtitle, onBack, actions }: UserLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/user') {
      return pathname === '/user';
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
      <button
        className={cn(
          'p-2 rounded-lg transition-colors',
          'hover:bg-accent text-muted-foreground hover:text-foreground',
          'focus:outline-none focus:ring-4 focus:ring-ring/75',
          'min-h-[44px] min-w-[44px]'
        )}
        aria-label="Thông báo"
      >
        <Bell className="w-5 h-5" />
      </button>
      <button
        className={cn(
          'p-2 rounded-lg transition-colors',
          'hover:bg-accent text-muted-foreground hover:text-foreground',
          'focus:outline-none focus:ring-4 focus:ring-ring/75',
          'min-h-[44px] min-w-[44px]'
        )}
        aria-label="Cài đặt"
      >
        <Settings className="w-5 h-5" />
      </button>
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
      {actions}
    </div>
  );

  return (
    <AuthGuard requiredRole="member">
      <div className="min-h-screen bg-background">
        <Header 
          title={`${title} - ${user?.displayName || 'Người chơi'}`} 
          onBack={onBack} 
          actions={headerActions} 
        />
        
        <main className="pb-20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
            {subtitle && (
              <div className="py-6 border-b border-border">
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  {subtitle}
                </p>
              </div>
            )}
            
            <div className="py-6">
              {children}
            </div>
          </div>
        </main>
        
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
          <div className="flex items-center justify-around px-2 py-1">
            {userNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href!);
              
              return (
                <Link
                  key={item.id}
                  href={(item.href || '/') as Route}
                  className={cn(
                    'flex flex-col items-center justify-center',
                    'min-h-[60px] px-3 py-2 rounded-lg',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-4 focus:ring-ring/75',
                    active 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className={cn(
                    'w-6 h-6 mb-1',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )} />
                  <span className={cn(
                    'text-xs font-medium',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </AuthGuard>
  );
}
