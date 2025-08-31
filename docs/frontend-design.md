# Frontend Design - Ping Pong League Manager

## **1. Design Philosophy & Target Audience**

### **1.1. Primary Users: Adults 40+ Years Old**

**Key Characteristics:**
- Less familiar with complex modern interfaces
- Prefer larger, clearer text and buttons
- Need simple, intuitive navigation
- Value familiar UI patterns
- Require high contrast for better readability
- May have vision or dexterity challenges
- Appreciate consistent, predictable layouts

**Design Principles:**
- **Simplicity First:** Minimize cognitive load
- **Accessibility:** WCAG 2.1 AA compliance
- **Familiarity:** Use conventional UI patterns
- **Clarity:** High contrast, large text
- **Forgiveness:** Clear error messages, undo options
- **Efficiency:** Minimize steps to complete tasks

---

## **2. Visual Design System**

### **2.1. Color Palette**

```typescript
// Primary Brand Colors
export const colors = {
  // Primary - Blue (Trust, Professional)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary - Green (Success, Positive Actions)
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0', 
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Main secondary
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Neutral - Gray (Background, Text)
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',  // Body text
    700: '#374151',  // Heading text
    800: '#1f2937',  // Dark text
    900: '#111827',  // Darkest
  },
  
  // Semantic Colors
  error: {
    50: '#fef2f2',
    500: '#ef4444',  // Main error
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',  // Main warning
    600: '#d97706',
  },
  
  success: {
    50: '#f0fdf4', 
    500: '#10b981',  // Main success
    600: '#059669',
  },
  
  info: {
    50: '#eff6ff',
    500: '#3b82f6',  // Main info
    600: '#2563eb',
  }
};

// High Contrast Theme for Accessibility
export const highContrastColors = {
  primary: '#0000ff',      // Pure blue
  secondary: '#008000',    // Pure green
  text: '#000000',         // Pure black
  background: '#ffffff',   // Pure white
  error: '#ff0000',        // Pure red
  warning: '#ff8c00',      // Dark orange
};
```

### **2.2. Typography Scale**

```typescript
export const typography = {
  // Font Family - Optimized for readability
  fontFamily: {
    sans: [
      'Inter',           // Modern, highly legible
      'system-ui',       // System default
      'Arial',           // Familiar fallback
      'sans-serif'
    ],
    mono: [
      'SF Mono',
      'Monaco', 
      'Consolas',
      'monospace'
    ]
  },
  
  // Font Sizes - Larger than typical for 40+ users
  fontSize: {
    'xs': ['14px', { lineHeight: '20px' }],    // Minimum readable size
    'sm': ['16px', { lineHeight: '24px' }],    // Small text
    'base': ['18px', { lineHeight: '28px' }],  // Body text (larger than standard 16px)
    'lg': ['20px', { lineHeight: '32px' }],    // Large text
    'xl': ['24px', { lineHeight: '32px' }],    // Headings
    '2xl': ['30px', { lineHeight: '36px' }],   // Large headings
    '3xl': ['36px', { lineHeight: '40px' }],   // Display text
    '4xl': ['48px', { lineHeight: '52px' }],   // Hero text
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Letter Spacing for readability
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
  }
};
```

### **2.3. Spacing & Layout**

```typescript
export const spacing = {
  // Base spacing unit (larger for easier touch targets)
  base: 4,
  
  // Spacing scale
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  56: '224px',
  64: '256px',
};

// Touch Target Sizes (minimum 44px for accessibility)
export const touchTargets = {
  small: '44px',       // Minimum touch target
  medium: '52px',      // Comfortable size
  large: '60px',       // Large buttons
  xlarge: '72px',      // Primary actions
};

// Layout containers
export const containers = {
  xs: '475px',
  sm: '640px', 
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
```

### **2.4. Border Radius & Shadows**

```typescript
export const borderRadius = {
  none: '0px',
  sm: '4px',           // Small elements
  base: '8px',         // Default
  md: '12px',          // Cards
  lg: '16px',          // Large components
  xl: '24px',          // Modals
  full: '9999px',      // Pills/badges
};

// Subtle shadows for depth without overwhelming
export const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};
```

---

## **3. Component Design System**

### **3.1. Button Components**

