# Backend Design - Ping Pong League Manager

## **1. Database Architecture Overview**

### **1.1. Firestore Database Structure**

```typescript
// Root Collections (Global)
/users/{userId}                           // User profiles and authentication
/tournaments/{tournamentId}               // Tournament metadata
/events/{eventId}                        // Individual events within tournaments
/matches/{matchId}                       // All matches across all events
/teams/{teamId}                          // Team information for team events
/notifications/{notificationId}          // System notifications
/standbyPools/{eventId}                  // Waitlist/substitute players
/payments/{paymentId}                    // Payment tracking
/auditLogs/{logId}                       // System audit trail

// Sub-collections (Nested)
/tournaments/{tournamentId}/events/{eventId}          // Events in tournament
/tournaments/{tournamentId}/rules/{ruleId}            // Tournament-specific rules
/events/{eventId}/registrations/{userId}              // Event registrations
/events/{eventId}/brackets/{bracketId}                // Tournament brackets
/events/{eventId}/standings/{roundId}                 // Round standings
/matches/{matchId}/sets/{setId}                       // Match set details
/users/{userId}/participations/{eventId}              // User's event history
/users/{userId}/ratings/{tournamentId}                // Rating history
```

---

## **2. Detailed Data Models**

### **2.1. Users Collection**

```typescript
interface User {
  // Primary Keys
  id: string;                              // Firebase Auth UID
  phoneNumber: string;                     // +84xxxxxxxxx (unique)
  
  // Profile Information
  displayName: string;                     // Full name (2-50 chars)
  birthYear: number;                       // 1950-2010
  club?: string;                          // Optional club affiliation
  avatar?: string;                        // Firebase Storage URL
  
  // System Data
  roles: UserRole[];                      // ['player', 'organizer', etc.]
  ratingPoints: number;                   // Current rating (default: 1200)
  grade: 'A' | 'B' | 'C';                // Auto-calculated from rating
  gradeOverride?: 'A' | 'B' | 'C';       // Manual override by organizer
  
  // Notification Settings
  fcmTokens: string[];                    // Firebase Cloud Messaging tokens
  smsEnabled: boolean;                    // SMS notifications enabled
  pushEnabled: boolean;                   // Push notifications enabled
  
  // Metadata
  isActive: boolean;                      // Account status
  lastLoginAt?: Timestamp;                // Last login time
  createdAt: Timestamp;                   // Account creation
  updatedAt: Timestamp;                   // Last profile update
  
  // Statistics (calculated fields)
  stats?: {
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    averageRating: number;
    tournamentsPlayed: number;
  };
}

enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  REFEREE = 'referee', 
  TREASURER = 'treasurer',
  MEMBER = 'member',
  PLAYER = 'player',
  CAPTAIN = 'captain',
  VIEWER = 'viewer'
}
```

### **2.2. Tournaments Collection**

```typescript
interface Tournament {
  // Primary Information
  id: string;                             // Auto-generated ID
  name: string;                           // Tournament name (required)
  description: string;                    // Tournament description
  organizerId: string;                    // User ID of organizer
  
  // Scheduling
  startDate: Timestamp;                   // Tournament start
  endDate: Timestamp;                     // Tournament end
  registrationDeadline: Timestamp;        // Registration cutoff
  venue: string;                          // Venue address/name
  
  // Configuration
  entryFee: number;                       // Base entry fee (VND)
  maxParticipants: number;                // Overall participant limit
  courtCount: number;                     // Available courts
  
  // Tournament Settings
  rules: TournamentRules;                 // Tournament-specific rules
  seedingConfig: SeedingConfig;           // Seeding configuration
  
  // Status Management
  status: TournamentStatus;               // Current status
  isPublic: boolean;                      // Public visibility
  allowStandby: boolean;                  // Allow waitlist
  
  // Financial
  totalRevenue?: number;                  // Total collected fees
  totalExpenses?: number;                 // Total expenses
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;                // When made public
  
  // Statistics
  stats?: {
    totalEvents: number;
    totalMatches: number;
    totalPlayers: number;
    averageRating: number;
  };
}

interface TournamentRules {
  // Scoring Rules
  defaultBestOf: 3 | 5 | 7;              // Default match format
  tieBreakRules: string[];                // Tie-breaking criteria order
  walkoverRules: string;                  // Walkover policies
  
  // Time Rules
  defaultMatchDuration: number;           // Minutes per match
  latePenalty: number;                   // Late penalty (minutes)
  noShowTime: number;                    // No-show threshold (minutes)
  
  // Grade Rules
  gradeCalculation: {
    aThreshold: number;                   // Points for Grade A
    bThreshold: number;                   // Points for Grade B
    // Grade C is below B threshold
  };
  
  // Pairing Rules
  autoHighLowPairing: boolean;           // Enable auto-pairing
  allowManualPairing: boolean;           // Allow manual partner selection
  crossGradePairing: boolean;            // Allow cross-grade pairing
}

interface SeedingConfig {
  method: 'rating' | 'random' | 'manual';
  balanceGroups: boolean;                 // Balance group strengths
  avoidClubmates: boolean;               // Separate club members
  seedByGrade: boolean;                  // Seed within grade first
}

enum TournamentStatus {
  DRAFT = 'draft',
  REGISTRATION = 'registration',
  REGISTRATION_CLOSED = 'registration_closed',
  DRAW_COMPLETED = 'draw_completed',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

### **2.3. Events Collection**

```typescript
interface Event {
  // Primary Keys
  id: string;                             // Auto-generated
  tournamentId: string;                   // Parent tournament
  
  // Event Information
  name: string;                           // e.g., "Men's Singles A"
  description?: string;                   // Event description
  type: EventType;                        // Event type
  format: EventFormat;                    // Tournament format
  
  // Restrictions
  gradeRestriction?: Grade[];             // Allowed grades
  genderRestriction?: 'male' | 'female' | 'open';
  ageRestriction?: {                      // Age limits
    minAge?: number;
    maxAge?: number;
  };
  
  // Capacity & Registration
  maxParticipants: number;                // Maximum registrations
  registeredCount: number;                // Current registrations
  waitlistCount: number;                  // Waitlist size
  
  // Financial
  entryFee: number;                       // Event-specific fee (can override tournament fee)
  
  // Round Configuration
  rounds: RoundConfig[];                  // Round-specific rules
  
  // Status
  status: EventStatus;                    // Current event status
  registrationOpen: boolean;              // Registration availability
  
  // Pairings (for doubles)
  pairingMethod: 'auto_high_low' | 'manual' | 'random';
  allowPartnerPreference: boolean;        // Allow partner requests
  
  // Brackets & Advancement
  groupCount?: number;                    // Number of groups (round robin)
  advanceCount?: number;                  // Players advancing from each group
  consolationBracket: boolean;            // Include consolation bracket
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  drawCompletedAt?: Timestamp;            // When draw was completed
  
  // Statistics
  stats?: {
    averageMatchDuration: number;
    totalSets: number;
    longestMatch: number;
    completionRate: number;
  };
}

enum EventType {
  SINGLES = 'singles',
  DOUBLES = 'doubles', 
  TEAM = 'team'
}

