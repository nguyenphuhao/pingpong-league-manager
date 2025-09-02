import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types';

// Enhanced button component optimized for 40+ users with mobile-first design
const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading = false, disabled = false, icon, className, ...props }, ref) => {
    
    // Determine if this is a column layout button based on className
    const isColumnLayout = className?.includes('flex-col');
    
    // Base styles optimized for accessibility and usability
    const baseStyles = cn(
      'inline-flex items-center justify-center',
      'font-medium rounded-lg shadow-sm',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-4 focus:ring-opacity-75',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95',
      'select-none touch-manipulation',
      // Responsive layout - ensure proper alignment
      isColumnLayout 
        ? 'flex-col gap-1 sm:gap-2' 
        : 'flex-row items-center gap-2 sm:gap-3'
    );

    // Mobile-first responsive size variants
    const sizeStyles = {
      sm: cn(
        'px-3 py-2 text-sm min-h-[44px]',
        'sm:px-4 sm:py-3',
        'md:text-base'
      ),
      md: cn(
        'px-4 py-3 text-base min-h-[48px]',
        'sm:px-6 sm:py-4 sm:min-h-[52px]',
        'md:text-lg'
      ),
      lg: cn(
        'px-6 py-4 text-lg min-h-[56px]',
        'sm:px-8 sm:py-5 sm:min-h-[60px]',
        'md:text-xl'
      ),
      xl: cn(
        'px-8 py-5 text-xl min-h-[64px]',
        'sm:px-10 sm:py-6 sm:min-h-[72px]',
        'md:text-2xl'
      ),
    };

    // Color variants with proper contrast
    const variantStyles = {
      primary: cn(
        'bg-slate-900 text-white border-2 border-slate-900',
        'hover:bg-slate-800 hover:border-slate-800',
        'active:bg-slate-700',
        'focus:ring-slate-300',
        'disabled:bg-slate-400 disabled:border-slate-400'
      ),
      secondary: cn(
        'bg-slate-100 text-slate-900 border-2 border-slate-200',
        'hover:bg-slate-200 hover:border-slate-300',
        'active:bg-slate-300',
        'focus:ring-slate-300'
      ),
      outline: cn(
        'bg-white text-slate-900 border-2 border-slate-300',
        'hover:bg-slate-50 hover:border-slate-400',
        'active:bg-slate-100',
        'focus:ring-slate-300'
      ),
      ghost: cn(
        'bg-transparent text-slate-700 border-2 border-transparent',
        'hover:bg-slate-100 hover:text-slate-900',
        'active:bg-slate-200',
        'focus:ring-slate-300'
      ),
      danger: cn(
        'bg-red-600 text-white border-2 border-red-600',
        'hover:bg-red-700 hover:border-red-700',
        'active:bg-red-800',
        'focus:ring-red-300'
      ),
    };

    // Get responsive icon sizes
    const getIconSize = () => {
      switch (size) {
        case 'sm': return 'w-4 h-4 sm:w-5 sm:h-5';
        case 'md': return 'w-5 h-5 sm:w-6 sm:h-6';
        case 'lg': return 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8';
        case 'xl': return 'w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9';
        default: return 'w-5 h-5 sm:w-6 sm:h-6';
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          loading && 'opacity-75 cursor-wait',
          // Remove flex-col from className to avoid conflicts
          className?.replace('flex-col', '')
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <Loader2 
            className={cn(
              'animate-spin',
              getIconSize(),
              isColumnLayout ? 'mb-1' : 'mr-2 sm:mr-3'
            )} 
            aria-hidden="true" 
          />
        )}
        
        {/* Icon when not loading */}
        {icon && !loading && !isColumnLayout && (
          <span 
            className={cn('flex-shrink-0', getIconSize())} 
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        
        {/* Column layout icon */}
        {icon && !loading && isColumnLayout && (
          <span 
            className={cn('flex-shrink-0 mb-1', getIconSize())} 
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        
        {/* Button content */}
        <span className={cn(
          'font-semibold leading-tight',
          isColumnLayout ? 'text-center' : ''
        )}>
          {children}
        </span>
        
        {/* Screen reader loading state */}
        {loading && (
          <span className="sr-only">Đang tải...</span>
        )}
      </button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export { ActionButton };