```typescript
// Button variants optimized for 40+ users
export const Button = {
  // Base styles
  base: `
    inline-flex items-center justify-center
    font-medium rounded-md
    transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-opacity-75
    disabled:opacity-50 disabled:cursor-not-allowed
    select-none
  `,
  
  // Size variants - All larger than typical
  size: {
    sm: `px-4 py-3 text-sm min-h-[44px]`,      // Still meets 44px minimum
    md: `px-6 py-4 text-base min-h-[52px]`,    // Standard size
    lg: `px-8 py-5 text-lg min-h-[60px]`,      // Large actions
    xl: `px-10 py-6 text-xl min-h-[72px]`,     // Hero actions
  },
  
  // Color variants
  variant: {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 active:bg-primary-800
      focus:ring-primary-500
    `,
    secondary: `
      bg-secondary-600 text-white  
      hover:bg-secondary-700 active:bg-secondary-800
      focus:ring-secondary-500
    `,
    outline: `
      border-2 border-primary-600 text-primary-600 bg-white
      hover:bg-primary-50 active:bg-primary-100
      focus:ring-primary-500
    `,
    ghost: `
      text-neutral-700 bg-transparent
      hover:bg-neutral-100 active:bg-neutral-200
      focus:ring-neutral-500
    `,
    danger: `
      bg-error-600 text-white
      hover:bg-error-700 active:bg-error-800
      focus:ring-error-500
    `,
  }
};

// Example Button component
export function ActionButton({ 
  children, 
  size = 'md', 
  variant = 'primary', 
  icon,
  loading = false,
  ...props 
}) {
  return (
    <button
      className={cn(
        Button.base,
        Button.size[size],
        Button.variant[variant],
        loading && 'opacity-75 cursor-wait'
      )}
      disabled={loading}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
      )}
      {icon && !loading && (
        <span className="mr-3">{icon}</span>
      )}
      <span className="font-semibold">{children}</span>
    </button>
  );
}
```

### **3.2. Card Components**

```typescript
// Card system for content organization
export const Card = {
  base: `
    bg-white rounded-lg border border-neutral-200
    shadow-md transition-all duration-200
  `,
  
  interactive: `
    hover:shadow-lg hover:border-neutral-300
    cursor-pointer
  `,
  
  padding: {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8',
  }
};

