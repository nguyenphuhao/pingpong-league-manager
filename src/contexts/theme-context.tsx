'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AgeGroup, ColorMode, ThemeConfig, ThemeContextType, DEFAULT_THEME } from '@/types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('pingpong-theme');
      if (savedTheme) {
        try {
          const parsedTheme: ThemeConfig = JSON.parse(savedTheme);
          // Validate the parsed theme has required properties
          if (parsedTheme.ageGroup && parsedTheme.colorMode) {
            setTheme(parsedTheme);
          }
        } catch (error) {
          console.warn('Failed to parse saved theme, using default:', error);
        }
      }
    } catch (error) {
      console.warn('Failed to access localStorage, using default theme:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('pingpong-theme', JSON.stringify(theme));
    }
  }, [theme, isHydrated]);

  // Apply theme classes to document body
  useEffect(() => {
    if (!isHydrated) return;

    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('under40', 'over40', 'light', 'dark');
    
    // Add current theme classes
    body.classList.add(theme.ageGroup, theme.colorMode);

    // Update CSS custom properties for age-specific styling
    const root = document.documentElement;
    
    if (theme.ageGroup === 'over40') {
      root.style.setProperty('--base-font-size', '16px');
      root.style.setProperty('--button-min-height', '48px');
      root.style.setProperty('--section-spacing', '1.5rem');
      root.style.setProperty('--component-spacing', '1rem');
      root.style.setProperty('--content-padding', '1.5rem');
    } else {
      root.style.setProperty('--base-font-size', '14px');
      root.style.setProperty('--button-min-height', '40px');
      root.style.setProperty('--section-spacing', '1rem');
      root.style.setProperty('--component-spacing', '0.5rem');
      root.style.setProperty('--content-padding', '1rem');
    }
  }, [theme, isHydrated]);

  const setAgeGroup = (ageGroup: AgeGroup) => {
    setTheme(prev => ({ ...prev, ageGroup }));
  };

  const setColorMode = (colorMode: ColorMode) => {
    setTheme(prev => ({ ...prev, colorMode }));
  };

  const toggleColorMode = () => {
    setTheme(prev => ({
      ...prev,
      colorMode: prev.colorMode === 'light' ? 'dark' : 'light'
    }));
  };

  const contextValue: ThemeContextType = {
    theme,
    setAgeGroup,
    setColorMode,
    toggleColorMode
  };

  // Always provide context, even before hydration
  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={!isHydrated ? "min-h-screen bg-background text-foreground" : ""}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  // Always provide a safe fallback if context is undefined
  if (context === undefined) {
    console.warn('useTheme: ThemeProvider context not available, using default theme');
    return {
      theme: DEFAULT_THEME,
      setAgeGroup: () => {},
      setColorMode: () => {},
      toggleColorMode: () => {},
    };
  }
  
  return context;
}

// SSR-safe theme classes generator
function getThemeClasses(ageGroup: 'under40' | 'over40' = 'over40') {
  return {
    // Typography classes based on age group
    heading: {
      h1: ageGroup === 'over40' 
        ? 'text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight' 
        : 'text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight',
      h2: ageGroup === 'over40'
        ? 'text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight'
        : 'text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight',
      h3: ageGroup === 'over40'
        ? 'text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight'
        : 'text-lg sm:text-xl lg:text-2xl font-semibold leading-tight',
      h4: ageGroup === 'over40'
        ? 'text-lg sm:text-xl lg:text-2xl font-medium leading-normal'
        : 'text-base sm:text-lg lg:text-xl font-medium leading-normal'
    },
    
    // Spacing classes
    section: ageGroup === 'over40' ? 'space-y-6' : 'space-y-4',
    component: ageGroup === 'over40' ? 'space-y-4' : 'space-y-2',
    padding: ageGroup === 'over40' ? 'p-6' : 'p-4',
    
    // Button classes
    button: {
      base: ageGroup === 'over40' 
        ? 'min-h-[48px] px-6 py-3 text-base' 
        : 'min-h-[40px] px-4 py-2 text-sm',
      large: ageGroup === 'over40'
        ? 'min-h-[56px] px-8 py-4 text-lg'
        : 'min-h-[48px] px-6 py-3 text-base'
    },
    
    // Text size classes
    text: {
      body: ageGroup === 'over40' ? 'text-base' : 'text-sm',
      caption: ageGroup === 'over40' ? 'text-sm' : 'text-xs',
      large: ageGroup === 'over40' ? 'text-lg' : 'text-base'
    }
  };
}

// Hook to get theme-specific classes
export function useThemeClasses() {
  // SSR-safe: Get context without throwing
  const context = useContext(ThemeContext);
  
  // During SSR or if context is unavailable, use default
  if (typeof window === 'undefined' || !context) {
    return getThemeClasses('over40'); // Default to 40+ for accessibility
  }
  
  // Client-side with context available
  return getThemeClasses(context.theme.ageGroup);
}
