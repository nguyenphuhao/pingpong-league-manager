# 🏓 Ping Pong League Manager

A comprehensive **Web/PWA system** for managing ping pong tournaments with automatic High-Low pairing, multiple tournament types, SMS OTP authentication, real-time match coordination, and role-based access control.

## 📋 Overview

This system is designed specifically for **adults 40+ years old** with an emphasis on simplicity, large touch targets, high contrast design, and intuitive user experience. The platform supports singles, doubles, and team tournaments with automatic scheduling, real-time updates, and comprehensive tournament management.

## ✨ Key Features

### 🔐 Authentication & User Management
- **SMS OTP Authentication** via Firebase Auth (built-in phone verification)
- **Role-based Access Control**: Admin, Organizer, Referee, Treasurer, Member, Player, Captain, Viewer
- **User Profiles** with rating system and automatic grade assignment (A/B/C)
- **Phone number validation** for Vietnamese numbers (+84)

### 🏆 Tournament Management
- **Multiple Tournament Types**: Singles, Doubles, Team events
- **Flexible Tournament Formats**: Round Robin, Knockout, Mixed
- **Round-specific Configuration**: Best-of-3/5/7, custom tie-break rules
- **Registration Management** with waitlist and substitute players
- **Payment Tracking** with multiple payment methods

### ⚡ Advanced Pairing & Scheduling
- **Auto High-Low Pairing** for doubles events
- **Intelligent Scheduling Engine** with court optimization
- **Real-time Court Management** with live status updates
- **Conflict Resolution** for player availability

### 📱 Real-time Features
- **Live Match Updates** via Firestore listeners
- **Court Status Board** for referees and organizers  
- **Public Display Boards** with auto-refresh
- **Web Push Notifications** + selective SMS alerts

### 📊 Match & Scoring System
- **Set-by-set Score Entry** with validation
- **Match Status Tracking**: Scheduled → On Court → Completed
- **Special Situations**: Walkover, No-show, Retired, Paused
- **Automatic Standings Calculation** with customizable tie-break rules

### 💰 Financial Management
- **Fee Collection Tracking** (Cash, Transfer, Online)
- **Treasurer Dashboard** with payment status
- **Revenue/Expense Reporting**
- **Receipt Generation**

### 📄 Document Generation
- **PDF Tournament Brackets** with html2canvas + jsPDF
- **Tournament Rules** with versioning
- **Certificates** for winners
- **Financial Reports**

### 🌐 Public Features
- **Public Tournament Boards** accessible without login
- **Search & Filter** functionality
- **TV/Kiosk Mode** with auto-refresh
- **Tournament History** and player statistics

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand + TanStack Query
- **PWA**: Next PWA with offline support
- **PDF Generation**: jsPDF + html2canvas

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Phone/SMS)
- **Storage**: Firebase Storage  
- **Functions**: Firebase Functions (Node.js/TypeScript)
- **Hosting**: Firebase Hosting
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Phone Authentication**: Firebase Auth (built-in SMS OTP)

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions + Firebase CLI

## 📁 Project Structure

```
pingpong-league-manager/
├── docs/                           # Project documentation
│   ├── product-spec.md            # Product requirements & features
│   ├── tech-spec.md               # Technical architecture
│   ├── end-to-end-flow.md         # User journey flows
│   ├── backend-design.md          # Database & API design
│   └── frontend-design.md         # UI/UX design system
├── src/                           # Next.js application
│   ├── app/                       # App Router pages
│   │   ├── (auth)/               # Authentication pages
│   │   ├── (dashboard)/          # Protected dashboard
│   │   └── (public)/             # Public pages
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── tournament/           # Tournament components
│   │   ├── match/                # Match components
│   │   └── common/               # Shared components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities & Firebase config
│   ├── store/                    # Zustand stores
│   └── types/                    # TypeScript definitions
├── functions/                     # Firebase Functions
│   ├── src/
│   │   ├── auth.ts              # Authentication functions
│   │   ├── tournaments.ts       # Tournament management
│   │   ├── matches.ts           # Match operations
│   │   ├── notifications.ts     # Notification system
│   │   └── scheduler.ts         # Scheduling algorithm
└── public/                       # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm
- Firebase CLI
- Firebase Project with enabled services:
  - Firestore Database
  - Authentication (Phone)
  - Storage
  - Functions
  - Hosting
  - Cloud Messaging

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pingpong-league-manager.git
   cd pingpong-league-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Firebase Setup**
   ```bash
   # Login to Firebase
   firebase login
   
   # Initialize Firebase project
   firebase init
   
   # Select services: Firestore, Functions, Hosting, Storage
   ```

4. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Fill in your Firebase config
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   
   # No additional SMS configuration needed
   # Firebase Auth handles phone authentication automatically
   ```