// Tournament Card Example
export function TournamentCard({ tournament, onClick }) {
  return (
    <div 
      className={cn(Card.base, Card.interactive, Card.padding.md)}
      onClick={onClick}
    >
      {/* Header with status badge */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-neutral-800 leading-tight">
          {tournament.name}
        </h3>
        <StatusBadge status={tournament.status} />
      </div>
      
      {/* Tournament details with large, clear text */}
      <div className="space-y-3">
        <div className="flex items-center text-base text-neutral-600">
          <Calendar className="w-5 h-5 mr-3 text-primary-500" />
          <span>{formatDate(tournament.startDate)}</span>
        </div>
        
        <div className="flex items-center text-base text-neutral-600">
          <MapPin className="w-5 h-5 mr-3 text-primary-500" />
          <span>{tournament.venue}</span>
        </div>
        
        <div className="flex items-center text-base text-neutral-600">
          <Users className="w-5 h-5 mr-3 text-primary-500" />
          <span>{tournament.registeredCount}/{tournament.maxParticipants} người</span>
        </div>
      </div>
      
      {/* Action area */}
      <div className="mt-6 pt-4 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-primary-600">
            {formatCurrency(tournament.entryFee)}
          </span>
          <ChevronRight className="w-6 h-6 text-neutral-400" />
        </div>
      </div>
    </div>
  );
}
```

### **3.3. Form Components**

```typescript
// Form inputs optimized for accessibility and usability
export const Input = {
  base: `
    w-full px-4 py-4 text-base
    border-2 border-neutral-300 rounded-md
    focus:border-primary-500 focus:ring-4 focus:ring-primary-100
    disabled:bg-neutral-100 disabled:cursor-not-allowed
    transition-colors duration-200
  `,
  
  error: `border-error-500 focus:border-error-500 focus:ring-error-100`,
  
  // Label styles
  label: `
    block text-base font-medium text-neutral-700 mb-2
  `,
  
  // Help text
  help: `
    mt-2 text-sm text-neutral-600
  `,
  
  // Error message  
  errorMessage: `
    mt-2 text-sm text-error-600 flex items-center
  `,
};

// Phone Number Input Component
export function PhoneInput({ label, error, helpText, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className={Input.label}>
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-neutral-500 text-base">+84</span>
        </div>
        
        <input
          type="tel"
          className={cn(
            Input.base,
            'pl-16', // Space for +84 prefix
            error && Input.error
          )}
          placeholder="912 345 678"
          {...props}
        />
      </div>
      
      {helpText && !error && (
        <p className={Input.help}>{helpText}</p>
      )}
      
      {error && (
        <p className={Input.errorMessage}>
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// OTP Input Component
export function OTPInput({ length = 6, onComplete, error }) {
  const [values, setValues] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-3">
        {values.map((value, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'w-14 h-14 text-center text-xl font-semibold',
              'border-2 border-neutral-300 rounded-lg',
              'focus:border-primary-500 focus:ring-4 focus:ring-primary-100',
              'transition-colors duration-200',
              error && 'border-error-500 focus:border-error-500'
            )}
          />
        ))}
      </div>
      
      {error && (
        <p className="text-center text-sm text-error-600 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
```

### **3.4. Navigation Components**

```typescript
// Bottom navigation for mobile (easier thumb access)
export function BottomNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'tournaments', label: 'Giải đấu', icon: Trophy },
    { id: 'matches', label: 'Trận đấu', icon: Clock },
    { id: 'profile', label: 'Cá nhân', icon: User },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center',
                'min-h-[60px] px-3 py-2 rounded-lg',
                'transition-colors duration-200',
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
              )}
            >
              <Icon className={cn(
                'w-6 h-6 mb-1',
                isActive ? 'text-primary-600' : 'text-neutral-600'
              )} />
              <span className={cn(
                'text-xs font-medium',
                isActive ? 'text-primary-600' : 'text-neutral-600'
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// Top header with back navigation
export function Header({ title, onBack, actions }) {
  return (
    <header className="bg-white border-b border-neutral-200 safe-top">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-4 p-2 -ml-2 rounded-lg hover:bg-neutral-100"
            >
              <ArrowLeft className="w-6 h-6 text-neutral-600" />
            </button>
          )}
          
          <h1 className="text-xl font-semibold text-neutral-800 truncate">
            {title}
          </h1>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
```

### **3.5. Data Display Components**

```typescript
// Match status badge with clear visual indicators
export function MatchStatusBadge({ status }) {
  const statusConfig = {
    scheduled: {
      label: 'Sắp diễn ra',
      className: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      icon: Clock
    },
    on_court: {
      label: 'Đang thi đấu', 
      className: 'bg-warning-100 text-warning-800 border-warning-200',
      icon: Play
    },
    completed: {
      label: 'Hoàn thành',
      className: 'bg-success-100 text-success-800 border-success-200', 
      icon: CheckCircle
    },
    walkover: {
      label: 'Bỏ cuộc',
      className: 'bg-error-100 text-error-800 border-error-200',
      icon: XCircle
    }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1.5',
      'text-sm font-medium rounded-full border',
      config.className
    )}>
      <Icon className="w-4 h-4 mr-2" />
      {config.label}
    </span>
  );
}

// Score display with large, clear numbers
export function ScoreDisplay({ sets, format }) {
  return (
    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-neutral-600 uppercase tracking-wide">
          Best of {format}
        </span>
        <MatchStatusBadge status="on_court" />
      </div>
      
      <div className="space-y-3">
        {sets.map((set, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-base font-medium text-neutral-700">
              Set {set.setNumber}
            </span>
            
            <div className="flex items-center space-x-4">
              <span className={cn(
                'text-2xl font-bold tabular-nums',
                set.winner === 'participant1' ? 'text-primary-600' : 'text-neutral-600'
              )}>
                {set.participant1Score}
              </span>
              
              <span className="text-lg text-neutral-400">-</span>
              
              <span className={cn(
                'text-2xl font-bold tabular-nums',
                set.winner === 'participant2' ? 'text-primary-600' : 'text-neutral-600'
              )}>
                {set.participant2Score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tournament bracket with zoom and pan capabilities
export function TournamentBracket({ matches, eventType }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  return (
    <div className="relative w-full h-96 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200">
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={() => setScale(Math.min(scale + 0.2, 2))}
          className="p-2 bg-white rounded-lg shadow-md border border-neutral-200 hover:bg-neutral-50"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setScale(Math.max(scale - 0.2, 0.5))}
          className="p-2 bg-white rounded-lg shadow-md border border-neutral-200 hover:bg-neutral-50"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
      
      {/* Bracket content */}
      <div 
        className="w-full h-full"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: 'center center'
        }}
      >
        <BracketRenderer matches={matches} eventType={eventType} />
      </div>
    </div>
  );
}
```

---

## **4. Layout System**

### **4.1. Responsive Grid System**

```typescript
// Container system for different screen sizes
export const Container = {
  base: 'mx-auto px-4 sm:px-6 lg:px-8',
  
  maxWidth: {
    sm: 'max-w-screen-sm',     // 640px
    md: 'max-w-screen-md',     // 768px  
    lg: 'max-w-screen-lg',     // 1024px
    xl: 'max-w-screen-xl',     // 1280px
    '2xl': 'max-w-screen-2xl', // 1536px
  }
};

// Grid system with larger gaps for better touch targets
export const Grid = {
  container: 'grid gap-4 sm:gap-6 lg:gap-8',
  
  cols: {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }
};

// Page layout with proper spacing
export function PageLayout({ children, title, subtitle, actions }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header title={title} actions={actions} />
      
      <main className="pb-20"> {/* Space for bottom nav */}
        <div className={cn(Container.base, Container.maxWidth.xl)}>
          {subtitle && (
            <div className="py-6 border-b border-neutral-200 mb-6">
              <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            </div>
          )}
          
          <div className="py-6">
            {children}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
```

### **4.2. Page Templates**

```typescript
// Tournament list page
export function TournamentListPage() {
  const { tournaments, loading } = useTournaments();
  const [filter, setFilter] = useState('all');
  
  return (
    <PageLayout 
      title="Giải đấu" 
      subtitle="Tham gia các giải đấu bóng bàn được tổ chức tại câu lạc bộ"
    >
      {/* Filter tabs with large touch targets */}
      <div className="mb-8">
        <nav className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                'whitespace-nowrap px-6 py-3 text-base font-medium rounded-lg',
                'transition-colors duration-200 min-h-[44px]',
                filter === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tournament cards grid */}
      {loading ? (
        <TournamentSkeleton count={4} />
      ) : (
        <div className={cn(Grid.container, Grid.cols[2])}>
          {tournaments.map((tournament) => (
            <TournamentCard 
              key={tournament.id} 
              tournament={tournament}
              onClick={() => router.push(`/tournaments/${tournament.id}`)}
            />
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && tournaments.length === 0 && (
        <EmptyState 
          icon={Trophy}
          title="Chưa có giải đấu nào"
          description="Hiện tại chưa có giải đấu nào được tổ chức. Vui lòng quay lại sau."
          action={
            <ActionButton onClick={() => router.push('/tournaments/suggest')}>
              Đề xuất giải đấu
            </ActionButton>
          }
        />
      )}
    </PageLayout>
  );
}

// Match details page  
export function MatchDetailsPage({ matchId }) {
  const { match, loading } = useMatch(matchId);
  
  if (loading) return <MatchDetailSkeleton />;
  
  return (
    <PageLayout 
      title="Chi tiết trận đấu"
      onBack={() => router.back()}
    >
      <div className="space-y-8">
        {/* Match header */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <MatchStatusBadge status={match.status} />
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-800">
                {match.participant1.playerName}
                <span className="mx-4 text-neutral-400">vs</span>
                {match.participant2.playerName}
              </h2>
              
              <p className="text-lg text-neutral-600">
                Sân {match.courtNumber} • {formatTime(match.scheduledTime)}
              </p>
            </div>
          </div>
        </Card>
        
        {/* Score display */}
        {match.sets.length > 0 && (
          <ScoreDisplay sets={match.sets} format={match.format} />
        )}
        
        {/* Match timeline */}
        <MatchTimeline match={match} />
        
        {/* Actions for participants */}
        {isParticipant(match, currentUser.id) && (
          <div className="space-y-4">
            {match.status === 'scheduled' && (
              <ActionButton 
                size="lg" 
                onClick={() => checkIn(match.id)}
                className="w-full"
              >
                Check-in
              </ActionButton>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
```

---

## **5. Accessibility Features**

### **5.1. WCAG 2.1 AA Compliance**

```typescript
// Accessibility utilities
export const accessibility = {
  // Focus management
  focusRing: 'focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-75',
  
  // Screen reader classes
  srOnly: 'sr-only',
  
  // Skip navigation
  skipLink: `
    absolute left-[-10000px] top-auto w-1 h-1 overflow-hidden
    focus:left-6 focus:top-6 focus:w-auto focus:h-auto focus:overflow-visible
    bg-primary-600 text-white px-4 py-2 rounded-md z-50
  `,
  
  // High contrast mode detection
  highContrast: '@media (prefers-contrast: high)',
  
  // Reduced motion
  reduceMotion: '@media (prefers-reduced-motion: reduce)',
};

// Accessible button with proper ARIA attributes
export function AccessibleButton({ 
  children, 
  ariaLabel, 
  ariaDescribedBy,
  disabled = false,
  loading = false,
  ...props 
}) {
  return (
    <button
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      disabled={disabled || loading}
      className={cn(
        Button.base,
        Button.size.md,
        Button.variant.primary,
        accessibility.focusRing,
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
      {...props}
    >
      {loading && (
        <>
          <Loader2 className="mr-3 h-5 w-5 animate-spin" aria-hidden="true" />
          <span className={accessibility.srOnly}>Đang tải...</span>
        </>
      )}
      {children}
    </button>
  );
}

// Form with proper labeling and error handling
export function AccessibleForm({ children, onSubmit, errors }) {
  return (
    <form 
      onSubmit={onSubmit}
      noValidate
      role="form"
      aria-label="Tournament registration form"
    >
      {/* Skip to form errors if any */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-error-800 mb-2">
            Vui lòng sửa các lỗi sau:
          </h3>
          <ul className="space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field} className="text-error-700">
                • {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="space-y-6">
        {children}
      </div>
    </form>
  );
}
```

### **5.2. Keyboard Navigation**

```typescript
// Keyboard navigation hook
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Escape key to close modals
      if (event.key === 'Escape') {
        closeModal();
      }
      
      // Tab trap in modals
      if (event.key === 'Tab' && isModalOpen) {
        trapFocus(event);
      }
      
      // Arrow key navigation in lists
      if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
        navigateList(event);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Focus trap for modals
export function FocusTrap({ children, enabled = true }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    // Focus first element on mount
    firstFocusable?.focus();
    
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable?.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [enabled]);
  
  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  );
}
```

### **5.3. Screen Reader Support**

```typescript
// Live regions for dynamic content updates
export function LiveRegion({ children, level = 'polite', ...props }) {
  return (
    <div
      aria-live={level}
      aria-atomic="true"
      className={accessibility.srOnly}
      {...props}
    >
      {children}
    </div>
  );
}

// Descriptive match card for screen readers
export function AccessibleMatchCard({ match }) {
  const matchDescription = `
    ${match.participant1.playerName} vs ${match.participant2.playerName}, 
    ${match.status === 'completed' ? 'đã kết thúc' : 'sắp diễn ra'} 
    tại sân ${match.courtNumber}
    ${match.scheduledTime ? `lúc ${formatTime(match.scheduledTime)}` : ''}
  `;
  
  return (
    <article
      role="article"
      aria-label={matchDescription}
      className={cn(Card.base, Card.interactive, Card.padding.md)}
    >
      {/* Hidden heading for screen readers */}
      <h3 className={accessibility.srOnly}>
        Trận đấu {match.participant1.playerName} vs {match.participant2.playerName}
      </h3>
      
      {/* Visual content */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-lg font-semibold text-neutral-800">
            {match.participant1.playerName}
            <span className="mx-3 text-neutral-400" aria-hidden="true">vs</span>
            {match.participant2.playerName}
          </p>
        </div>
        
        <MatchStatusBadge status={match.status} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-base text-neutral-600">
          <Calendar 
            className="w-5 h-5 mr-3 text-primary-500" 
            aria-hidden="true" 
          />
          <span>{formatTime(match.scheduledTime)}</span>
        </div>
        
        <div className="flex items-center text-base text-neutral-600">
          <MapPin 
            className="w-5 h-5 mr-3 text-primary-500" 
            aria-hidden="true" 
          />
          <span>Sân {match.courtNumber}</span>
        </div>
      </div>
      
      {/* Action button */}
      <div className="mt-4 pt-4 border-t border-neutral-100">
        <AccessibleButton
          ariaLabel={`Xem chi tiết trận ${match.participant1.playerName} vs ${match.participant2.playerName}`}
          onClick={() => router.push(`/matches/${match.id}`)}
        >
          Xem chi tiết
        </AccessibleButton>
      </div>
    </article>
  );
}
```

---

## **6. Mobile-First Design**

### **6.1. Touch-Friendly Interface**

```typescript
// Touch target guidelines
export const touchTargets = {
  // Minimum sizes (WCAG 2.1 AA)
  minimum: {
    width: '44px',
    height: '44px',
  },
  
  // Recommended sizes for 40+ users
  recommended: {
    small: { width: '48px', height: '48px' },
    medium: { width: '56px', height: '56px' },
    large: { width: '64px', height: '64px' },
  },
  
  // Spacing between touch targets
  spacing: {
    minimum: '8px',
    recommended: '12px',
  }
};

// Large touch areas for important actions
export function LargeTouchButton({ children, icon, ...props }) {
  return (
    <button
      className={cn(
        'w-full min-h-[64px] px-6 py-4',
        'flex items-center justify-center space-x-3',
        'bg-primary-600 text-white text-lg font-semibold',
        'rounded-xl shadow-md',
        'hover:bg-primary-700 active:bg-primary-800',
        'focus:outline-none focus:ring-4 focus:ring-primary-300',
        'transition-all duration-200',
        'touch-manipulation' // Improves touch responsiveness
      )}
      {...props}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// Swipe-friendly card list
export function SwipeableMatchList({ matches }) {
  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <SwipeableCard key={match.id} match={match} />
      ))}
    </div>
  );
}

export function SwipeableCard({ match }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleTouchStart = (e) => {
    setIsDragging(true);
    // Handle touch start
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    // Handle swipe gesture
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    // Handle swipe action
  };
  
  return (
    <div
      className={cn(
        'relative bg-white rounded-lg shadow-md overflow-hidden',
        'transition-transform duration-200',
        isDragging && 'cursor-grabbing'
      )}
      style={{ transform: `translateX(${swipeOffset}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="p-6">
        <AccessibleMatchCard match={match} />
      </div>
      
      {/* Swipe actions */}
      <div className="absolute inset-y-0 right-0 flex items-center space-x-2 px-4 bg-primary-600">
        <button
          className="p-2 text-white rounded-lg"
          onClick={() => viewMatch(match.id)}
          aria-label="Xem chi tiết"
        >
          <Eye className="w-6 h-6" />
        </button>
        
        <button
          className="p-2 text-white rounded-lg"
          onClick={() => shareMatch(match.id)}
          aria-label="Chia sẻ"
        >
          <Share className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
```

### **6.2. Responsive Breakpoints**

```typescript
// Mobile-first responsive design
export const breakpoints = {
  // Phone portrait
  xs: '0px',
  
  // Phone landscape / Small tablet portrait  
  sm: '640px',
  
  // Tablet portrait
  md: '768px',
  
  // Tablet landscape / Small desktop
  lg: '1024px',
  
  // Desktop
  xl: '1280px',
  
  // Large desktop
  '2xl': '1536px',
};

// Component with responsive behavior
export function ResponsiveGrid({ children, ...props }) {
  return (
    <div 
      className={cn(
        // Mobile: single column
        'grid grid-cols-1 gap-4',
        
        // Small screens: 2 columns for cards
        'sm:grid-cols-2 sm:gap-6',
        
        // Medium screens: maintain 2 columns, larger gaps
        'md:gap-8',
        
        // Large screens: 3 columns for more content
        'lg:grid-cols-3',
        
        // Extra large: maintain 3 columns, adjust spacing
        'xl:gap-10'
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

---

## **7. Theme System**

### **7.1. Theme Provider**

```typescript
// Theme context and provider
export const ThemeContext = createContext({
  theme: 'default',
  setTheme: () => {},
  preferences: {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
  },
  updatePreferences: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('default');
  const [preferences, setPreferences] = useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
  });
  
  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Base theme classes
    root.className = cn(
      'transition-colors duration-300',
      theme === 'dark' && 'dark',
      preferences.highContrast && 'high-contrast',
      preferences.largeText && 'large-text',
      preferences.reduceMotion && 'reduce-motion'
    );
    
    // CSS custom properties
    const themeVars = getThemeVariables(theme, preferences);
    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [theme, preferences]);
  
  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
    
    // Save to localStorage
    localStorage.setItem('theme-preferences', JSON.stringify(newPreferences));
  };
  
  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      preferences,
      updatePreferences
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Theme variables generator
function getThemeVariables(theme, preferences) {
  const baseVars = {
    '--color-primary': theme === 'dark' ? '#60a5fa' : '#3b82f6',
    '--color-background': theme === 'dark' ? '#1f2937' : '#ffffff',
    '--color-text': theme === 'dark' ? '#f9fafb' : '#1f2937',
  };
  
  // High contrast adjustments
  if (preferences.highContrast) {
    baseVars['--color-primary'] = '#0000ff';
    baseVars['--color-background'] = '#ffffff';
    baseVars['--color-text'] = '#000000';
  }
  
  // Large text adjustments
  if (preferences.largeText) {
    baseVars['--font-size-base'] = '20px';
    baseVars['--font-size-lg'] = '22px';
    baseVars['--font-size-xl'] = '26px';
  }
  
  return baseVars;
}
```

### **7.2. Accessibility Settings Panel**

```typescript
export function AccessibilitySettings() {
  const { preferences, updatePreferences } = useTheme();
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-neutral-800 mb-6">
        Cài đặt trợ năng
      </h3>
      
      <div className="space-y-6">
        {/* High contrast toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-neutral-700">
              Độ tương phản cao
            </h4>
            <p className="text-base text-neutral-600 mt-1">
              Tăng độ tương phản cho văn bản và nền dễ đọc hơn
            </p>
          </div>
          
          <Switch
            checked={preferences.highContrast}
            onCheckedChange={(checked) => 
              updatePreferences({ highContrast: checked })
            }
            className="ml-4"
          />
        </div>
        
        {/* Large text toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-neutral-700">
              Văn bản lớn
            </h4>
            <p className="text-base text-neutral-600 mt-1">
              Tăng kích thước chữ để đọc dễ dàng hơn
            </p>
          </div>
          
          <Switch
            checked={preferences.largeText}
            onCheckedChange={(checked) => 
              updatePreferences({ largeText: checked })
            }
            className="ml-4"
          />
        </div>
        
        {/* Reduce motion toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-neutral-700">
              Giảm chuyển động
            </h4>
            <p className="text-base text-neutral-600 mt-1">
              Giảm hoạt ảnh và chuyển động để tránh choáng váng
            </p>
          </div>
          
          <Switch
            checked={preferences.reduceMotion}
            onCheckedChange={(checked) => 
              updatePreferences({ reduceMotion: checked })
            }
            className="ml-4"
          />
        </div>
        
        {/* Font size slider */}
        <div>
          <h4 className="text-lg font-medium text-neutral-700 mb-3">
            Cỡ chữ
          </h4>
          
          <div className="space-y-4">
            <Slider
              value={[preferences.fontSize || 18]}
              onValueChange={([fontSize]) => 
                updatePreferences({ fontSize })
              }
              min={16}
              max={24}
              step={2}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Nhỏ (16px)</span>
              <span>Vừa (18px)</span>
              <span>Lớn (20px)</span>
              <span>Rất lớn (24px)</span>
            </div>
            
            {/* Preview text */}
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <p style={{ fontSize: `${preferences.fontSize || 18}px` }}>
                Đây là văn bản mẫu để xem trước kích thước chữ. 
                Hãy chọn cỡ chữ phù hợp với bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

---

## **8. Error Handling & Loading States**

### **8.1. User-Friendly Error Messages**

```typescript
// Error display component with clear actions
export function ErrorDisplay({ 
  error, 
  onRetry, 
  showDetails = false,
  illustration 
}) {
  const errorMessages = {
    NETWORK_ERROR: {
      title: 'Lỗi kết nối',
      message: 'Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối internet và thử lại.',
      action: 'Thử lại',
      icon: Wifi
    },
    PERMISSION_DENIED: {
      title: 'Không có quyền truy cập',
      message: 'Bạn không có quyền thực hiện hành động này. Vui lòng liên hệ quản trị viên.',
      action: 'Liên hệ hỗ trợ',
      icon: Shield
    },
    NOT_FOUND: {
      title: 'Không tìm thấy',
      message: 'Thông tin bạn đang tìm kiếm không còn tồn tại hoặc đã được di chuyển.',
      action: 'Về trang chủ',
      icon: Search
    },
    VALIDATION_ERROR: {
      title: 'Thông tin không hợp lệ',
      message: 'Vui lòng kiểm tra lại thông tin đã nhập và thử lại.',
      action: 'Sửa thông tin',
      icon: AlertCircle
    }
  };
  
  const errorConfig = errorMessages[error.code] || {
    title: 'Có lỗi xảy ra',
    message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
    action: 'Thử lại',
    icon: AlertCircle
  };
  
  const Icon = errorConfig.icon;
  
  return (
    <div className="text-center py-12 px-6">
      {illustration && (
        <div className="mb-6">
          {illustration}
        </div>
      )}
      
      <div className="inline-flex items-center justify-center w-16 h-16 bg-error-100 rounded-full mb-6">
        <Icon className="w-8 h-8 text-error-600" />
      </div>
      
      <h3 className="text-2xl font-semibold text-neutral-800 mb-4">
        {errorConfig.title}
      </h3>
      
      <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed">
        {errorConfig.message}
      </p>
      
      <div className="space-y-4">
        {onRetry && (
          <ActionButton 
            size="lg" 
            onClick={onRetry}
            className="min-w-[200px]"
          >
            {errorConfig.action}
          </ActionButton>
        )}
        
        {showDetails && (
          <details className="mt-6">
            <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700">
              Chi tiết lỗi
            </summary>
            <div className="mt-3 p-4 bg-neutral-100 rounded-lg text-left">
              <code className="text-sm text-neutral-700">
                {JSON.stringify(error, null, 2)}
              </code>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// Page-level error boundary
export function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      setError(error);
    };
    
    window.addEventListener('unhandledrejection', handleError);
    return () => window.removeEventListener('unhandledrejection', handleError);
  }, []);
  
  if (hasError) {
    return fallback || (
      <ErrorDisplay 
        error={error}
        onRetry={() => {
          setHasError(false);
          setError(null);
        }}
        showDetails={process.env.NODE_ENV === 'development'}
      />
    );
  }
  
  return children;
}
```

### **8.2. Loading States**

```typescript
// Skeleton components for loading states
export function TournamentSkeleton({ count = 3 }) {
  return (
    <div className={cn(Grid.container, Grid.cols[2])}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-neutral-200 rounded-md mb-2" />
                <div className="h-4 bg-neutral-200 rounded-md w-3/4" />
              </div>
              <div className="h-6 bg-neutral-200 rounded-full w-20" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-neutral-200 rounded mr-3" />
                <div className="h-4 bg-neutral-200 rounded-md w-1/2" />
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-neutral-200 rounded mr-3" />
                <div className="h-4 bg-neutral-200 rounded-md w-2/3" />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-neutral-200 rounded-md w-1/3" />
                <div className="w-6 h-6 bg-neutral-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading overlay with progress indicator
export function LoadingOverlay({ 
  isVisible, 
  message = 'Đang tải...', 
  progress 
}) {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm mx-4 text-center">
        <div className="mb-6">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
        </div>
        
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          {message}
        </h3>
        
        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-neutral-600 mb-2">
              <span>Tiến trình</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        <p className="text-sm text-neutral-600 mt-4">
          Vui lòng không đóng ứng dụng
        </p>
      </div>
    </div>
  );
}
```

---

This comprehensive Frontend Design document provides a complete design system optimized for adults 40+ years old, featuring large touch targets, high contrast colors, clear typography, accessible navigation, and user-friendly error handling. The design emphasizes simplicity, readability, and ease of use while maintaining modern aesthetics and functionality.
