import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function Header({ title, onBack, actions }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4">
        <div className="flex items-center min-w-0 flex-1">
          {onBack && (
            <button
              onClick={onBack}
              className={cn(
                "mr-2 sm:mr-4 p-2 -ml-2 rounded-lg",
                "hover:bg-slate-100 transition-colors",
                "focus:outline-none focus:ring-4 focus:ring-slate-300",
                "min-h-[44px] min-w-[44px] flex items-center justify-center"
              )}
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
            </button>
          )}
          
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">
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