5. **Start Development**
   ```bash
   # Start Firebase Emulators
   firebase emulators:start
   
   # In another terminal, start Next.js
   pnpm dev
   ```

### Development Workflow

1. **Phase 1: Foundation (4 weeks)**
   - [ ] Firebase project setup
   - [ ] Authentication system
   - [ ] Basic UI components
   - [ ] User management
   - [ ] Tournament CRUD

2. **Phase 2: Core Features (6 weeks)**
   - [ ] Event registration system
   - [ ] Match management
   - [ ] Real-time updates
   - [ ] Basic scheduling
   - [ ] Payment tracking

3. **Phase 3: Advanced Features (4 weeks)**
   - [ ] Advanced scheduling engine
   - [ ] Notification system
   - [ ] PDF generation
   - [ ] Public boards
   - [ ] PWA implementation

4. **Phase 4: Polish & Optimization (2 weeks)**
   - [ ] Performance optimization
   - [ ] Testing
   - [ ] UI/UX refinements
   - [ ] Documentation

## 📚 Documentation

- **[Product Specification](docs/product-spec.md)** - Features, user roles, and requirements
- **[Technical Specification](docs/tech-spec.md)** - Architecture, tech stack, and implementation
- **[End-to-End Flows](docs/end-to-end-flow.md)** - User journey mapping and system flows  
- **[Backend Design](docs/backend-design.md)** - Database schema, API design, security rules
- **[Frontend Design](docs/frontend-design.md)** - UI/UX system optimized for 40+ users

## 🎨 Design Philosophy

This application is specifically designed for **adults 40+ years old** with the following principles:

- **👆 Large Touch Targets**: Minimum 44px, recommended 52-72px
- **📖 Readable Typography**: 18px base font size (larger than standard)
- **🎨 High Contrast**: Clear color distinctions for better visibility
- **🧭 Simple Navigation**: Familiar UI patterns and clear hierarchy
- **♿ Accessibility First**: WCAG 2.1 AA compliance
- **📱 Mobile-Friendly**: Touch-optimized with bottom navigation

## 🔒 Security Features

- **Phone-based Authentication** with SMS OTP
- **Role-based Access Control** with granular permissions
- **Firestore Security Rules** protecting data access
- **Input Validation** with Zod schemas
- **Rate Limiting** for OTP requests and API calls
- **Audit Logging** for administrative actions

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

3. **Configure Custom Domain** (optional)
   ```bash
   firebase hosting:channel:deploy live --expires 30d
   ```

### Environment Setup

- **Development**: Local with Firebase Emulators
- **Staging**: Firebase Preview Channels  
- **Production**: Firebase Hosting

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run integration tests with emulators
firebase emulators:exec "pnpm test"

# Run e2e tests
pnpm test:e2e

# Test accessibility compliance
pnpm test:a11y
```

## 📈 Performance

- **Lighthouse Score Target**: 90+ on all metrics
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **PWA Features**: Offline support, installable, fast loading
- **Image Optimization**: Next.js Image component with WebP
- **Bundle Analysis**: Regular bundle size monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding standards (ESLint + Prettier)
4. Write tests for new functionality
5. Ensure accessibility compliance
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Firebase and Next.js recommended configs
- **Prettier**: Consistent code formatting
- **Accessibility**: All components must pass a11y tests
- **Testing**: Minimum 80% coverage for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support

- **Documentation**: Check the `/docs` directory
- **Issues**: Submit bug reports and feature requests via GitHub Issues
- **Discussions**: Join project discussions in GitHub Discussions

## 🗺️ Roadmap

### v1.0 - MVP Release
- ✅ Basic tournament management
- ✅ User authentication & profiles  
- ✅ Match scheduling & scoring
- ✅ Real-time updates
- ✅ Mobile-responsive design

### v1.1 - Enhanced Features
- 🔄 Advanced scheduling algorithm
- 🔄 PDF generation & reporting
- 🔄 Team tournament support
- 🔄 Payment integration

### v1.2 - Community Features  
- ⏳ Player statistics & rankings
- ⏳ Social features & achievements
- ⏳ Multi-language support
- ⏳ Advanced analytics

### v2.0 - Platform Expansion
- ⏳ Multi-sport support
- ⏳ Club management features
- ⏳ API for third-party integrations
- ⏳ White-label solutions

---

Made with ❤️ for the ping pong community, optimized for accessibility and ease of use for players of all ages.