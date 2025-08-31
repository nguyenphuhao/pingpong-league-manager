# Technical Specification - Ping Pong League Manager

## **1. Tech Stack Overview**

### **Frontend**
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI Library:** shadcn/ui + Tailwind CSS
- **State Management:** Zustand + React Query/TanStack Query
- **PWA:** Next PWA plugin
- **PDF Generation:** jsPDF + html2canvas
- **Real-time:** Firebase Firestore real-time listeners

### **Backend**
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Phone/SMS)
- **Storage:** Firebase Storage
- **Functions:** Firebase Functions (Node.js/TypeScript)
- **Hosting:** Firebase Hosting
- **Notifications:** Firebase Cloud Messaging (FCM)
- **SMS:** Third-party service (Twilio/AWS SNS) via Functions

### **Development & Deployment**
- **Package Manager:** pnpm
- **Build Tool:** Vite/Next.js
- **CI/CD:** GitHub Actions + Firebase CLI
- **Environment:** Firebase Projects (dev/staging/prod)

---

## **2. Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js PWA   │───▶│  Firebase Auth   │───▶│   Firestore     │
│  (shadcn/ui)    │    │   (SMS OTP)      │    │   (Real-time)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Firebase Storage│    │ Firebase Functions│    │Firebase Hosting │
│ (PDFs, Images)  │    │ (SMS, Scheduling) │    │ (Static Assets) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌──────────────────┐
                    │ Firebase FCM     │
                    │ (Push Notifications)│
                    └──────────────────┘
```

---

## **3. Database Design (Firestore)**

### **Collections Structure**

```typescript
// Root Collections
/users/{userId}
/tournaments/{tournamentId}
/events/{eventId}
/matches/{matchId}
/teams/{teamId}
/notifications/{notificationId}
/ratings/{userId}
/standbyPools/{eventId}

