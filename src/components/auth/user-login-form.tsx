'use client';

import { useState } from 'react';
import { ArrowLeft, Smartphone, Shield } from 'lucide-react';
import { ConfirmationResult } from 'firebase/auth';
import { useAuth } from '@/contexts/auth-context';
import { ActionButton } from '@/components/common/action-button';
import { PhoneInput } from './phone-input';
import { OTPInput } from './otp-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserLoginFormProps {
  onSuccess?: () => void;
}

type LoginStep = 'phone' | 'otp';

export function UserLoginForm({ onSuccess }: UserLoginFormProps) {
  const { sendOTP, verifyOTP } = useAuth();
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.replace(/\s/g, '').length !== 9) {
      setError('Vui lòng nhập đúng số điện thoại');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullPhoneNumber = `+84${phoneNumber.replace(/\s/g, '')}`;
      const result = await sendOTP(fullPhoneNumber);
      setConfirmationResult(result);
      setStep('otp');
      
      // Start resend cooldown (60 seconds)
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi mã OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (code: string) => {
    if (!confirmationResult) {
      setError('Vui lòng gửi lại mã OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOTP(confirmationResult, code);
      onSuccess?.();
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error instanceof Error ? error.message : 'Mã OTP không đúng, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (resendCooldown > 0) return;
    setStep('phone');
    setConfirmationResult(null);
    setError('');
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setConfirmationResult(null);
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {step === 'phone' ? (
              <Smartphone className="w-8 h-8 text-primary" />
            ) : (
              <Shield className="w-8 h-8 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {step === 'phone' ? 'Đăng nhập' : 'Xác thực OTP'}
          </CardTitle>
          <p className="text-muted-foreground">
            {step === 'phone' 
              ? 'Nhập số điện thoại để nhận mã xác thực'
              : `Mã OTP đã được gửi đến ${phoneNumber ? `+84${phoneNumber.replace(/\s/g, '')}` : 'số điện thoại của bạn'}`
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'phone' ? (
            <>
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                error={error}
                disabled={loading}
              />
              
              {/* Info about phone verification */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Lưu ý quan trọng:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Nhập số điện thoại thật để nhận mã OTP</p>
                  <p>• Mã OTP sẽ được gửi qua SMS</p>
                  <p>• Kiểm tra kết nối internet ổn định</p>
                </div>
              </div>
              
              <ActionButton
                onClick={handleSendOTP}
                loading={loading}
                disabled={!phoneNumber || loading}
                size="lg"
                className="w-full"
              >
                Gửi mã OTP
              </ActionButton>
            </>
          ) : (
            <>
              <div className="px-4 py-2">
                <OTPInput
                  onComplete={handleVerifyOTP}
                  error={error}
                  loading={loading}
                />
              </div>
              
              <div className="text-center space-y-4">
                <div className="text-sm text-slate-600">
                  Không nhận được mã?{' '}
                  {resendCooldown > 0 ? (
                    <span className="text-slate-500">Gửi lại sau {resendCooldown}s</span>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      className="text-blue-600 hover:underline hover:text-blue-700 transition-colors"
                      disabled={loading}
                    >
                      Gửi lại mã
                    </button>
                  )}
                </div>
                
                <ActionButton
                  onClick={handleBackToPhone}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  icon={<ArrowLeft />}
                >
                  Đổi số điện thoại
                </ActionButton>
              </div>
            </>
          )}
          
          {/* reCAPTCHA container for Firebase */}
          <div id="recaptcha-container" className="hidden"></div>
        </CardContent>
      </Card>
    </div>
  );
}
