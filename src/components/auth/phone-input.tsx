'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function PhoneInput({ value, onChange, error, disabled = false, placeholder = "912 345 678" }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format the phone number (add spaces every 3 digits)
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    onChange(inputValue);
  };

  const getFullPhoneNumber = () => {
    const cleanValue = value.replace(/\s/g, '');
    return cleanValue ? `+84${cleanValue}` : '';
  };

  return (
    <div className="space-y-1">
      <label className="block text-base font-medium text-foreground mb-2">
        Số điện thoại
        <span className="text-destructive ml-1">*</span>
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-muted-foreground text-base">+84</span>
        </div>
        
        <Input
          type="tel"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'pl-16 text-base min-h-[52px]', // Space for +84 prefix and larger height
            error && 'border-destructive focus-visible:ring-destructive/20'
          )}
          maxLength={11} // 9 digits + 2 spaces
        />
      </div>
      
      {value && (
        <p className="text-sm text-muted-foreground">
          Số điện thoại đầy đủ: {getFullPhoneNumber()}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-destructive flex items-center">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
      
      <p className="text-sm text-muted-foreground">
        Nhập số điện thoại di động của bạn để nhận mã OTP
      </p>
    </div>
  );
}