enum EventFormat {
  ROUND_ROBIN = 'round_robin',
  KNOCKOUT = 'knockout',
  ROUND_ROBIN_KNOCKOUT = 'round_robin_knockout',  // Groups then knockout
  SWISS = 'swiss'                                 // Swiss system
}

enum EventStatus {
  REGISTRATION = 'registration',
  REGISTRATION_CLOSED = 'registration_closed',
  DRAW_PENDING = 'draw_pending',
  DRAW_COMPLETED = 'draw_completed',
  ROUND_ROBIN = 'round_robin',
  KNOCKOUT = 'knockout',
  COMPLETED = 'completed'
}

interface RoundConfig {
  id: string;                             // Round identifier
  name: string;                           // e.g., "Group Stage", "Quarterfinals"
  type: RoundType;                        // Round type
  bestOf: 3 | 5 | 7;                     // Match format
  estimatedDuration: number;              // Minutes per match
  cutoffTime?: Timestamp;                 // Hard deadline for round
  tieBreakRules?: string[];              // Round-specific tie-break rules
  startDate?: Timestamp;                  // Scheduled start time
  endDate?: Timestamp;                    // Scheduled end time
  status: RoundStatus;                    // Current status
}

enum RoundType {
  GROUP = 'group',                        // Round robin groups
  ROUND_32 = 'round_32',
  ROUND_16 = 'round_16', 
  QUARTERFINAL = 'quarterfinal',
  SEMIFINAL = 'semifinal',
  BRONZE_MATCH = 'bronze_match',          // 3rd place playoff
  FINAL = 'final',
  CONSOLATION = 'consolation'             // Consolation bracket rounds
}

enum RoundStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

### **2.4. Matches Collection**

```typescript
interface Match {
  // Primary Keys
  id: string;                             // Auto-generated
  eventId: string;                        // Parent event
  tournamentId: string;                   // Parent tournament (denormalized)
  roundId: string;                        // Round identifier
  
  // Participants
  participant1: MatchParticipant;         // Player/Team 1
  participant2?: MatchParticipant;        // Player/Team 2 (null for bye)
  
  // Scheduling
  courtNumber?: number;                   // Assigned court
  scheduledTime?: Timestamp;              // Scheduled start time
  actualStartTime?: Timestamp;            // Actual start time
  actualEndTime?: Timestamp;              // Actual end time
  estimatedEndTime?: Timestamp;           // Estimated completion
  
  // Match Status
  status: MatchStatus;                    // Current status
  winner?: 'participant1' | 'participant2'; // Match winner
  
  // Scoring
  format: 3 | 5 | 7;                     // Best of X sets
  currentSet: number;                     // Current set number (1-based)
  sets: SetScore[];                       // Set-by-set scores
  
  // Officials
  refereeId?: string;                     // Assigned referee
  
  // Notes & Issues
  notes?: string;                         // General notes
  issues?: MatchIssue[];                  // Problems encountered
  
  // Bracket Position (for knockout)
  bracketPosition?: {
    round: number;                        // Round number
    position: number;                     // Position in round
    group?: string;                       // Group name (if applicable)
  };
  
  // Next Match Reference (for knockout advancement)
  nextMatchId?: string;                   // Where winner advances
  nextMatchPosition?: 'participant1' | 'participant2'; // Position in next match
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Statistics
  stats?: {
    totalDuration: number;                // Minutes
    longestSet: number;                   // Longest set duration
    totalPoints: number;                  // Total points played
    aces?: number;                        // Aces (if tracked)
    winners?: number;                     // Winners (if tracked)
  };
}

interface MatchParticipant {
  // Player Info (for singles/doubles)
  playerId?: string;                      // Primary player ID
  playerName?: string;                    // Denormalized name
  partnerId?: string;                     // Partner ID (doubles)
  partnerName?: string;                   // Partner name (doubles)
  
  // Team Info (for team events)
  teamId?: string;                        // Team ID
  teamName?: string;                      // Team name
  
  // Seeding
  seed?: number;                          // Tournament seed
  rating?: number;                        // Rating at time of match
  grade?: Grade;                          // Grade at time of match
  
  // Status
  isPresent: boolean;                     // Checked in status
  checkinTime?: Timestamp;                // When checked in
}

interface SetScore {
  setNumber: number;                      // Set number (1-based)
  participant1Score: number;              // Participant 1 score
  participant2Score: number;              // Participant 2 score
  winner?: 'participant1' | 'participant2'; // Set winner
  duration?: number;                      // Set duration (minutes)
  startTime?: Timestamp;                  // Set start time
  endTime?: Timestamp;                    // Set end time
}

interface MatchIssue {
  id: string;                             // Issue ID
  type: IssueType;                        // Issue category
  description: string;                    // Issue description
  reportedBy: string;                     // User who reported
  reportedAt: Timestamp;                  // When reported
  resolvedBy?: string;                    // Who resolved
  resolvedAt?: Timestamp;                 // When resolved
  resolution?: string;                    // Resolution notes
  status: 'open' | 'resolved' | 'dismissed';
}

enum MatchStatus {
  SCHEDULED = 'scheduled',                // Match created and scheduled
  READY = 'ready',                        // Both participants checked in
  ON_COURT = 'on_court',                 // Match in progress
  PAUSED = 'paused',                      // Temporarily paused
  COMPLETED = 'completed',                // Finished normally
  WALKOVER = 'walkover',                  // Walkover before start
  NO_SHOW = 'no_show',                   // No-show after deadline
  RETIRED = 'retired',                    // Retired during match
  CANCELLED = 'cancelled',                // Match cancelled
  DISPUTED = 'disputed'                   // Under dispute
}

enum IssueType {
  SCORING_DISPUTE = 'scoring_dispute',
  CONDUCT = 'conduct',
  EQUIPMENT = 'equipment',
  INJURY = 'injury',
  TIME_VIOLATION = 'time_violation',
  OTHER = 'other'
}

enum Grade {
  A = 'A',
  B = 'B', 
  C = 'C'
}
```

### **2.5. Teams Collection (for Team Events)**

```typescript
interface Team {
  // Primary Keys
  id: string;                             // Auto-generated
  eventId: string;                        // Parent event
  tournamentId: string;                   // Parent tournament
  
  // Team Information
  name: string;                           // Team name
  shortName?: string;                     // Abbreviated name
  logo?: string;                          // Team logo URL
  club?: string;                          // Affiliated club
  
  // Leadership
  captainId: string;                      // Team captain (User ID)
  viceCaptainId?: string;                 // Vice captain
  
  // Members
  members: TeamMember[];                  // Team roster
  maxMembers: number;                     // Maximum team size
  
  // Requirements
  gradeRequirements?: {
    maxGradeA?: number;                   // Max Grade A players
    minGradeB?: number;                   // Min Grade B players
    totalMembers: number;                 // Total required members
  };
  
  // Statistics
  stats?: {
    averageRating: number;
    totalMatches: number;
    wins: number;
    losses: number;
  };
  
  // Status
  status: TeamStatus;                     // Team status
  isComplete: boolean;                    // Roster complete
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface TeamMember {
  playerId: string;                       // User ID
  playerName: string;                     // Denormalized name
  position: number;                       // Playing order/position
  grade: Grade;                           // Player grade
  rating: number;                         // Player rating
  role: 'captain' | 'vice_captain' | 'player'; // Team role
  joinedAt: Timestamp;                    // When joined team
  status: 'active' | 'inactive' | 'substitute'; // Member status
}

enum TeamStatus {
  FORMING = 'forming',                    // Recruiting members
  COMPLETE = 'complete',                  // Full roster
  REGISTERED = 'registered',              // Registered for event
  COMPETING = 'competing',                // In active competition
  ELIMINATED = 'eliminated',              // Eliminated from competition
  CHAMPION = 'champion'                   // Won the event
}
```

