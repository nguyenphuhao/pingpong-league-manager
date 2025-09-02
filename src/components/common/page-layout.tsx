import { Header } from './header';
import { BottomNavigation } from './bottom-navigation';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  onBack, 
  actions, 
  showBottomNav = true,
  className 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header title={title} onBack={onBack} actions={actions} />
      
      <main className={cn(
        "pb-16 sm:pb-20", // Space for bottom navigation
        showBottomNav && "mb-12 sm:mb-16",
        className
      )}>
        <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-screen-xl">
          {subtitle && (
            <div className="py-4 sm:py-6 border-b border-slate-200 mb-4 sm:mb-6">
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            </div>
          )}
          
          <div className="py-4 sm:py-6">
            {children}
          </div>
        </div>
      </main>
      
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
