'use client';

import { Home, Trophy, Clock, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';

const navigationItems: NavItem[] = [
  { id: 'home', label: 'Trang chủ', icon: Home, href: '/' },
  { id: 'tournaments', label: 'Giải đấu', icon: Trophy, href: '/tournaments' },
  { id: 'matches', label: 'Trận đấu', icon: Clock, href: '/matches' },
  { id: 'profile', label: 'Cá nhân', icon: User, href: '/profile' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-bottom shadow-lg">
      <div className="flex items-center justify-around px-1 sm:px-2 py-1 sm:py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href!);
          
          return (
            <Link
              key={item.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={item.href! as any}
              className={cn(
                'flex flex-col items-center justify-center',
                'min-h-[52px] sm:min-h-[60px] px-2 sm:px-3 py-1 sm:py-2 rounded-lg',
                'transition-all duration-200 active:scale-95',
                'focus:outline-none focus:ring-4 focus:ring-slate-300',
                'touch-manipulation',
                active 
                  ? 'bg-slate-900/10 text-slate-900' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1',
                active ? 'text-slate-900' : 'text-slate-500'
              )} />
              <span className={cn(
                'text-xs font-medium leading-tight',
                active ? 'text-slate-900' : 'text-slate-500'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