### **2.6. Registrations Sub-collection**

```typescript
// Path: /events/{eventId}/registrations/{userId}
interface Registration {
  // Primary Keys
  userId: string;                         // Registered user
  eventId: string;                        // Target event
  tournamentId: string;                   // Parent tournament
  
  // Registration Details
  registeredAt: Timestamp;                // Registration time
  status: RegistrationStatus;             // Current status
  
  // Partner Information (for doubles)
  partnerId?: string;                     // Partner ID
  partnerPreference?: string;             // Preferred partner ID
  partnerStatus?: 'confirmed' | 'pending' | 'declined'; // Partner confirmation
  pairingMethod?: 'auto' | 'manual';      // How pair was formed
  
  // Team Information (for team events)
  teamId?: string;                        // Team ID
  teamRole?: 'captain' | 'member' | 'substitute'; // Role in team
  
  // Payment
  paymentStatus: PaymentStatus;           // Payment status
  paymentMethod?: PaymentMethod;          // How paid
  paidAmount: number;                     // Amount paid
  paidAt?: Timestamp;                     // Payment time
  paymentReference?: string;              // Payment reference/receipt
  
  // Seeding Information
  seedNumber?: number;                    // Tournament seed
  ratingAtRegistration: number;           // Rating when registered
  gradeAtRegistration: Grade;             // Grade when registered
  
  // Waitlist
  waitlistPosition?: number;              // Position on waitlist
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;                // When confirmed
  
  // Notes
  notes?: string;                         // Registration notes
  specialRequests?: string;               // Special requirements
}

enum RegistrationStatus {
  PENDING_PAYMENT = 'pending_payment',
  WAITLISTED = 'waitlisted',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

enum PaymentStatus {
  UNPAID = 'unpaid',
  PENDING = 'pending',                    // Awaiting verification
  PAID = 'paid',
  REFUNDED = 'refunded'
}

enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  ONLINE = 'online',
  WAIVED = 'waived'                       // Fee waived
}
```

### **2.7. Notifications Collection**

```typescript
interface Notification {
  // Primary Keys
  id: string;                             // Auto-generated
  
  // Recipients
  recipientId?: string;                   // Single recipient (null for broadcast)
  recipientIds?: string[];                // Multiple recipients
  recipientType: 'user' | 'role' | 'event_participants' | 'tournament_participants';
  recipientFilter?: {                     // Filter criteria
    roles?: UserRole[];
    grades?: Grade[];
    eventIds?: string[];
    tournamentIds?: string[];
  };
  
  // Message Content
  title: string;                          // Notification title
  message: string;                        // Notification body
  type: NotificationType;                 // Notification category
  priority: NotificationPriority;         // Priority level
  
  // Channels
  channels: NotificationChannel[];        // Delivery channels
  
  // Scheduling
  scheduledAt?: Timestamp;                // When to send (null = immediate)
  sentAt?: Timestamp;                     // When actually sent
  expiresAt?: Timestamp;                  // Expiration time
  
  // Content Details
  data?: Record<string, any>;             // Additional data payload
  actionUrl?: string;                     // Deep link URL
  imageUrl?: string;                      // Notification image
  
  // Delivery Status
  status: NotificationStatus;             // Overall status
  deliveryStats?: {
    totalRecipients: number;
    delivered: number;
    failed: number;
    opened: number;
    clicked: number;
  };
  
  // Source
  createdBy: string;                      // User who created (system or user ID)
  source: 'system' | 'manual' | 'automated'; // How created
  templateId?: string;                    // Template used
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Campaign (for bulk notifications)
  campaignId?: string;                    // Notification campaign
  batchId?: string;                       // Batch identifier
}

enum NotificationType {
  // Authentication & Account
  WELCOME = 'welcome',
  ACCOUNT_CREATED = 'account_created',
  PHONE_VERIFIED = 'phone_verified',
  
  // Registration
  REGISTRATION_SUCCESS = 'registration_success',
  REGISTRATION_CANCELLED = 'registration_cancelled',
  PAYMENT_RECEIVED = 'payment_received',
  WAITLIST_PROMOTED = 'waitlist_promoted',
  
  // Tournament Progress
  TOURNAMENT_PUBLISHED = 'tournament_published',
  DRAW_COMPLETED = 'draw_completed',
  MATCH_SCHEDULED = 'match_scheduled',
  MATCH_STARTING_SOON = 'match_starting_soon',
  MATCH_COURT_CHANGED = 'match_court_changed',
  MATCH_RESULT = 'match_result',
  ADVANCED_TO_NEXT_ROUND = 'advanced_to_next_round',
  ELIMINATED = 'eliminated',
  TOURNAMENT_COMPLETED = 'tournament_completed',
  
  // Team Events
  TEAM_INVITATION = 'team_invitation',
  TEAM_MEMBER_JOINED = 'team_member_joined',
  TEAM_LINEUP_CHANGED = 'team_lineup_changed',
  
  // Administrative
  SUBSTITUTE_NEEDED = 'substitute_needed',
  SCHEDULE_CHANGE = 'schedule_change',
  VENUE_CHANGE = 'venue_change',
  WEATHER_UPDATE = 'weather_update',
  EMERGENCY = 'emergency',
  
  // System
  MAINTENANCE = 'maintenance',
  UPDATE_AVAILABLE = 'update_available',
  RATING_UPDATED = 'rating_updated',
  
  // Social
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  MILESTONE_REACHED = 'milestone_reached'
}

enum NotificationPriority {
  LOW = 'low',                            // Non-urgent updates
  NORMAL = 'normal',                      // Standard notifications
  HIGH = 'high',                          // Important updates
  CRITICAL = 'critical'                   // Emergency/urgent
}

enum NotificationChannel {
  WEB_PUSH = 'web_push',                  // Firebase Cloud Messaging
  SMS = 'sms',                            // Text message
  IN_APP = 'in_app',                      // In-app notification center
  EMAIL = 'email'                         // Email (future)
}

enum NotificationStatus {
  DRAFT = 'draft',                        // Created but not sent
  SCHEDULED = 'scheduled',                // Scheduled for future delivery
  SENDING = 'sending',                    // Currently being sent
  SENT = 'sent',                          // Successfully sent
  FAILED = 'failed',                      // Failed to send
  CANCELLED = 'cancelled'                 // Cancelled before sending
}
```

---

## **3. API Design (Firebase Functions)**

### **3.1. Authentication APIs**

