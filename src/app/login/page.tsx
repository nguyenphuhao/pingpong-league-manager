'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { UserLoginForm } from '@/components/auth/user-login-form';
import { RegistrationForm } from '@/components/auth/registration-form';
import { useThemeClasses } from '@/contexts/theme-context';
import { ActionButton } from '@/components/common/action-button';
import { 
  ArrowLeft, 
  Trophy, 
  Users, 
  Sparkles,
  Shield,
  Lock
} from 'lucide-react';

export default function UserLoginPage() {
  const router = useRouter();
  const { user, loading, needsRegistration } = useAuth();
  const themeClasses = useThemeClasses();

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
    router.push('/');
  };

  const handleRegistrationBack = () => {
    // This would sign out the pending user and return to login
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className={`${themeClasses.text.large} text-slate-600 dark:text-slate-300`}>
            Đang tải...
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="relative">
        {/* Header */}
        <div className={`${themeClasses.padding} border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm`}>
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <ActionButton
              onClick={handleBack}
              variant="ghost"
              className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              icon={<ArrowLeft />}
            >
              <span className="hidden sm:inline">Quay lại</span>
            </ActionButton>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className={`${themeClasses.heading.h4} font-bold text-slate-900 dark:text-white`}>
                CLB Bóng Bàn Bình Tân
              </span>
            </div>
            
            <div className="w-24"></div> {/* Spacer for center alignment */}
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 sm:py-16">
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <div className="w-full max-w-lg">
              {/* Login Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                      {needsRegistration ? (
                        <Users className="h-8 w-8 text-white" />
                      ) : (
                        <Shield className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400 animate-pulse" />
                  </div>
                </div>

                <h1 className={`${themeClasses.heading.h2} text-slate-900 dark:text-white font-bold mb-4`}>
                  {needsRegistration ? "Hoàn tất đăng ký" : "Đăng nhập hội viên"}
                </h1>
                
                <p className={`${themeClasses.text.body} text-slate-600 dark:text-slate-300 mb-2`}>
                  {needsRegistration 
                    ? "Vui lòng nhập tên của bạn để hoàn tất quá trình đăng ký"
                    : "Sử dụng số điện thoại để truy cập vào hệ thống CLB"
                  }
                </p>
                
                {!needsRegistration && (
                  <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                    <Lock className="h-4 w-4" />
                    <span className={themeClasses.text.caption}>
                      Bảo mật với xác thực OTP
                    </span>
                  </div>
                )}
              </div>

              {/* Login/Registration Form */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className={`${themeClasses.padding} ${themeClasses.section}`}>
                  {needsRegistration ? (
                    <RegistrationForm onBack={handleRegistrationBack} />
                  ) : (
                    <UserLoginForm onSuccess={handleLoginSuccess} />
                  )}
                </div>
              </div>

              {/* Footer Links */}
              {!needsRegistration && (
                <div className="text-center mt-8">
                  <p className={`${themeClasses.text.caption} text-slate-500 dark:text-slate-400 mb-4`}>
                    Chưa phải hội viên của CLB?
                  </p>
                  <ActionButton
                    onClick={() => router.push('/viewer')}
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Xem thông tin công khai
                  </ActionButton>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`${themeClasses.text.body} font-medium text-blue-900 dark:text-blue-100 mb-1`}>
                      Bảo mật thông tin
                    </h4>
                    <p className={`${themeClasses.text.caption} text-blue-700 dark:text-blue-300`}>
                      Thông tin của bạn được bảo vệ bằng hệ thống xác thực OTP an toàn. 
                      Chúng tôi không lưu trữ mật khẩu và tuân thủ các tiêu chuẩn bảo mật cao nhất.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
