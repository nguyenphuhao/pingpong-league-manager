'use client';

import { useState } from 'react';
import { X, Save, Shield, Users, Plus, Edit3, Trash2, Palette } from 'lucide-react';
import { ActionButton } from '@/components/common/action-button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { UserGroup, GroupFormData, UserRole } from '@/types';

interface UserGroupModalProps {
  onClose: () => void;
  onSave: (groupData: GroupFormData) => void;
}

// Mock data for existing groups
const mockGroups: UserGroup[] = [
  {
    id: '1',
    name: 'Quản trị viên',
    description: 'Toàn quyền quản lý hệ thống',
    roles: ['admin'],
    color: '#ef4444',
    isDefault: true,
    memberCount: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '2',
    name: 'Ban tổ chức',
    description: 'Tổ chức và quản lý giải đấu',
    roles: ['organizer', 'member'],
    color: '#8b5cf6',
    isDefault: false,
    memberCount: 3,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    createdBy: 'admin'
  },
  {
    id: '3',
    name: 'Trọng tài',
    description: 'Điều hành các trận đấu',
    roles: ['referee', 'member'],
    color: '#3b82f6',
    isDefault: false,
    memberCount: 5,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(),
    createdBy: 'admin'
  }
];

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

const colorOptions = [
  { value: '#ef4444', label: 'Đỏ', class: 'bg-red-500' },
  { value: '#f97316', label: 'Cam', class: 'bg-orange-500' },
  { value: '#eab308', label: 'Vàng', class: 'bg-yellow-500' },
  { value: '#22c55e', label: 'Xanh lá', class: 'bg-green-500' },
  { value: '#3b82f6', label: 'Xanh dương', class: 'bg-blue-500' },
  { value: '#8b5cf6', label: 'Tím', class: 'bg-purple-500' },
  { value: '#ec4899', label: 'Hồng', class: 'bg-pink-500' },
  { value: '#64748b', label: 'Xám', class: 'bg-slate-500' }
];

export function UserGroupModal({ onClose }: Pick<UserGroupModalProps, 'onClose'>) {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [groups, setGroups] = useState<UserGroup[]>(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    roles: [],
    color: colorOptions[0].value
  });
  
  // Confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete';
    group: UserGroup;
  } | null>(null);

  const [errors, setErrors] = useState<{ [K in keyof GroupFormData]?: string }>({});

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      roles: [],
      color: colorOptions[0].value
    });
    setErrors({});
  };

  const handleCreateNew = () => {
    resetForm();
    setView('create');
  };

  const handleEdit = (group: UserGroup) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      roles: [...group.roles],
      color: group.color || colorOptions[0].value
    });
    setView('edit');
  };

  const handleDelete = (group: UserGroup) => {
    if (group.isDefault) return;
    setConfirmAction({ type: 'delete', group });
    setShowConfirmDialog(true);
  };

  const executeDelete = () => {
    if (!confirmAction) return;
    
    setLoading(true);
    setTimeout(() => {
      setGroups(prev => prev.filter(g => g.id !== confirmAction.group.id));
      setLoading(false);
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }, 1000);
  };

  const validateForm = (): boolean => {
    const newErrors: { [K in keyof GroupFormData]?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên nhóm là bắt buộc';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên nhóm phải có ít nhất 2 ký tự';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (formData.roles.length === 0) {
      newErrors.roles = 'Phải chọn ít nhất một vai trò';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      if (view === 'create') {
        const newGroup: UserGroup = {
          id: Date.now().toString(),
          ...formData,
          isDefault: false,
          memberCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'admin'
        };
        setGroups(prev => [...prev, newGroup]);
      } else if (view === 'edit' && selectedGroup) {
        setGroups(prev => prev.map(g => 
          g.id === selectedGroup.id 
            ? { ...g, ...formData, updatedAt: new Date() }
            : g
        ));
      }
      
      setLoading(false);
      setView('list');
      resetForm();
    }, 1000);
  };

  const handleRoleToggle = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const renderGroupList = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-slate-900">Quản lý nhóm quyền</h3>
          <p className="text-sm text-slate-600 mt-1">
            Tạo và quản lý các nhóm quyền cho người dùng
          </p>
        </div>
        <ActionButton
          onClick={handleCreateNew}
          icon={<Plus />}
          size="sm"
        >
          Tạo nhóm mới
        </ActionButton>
      </div>

      {/* Groups List */}
      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <h4 className="font-medium text-slate-900">{group.name}</h4>
                  {group.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Mặc định
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 mb-3">{group.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {group.memberCount} thành viên
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {group.roles.length} vai trò
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {group.roles.map((role) => {
                    const roleInfo = roleOptions.find(r => r.value === role);
                    return (
                      <Badge key={role} variant="outline" className="text-xs">
                        {roleInfo?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(group)}
                  className="p-2 hover:bg-slate-100 rounded transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit3 className="w-4 h-4 text-slate-600" />
                </button>
                {!group.isDefault && (
                  <button
                    onClick={() => handleDelete(group)}
                    className="p-2 hover:bg-red-50 rounded transition-colors"
                    title="Xóa nhóm"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          Chưa có nhóm quyền nào
        </div>
      )}
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setView('list')}
          className="p-2 hover:bg-slate-100 rounded transition-colors"
        >
          ←
        </button>
        <h3 className="text-lg font-medium text-slate-900">
          {view === 'create' ? 'Tạo nhóm quyền mới' : 'Chỉnh sửa nhóm quyền'}
        </h3>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tên nhóm *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="VD: Ban tổ chức tournament"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.name ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mô tả *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Mô tả vai trò và trách nhiệm của nhóm này..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.description ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Palette className="w-4 h-4 inline mr-1" />
            Màu nhóm
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                className={`p-3 border-2 rounded-lg transition-all ${
                  formData.color === color.value
                    ? 'border-slate-900'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${color.class}`} />
                  <span className="text-sm">{color.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roles Selection */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Vai trò và quyền hạn *
          </h4>
          <p className="text-sm text-slate-600 mb-3">
            Chọn các vai trò mà thành viên nhóm này sẽ có
          </p>
        </div>

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
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
        <ActionButton
          variant="outline"
          onClick={() => setView('list')}
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
          {view === 'create' ? 'Tạo nhóm' : 'Cập nhật'}
        </ActionButton>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold text-slate-900">
              Quản lý nhóm quyền
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {view === 'list' ? renderGroupList() : renderForm()}
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && confirmAction && (
        <ConfirmDialog
          title="Xác nhận xóa nhóm quyền"
          message={`Bạn có chắc muốn xóa nhóm "${confirmAction.group.name}"? Hành động này không thể hoàn tác.`}
          confirmText="Xóa"
          confirmVariant="danger"
          loading={loading}
          onConfirm={executeDelete}
          onCancel={() => {
            setShowConfirmDialog(false);
            setConfirmAction(null);
          }}
        />
      )}
    </div>
  );
}