```typescript
// functions/src/auth.ts

/**
 * Initialize phone authentication (Firebase Auth built-in)
 * Note: Actual OTP sending is handled by Firebase Auth SDK on frontend
 */
export const initPhoneAuth = functions.https.onCall(async (data: {
  phoneNumber: string;
}, context) => {
  // Rate limiting check
  await checkRateLimit(data.phoneNumber, 'otp_request', 3, 3600); // 3 per hour
  
  // Validate phone number format
  if (!validatePhoneNumber(data.phoneNumber)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid phone number format');
  }
  
  // Log the authentication attempt for security
  await logActivity({
    action: 'phone_auth_initiated',
    phoneNumber: data.phoneNumber,
    timestamp: admin.firestore.Timestamp.now()
  });
  
  // Firebase Auth handles OTP sending automatically
  // This function just validates and logs the attempt
  return { success: true, message: 'Phone auth initialized' };
});

/**
 * Handle post-authentication user setup
 * Called after Firebase Auth phone verification is complete
 */
export const handlePhoneAuthComplete = functions.auth.user().onCreate(async (user) => {
  // Extract phone number from Firebase Auth user
  const phoneNumber = user.phoneNumber;
  
  if (!phoneNumber) {
    console.error('User created without phone number');
    return;
  }
  
  // Check if user profile exists in Firestore
  const userDoc = await admin.firestore().doc(`users/${user.uid}`).get();
  
  if (!userDoc.exists) {
    // Create new user profile
    const newUser: Partial<User> = {
      id: user.uid,
      phoneNumber: phoneNumber,
      displayName: '', // Will be filled during profile setup
      roles: ['member', 'player'],
      ratingPoints: 1200, // Default rating
      grade: 'B', // Default grade
      fcmTokens: [],
      isActive: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    };
    
    await admin.firestore().doc(`users/${user.uid}`).set(newUser);
    
    // Log user creation
    await logActivity({
      action: 'user_created',
      userId: user.uid,
      phoneNumber: phoneNumber,
      timestamp: admin.firestore.Timestamp.now()
    });
  } else {
    // Update last login for existing user
    await admin.firestore().doc(`users/${user.uid}`).update({
      lastLoginAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    });
  }
});

/**
 * Get or create user profile
 */
export const getOrCreateUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }
  
  const userId = context.auth.uid;
  const userDoc = await admin.firestore().doc(`users/${userId}`).get();
  
  if (!userDoc.exists) {
    // This shouldn't happen if handlePhoneAuthComplete works correctly
    throw new functions.https.HttpsError('not-found', 'User profile not found');
  }
  
  return { user: userDoc.data() };
});
```

### **3.2. Tournament Management APIs**

```typescript
// functions/src/tournaments.ts

/**
 * Create new tournament (Organizer only)
 */
export const createTournament = functions.https.onCall(async (data: {
  name: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  venue: string;
  entryFee: number;
  maxParticipants: number;
  courtCount: number;
  rules: TournamentRules;
}, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  // Authorization check
  await requireRole(context.auth.uid, ['admin', 'organizer']);
  
  // Validate input
  await validateTournamentData(data);
  
  // Create tournament
  const tournamentRef = admin.firestore().collection('tournaments').doc();
  const tournament: Tournament = {
    id: tournamentRef.id,
    organizerId: context.auth.uid,
    status: TournamentStatus.DRAFT,
    isPublic: false,
    allowStandby: true,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    ...data
  };
  
  await tournamentRef.set(tournament);
  
  // Log activity
  await logActivity({
    action: 'tournament_created',
    userId: context.auth.uid,
    tournamentId: tournament.id,
    data: { tournamentName: tournament.name }
  });
  
  return { success: true, tournamentId: tournament.id };
});

/**
 * Publish tournament (make public and open registration)
 */
export const publishTournament = functions.https.onCall(async (data: {
  tournamentId: string;
}, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  
  const tournament = await getTournament(data.tournamentId);
  await requireTournamentPermission(context.auth.uid, tournament, 'write');
  
  // Validate tournament is ready to publish
  await validateTournamentForPublish(tournament);
  
  // Update tournament status
  await admin.firestore().doc(`tournaments/${data.tournamentId}`).update({
    status: TournamentStatus.REGISTRATION,
    isPublic: true,
    publishedAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  });
  
  // Send notifications to all members
  await sendBulkNotification({
    recipientType: 'role',
    recipientFilter: { roles: ['member', 'player'] },
    title: `Giải mới: ${tournament.name}`,
    message: `Giải đấu mới đã được công bố. Đăng ký ngay!`,
    type: NotificationType.TOURNAMENT_PUBLISHED,
    channels: [NotificationChannel.WEB_PUSH],
    actionUrl: `/tournaments/${data.tournamentId}`,
    createdBy: context.auth.uid
  });
  
  return { success: true };
});
```

### **3.3. Event Registration APIs**

