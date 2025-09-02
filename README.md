# 🏓 Ping Pong League Manager

**A comprehensive web application for managing ping pong tournaments with Firebase Authentication, user management, and role-based access control.**

## 🌐 **Live Application**

**🚀 Production URL**: https://pingpong-league-manager.web.app

---

## ⚡ **Quick Deploy**

Deploy to Firebase Hosting in one command:

```bash
# Deploy everything
./deploy.sh

# Or using npm
pnpm run deploy
```

**📖 Full deployment guide**: [DEPLOY_QUICK_GUIDE.md](DEPLOY_QUICK_GUIDE.md)

---

## 🎯 **Features**

### **🔐 Authentication & Access Control**
- **Phone Number + OTP** authentication via Firebase Auth
- **Role-based access control** (Admin, Organizer, Referee, Treasurer, Captain, Player, Member, Viewer)
- **Multi-role support** - users can have multiple roles
- **Admin override** - admins can access all user areas
- **Quick registration** - new users auto-register with name input

### **👥 User Management**
- **Complete CRUD operations** for users and user groups
- **Role assignment** and management
- **User activation/deactivation**
- **Real-time user search** and filtering
- **Firestore integration** for data persistence

### **📱 Modern UI/UX**
- **Mobile-first responsive design** (Mobile → Tablet → Desktop)
- **Progressive Web App (PWA)** capabilities
- **Touch-friendly interfaces** (44px minimum touch targets)
- **Accessibility compliant** (WCAG 2.1 AA standards)
- **shadcn/ui components** with Tailwind CSS

### **🏗️ Technical Stack**
- **Next.js 15+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Firebase Authentication** & **Firestore**
- **Firebase Hosting** for deployment
- **PWA** with offline support

---

## 🚀 **Getting Started**

### **1. Development Setup**

```bash
# Clone repository
git clone <repository-url>
cd pingpong-league-manager

# Install dependencies
pnpm install

# Setup environment
pnpm run env:setup --create
# Edit .env.local with Firebase config

# Start development server
pnpm dev
```

### **2. Production Deployment**

```bash
# Quick deployment
pnpm run deploy

# Step-by-step
pnpm run deploy:check    # Verify setup
pnpm run deploy:build    # Build only
pnpm run deploy          # Full deployment
```

### **3. Environment Configuration**

Create `.env.local` with your Firebase config:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NODE_ENV=production
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
```

---

## 📱 **User Access**

### **🔑 Admin Access**
- **Phone**: `0333141692` (hardcoded admin)
- **Features**: Full user management, admin dashboard
- **URL**: `/admin`

### **👤 User Access**
- **Phone**: Any other number (auto-creates member)
- **Features**: User dashboard, profile management
- **URL**: `/dashboard`

### **👀 Public Access**
- **URL**: `/viewer`
- **Features**: Public tournament viewing (no authentication)

---

## 🛠️ **Development**

### **Available Scripts**

```bash
# Development
pnpm dev                 # Start dev server
pnpm build              # Build for production
pnpm start              # Start production server
pnpm lint               # Run ESLint

# Database
pnpm seed               # Seed Firestore with sample data
pnpm seed:clean         # Clean and reseed database

# Deployment
pnpm run deploy         # Full deployment
pnpm run deploy:check   # Pre-deployment checks
pnpm run deploy:build   # Build only

# Environment
pnpm run env:setup      # Setup environment
pnpm run env:validate   # Validate config
pnpm run env:show       # Show current config

# Firebase
pnpm run firebase:deploy   # Direct Firebase deploy
pnpm run firebase:login    # Authenticate
pnpm run firebase:use      # Set project
```

### **Project Structure**

```
src/
├── app/                    # Next.js app router pages
│   ├── (protected)/       # Protected routes (user)
│   ├── admin/             # Admin-only pages
│   ├── login/             # Authentication pages
│   └── viewer/            # Public pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── admin/            # Admin management components
│   ├── common/           # Shared components
│   └── layouts/          # Layout components
├── contexts/             # React contexts
├── lib/                  # Utilities and configs
├── services/             # Firebase services
└── types/                # TypeScript types

