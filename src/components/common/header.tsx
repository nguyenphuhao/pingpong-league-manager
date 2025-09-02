'use client';

import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/contexts/theme-context';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function Header({ title, onBack, actions }: HeaderProps) {
  const themeClasses = useThemeClasses();
  
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className={cn(
        "flex items-center justify-between px-3 sm:px-4",
        themeClasses.padding.replace('p-', 'py-')
      )}>
        <div className="flex items-center min-w-0 flex-1">
          {onBack && (
            <button
              onClick={onBack}
              className={cn(
                "mr-2 sm:mr-4 p-2 -ml-2 rounded-lg",
                "hover:bg-accent transition-colors",
                "focus:outline-none focus:ring-4 focus:ring-ring/75",
                themeClasses.button.base,
                "flex items-center justify-center"
              )}
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </button>
          )}
          
          <h1 className={cn(
            "font-semibold text-foreground truncate",
            themeClasses.heading.h4
          )}>
            {title}
          </h1>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