```typescript
// functions/src/registrations.ts

/**
 * Register for event
 */
export const registerForEvent = functions.https.onCall(async (data: {
  eventId: string;
  partnerId?: string; // for doubles
  teamId?: string;    // for team events
  paymentMethod: PaymentMethod;
  paymentReference?: string;
}, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  
  const userId = context.auth.uid;
  
  // Get event and tournament details
  const event = await getEvent(data.eventId);
  const tournament = await getTournament(event.tournamentId);
  
  // Validate registration eligibility
  await validateRegistrationEligibility(userId, event, tournament);
  
  // Check if already registered
  const existingRegistration = await getRegistration(data.eventId, userId);
  if (existingRegistration) {
    throw new functions.https.HttpsError('already-exists', 'Already registered for this event');
  }
  
  // Check event capacity
  if (event.registeredCount >= event.maxParticipants) {
    // Add to waitlist
    return await addToWaitlist(data.eventId, userId, data);
  }
  
  // Validate doubles pairing
  if (event.type === EventType.DOUBLES && data.partnerId) {
    await validateDoublesPartner(userId, data.partnerId, event);
  }
  
  // Create registration
  const registration: Registration = {
    userId,
    eventId: data.eventId,
    tournamentId: event.tournamentId,
    registeredAt: admin.firestore.Timestamp.now(),
    status: RegistrationStatus.PENDING_PAYMENT,
    paymentStatus: data.paymentMethod === PaymentMethod.CASH ? PaymentStatus.PENDING : PaymentStatus.UNPAID,
    paymentMethod: data.paymentMethod,
    paidAmount: 0,
    ratingAtRegistration: await getUserRating(userId),
    gradeAtRegistration: await getUserGrade(userId),
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    ...data
  };
  
  // Save registration
  await admin.firestore()
    .doc(`events/${data.eventId}/registrations/${userId}`)
    .set(registration);
  
  // Update event registered count
  await admin.firestore().doc(`events/${data.eventId}`).update({
    registeredCount: admin.firestore.FieldValue.increment(1),
    updatedAt: admin.firestore.Timestamp.now()
  });
  
  // Handle payment
  if (data.paymentMethod === PaymentMethod.ONLINE) {
    // Integrate with payment gateway
    const paymentUrl = await createPaymentSession(registration);
    return { success: true, paymentUrl, registrationId: `${data.eventId}_${userId}` };
  }
  
  // Send confirmation notification
  await sendNotification({
    recipientId: userId,
    title: `Đăng ký thành công: ${event.name}`,
    message: `Bạn đã đăng ký thành công cho ${event.name}. ${data.paymentMethod === PaymentMethod.CASH ? 'Vui lòng thanh toán lệ phí khi đến thi đấu.' : ''}`,
    type: NotificationType.REGISTRATION_SUCCESS,
    channels: [NotificationChannel.WEB_PUSH, NotificationChannel.SMS],
    createdBy: 'system'
  });
  
  return { success: true, status: 'registered' };
});

/**
 * Auto High-Low pairing for doubles
 */
export const generateHighLowPairs = functions.https.onCall(async (data: {
  eventId: string;
}, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  
  const event = await getEvent(data.eventId);
  await requireTournamentPermission(context.auth.uid, event.tournamentId, 'write');
  
  if (event.type !== EventType.DOUBLES) {
    throw new functions.https.HttpsError('invalid-argument', 'Event must be doubles type');
  }
  
  // Get all unpaired registrations
  const unpairedRegistrations = await getUnpairedRegistrations(data.eventId);
  
  if (unpairedRegistrations.length % 2 !== 0) {
    throw new functions.https.HttpsError('failed-precondition', 'Odd number of players cannot be paired');
  }
  
  // Sort by rating (high to low)
  const sortedPlayers = unpairedRegistrations.sort((a, b) => b.ratingAtRegistration - a.ratingAtRegistration);
  
  // Split into two groups
  const midPoint = Math.floor(sortedPlayers.length / 2);
  const highGroup = sortedPlayers.slice(0, midPoint);
  const lowGroup = sortedPlayers.slice(midPoint);
  
  // Pair high[i] with low[i]
  const pairs: Array<{player1: Registration, player2: Registration}> = [];
  for (let i = 0; i < highGroup.length; i++) {
    pairs.push({
      player1: highGroup[i],
      player2: lowGroup[i]
    });
  }
  
  // Save pairings
  const batch = admin.firestore().batch();
  for (const pair of pairs) {
    // Update player1 registration
    batch.update(
      admin.firestore().doc(`events/${data.eventId}/registrations/${pair.player1.userId}`),
      {
        partnerId: pair.player2.userId,
        partnerStatus: 'confirmed',
        pairingMethod: 'auto',
        updatedAt: admin.firestore.Timestamp.now()
      }
    );
    
    // Update player2 registration
    batch.update(
      admin.firestore().doc(`events/${data.eventId}/registrations/${pair.player2.userId}`),
      {
        partnerId: pair.player1.userId,
        partnerStatus: 'confirmed',
        pairingMethod: 'auto',
        updatedAt: admin.firestore.Timestamp.now()
      }
    );
  }
  
  await batch.commit();
  
  // Notify paired players
  for (const pair of pairs) {
    await sendNotification({
      recipientIds: [pair.player1.userId, pair.player2.userId],
      title: `Ghép đôi thành công: ${event.name}`,
      message: `Bạn đã được ghép đôi tự động. Đối tác: ${pair.player1.userId === pair.player2.userId ? 'Unknown' : 'Partner Name'}`,
      type: NotificationType.MATCH_SCHEDULED,
      channels: [NotificationChannel.WEB_PUSH],
      createdBy: context.auth.uid
    });
  }
  
  return { success: true, pairsCreated: pairs.length };
});
```

### **3.4. Match Management APIs**

```typescript
// functions/src/matches.ts

/**
 * Generate tournament bracket and schedule
 */
export const generateBracket = functions.https.onCall(async (data: {
  eventId: string;
  courtCount: number;
  startTime: Timestamp;
}, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  
  const event = await getEvent(data.eventId);
  await requireTournamentPermission(context.auth.uid, event.tournamentId, 'write');
  
  // Get all confirmed registrations
  const registrations = await getConfirmedRegistrations(data.eventId);
  
  if (registrations.length === 0) {
    throw new functions.https.HttpsError('failed-precondition', 'No confirmed registrations');
  }
  
  // Generate matches based on event format
  let matches: Partial<Match>[] = [];
  
  if (event.format === EventFormat.ROUND_ROBIN) {
    matches = await generateRoundRobinMatches(event, registrations);
  } else if (event.format === EventFormat.KNOCKOUT) {
    matches = await generateKnockoutMatches(event, registrations);
  } else if (event.format === EventFormat.ROUND_ROBIN_KNOCKOUT) {
    matches = await generateMixedMatches(event, registrations);
  }
  
  // Schedule matches
  const scheduledMatches = await scheduleMatches(matches, data.courtCount, data.startTime, event);
  
  // Save matches to database
  const batch = admin.firestore().batch();
  
  for (const match of scheduledMatches) {
    const matchRef = admin.firestore().collection('matches').doc();
    const matchData: Match = {
      id: matchRef.id,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      ...match
    } as Match;
    
    batch.set(matchRef, matchData);
  }
  
  // Update event status
  batch.update(admin.firestore().doc(`events/${data.eventId}`), {
    status: EventStatus.DRAW_COMPLETED,
    drawCompletedAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  });
  
  await batch.commit();
  
  // Notify participants
  await sendBulkNotification({
    recipientType: 'event_participants',
    recipientFilter: { eventIds: [data.eventId] },
    title: `Lịch thi đấu ${event.name}`,
    message: 'Lịch thi đấu đã được công bố. Xem chi tiết trong ứng dụng.',
    type: NotificationType.DRAW_COMPLETED,
    channels: [NotificationChannel.WEB_PUSH],
    actionUrl: `/events/${data.eventId}/schedule`,
    createdBy: context.auth.uid
  });
  
  return { success: true, matchesCreated: scheduledMatches.length };
});

/**
 * Update match score
 */
export const updateMatchScore = functions.https.onCall(async (data: {
  matchId: string;
  setNumber: number;
  participant1Score: number;
  participant2Score: number;
}, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  
  const match = await getMatch(data.matchId);
  await requireMatchPermission(context.auth.uid, match, 'write');
  
  // Validate score
  await validateScore(data.participant1Score, data.participant2Score, data.setNumber);
  
  // Update set score
  const setScore: SetScore = {
    setNumber: data.setNumber,
    participant1Score: data.participant1Score,
    participant2Score: data.participant2Score,
    winner: data.participant1Score > data.participant2Score ? 'participant1' : 'participant2',
    endTime: admin.firestore.Timestamp.now()
  };
  
  // Update match
  const updatedSets = [...match.sets];
  const existingSetIndex = updatedSets.findIndex(s => s.setNumber === data.setNumber);
  
  if (existingSetIndex >= 0) {
    updatedSets[existingSetIndex] = setScore;
  } else {
    updatedSets.push(setScore);
  }
  
  // Check if match is completed
  const { isComplete, winner } = checkMatchComplete(updatedSets, match.format);
  
  const updateData: Partial<Match> = {
    sets: updatedSets,
    currentSet: data.setNumber,
    updatedAt: admin.firestore.Timestamp.now()
  };
  
  if (isComplete) {
    updateData.status = MatchStatus.COMPLETED;
    updateData.winner = winner;
    updateData.actualEndTime = admin.firestore.Timestamp.now();
  }
  
  await admin.firestore().doc(`matches/${data.matchId}`).update(updateData);
  
  // If match completed, handle advancement
  if (isComplete && match.nextMatchId) {
    await advanceWinnerToNextMatch(match, winner);
  }
  
  // Update ratings if match completed
  if (isComplete) {
    await updatePlayerRatings(match, winner);
  }
  
  // Notify participants
  const message = isComplete ? 
    `Trận đấu đã kết thúc. ${winner === 'participant1' ? match.participant1.playerName : match.participant2?.playerName} thắng!` :
    `Điểm set ${data.setNumber}: ${data.participant1Score}-${data.participant2Score}`;
  
  await sendMatchNotification(match, message, isComplete ? NotificationType.MATCH_RESULT : NotificationType.MATCH_RESULT);
  
  return { success: true, matchCompleted: isComplete, winner };
});

/**
 * Advanced scheduling algorithm
 */
async function scheduleMatches(
  matches: Partial<Match>[], 
  courtCount: number, 
  startTime: Timestamp, 
  event: Event
): Promise<Partial<Match>[]> {
  const scheduledMatches: Partial<Match>[] = [];
  const courtSchedule: Map<number, Timestamp> = new Map();
  
  // Initialize court availability
  for (let i = 1; i <= courtCount; i++) {
    courtSchedule.set(i, startTime);
  }
  
  // Sort matches by priority (final matches last, etc.)
  const sortedMatches = matches.sort((a, b) => {
    const aPriority = getMatchPriority(a);
    const bPriority = getMatchPriority(b);
    return aPriority - bPriority;
  });
  
  for (const match of sortedMatches) {
    // Find earliest available court considering player conflicts
    const { court, time } = await findOptimalCourtTime(match, courtSchedule, scheduledMatches);
    
    // Get match duration from round config
    const roundConfig = event.rounds.find(r => r.id === match.roundId);
    const duration = roundConfig?.estimatedDuration || 30; // default 30 minutes
    
    // Schedule match
    scheduledMatches.push({
      ...match,
      courtNumber: court,
      scheduledTime: time,
      estimatedEndTime: new Timestamp(time.seconds + (duration * 60), time.nanoseconds)
    });
    
    // Update court availability
    courtSchedule.set(court, new Timestamp(time.seconds + (duration * 60), time.nanoseconds));
  }
  
  return scheduledMatches;
}
```

