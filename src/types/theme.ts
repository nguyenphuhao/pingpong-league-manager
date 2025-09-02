export type AgeGroup = 'under40' | 'over40';
export type ColorMode = 'light' | 'dark';

export interface ThemeConfig {
  ageGroup: AgeGroup;
  colorMode: ColorMode;
}

export interface ThemeContextType {
  theme: ThemeConfig;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export const DEFAULT_THEME: ThemeConfig = {
  ageGroup: 'over40', // Default to 40+ for accessibility
  colorMode: 'light'
};

// Theme-specific design tokens
export const THEME_TOKENS = {
  under40: {
    light: {
      // Modern, compact design
      fontSize: {
        base: '14px',
        heading: {
          h1: 'text-2xl',
          h2: 'text-xl', 
          h3: 'text-lg',
          h4: 'text-base'
        }
      },
      spacing: {
        section: 'space-y-4',
        component: 'space-y-2',
        padding: 'p-4'
      },
      buttonSize: 'min-h-[40px]',
      contrast: 'normal'
    },
    dark: {
      fontSize: {
        base: '14px',
        heading: {
          h1: 'text-2xl',
          h2: 'text-xl',
          h3: 'text-lg', 
          h4: 'text-base'
        }
      },
      spacing: {
        section: 'space-y-4',
        component: 'space-y-2',
        padding: 'p-4'
      },
      buttonSize: 'min-h-[40px]',
      contrast: 'normal'
    }
  },
  over40: {
    light: {
      // Larger, accessible design
      fontSize: {
        base: '16px',
        heading: {
          h1: 'text-3xl lg:text-4xl',
          h2: 'text-2xl lg:text-3xl',
          h3: 'text-xl lg:text-2xl',
          h4: 'text-lg lg:text-xl'
        }
      },
      spacing: {
        section: 'space-y-6',
        component: 'space-y-4',
        padding: 'p-6'
      },
      buttonSize: 'min-h-[48px]',
      contrast: 'high'
    },
    dark: {
      fontSize: {
        base: '16px',
        heading: {
          h1: 'text-3xl lg:text-4xl',
          h2: 'text-2xl lg:text-3xl',
          h3: 'text-xl lg:text-2xl',
          h4: 'text-lg lg:text-xl'
        }
      },
      spacing: {
        section: 'space-y-6',
        component: 'space-y-4',
        padding: 'p-6'
      },
      buttonSize: 'min-h-[48px]',
      contrast: 'high'
    }
  }
} as const;
