'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { UserLoginForm } from '@/components/auth/user-login-form';
import { RegistrationForm } from '@/components/auth/registration-form';
import { Header } from '@/components/common/header';

export default function UserLoginPage() {
  const router = useRouter();
  const { user, loading, needsRegistration } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (!loading && user) {
      const primaryRole = user.primaryRole || 'member';
      if (primaryRole === 'admin') {
        router.push('/admin');
      } else if (['organizer', 'referee', 'treasurer', 'captain', 'player', 'member'].includes(primaryRole)) {
        router.push('/dashboard');
      } else {
        router.push('/viewer');
      }
    }
  }, [user, loading, router]);

  const handleLoginSuccess = () => {
    // After login, redirect based on user's primary role
    if (user?.primaryRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (needsRegistration) {
      // For registration step, go back to home instead of login form
      router.push('/');
    } else {
      router.push('/');
    }
  };

  const handleRegistrationBack = () => {
    // This would sign out the pending user and return to login
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title={needsRegistration ? "Đăng ký" : "Đăng nhập"} 
        onBack={handleBack}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          {needsRegistration ? (
            <RegistrationForm onBack={handleRegistrationBack} />
          ) : (
            <UserLoginForm onSuccess={handleLoginSuccess} />
          )}
        </div>
      </main>
    </div>
  );
}