### **3.5. Notification APIs**

```typescript
// functions/src/notifications.ts

/**
 * Send bulk notification
 */
export const sendBulkNotification = functions.https.onCall(async (data: {
  recipientType: 'user' | 'role' | 'event_participants' | 'tournament_participants';
  recipientIds?: string[];
  recipientFilter?: any;
  title: string;
  message: string;
  type: NotificationType;
  channels: NotificationChannel[];
  actionUrl?: string;
  imageUrl?: string;
  scheduledAt?: Timestamp;
}, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  
  // Check permission to send notifications
  await requireRole(context.auth.uid, ['admin', 'organizer']);
  
  // Resolve recipients
  const recipients = await resolveNotificationRecipients(data.recipientType, data.recipientIds, data.recipientFilter);
  
  if (recipients.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'No recipients found');
  }
  
  // Create notification record
  const notificationRef = admin.firestore().collection('notifications').doc();
  const notification: Notification = {
    id: notificationRef.id,
    recipientType: data.recipientType,
    recipientIds: recipients.map(r => r.id),
    title: data.title,
    message: data.message,
    type: data.type,
    priority: getNotificationPriority(data.type),
    channels: data.channels,
    status: data.scheduledAt ? NotificationStatus.SCHEDULED : NotificationStatus.SENDING,
    createdBy: context.auth.uid,
    source: 'manual',
    actionUrl: data.actionUrl,
    imageUrl: data.imageUrl,
    scheduledAt: data.scheduledAt,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    deliveryStats: {
      totalRecipients: recipients.length,
      delivered: 0,
      failed: 0,
      opened: 0,
      clicked: 0
    }
  };
  
  await notificationRef.set(notification);
  
  // Send immediately or schedule
  if (data.scheduledAt) {
    // Schedule for later delivery
    await scheduleNotificationDelivery(notification);
  } else {
    // Send immediately
    await deliverNotification(notification, recipients);
  }
  
  return { success: true, notificationId: notification.id, recipientCount: recipients.length };
});

/**
 * Deliver notification through multiple channels
 */
async function deliverNotification(notification: Notification, recipients: User[]) {
  const deliveryPromises: Promise<void>[] = [];
  
  for (const channel of notification.channels) {
    switch (channel) {
      case NotificationChannel.WEB_PUSH:
        deliveryPromises.push(sendWebPushNotifications(notification, recipients));
        break;
        
      case NotificationChannel.SMS:
        deliveryPromises.push(sendSMSNotifications(notification, recipients));
        break;
        
      case NotificationChannel.IN_APP:
        deliveryPromises.push(createInAppNotifications(notification, recipients));
        break;
    }
  }
  
  // Wait for all deliveries
  const results = await Promise.allSettled(deliveryPromises);
  
  // Update delivery stats
  let delivered = 0;
  let failed = 0;
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      delivered += result.value || 0;
    } else {
      failed += 1;
      console.error('Notification delivery failed:', result.reason);
    }
  });
  
  // Update notification status
  await admin.firestore().doc(`notifications/${notification.id}`).update({
    status: NotificationStatus.SENT,
    sentAt: admin.firestore.Timestamp.now(),
    'deliveryStats.delivered': delivered,
    'deliveryStats.failed': failed
  });
}

/**
 * Send Web Push notifications via FCM
 */
async function sendWebPushNotifications(notification: Notification, recipients: User[]): Promise<number> {
  const tokens: string[] = [];
  
  // Collect FCM tokens from all recipients
  for (const recipient of recipients) {
    if (recipient.pushEnabled && recipient.fcmTokens.length > 0) {
      tokens.push(...recipient.fcmTokens);
    }
  }
  
  if (tokens.length === 0) return 0;
  
  // Prepare FCM message
  const message: admin.messaging.MulticastMessage = {
    notification: {
      title: notification.title,
      body: notification.message,
      imageUrl: notification.imageUrl
    },
    data: {
      type: notification.type,
      actionUrl: notification.actionUrl || '',
      notificationId: notification.id
    },
    tokens: tokens,
    webpush: {
      fcmOptions: {
        link: notification.actionUrl
      }
    }
  };
  
  // Send batch message
  const response = await admin.messaging().sendMulticast(message);
  
  // Handle failed tokens (clean up invalid tokens)
  if (response.failureCount > 0) {
    await cleanupInvalidTokens(response.responses, tokens, recipients);
  }
  
  return response.successCount;
}

/**
 * Handle SMS notifications (Currently disabled - using Web Push only)
 * Future: Can integrate with Vietnamese SMS providers if needed
 */
async function sendSMSNotifications(notification: Notification, recipients: User[]): Promise<number> {
  // SMS notifications are currently disabled
  // The system relies on Web Push notifications instead
  
  console.log(`SMS notification skipped for ${recipients.length} recipients: ${notification.title}`);
  
  // Log which notifications would have been sent as SMS
  const smsAllowedTypes = [
    NotificationType.REGISTRATION_SUCCESS,
    NotificationType.WELCOME,
    NotificationType.EMERGENCY,
    NotificationType.VENUE_CHANGE
  ];
  
  if (smsAllowedTypes.includes(notification.type)) {
    console.log(`Would send SMS for critical notification type: ${notification.type}`);
    
    // TODO: Integrate Vietnamese SMS provider if needed
    // Example providers: eSMS, SpeedSMS, Stringee
    // Cost: ~300-500 VND per SMS vs ~1800 VND for Twilio
  }
  
  // Return 0 as no SMS was actually sent
  return 0;
}
```

