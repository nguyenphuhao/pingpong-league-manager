'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserRole } from '@/types';

export interface AuthUser extends User {
  roles?: UserRole[];
  primaryRole?: UserRole;
  displayName: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  needsRegistration: boolean;
  pendingUser: User | null;
  
  // Phone authentication (unified for all users)
  sendOTP: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyOTP: (confirmationResult: ConfirmationResult, code: string) => Promise<void>;
  
  // Registration
  completeRegistration: (displayName: string) => Promise<void>;
  
  // General
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Firestore helper functions
const getUserFromFirestore = async (phoneNumber: string): Promise<{
  roles: UserRole[];
  displayName?: string;
  isActive: boolean;
  userId?: string;
} | null> => {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('phoneNumber', '==', phoneNumber)
    );
    
    const querySnapshot = await getDocs(usersQuery);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      return {
        userId: userDoc.id,
        roles: userData.roles || ['member'],
        displayName: userData.displayName,
        isActive: userData.isActive !== false // Default to true if not specified
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user from Firestore:', error);
    return null;
  }
};



// Update user's last login time
const updateLastLogin = async (userId: string): Promise<void> => {
  try {
    if (userId && userId !== 'unknown') {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        lastLoginAt: Timestamp.now()
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

const getPrimaryRole = (roles: UserRole[]): UserRole => {
  // Priority order for primary role
  const rolePriority: UserRole[] = ['admin', 'organizer', 'referee', 'treasurer', 'captain', 'player', 'member', 'viewer'];
  
  for (const role of rolePriority) {
    if (roles.includes(role)) {
      return role;
    }
  }
  
  return 'member';
};

const getDisplayName = (phoneNumber: string | null | undefined, primaryRole: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Quản trị viên',
    organizer: 'Ban tổ chức',
    referee: 'Trọng tài',
    treasurer: 'Thủ quỹ',
    captain: 'Đội trưởng',
    player: 'Người chơi',
    member: 'Thành viên',
    viewer: 'Khách'
  };

  if (primaryRole === 'admin') {
    return 'Quản trị viên';
  }
  
  if (phoneNumber) {
    const phone = phoneNumber.replace('+84', '0');
    const roleName = roleNames[primaryRole];
    return `${roleName} ${phone.slice(-4)}`;
  }
  
  return 'Khách';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.phoneNumber) {
        try {
          // Check if user exists in Firestore
          const firestoreUser = await getUserFromFirestore(firebaseUser.phoneNumber);
          
          if (firestoreUser) {
            // User exists in Firestore
            if (!firestoreUser.isActive) {
              // User is deactivated, deny access
              console.log(`❌ User ${firebaseUser.phoneNumber} is deactivated`);
              setUser(null);
              setLoading(false);
              return;
            }
            
            // Update last login time
            if (firestoreUser.userId) {
              await updateLastLogin(firestoreUser.userId);
            }
            
            // Use Firestore data
            const primaryRole = getPrimaryRole(firestoreUser.roles);
            setUser({
              ...firebaseUser,
              roles: firestoreUser.roles,
              primaryRole,
              displayName: firestoreUser.displayName || getDisplayName(firebaseUser.phoneNumber, primaryRole) || null
            } as AuthUser);
          } else {
            // User doesn't exist in Firestore - trigger registration step
            console.log(`📝 New user detected: ${firebaseUser.phoneNumber} - needs registration`);
            setPendingUser(firebaseUser);
            setNeedsRegistration(true);
            setUser(null); // Don't set user until registration is complete
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          // Fallback: deny access on error
          setUser(null);
        }
      } else {
        setUser(null);
        setPendingUser(null);
        setNeedsRegistration(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      
      // Cleanup reCAPTCHA verifier on unmount
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (clearError) {
          console.warn('Warning clearing reCAPTCHA on unmount:', clearError);
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Phone authentication for all users
  const sendOTP = async (phoneNumber: string): Promise<ConfirmationResult> => {
    try {
      console.log('🔥 Sending OTP to:', phoneNumber);

      // Clear any existing reCAPTCHA verifier and DOM content
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (clearError) {
          console.warn('Warning clearing existing reCAPTCHA:', clearError);
        }
        window.recaptchaVerifier = null;
      }

      // Clear the container element to ensure clean state
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = '';
      }

      // Setup reCAPTCHA verifier
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('✅ reCAPTCHA verified');
        },
        'expired-callback': () => {
          console.log('❌ reCAPTCHA expired, resetting...');
          if (window.recaptchaVerifier) {
            try {
              window.recaptchaVerifier.clear();
            } catch (clearError) {
              console.warn('Warning clearing expired reCAPTCHA:', clearError);
            }
            window.recaptchaVerifier = null;
          }
        }
      });

      // Send OTP using Firebase Phone Authentication
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        phoneNumber, 
        window.recaptchaVerifier
      );
      
      console.log('📱 OTP sent successfully');
      return confirmationResult;
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (clearError) {
          console.warn('Warning clearing reCAPTCHA after error:', clearError);
        }
        window.recaptchaVerifier = null;
      }

      // Also clear the container element
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = '';
      }
      
      // Provide user-friendly error messages
      let errorMessage = 'Có lỗi xảy ra khi gửi mã OTP';
      
      if (error instanceof Error) {
        const firebaseError = error as { code?: string };
        if (firebaseError.code === 'auth/network-request-failed') {
          errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
        } else if (firebaseError.code === 'auth/too-many-requests') {
          errorMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
        } else if (firebaseError.code === 'auth/invalid-phone-number') {
          errorMessage = 'Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (firebaseError.code === 'auth/captcha-check-failed') {
          errorMessage = 'Xác thực reCAPTCHA thất bại. Vui lòng thử lại.';
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  const verifyOTP = async (confirmationResult: ConfirmationResult, code: string): Promise<void> => {
    try {
      await confirmationResult.confirm(code);
      // User state will be updated via onAuthStateChanged
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setPendingUser(null);
      setNeedsRegistration(false);
      
      // Cleanup reCAPTCHA verifier on logout
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (clearError) {
          console.warn('Warning clearing reCAPTCHA on logout:', clearError);
        }
        window.recaptchaVerifier = null;
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const completeRegistration = async (displayName: string): Promise<void> => {
    if (!pendingUser || !pendingUser.phoneNumber) {
      throw new Error('No pending user for registration');
    }

    try {
      setLoading(true);
      console.log(`✍️ Completing registration for ${pendingUser.phoneNumber} with name: ${displayName}`);

      // Check if this is the admin phone number
      const isAdmin = pendingUser.phoneNumber === '+84333141692';
      const defaultRoles: UserRole[] = isAdmin ? ['admin'] : ['member'];
      
      // Create user profile in Firestore with provided name
      const userDocRef = doc(collection(db, 'users'));
      const now = Timestamp.now();
      
      const userData = {
        phoneNumber: pendingUser.phoneNumber,
        displayName: displayName.trim(),
        birthYear: new Date().getFullYear() - 25, // Default age
        roles: defaultRoles,
        grade: 'C' as const,
        ratingPoints: 0,
        fcmTokens: [],
        isActive: true,
        lastLoginAt: now,
        createdAt: now,
        updatedAt: now,
        createdBy: 'self-registration'
      };
      
      await setDoc(userDocRef, userData);
      
      console.log(`✅ Registration completed for ${pendingUser.phoneNumber}`);
      
      // Set user as logged in
      const primaryRole = getPrimaryRole(defaultRoles);
      setUser({
        ...pendingUser,
        roles: defaultRoles,
        primaryRole,
        displayName: displayName.trim()
      } as AuthUser);
      
      // Clear registration state
      setPendingUser(null);
      setNeedsRegistration(false);
      
    } catch (error) {
      console.error('Error completing registration:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    needsRegistration,
    pendingUser,
    sendOTP,
    verifyOTP,
    completeRegistration,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Extend window object for reCAPTCHA
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}
