'use client';

import { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  error?: string;
  loading?: boolean;
}

export function OTPInput({ length = 6, onComplete, error, loading = false }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0] && !loading) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [loading]);

  // Clear values when error occurs
  useEffect(() => {
    if (error) {
      setValues(Array(length).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [error, length]);

  const handleChange = (value: string, index: number) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value.slice(-1); // Only take last character
    setValues(newValues);

    // Auto-focus next input
    if (value && index < length - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        setTimeout(() => nextInput.focus(), 10);
      }
    }

    // Check if all inputs are filled
    if (newValues.every(v => v !== '') && newValues.join('').length === length) {
      setTimeout(() => onComplete(newValues.join('')), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValues = [...values];
      
      if (values[index]) {
        // Clear current input
        newValues[index] = '';
        setValues(newValues);
      } else if (index > 0) {
        // Move to previous input and clear it
        newValues[index - 1] = '';
        setValues(newValues);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    if (pastedData.length === length) {
      const newValues = pastedData.split('');
      setValues(newValues);
      onComplete(pastedData);
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="flex justify-center items-center gap-2 sm:gap-3">
        {values.map((value, index) => (
          <input
            key={index}
            ref={el => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={loading}
            className={cn(
              'w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold',
              'border-2 border-slate-300 rounded-lg shadow-sm',
              'bg-white text-slate-900 placeholder-slate-400',
              'hover:border-slate-400',
              'focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
              'focus:outline-none focus:shadow-lg',
              'transition-all duration-200 ease-in-out',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
              'selection:bg-blue-100',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-200'
            )}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>
      
      {error && (
        <p className="text-center text-sm text-red-600 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
      
      <div className="text-center text-sm text-slate-600">
        Nhập mã OTP gồm {length} chữ số
      </div>
    </div>
  );
}