// Sub-collections
/tournaments/{tournamentId}/events/{eventId}
/events/{eventId}/registrations/{userId}
/events/{eventId}/matches/{matchId}
/events/{eventId}/brackets/{bracketId}
/events/{eventId}/standings/{standingId}
/tournaments/{tournamentId}/rules/{ruleId}
```

### **Data Models**

```typescript
interface User {
  id: string;
  phoneNumber: string;
  displayName: string;
  birthYear: number;
  club?: string;
  avatar?: string;
  roles: UserRole[];
  ratingPoints: number;
  grade: 'A' | 'B' | 'C';
  fcmTokens: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Tournament {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  venue: string;
  entryFee: number;
  maxParticipants: number;
  registrationDeadline: Timestamp;
  status: 'draft' | 'registration' | 'ongoing' | 'completed';
  rules: TournamentRules;
  seedingConfig: SeedingConfig;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Event {
  id: string;
  tournamentId: string;
  name: string;
  type: 'singles' | 'doubles' | 'team';
  format: 'round_robin' | 'knockout' | 'mixed';
  gradeRestriction?: 'A' | 'B' | 'C' | 'open';
  maxParticipants: number;
  registeredCount: number;
  entryFee: number;
  rounds: RoundConfig[];
  status: 'registration' | 'draw' | 'ongoing' | 'completed';
  createdAt: Timestamp;
}

interface Match {
  id: string;
  eventId: string;
  roundId: string;
  player1Id: string;
  player2Id?: string; // null for bye
  team1Id?: string; // for team matches
  team2Id?: string;
  courtNumber?: number;
  scheduledTime?: Timestamp;
  actualStartTime?: Timestamp;
  actualEndTime?: Timestamp;
  status: 'scheduled' | 'on_court' | 'paused' | 'completed' | 'walkover' | 'no_show' | 'retired';
  scores: MatchScore[];
  winner?: 'player1' | 'player2';
  notes?: string;
  refereeId?: string;
}

interface RoundConfig {
  id: string;
  name: string;
  type: 'group' | 'knockout' | 'consolation';
  bestOf: 3 | 5 | 7;
  estimatedDuration: number; // minutes
  cutoffTime?: Timestamp;
  tieBreakRules?: string[];
}
```

---

## **4. Authentication & Security**

### **Firebase Auth Configuration**
```typescript
// Firebase Auth Setup
const auth = getAuth();
auth.settings.appVerificationDisabledForTesting = false;

// Phone Authentication
export const sendOTP = async (phoneNumber: string) => {
  const appVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
  });
  
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export const verifyOTP = async (confirmationResult: any, code: string) => {
  return confirmationResult.confirm(code);
};
```

### **Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read for tournaments/events
    match /tournaments/{tournamentId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (hasRole('admin') || hasRole('organizer'));
    }
    
    // Event registrations
    match /events/{eventId}/registrations/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || hasRole('organizer'));
    }
    
    // Match results - referees and organizers can update
    match /matches/{matchId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (hasRole('referee') || hasRole('organizer'));
    }
    
    function hasRole(role) {
      return request.auth != null && 
        role in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles;
    }
  }
}
```

---

## **5. Real-time Features**

### **Firestore Real-time Listeners**
```typescript
// Match status updates
export const useMatchUpdates = (eventId: string) => {
  return useQuery({
    queryKey: ['matches', eventId],
    queryFn: () => {
      return new Promise((resolve) => {
        const unsubscribe = onSnapshot(
          query(collection(db, 'matches'), where('eventId', '==', eventId)),
          (snapshot) => {
            const matches = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            resolve(matches);
          }
        );
        return unsubscribe;
      });
    },
    refetchInterval: false,
  });
};

// Court management real-time
export const useCourtStatus = (tournamentId: string) => {
  const [courts, setCourts] = useState([]);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'matches'), 
        where('tournamentId', '==', tournamentId),
        where('status', 'in', ['scheduled', 'on_court'])
      ),
      (snapshot) => {
        const courtUpdates = snapshot.docs.map(doc => doc.data());
        setCourts(groupByCourt(courtUpdates));
      }
    );
    
    return unsubscribe;
  }, [tournamentId]);
  
  return courts;
};
```

---

## **6. Notifications System**

### **Firebase Cloud Messaging (FCM)**
```typescript
// FCM Setup
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export const requestNotificationPermission = async () => {
  const messaging = getMessaging();
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY
  });
  
  if (token) {
    // Save token to user document
    await updateDoc(doc(db, 'users', currentUser.uid), {
      fcmTokens: arrayUnion(token)
    });
  }
};

// Handle foreground messages
export const setupMessageListener = () => {
  const messaging = getMessaging();
  
  onMessage(messaging, (payload) => {
    // Show in-app notification
    toast({
      title: payload.notification?.title,
      description: payload.notification?.body,
    });
  });
};
```

### **SMS Integration (Firebase Functions)**
```typescript
// functions/src/notifications.ts
import * as functions from 'firebase-functions';
import { Twilio } from 'twilio';

const twilio = new Twilio(
  functions.config().twilio.sid,
  functions.config().twilio.token
);

export const sendSMSNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new Error('Unauthorized');
  
  const { phoneNumber, message, type } = data;
  
  // Only send SMS for specific events
  const allowedTypes = ['registration_success', 'new_member_welcome'];
  if (!allowedTypes.includes(type)) {
    return { success: false, reason: 'SMS not allowed for this notification type' };
  }
  
  try {
    await twilio.messages.create({
      body: message,
      from: functions.config().twilio.phone,
      to: phoneNumber
    });
    
    return { success: true };
  } catch (error) {
    console.error('SMS Error:', error);
    throw new Error('Failed to send SMS');
  }
});
```

---

## **7. PDF Generation & Storage**

### **PDF Generation (Client-side)**
```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateTournamentBracket = async (eventId: string) => {
  const element = document.getElementById('bracket-container');
  const canvas = await html2canvas(element);
  
  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');
  
  pdf.addImage(imgData, 'PNG', 10, 10, 277, 200);
  
  // Upload to Firebase Storage
  const pdfBlob = pdf.output('blob');
  const storageRef = ref(storage, `tournaments/${eventId}/bracket.pdf`);
  
  await uploadBytes(storageRef, pdfBlob);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};
```

### **Firebase Storage Rules**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Tournament documents
    match /tournaments/{tournamentId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && hasRole('organizer');
    }
    
