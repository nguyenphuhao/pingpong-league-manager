'use client';

import { useState } from 'react';
import { User, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ActionButton } from '@/components/common/action-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RegistrationFormProps {
  onBack?: () => void;
}

export function RegistrationForm({ onBack }: RegistrationFormProps) {
  const { pendingUser, completeRegistration } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!pendingUser) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Tên phải có ít nhất 2 ký tự');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Tên không được vượt quá 50 ký tự');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await completeRegistration(trimmedName);
      // User will be automatically logged in and redirected by parent component
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi hoàn tất đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace('+84', '0');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Hoàn tất đăng ký</CardTitle>
          <p className="text-sm text-slate-600">
            Chào mừng! Vui lòng nhập tên của bạn để hoàn tất việc tạo tài khoản.
          </p>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              📱 Số điện thoại: {formatPhoneNumber(pendingUser.phoneNumber || '')}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name Input */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-2">
                <User className="inline-block w-4 h-4 mr-1 text-slate-500" /> 
                Tên hiển thị
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={`w-full p-3 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                placeholder="Nguyễn Văn A"
                disabled={loading}
                autoFocus
                maxLength={50}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              <p className="text-slate-500 text-xs mt-1">
                Tên này sẽ hiển thị trong hệ thống và có thể thay đổi sau.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <ActionButton 
                loading={loading} 
                disabled={loading || !displayName.trim()}
                className="w-full"
                size="lg"
                icon={<Save />}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              >
                Hoàn tất đăng ký
              </ActionButton>
              
              {onBack && (
                <ActionButton 
                  variant="outline" 
                  onClick={onBack} 
                  disabled={loading}
                  className="w-full"
                  icon={<ArrowLeft />}
                >
                  Quay lại
                </ActionButton>
              )}
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-700 mb-2">💡 Bước tiếp theo</h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>✅ Tài khoản của bạn sẽ được tạo với quyền thành viên</li>
              <li>✅ Bạn có thể tham gia xem các giải đấu công khai</li>
              <li>✅ Liên hệ admin để được cấp thêm quyền tham gia thi đấu</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
