'use client';

import { useState } from 'react';
import { X, Calendar, Building2, Shield, Award, ToggleLeft, ToggleRight } from 'lucide-react';
import { ActionButton } from '@/components/common/action-button';
import { Badge } from '@/components/ui/badge';
import { UserFilter, UserRole, Grade } from '@/types';

interface UserFiltersProps {
  filters: UserFilter;
  onFiltersChange: (filters: UserFilter) => void;
  onClear: () => void;
}

const roleOptions: { value: UserRole; label: string; color: string }[] = [
  { value: 'admin', label: 'Quản trị viên', color: 'bg-red-100 text-red-800' },
  { value: 'organizer', label: 'Ban tổ chức', color: 'bg-purple-100 text-purple-800' },
  { value: 'referee', label: 'Trọng tài', color: 'bg-blue-100 text-blue-800' },
  { value: 'treasurer', label: 'Thủ quỹ', color: 'bg-green-100 text-green-800' },
  { value: 'captain', label: 'Đội trưởng', color: 'bg-orange-100 text-orange-800' },
  { value: 'player', label: 'Người chơi', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'member', label: 'Thành viên', color: 'bg-slate-100 text-slate-800' },
  { value: 'viewer', label: 'Khách', color: 'bg-gray-100 text-gray-800' }
];

const gradeOptions: { value: Grade; label: string; color: string }[] = [
  { value: 'A', label: 'Hạng A', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'B', label: 'Hạng B', color: 'bg-blue-100 text-blue-800' },
  { value: 'C', label: 'Hạng C', color: 'bg-green-100 text-green-800' }
];

export function UserFilters({ filters, onFiltersChange, onClear }: UserFiltersProps) {
  const [clubInput, setClubInput] = useState(filters.club || '');

  const handleRoleToggle = (role: UserRole) => {
    const currentRoles = filters.roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    
    onFiltersChange({
      ...filters,
      roles: newRoles.length > 0 ? newRoles : undefined
    });
  };

  const handleGradeToggle = (grade: Grade) => {
    const currentGrades = filters.grade || [];
    const newGrades = currentGrades.includes(grade)
      ? currentGrades.filter(g => g !== grade)
      : [...currentGrades, grade];
    
    onFiltersChange({
      ...filters,
      grade: newGrades.length > 0 ? newGrades : undefined
    });
  };

  const handleStatusToggle = (isActive: boolean | undefined) => {
    onFiltersChange({
      ...filters,
      isActive: filters.isActive === isActive ? undefined : isActive
    });
  };

  const handleClubChange = (value: string) => {
    setClubInput(value);
    onFiltersChange({
      ...filters,
      club: value.trim() || undefined
    });
  };

  const handleDateChange = (field: 'createdAfter' | 'createdBefore', value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value ? new Date(value) : undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && 
    !(Array.isArray(value) && value.length === 0)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Bộ lọc tìm kiếm</h3>
        {hasActiveFilters && (
          <ActionButton
            variant="outline"
            size="sm"
            onClick={onClear}
            icon={<X />}
          >
            Xóa tất cả
          </ActionButton>
        )}
      </div>

      {/* Role Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-600" />
          <h4 className="font-medium text-slate-900">Vai trò</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {roleOptions.map((role) => {
            const isSelected = filters.roles?.includes(role.value) || false;
            return (
              <button
                key={role.value}
                onClick={() => handleRoleToggle(role.value)}
                className={`text-left p-3 border-2 rounded-lg transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${role.color}`}>
                    {role.label}
                  </Badge>
                  {isSelected && (
                    <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {filters.roles && filters.roles.length > 0 && (
          <div className="text-sm text-slate-600">
            Đã chọn {filters.roles.length} vai trò
          </div>
        )}
      </div>

      {/* Grade Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-slate-600" />
          <h4 className="font-medium text-slate-900">Hạng thi đấu</h4>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {gradeOptions.map((grade) => {
            const isSelected = filters.grade?.includes(grade.value) || false;
            return (
              <button
                key={grade.value}
                onClick={() => handleGradeToggle(grade.value)}
                className={`text-center p-3 border-2 rounded-lg transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${grade.color}`}>
                    {grade.label}
                  </Badge>
                  {isSelected && (
                    <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-slate-900">Trạng thái tài khoản</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleStatusToggle(true)}
            className={`flex items-center justify-between p-3 border-2 rounded-lg transition-all ${
              filters.isActive === true
                ? 'border-green-500 bg-green-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {filters.isActive === true ? (
                <ToggleRight className="w-5 h-5 text-green-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-slate-400" />
              )}
              <span className="text-sm font-medium">Đang hoạt động</span>
            </div>
            {filters.isActive === true && (
              <div className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </button>

          <button
            onClick={() => handleStatusToggle(false)}
            className={`flex items-center justify-between p-3 border-2 rounded-lg transition-all ${
              filters.isActive === false
                ? 'border-red-500 bg-red-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {filters.isActive === false ? (
                <ToggleRight className="w-5 h-5 text-red-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-slate-400" />
              )}
              <span className="text-sm font-medium">Bị khóa</span>
            </div>
            {filters.isActive === false && (
              <div className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Club Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-slate-600" />
          <h4 className="font-medium text-slate-900">Club</h4>
        </div>
        <input
          type="text"
          value={clubInput}
          onChange={(e) => handleClubChange(e.target.value)}
          placeholder="Nhập tên club để lọc..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Date Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-600" />
          <h4 className="font-medium text-slate-900">Ngày tạo tài khoản</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={filters.createdAfter ? filters.createdAfter.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange('createdAfter', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={filters.createdBefore ? filters.createdBefore.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange('createdBefore', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Bộ lọc đang áp dụng:</h5>
          <div className="space-y-2 text-sm text-blue-800">
            {filters.roles && filters.roles.length > 0 && (
              <div>• Vai trò: {filters.roles.length} vai trò được chọn</div>
            )}
            {filters.grade && filters.grade.length > 0 && (
              <div>• Hạng: {filters.grade.join(', ')}</div>
            )}
            {filters.isActive !== undefined && (
              <div>• Trạng thái: {filters.isActive ? 'Đang hoạt động' : 'Bị khóa'}</div>
            )}
            {filters.club && (
              <div>• Club: &quot;{filters.club}&quot;</div>
            )}
            {filters.createdAfter && (
              <div>• Tạo từ: {filters.createdAfter.toLocaleDateString('vi-VN')}</div>
            )}
            {filters.createdBefore && (
              <div>• Tạo đến: {filters.createdBefore.toLocaleDateString('vi-VN')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
