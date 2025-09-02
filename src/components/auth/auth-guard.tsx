'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/types';

// Helper function for role display names
const getRoleDisplayName = (role: UserRole): string => {
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
  return roleNames[role];
};

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  redirectTo?: string;
}

export function AuthGuard({ children, requiredRole, redirectTo }: AuthGuardProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Not authenticated, redirect to login page (now only one login for all)
      router.push((redirectTo || '/login') as Route);
    }
  }, [user, loading, requiredRole, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Check if user has required role
  // Admin users can access everything, others need specific role
  const isAdmin = user.roles?.includes('admin') || false;
  const hasSpecificRole = user.roles?.includes(requiredRole) || false;
  const hasAccess = isAdmin || hasSpecificRole;
  
  // Wrong role - show access denied instead of auto-redirect
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Không có quyền truy cập
          </h1>
          
          <p className="text-slate-600 mb-6">
            Bạn đang đăng nhập với vai trò <strong>{getRoleDisplayName(user.primaryRole || 'member')}</strong> nhưng trang này yêu cầu vai trò <strong>{getRoleDisplayName(requiredRole)}</strong>.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login' as Route)}
              className="w-full bg-slate-900 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Đăng nhập lại với số điện thoại khác
            </button>
            
            <button
              onClick={() => {
                // Navigate to user's primary role dashboard
                const primaryRole = user.primaryRole || 'member';
                if (primaryRole === 'admin') {
                  router.push('/admin' as Route);
                } else if (['organizer', 'referee', 'treasurer', 'captain', 'player', 'member'].includes(primaryRole)) {
                  router.push('/dashboard' as Route);
                } else {
                  router.push('/viewer' as Route);
                }
              }}
              className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Về trang chủ của tôi
            </button>
            
            <button
              onClick={logout}
              className="w-full text-slate-500 py-2 px-4 rounded-lg hover:text-slate-700 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
