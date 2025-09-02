'use client';

import { Trophy, Calendar, BarChart3, Users, Monitor } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Header } from '@/components/common/header';
import { NavItem } from '@/types';
import { ThemeSwitcher } from '@/components/common/theme-switcher';

const viewerNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: Monitor, href: '/viewer' },
  { id: 'tournaments', label: 'Giải đấu', icon: Trophy, href: '/viewer/tournaments' },
  { id: 'live', label: 'Trực tiếp', icon: Calendar, href: '/viewer/live' },
  { id: 'standings', label: 'Bảng xếp hạng', icon: BarChart3, href: '/viewer/standings' },
  { id: 'players', label: 'Vận động viên', icon: Users, href: '/viewer/players' },
];

interface ViewerLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showThemeSwitch?: boolean;
}

export function ViewerLayout({ children, title, subtitle, onBack, showThemeSwitch = false }: ViewerLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/viewer') {
      return pathname === '/viewer';
    }
    return pathname.startsWith(href);
  };

  const headerActions = showThemeSwitch ? (
    <ThemeSwitcher />
  ) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header title={title} onBack={onBack} actions={headerActions} />
      
      <main className="pb-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl">
          {subtitle && (
            <div className="py-6 border-b border-border">
              <div className="flex items-center justify-between">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {subtitle}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Cập nhật trực tiếp</span>
                </div>
              </div>
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
          {viewerNavItems.map((item) => {
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
                <Icon className={cn(
                  'w-6 h-6 mb-1',
                  active ? 'text-primary' : 'text-muted-foreground'
                )} />
                <span className={cn(
                  'text-xs font-medium text-center',
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
  );
}
