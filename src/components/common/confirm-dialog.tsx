'use client';

import { AlertTriangle, X } from 'lucide-react';
import { ActionButton } from './action-button';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmVariant = 'primary',
  loading = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-200">
          <div className={`p-2 rounded-full ${
            confirmVariant === 'danger' 
              ? 'bg-red-100 text-red-600' 
              : 'bg-blue-100 text-blue-600'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 flex-1">
            {title}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 pt-0">
          <ActionButton
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </ActionButton>
          <ActionButton
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
