'use client';

import { useState, useEffect } from 'react';
import { X, Save, User, Phone, Calendar, Building2, Shield, Award } from 'lucide-react';
import { ActionButton } from '@/components/common/action-button';
import { Badge } from '@/components/ui/badge';
import { ManagedUser, UserFormData, UserRole, Grade } from '@/types';
import { checkPhoneNumberExists } from '@/services/user-management';

interface UserModalProps {
  user?: ManagedUser | null;
  onClose: () => void;
  onSave: (userData: UserFormData) => Promise<void>;
}

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Quản trị viên', description: 'Toàn quyền hệ thống' },
  { value: 'organizer', label: 'Ban tổ chức', description: 'Tổ chức giải đấu' },
  { value: 'referee', label: 'Trọng tài', description: 'Điều hành trận đấu' },
  { value: 'treasurer', label: 'Thủ quỹ', description: 'Quản lý tài chính' },
  { value: 'captain', label: 'Đội trưởng', description: 'Lãnh đạo đội' },
  { value: 'player', label: 'Người chơi', description: 'Tham gia thi đấu' },
  { value: 'member', label: 'Thành viên', description: 'Thành viên cơ bản' },
  { value: 'viewer', label: 'Khách', description: 'Chỉ xem thông tin' }
];

const gradeOptions: { value: Grade; label: string; description: string }[] = [
  { value: 'A', label: 'Hạng A', description: 'Trình độ cao' },
  { value: 'B', label: 'Hạng B', description: 'Trình độ trung bình' },
  { value: 'C', label: 'Hạng C', description: 'Trình độ cơ bản' }
];

export function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    phoneNumber: '',
    displayName: '',
    birthYear: new Date().getFullYear() - 25,
    club: '',
    roles: ['member'],
    grade: 'C',
    isActive: true
  });

  const [errors, setErrors] = useState<{ [K in keyof UserFormData]?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        phoneNumber: user.phoneNumber,
        displayName: user.displayName,
        birthYear: user.birthYear,
        club: user.club || '',
        roles: [...user.roles],
        grade: user.grade,
        isActive: user.isActive
      });
    }
  }, [user]);

  const validateForm = async (): Promise<boolean> => {
    const newErrors: { [K in keyof UserFormData]?: string } = {};

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (!/^\+84\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (định dạng: +84xxxxxxxxx)';
    } else {
      // Check if phone number already exists
      try {
        const exists = await checkPhoneNumberExists(formData.phoneNumber, user?.id);
        if (exists) {
          newErrors.phoneNumber = 'Số điện thoại này đã được sử dụng';
        }
      } catch (error) {
        console.error('Error checking phone number:', error);
        // Don't block form submission if check fails
      }
    }

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Tên hiển thị là bắt buộc';
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự';
    }

    // Birth year validation
    const currentYear = new Date().getFullYear();
    if (formData.birthYear < 1950 || formData.birthYear > currentYear - 10) {
      newErrors.birthYear = `Năm sinh phải từ 1950 đến ${currentYear - 10}`;
    }

    // Roles validation
    if (formData.roles.length === 0) {
      newErrors.roles = 'Phải chọn ít nhất một vai trò';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);
    
    try {
      await onSave(formData);
      setLoading(false);
    } catch (error) {
      console.error('Error saving user:', error);
      setLoading(false);
      // onSave will handle error display in the parent component
    }
  };

  const handleRoleToggle = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // If starts with 0, replace with +84
    if (digits.startsWith('0')) {
      return '+84' + digits.slice(1);
    }
    
    // If starts with 84, add +
    if (digits.startsWith('84')) {
      return '+' + digits;
    }
    
    // If starts with +84, keep as is
    if (value.startsWith('+84')) {
      return '+84' + digits.slice(2);
    }
    
    // Otherwise, assume Vietnamese number and add +84
    return '+84' + digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phoneNumber: formatted }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="+84333141692"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.phoneNumber ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên hiển thị *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.displayName ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors.displayName && (
                  <p className="text-red-600 text-sm mt-1">{errors.displayName}</p>
                )}
              </div>

              {/* Birth Year */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Năm sinh *
                </label>
                <input
                  type="number"
                  value={formData.birthYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthYear: parseInt(e.target.value) }))}
                  min="1950"
                  max={new Date().getFullYear() - 10}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.birthYear ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors.birthYear && (
                  <p className="text-red-600 text-sm mt-1">{errors.birthYear}</p>
                )}
              </div>

              {/* Club */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  Club
                </label>
                <input
                  type="text"
                  value={formData.club}
                  onChange={(e) => setFormData(prev => ({ ...prev, club: e.target.value }))}
                  placeholder="Tên club (không bắt buộc)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Grade Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Hạng thi đấu
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {gradeOptions.map((grade) => (
                <label
                  key={grade.value}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    formData.grade === grade.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="grade"
                    value={grade.value}
                    checked={formData.grade === grade.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value as Grade }))}
                    className="hidden"
                  />
                  <div className="text-center">
                    <div className="font-medium text-slate-900">{grade.label}</div>
                    <div className="text-sm text-slate-600 mt-1">{grade.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Roles Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Vai trò và quyền hạn *
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roleOptions.map((role) => (
                <label
                  key={role.value}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    formData.roles.includes(role.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role.value)}
                    onChange={() => handleRoleToggle(role.value)}
                    className="hidden"
                  />
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{role.label}</div>
                      <div className="text-sm text-slate-600 mt-1">{role.description}</div>
                    </div>
                    {formData.roles.includes(role.value) && (
                      <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {errors.roles && (
              <p className="text-red-600 text-sm">{errors.roles}</p>
            )}

            {/* Selected Roles Preview */}
            {formData.roles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Vai trò đã chọn:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.roles.map((role) => {
                    const roleInfo = roleOptions.find(r => r.value === role);
                    return (
                      <Badge key={role} variant="secondary">
                        {roleInfo?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Account Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Trạng thái tài khoản</h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-slate-900">Kích hoạt tài khoản</div>
                <div className="text-sm text-slate-600">
                  Người dùng có thể đăng nhập và sử dụng hệ thống
                </div>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <ActionButton
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </ActionButton>
            <ActionButton
              loading={loading}
              icon={<Save />}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
            >
              {user ? 'Cập nhật' : 'Tạo mới'}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