    // User avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## **8. Frontend Implementation**

### **Next.js App Structure**
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── tournaments/
│   │   ├── events/
│   │   ├── matches/
│   │   └── profile/
│   ├── (public)/
│   │   ├── boards/
│   │   └── results/
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   ├── tournament/
│   ├── match/
│   └── common/
├── hooks/
├── lib/
│   ├── firebase.ts
│   ├── utils.ts
│   └── validations.ts
├── store/
└── types/
```

### **shadcn/ui Setup**
```typescript
// components/ui configuration
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Match card component example
export function MatchCard({ match }: { match: Match }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{match.player1Name} vs {match.player2Name}</span>
          <Badge variant={match.status === 'completed' ? 'success' : 'outline'}>
            {match.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>Court {match.courtNumber}</div>
          <div>{format(match.scheduledTime, 'HH:mm')}</div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### **State Management with Zustand**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TournamentStore {
  currentTournament: Tournament | null;
  events: Event[];
  matches: Match[];
  setCurrentTournament: (tournament: Tournament) => void;
  addEvent: (event: Event) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
}

export const useTournamentStore = create<TournamentStore>()(
  persist(
    (set, get) => ({
      currentTournament: null,
      events: [],
      matches: [],
      setCurrentTournament: (tournament) => 
        set({ currentTournament: tournament }),
      addEvent: (event) => 
        set({ events: [...get().events, event] }),
      updateMatch: (matchId, updates) => 
        set({
          matches: get().matches.map(match => 
            match.id === matchId ? { ...match, ...updates } : match
          )
        }),
    }),
    { name: 'tournament-store' }
  )
);
```

---

## **9. PWA Configuration**

### **Next.js PWA Setup**
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'firestore-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
});

module.exports = withPWA({
  // Next.js config
});
```

### **Web App Manifest**
```json
{
  "name": "Ping Pong League Manager",
  "short_name": "PPLeague",
  "description": "Professional ping pong tournament management",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## **10. Scheduling Engine (Firebase Functions)**

```typescript
// functions/src/scheduler.ts
export const generateSchedule = functions.https.onCall(async (data, context) => {
  const { eventId, courtCount } = data;
  
  // Get all matches for the event
  const matchesSnapshot = await admin.firestore()
    .collection('matches')
    .where('eventId', '==', eventId)
    .where('status', '==', 'scheduled')
    .get();
  
  const matches = matchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Advanced scheduling algorithm
  const schedule = await optimizeSchedule(matches, courtCount);
  
  // Update matches with court assignments and times
  const batch = admin.firestore().batch();
  
  schedule.forEach((match, index) => {
    const matchRef = admin.firestore().doc(`matches/${match.id}`);
    batch.update(matchRef, {
      courtNumber: match.assignedCourt,
      scheduledTime: match.scheduledTime,
      estimatedEndTime: match.estimatedEndTime
    });
  });
  
  await batch.commit();
  return { success: true, scheduledMatches: schedule.length };
});

function optimizeSchedule(matches: any[], courtCount: number) {
  // Implementation of scheduling algorithm
  // Consider player conflicts, court availability, round dependencies
  return matches.map((match, index) => ({
    ...match,
    assignedCourt: (index % courtCount) + 1,
    scheduledTime: new Date(Date.now() + (Math.floor(index / courtCount) * 30 * 60000)),
    estimatedEndTime: new Date(Date.now() + (Math.floor(index / courtCount) * 30 * 60000) + (20 * 60000))
  }));
}
```

---

## **11. Performance Optimization**

### **Firestore Optimization**
- Use composite indexes for complex queries
- Implement pagination for large datasets
- Cache frequently accessed data
- Use subcollections to avoid large document sizes

### **Frontend Optimization**
```typescript
// Lazy loading for heavy components
const TournamentBracket = lazy(() => import('@/components/TournamentBracket'));
const MatchScheduler = lazy(() => import('@/components/MatchScheduler'));

// Memoization for expensive calculations
const MemoizedStandings = memo(({ matches }: { matches: Match[] }) => {
  const standings = useMemo(() => calculateStandings(matches), [matches]);
  return <StandingsTable standings={standings} />;
});

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

const MatchList = ({ matches }: { matches: Match[] }) => (
  <FixedSizeList
    height={600}
    itemCount={matches.length}
    itemSize={80}
    itemData={matches}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <MatchCard match={data[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

---

## **12. Deployment & CI/CD**

### **Firebase Project Setup**
```bash
# Initialize Firebase
firebase init

# Select services:
# - Firestore
# - Functions
# - Hosting
# - Storage
# - Emulators

# Deploy
firebase deploy
```

### **GitHub Actions Workflow**
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: pingpong-league-manager
```

---

## **13. Environment Configuration**

### **Firebase Config**
```typescript
// lib/firebase.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
```

### **Environment Variables**
```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_VAPID_KEY=

# Firebase Functions
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_PHONE=
```

---

## **14. Development Timeline**

### **Phase 1: Foundation (4 weeks)**
- Firebase project setup
- Authentication system
- Basic UI components (shadcn/ui)
- User management
- Tournament CRUD

### **Phase 2: Core Features (6 weeks)**
- Event registration system
- Match management
- Real-time updates
- Basic scheduling
- Payment tracking

### **Phase 3: Advanced Features (4 weeks)**
- Advanced scheduling engine
- Notification system
- PDF generation
- Public boards
- PWA implementation

### **Phase 4: Polish & Optimization (2 weeks)**
- Performance optimization
- Testing
- UI/UX refinements
- Documentation

---

This technical specification provides a comprehensive roadmap for building the ping pong tournament management system using Firebase ecosystem and shadcn/ui. The architecture is scalable, real-time, and follows modern web development practices.