scripts/                   # Deployment scripts
├── deploy.sh             # Main deployment script
├── deploy.ps1            # Windows PowerShell version
└── setup-env.sh          # Environment setup helper
```

---

## 🔧 **Configuration**

### **Firebase Services**
- **Authentication**: Phone number + OTP
- **Firestore**: User data and tournament management
- **Hosting**: Static site deployment
- **Storage**: File uploads (configured)

### **Next.js Configuration**
- **Static Export**: For Firebase Hosting
- **PWA**: Service worker and manifest
- **Tailwind CSS**: Custom theming with slate palette
- **TypeScript**: Strict mode enabled

### **Security**
- **Firestore Rules**: Authentication required
- **Environment Variables**: Secure config management
- **HTTPS**: Enforced via Firebase Hosting
- **Input Validation**: Client and server-side

---

## 🧪 **Testing**

### **Manual Testing Checklist**
- [ ] **Phone Authentication**: OTP flow works
- [ ] **User Registration**: Name input and profile creation
- [ ] **Role Management**: Admin can manage users
- [ ] **Access Control**: Proper role-based restrictions
- [ ] **Mobile Responsive**: All screen sizes work
- [ ] **PWA Features**: Install and offline functionality

### **Test Users**
- **Admin**: `0333141692`
- **New Users**: Any phone number (auto-registration)

### **Test URLs**
- **App**: https://pingpong-league-manager.web.app
- **Admin**: https://pingpong-league-manager.web.app/admin
- **Public**: https://pingpong-league-manager.web.app/viewer

---

## 📚 **Documentation**

- **[Deployment Guide](DEPLOYMENT_SCRIPTS.md)** - Complete deployment automation
- **[Quick Deploy](DEPLOY_QUICK_GUIDE.md)** - TL;DR deployment instructions
- **[User Management Setup](USER_MANAGEMENT_SETUP.md)** - User system documentation
- **[Firebase Setup](FIREBASE_SETUP.md)** - Firebase configuration guide

---

## 🔄 **Deployment Workflow**

### **Automated Deployment**
1. **Environment Check** - Validates Firebase config
2. **Dependency Management** - Installs/updates packages
3. **Code Quality** - Runs linting and type checking
4. **Build Process** - Next.js static export
5. **Firebase Deploy** - Uploads to hosting
6. **Verification** - Provides live URLs and stats

### **Manual Steps**
```bash
# Check everything is ready
pnpm run deploy:check

# Deploy to production
pnpm run deploy

# Verify deployment
# Test key functionality
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

**Build Errors**
```bash
pnpm build                # Check build locally
pnpm run deploy:check     # Verify setup
```

**Authentication Issues**
```bash
pnpm run firebase:login   # Re-authenticate
firebase use pingpong-league-manager  # Set project
```

**Environment Problems**
```bash
pnpm run env:validate     # Check configuration
pnpm run env:show         # View current settings
```

---

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and test locally
4. **Test deployment**: `pnpm run deploy:build`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**

---

## 📈 **Performance**

### **Build Stats**
- **Total Size**: ~265KB (with chunks)
- **Static Pages**: 7 routes pre-rendered
- **PWA Ready**: Service worker + manifest
- **Mobile Optimized**: Touch-friendly UI

### **Firebase Hosting**
- **Global CDN**: Fast worldwide delivery
- **HTTPS**: Automatic SSL certificates
- **Caching**: Optimized static asset delivery
- **Rollback**: Easy version management

---

## 📞 **Support**

### **Monitoring**
- **Firebase Console**: https://console.firebase.google.com/project/pingpong-league-manager
- **Hosting Dashboard**: https://console.firebase.google.com/project/pingpong-league-manager/hosting
- **Performance Monitoring**: Real-time metrics

### **Development Help**
- **Check deployment**: `pnpm run deploy:check`
- **Environment status**: `pnpm run env:show`
- **Firebase logs**: Firebase Console → Functions/Hosting logs

---

## 🏓 **Ready to Play!**

Your ping pong league manager is now ready for production use with:
- ✅ **Automated deployment**
- ✅ **User management system**
- ✅ **Role-based access control**
- ✅ **Mobile-first design**
- ✅ **PWA capabilities**
- ✅ **Firebase integration**

**Deploy now**: `pnpm run deploy` 🚀

**Live app**: https://pingpong-league-manager.web.app ✨