---

## **4. Security & Data Validation**

### **4.1. Firestore Security Rules**

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function hasRole(role) {
      return isAuthenticated() && role in getUserData().roles;
    }
    
    function hasAnyRole(roles) {
      return isAuthenticated() && getUserData().roles.hasAny(roles);
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isTournamentOrganizer(tournamentId) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/tournaments/$(tournamentId)).data.organizerId == request.auth.uid;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read/write their own profile
      allow read, write: if isOwner(userId);
      
      // Admins can read/write any user
      allow read, write: if hasRole('admin');
      
      // Organizers can read user profiles for tournament management
      allow read: if hasRole('organizer');
      
      // Public read access to basic user info for displays
      allow read: if resource.data.isActive == true;
    }
    
    // Tournaments collection
    match /tournaments/{tournamentId} {
      // Public read access
      allow read: if true;
      
      // Create: Organizers and Admins
      allow create: if hasAnyRole(['admin', 'organizer']) && 
        request.auth.uid == resource.data.organizerId;
      
      // Update: Tournament organizer or Admin
      allow update: if hasRole('admin') || isTournamentOrganizer(tournamentId);
      
      // Delete: Admin only
      allow delete: if hasRole('admin');
      
      // Sub-collections
      match /events/{eventId} {
        allow read: if true;
        allow write: if hasRole('admin') || isTournamentOrganizer(tournamentId);
      }
      
      match /rules/{ruleId} {
        allow read: if true;
        allow write: if hasRole('admin') || isTournamentOrganizer(tournamentId);
      }
    }
    
    // Events collection
    match /events/{eventId} {
      // Public read access
      allow read: if true;
      
      // Write: Event organizer, tournament organizer, or admin
      allow write: if hasRole('admin') || 
        isTournamentOrganizer(resource.data.tournamentId);
      
      // Registrations sub-collection
      match /registrations/{userId} {
        // Users can read their own registration
        allow read: if isOwner(userId);
        
        // Users can create their own registration
        allow create: if isOwner(userId) && request.auth.uid == resource.data.userId;
        
        // Users can cancel their own registration
        allow update: if isOwner(userId) && 
          request.data.status == 'cancelled' &&
          resource.data.status != 'cancelled';
        
        // Organizers can read/write all registrations
        allow read, write: if hasRole('admin') || hasRole('organizer');
        
        // Treasurers can update payment status
        allow update: if hasRole('treasurer') && 
          request.data.diff(resource.data).affectedKeys().hasOnly(['paymentStatus', 'paidAmount', 'paidAt', 'updatedAt']);
      }
      
      // Brackets sub-collection
      match /brackets/{bracketId} {
        allow read: if true;
        allow write: if hasRole('admin') || hasRole('organizer');
      }
      
      // Standings sub-collection  
      match /standings/{roundId} {
        allow read: if true;
        allow write: if hasRole('admin') || hasRole('organizer');
      }
    }
    
    // Matches collection
    match /matches/{matchId} {
      // Public read access
      allow read: if true;
      
      // Referees can update match scores and status
      allow update: if hasRole('referee') &&
        request.data.diff(resource.data).affectedKeys()
          .hasOnly(['sets', 'currentSet', 'status', 'winner', 'actualStartTime', 'actualEndTime', 'notes', 'updatedAt']);
      
      // Organizers can do everything
      allow write: if hasRole('admin') || hasRole('organizer');
      
      // Match participants can update limited fields (check-in status)
      allow update: if isAuthenticated() && 
        (request.auth.uid == resource.data.participant1.playerId || 
         request.auth.uid == resource.data.participant2.playerId) &&
        request.data.diff(resource.data).affectedKeys()
          .hasOnly(['participant1.isPresent', 'participant1.checkinTime', 'participant2.isPresent', 'participant2.checkinTime', 'updatedAt']);
      
      // Sets sub-collection
      match /sets/{setId} {
        allow read: if true;
        allow write: if hasRole('admin') || hasRole('organizer') || hasRole('referee');
      }
    }
    
    // Teams collection
    match /teams/{teamId} {
      // Public read access
      allow read: if true;
      
      // Team captain can create/update team
      allow create: if isAuthenticated() && 
        request.auth.uid == resource.data.captainId;
        
      allow update: if isAuthenticated() && 
        (request.auth.uid == resource.data.captainId || 
         request.auth.uid == resource.data.viceCaptainId);
      
      // Organizers can do everything
      allow write: if hasRole('admin') || hasRole('organizer');
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      // Users can read their own notifications
      allow read: if isAuthenticated() && 
        (request.auth.uid in resource.data.recipientIds || 
         resource.data.recipientId == request.auth.uid);
      
      // Admins and organizers can read all
      allow read: if hasAnyRole(['admin', 'organizer']);
      
      // Only admins and organizers can create notifications
      allow create: if hasAnyRole(['admin', 'organizer']);
      
      // System can update delivery status
      allow update: if hasRole('admin');
    }
    
    // Standby pools
    match /standbyPools/{eventId} {
      // Public read access
      allow read: if true;
      
      // Users can add themselves to standby
      allow write: if isAuthenticated();
      
      // Organizers can manage standby pools
      allow write: if hasRole('admin') || hasRole('organizer');
    }
    
    // Payments collection
    match /payments/{paymentId} {
      // Users can read their own payments
      allow read: if isOwner(resource.data.userId);
      
      // Treasurers and organizers can read/write all payments
      allow read, write: if hasAnyRole(['admin', 'organizer', 'treasurer']);
    }
    
    // Audit logs (admin only)
    match /auditLogs/{logId} {
      allow read, write: if hasRole('admin');
    }
  }
}
```

### **4.2. Input Validation Schemas**

```typescript
// lib/validation.ts
import { z } from 'zod';

// Phone number validation (Vietnam)
export const phoneSchema = z.string()
  .regex(/^\+84\d{9,10}$/, 'Invalid Vietnam phone number format')
  .transform(phone => phone.replace(/\s+/g, '')); // Remove spaces

// User profile validation
export const userProfileSchema = z.object({
  displayName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Name can only contain letters and spaces'),
  
  birthYear: z.number()
    .int('Birth year must be an integer')
    .min(1950, 'Birth year must be after 1950')
    .max(new Date().getFullYear() - 10, 'Must be at least 10 years old'),
  
  club: z.string()
    .max(100, 'Club name must not exceed 100 characters')
    .optional(),
  
  avatar: z.string().url('Invalid avatar URL').optional()
});

// Tournament validation
export const tournamentSchema = z.object({
  name: z.string()
    .min(5, 'Tournament name must be at least 5 characters')
    .max(100, 'Tournament name must not exceed 100 characters'),
  
  description: z.string()
    .max(1000, 'Description must not exceed 1000 characters'),
  
  startDate: z.date()
    .min(new Date(), 'Start date must be in the future'),
  
  endDate: z.date(),
  
  venue: z.string()
    .min(5, 'Venue must be at least 5 characters')
    .max(200, 'Venue must not exceed 200 characters'),
  
  entryFee: z.number()
    .int('Entry fee must be an integer')
    .min(0, 'Entry fee cannot be negative')
    .max(10000000, 'Entry fee too high'), // 10M VND max
  
  maxParticipants: z.number()
    .int('Max participants must be an integer')
    .min(4, 'Must allow at least 4 participants')
    .max(1000, 'Cannot exceed 1000 participants'),
  
  courtCount: z.number()
    .int('Court count must be an integer')
    .min(1, 'Must have at least 1 court')
    .max(50, 'Cannot exceed 50 courts')
}).refine(data => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate']
});

