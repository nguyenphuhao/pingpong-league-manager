// Base types for the Ping Pong League Manager system
// Based on the tech specification

export type UserRole = 
  | 'admin' 
  | 'organizer' 
  | 'referee' 
  | 'treasurer' 
  | 'member' 
  | 'player' 
  | 'captain' 
  | 'viewer';

export type Grade = 'A' | 'B' | 'C';

export type TournamentStatus = 'draft' | 'registration' | 'ongoing' | 'completed';
export type EventStatus = 'registration' | 'draw' | 'ongoing' | 'completed';
export type MatchStatus = 
  | 'scheduled' 
  | 'on_court' 
  | 'paused' 
  | 'completed' 
  | 'walkover' 
  | 'no_show' 
  | 'retired';

export type EventType = 'singles' | 'doubles' | 'team';
export type EventFormat = 'round_robin' | 'knockout' | 'mixed';

export interface User {
  id: string;
  phoneNumber: string;
  displayName: string;
  birthYear: number;
  club?: string;
  avatar?: string;
  roles: UserRole[];
  ratingPoints: number;
  grade: Grade;
  fcmTokens: string[];
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // Admin who created the user
}

// Extended user management types
export interface ManagedUser extends User {
  canDelete: boolean; // Admin cannot delete themselves
  canDeactivate: boolean; // Admin cannot deactivate themselves
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
  color?: string;
  isDefault: boolean;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface UserFilter {
  search?: string;
  roles?: UserRole[];
  grade?: Grade[];
  isActive?: boolean;
  club?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface UserFormData {
  phoneNumber: string;
  displayName: string;
  birthYear: number;
  club?: string;
  roles: UserRole[];
  grade: Grade;
  isActive: boolean;
}

export interface GroupFormData {
  name: string;
  description: string;
  roles: UserRole[];
  color?: string;
}

export type UserSortField = 'displayName' | 'phoneNumber' | 'createdAt' | 'lastLoginAt' | 'grade';
export type SortDirection = 'asc' | 'desc';

export interface UserListParams {
  page?: number;
  limit?: number;
  filter?: UserFilter;
  sortBy?: UserSortField;
  sortDirection?: SortDirection;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  entryFee: number;
  maxParticipants: number;
  registrationDeadline: Date;
  status: TournamentStatus;
  rules: TournamentRules;
  seedingConfig: SeedingConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  tournamentId: string;
  name: string;
  type: EventType;
  format: EventFormat;
  gradeRestriction?: Grade | 'open';
  maxParticipants: number;
  registeredCount: number;
  entryFee: number;
  rounds: RoundConfig[];
  status: EventStatus;
  createdAt: Date;
}

export interface Match {
  id: string;
  eventId: string;
  roundId: string;
  player1Id: string;
  player2Id?: string; // null for bye
  team1Id?: string; // for team matches
  team2Id?: string;
  courtNumber?: number;
  scheduledTime?: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  status: MatchStatus;
  scores: MatchScore[];
  winner?: 'player1' | 'player2';
  notes?: string;
  refereeId?: string;
}

export interface RoundConfig {
  id: string;
  name: string;
  type: 'group' | 'knockout' | 'consolation';
  bestOf: 3 | 5 | 7;
  estimatedDuration: number; // minutes
  cutoffTime?: Date;
  tieBreakRules?: string[];
}

export interface MatchScore {
  setNumber: number;
  participant1Score: number;
  participant2Score: number;
  winner?: 'participant1' | 'participant2';
}

export interface TournamentRules {
  defaultFormat: 'best_of_3' | 'best_of_5' | 'best_of_7';
  pointsToWinSet: number;
  deuceDifference: number;
  timeLimit?: number; // minutes
  warmupTime: number; // minutes
}

export interface SeedingConfig {
  method: 'rating' | 'random' | 'manual';
  groupByGrade: boolean;
  allowCrossGradeMatches: boolean;
}

// Component props types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
}

// Theme types
export interface ThemePreferences {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  fontSize?: number;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  preferences: ThemePreferences;
  updatePreferences: (preferences: Partial<ThemePreferences>) => void;
}