// Match score validation
export const matchScoreSchema = z.object({
  setNumber: z.number()
    .int('Set number must be an integer')
    .min(1, 'Set number must be at least 1')
    .max(7, 'Set number cannot exceed 7'),
  
  participant1Score: z.number()
    .int('Score must be an integer')
    .min(0, 'Score cannot be negative')
    .max(50, 'Score too high'), // Max realistic score
  
  participant2Score: z.number()
    .int('Score must be an integer')
    .min(0, 'Score cannot be negative')
    .max(50, 'Score too high')
}).refine(data => {
  // Table tennis scoring rules validation
  const { participant1Score, participant2Score } = data;
  
  // Normal game to 11, must win by 2
  if (Math.max(participant1Score, participant2Score) >= 11) {
    return Math.abs(participant1Score - participant2Score) >= 2;
  }
  
  // Game in progress is always valid
  return true;
}, {
  message: 'Invalid table tennis score - must win by 2 points',
  path: ['participant1Score', 'participant2Score']
});

// Registration validation
export const registrationSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  partnerId: z.string().uuid('Invalid partner ID').optional(),
  teamId: z.string().uuid('Invalid team ID').optional(),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'online', 'waived']),
  paymentReference: z.string().optional(),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional()
});
```

---

## **5. Performance Optimization**

### **5.1. Database Indexing Strategy**

```typescript
// Create composite indexes for common queries
const indexes = [
  // Users
  { collection: 'users', fields: [{ field: 'phoneNumber', mode: 'ASCENDING' }] },
  { collection: 'users', fields: [{ field: 'ratingPoints', mode: 'DESCENDING' }] },
  { collection: 'users', fields: [{ field: 'grade', mode: 'ASCENDING' }, { field: 'ratingPoints', mode: 'DESCENDING' }] },
  
  // Tournaments
  { collection: 'tournaments', fields: [{ field: 'status', mode: 'ASCENDING' }, { field: 'startDate', mode: 'ASCENDING' }] },
  { collection: 'tournaments', fields: [{ field: 'isPublic', mode: 'ASCENDING' }, { field: 'startDate', mode: 'ASCENDING' }] },
  
  // Events
  { collection: 'events', fields: [{ field: 'tournamentId', mode: 'ASCENDING' }, { field: 'status', mode: 'ASCENDING' }] },
  { collection: 'events', fields: [{ field: 'type', mode: 'ASCENDING' }, { field: 'gradeRestriction', mode: 'ASCENDING' }] },
  
  // Matches
  { collection: 'matches', fields: [{ field: 'eventId', mode: 'ASCENDING' }, { field: 'status', mode: 'ASCENDING' }] },
  { collection: 'matches', fields: [{ field: 'tournamentId', mode: 'ASCENDING' }, { field: 'scheduledTime', mode: 'ASCENDING' }] },
  { collection: 'matches', fields: [{ field: 'courtNumber', mode: 'ASCENDING' }, { field: 'scheduledTime', mode: 'ASCENDING' }] },
  { collection: 'matches', fields: [{ field: 'participant1.playerId', mode: 'ASCENDING' }, { field: 'status', mode: 'ASCENDING' }] },
  { collection: 'matches', fields: [{ field: 'participant2.playerId', mode: 'ASCENDING' }, { field: 'status', mode: 'ASCENDING' }] },
  
  // Registrations
  { collection: 'registrations', fields: [{ field: 'eventId', mode: 'ASCENDING' }, { field: 'status', mode: 'ASCENDING' }] },
  { collection: 'registrations', fields: [{ field: 'userId', mode: 'ASCENDING' }, { field: 'paymentStatus', mode: 'ASCENDING' }] },
  
  // Notifications
  { collection: 'notifications', fields: [{ field: 'recipientId', mode: 'ASCENDING' }, { field: 'createdAt', mode: 'DESCENDING' }] },
  { collection: 'notifications', fields: [{ field: 'type', mode: 'ASCENDING' }, { field: 'createdAt', mode: 'DESCENDING' }] }
];
```

### **5.2. Caching Strategy**

```typescript
// functions/src/cache.ts
import { getFirestore } from 'firebase-admin/firestore';

interface CacheConfig {
  ttl: number;           // Time to live in seconds
  refreshBuffer: number;  // Refresh buffer time
}

const CACHE_CONFIGS: Record<string, CacheConfig> = {
  tournaments: { ttl: 3600, refreshBuffer: 300 },      // 1 hour, refresh 5 min early
  events: { ttl: 1800, refreshBuffer: 180 },           // 30 min, refresh 3 min early  
  users: { ttl: 1800, refreshBuffer: 180 },            // 30 min, refresh 3 min early
  matches: { ttl: 300, refreshBuffer: 30 },            // 5 min, refresh 30s early
  standings: { ttl: 600, refreshBuffer: 60 },          // 10 min, refresh 1 min early
};

export class FirestoreCache {
  private cache = new Map<string, { data: any, timestamp: number, ttl: number }>();
  
  async get<T>(key: string, fetcher: () => Promise<T>, config?: CacheConfig): Promise<T> {
    const cacheConfig = config || CACHE_CONFIGS.default || { ttl: 300, refreshBuffer: 30 };
    const cached = this.cache.get(key);
    
    const now = Date.now() / 1000;
    
    if (cached && (now - cached.timestamp) < (cached.ttl - cacheConfig.refreshBuffer)) {
      // Background refresh if within refresh buffer
      if ((now - cached.timestamp) > (cached.ttl - cacheConfig.refreshBuffer)) {
        this.backgroundRefresh(key, fetcher, cacheConfig);
      }
      return cached.data;
    }
    
    // Cache miss or expired, fetch fresh data
    const data = await fetcher();
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: cacheConfig.ttl
    });
    
    return data;
  }
  
  private async backgroundRefresh<T>(key: string, fetcher: () => Promise<T>, config: CacheConfig) {
    try {
      const data = await fetcher();
      this.cache.set(key, {
        data,
        timestamp: Date.now() / 1000,
        ttl: config.ttl
      });
    } catch (error) {
      console.error(`Background refresh failed for key ${key}:`, error);
    }
  }
  
  invalidate(key: string) {
    this.cache.delete(key);
  }
  
  invalidatePattern(pattern: RegExp) {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// Usage in functions
const cache = new FirestoreCache();

export async function getCachedTournament(tournamentId: string): Promise<Tournament> {
  return cache.get(
    `tournament:${tournamentId}`,
    () => getFirestore().doc(`tournaments/${tournamentId}`).get().then(doc => doc.data() as Tournament),
    CACHE_CONFIGS.tournaments
  );
}
```

---

This comprehensive Backend Design document provides the complete foundation for implementing the Ping Pong League Manager system with Firebase. It includes detailed data models, comprehensive API design, robust security rules, input validation, and performance optimization strategies specifically tailored for the requirements outlined in the product specification.
