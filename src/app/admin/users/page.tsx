'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  UserCheck, 
  UserX,
  Shield,
  AlertCircle,
  X,
  Download,
  MoreVertical
} from 'lucide-react';
import { ActionButton } from '@/components/common/action-button';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserModal } from '@/components/admin/user-modal';
import { UserFilters } from '@/components/admin/user-filters';
import { UserGroupModal } from '@/components/admin/user-group-modal';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { 
  ManagedUser, 
  UserRole, 
  UserFilter, 
  UserSortField, 
  SortDirection,
  UserFormData
} from '@/types';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStatistics
} from '@/services/user-management';



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

const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    admin: 'bg-red-100 text-red-800',
    organizer: 'bg-purple-100 text-purple-800',
    referee: 'bg-blue-100 text-blue-800',
    treasurer: 'bg-green-100 text-green-800',
    captain: 'bg-orange-100 text-orange-800',
    player: 'bg-indigo-100 text-indigo-800',
    member: 'bg-slate-100 text-slate-800',
    viewer: 'bg-gray-100 text-gray-800'
  };
  return colors[role];
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<UserFilter>({});
  const [sortBy, setSortBy] = useState<UserSortField>('displayName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'activate' | 'deactivate';
    user: ManagedUser;
  } | null>(null);

  // Load users from Firebase
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        filter: { ...filters, search: searchTerm },
        sortBy,
        sortDirection
      };
      
      const response = await getUsers(params, currentUser?.uid);
      setUsers(response.data);
      
      // Load statistics
      const stats = await getUserStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, sortBy, sortDirection, currentUser?.uid]);

  // Initial load
  useEffect(() => {
    if (currentUser) {
      loadUsers();
    }
  }, [currentUser, loadUsers]);

  // Reload when filters change
  useEffect(() => {
    if (currentUser && !loading) {
      const debounceTimer = setTimeout(() => {
        loadUsers();
      }, 300); // Debounce search
      
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, filters, sortBy, sortDirection, currentUser, loading, loadUsers]);

  // Since we're doing server-side filtering, just set filteredUsers to users
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: ManagedUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user: ManagedUser) => {
    if (!user.canDelete) return;
    setConfirmAction({ type: 'delete', user });
    setShowConfirmDialog(true);
  };

  const handleToggleUserStatus = (user: ManagedUser) => {
    if (!user.canDeactivate && user.isActive) return;
    setConfirmAction({ 
      type: user.isActive ? 'deactivate' : 'activate', 
      user 
    });
    setShowConfirmDialog(true);
  };

  const executeAction = async () => {
    if (!confirmAction || !currentUser) return;

    try {
      setLoading(true);
      
      switch (confirmAction.type) {
        case 'delete':
          await deleteUser(confirmAction.user.id, currentUser.uid);
          break;
        case 'activate':
          await toggleUserStatus(confirmAction.user.id, true, currentUser.uid);
          break;
        case 'deactivate':
          await toggleUserStatus(confirmAction.user.id, false, currentUser.uid);
          break;
      }

      // Reload users after action
      await loadUsers();
      
      setShowConfirmDialog(false);
      setConfirmAction(null);
    } catch (err) {
      console.error('Error executing action:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute action');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: UserSortField) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleSaveUser = async (userData: UserFormData) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      if (selectedUser) {
        // Update existing user
        await updateUser(selectedUser.id, userData, currentUser!.uid);
      } else {
        // Create new user
        await createUser(userData, currentUser.uid);
      }

      // Reload users after save
      await loadUsers();
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err instanceof Error ? err.message : 'Failed to save user');
      // Don't close modal on error so user can try again
    } finally {
      setLoading(false);
    }
  };

  const headerActions = (
    <div className="flex gap-2">
      <ActionButton
        variant="outline"
        onClick={() => setShowGroupModal(true)}
        icon={<Shield />}
        className="px-4"
      >
        Nhóm quyền
      </ActionButton>
      
      <ActionButton
        onClick={handleCreateUser}
        icon={<Plus />}
        className="px-4"
      >
        Thêm người dùng
      </ActionButton>
    </div>
  );

  return (
    <AdminLayout
      title="Quản lý người dùng"
      subtitle={`${statistics.total} người dùng (${statistics.active} đang hoạt động)`}
      actions={headerActions}
    >
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:bg-red-100 rounded"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Search and Filter Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, số điện thoại, club..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <ActionButton
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter />}
            className="px-4"
          >
            Lọc
          </ActionButton>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <UserFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClear={() => setFilters({})}
            />
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Tổng số</p>
                <p className="text-2xl font-bold text-slate-900">{statistics.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{statistics.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Bị khóa</p>
                <p className="text-2xl font-bold text-red-600">{statistics.inactive}</p>
              </div>
              <UserX className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Quản trị viên</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.admins}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh sách người dùng</CardTitle>
            <ActionButton
              variant="outline"
              size="sm"
              icon={<Download />}
            >
              Xuất Excel
            </ActionButton>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th 
                    className="text-left py-3 px-4 font-medium text-slate-700 cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort('displayName')}
                  >
                    Tên hiển thị
                    {sortBy === 'displayName' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-slate-700 cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort('phoneNumber')}
                  >
                    Số điện thoại
                    {sortBy === 'phoneNumber' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Vai trò</th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-slate-700 cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort('grade')}
                  >
                    Hạng
                    {sortBy === 'grade' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Club</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Trạng thái</th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-slate-700 cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort('lastLoginAt')}
                  >
                    Đăng nhập cuối
                    {sortBy === 'lastLoginAt' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{user.displayName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-mono text-sm">
                      {user.phoneNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <Badge 
                            key={role} 
                            className={`text-xs ${getRoleColor(role)}`}
                          >
                            {getRoleDisplayName(role)}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {user.grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {user.club || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        className={`text-xs ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-sm">
                      {user.lastLoginAt ? (
                        new Date(user.lastLoginAt).toLocaleDateString('vi-VN')
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <div className="relative group">
                          <button className="p-1 hover:bg-slate-200 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 hidden group-hover:block min-w-[150px]">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4" />
                              Chỉnh sửa
                            </button>
                            {user.canDeactivate && (
                              <button
                                onClick={() => handleToggleUserStatus(user)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                              >
                                {user.isActive ? (
                                  <>
                                    <UserX className="w-4 h-4" />
                                    Khóa tài khoản
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4" />
                                    Kích hoạt
                                  </>
                                )}
                              </button>
                            )}
                            {user.canDelete && (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 text-red-600 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 text-slate-500">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  Đang tải dữ liệu...
                </div>
              </div>
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                {error ? 'Có lỗi khi tải dữ liệu' : 'Không tìm thấy người dùng nào'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {showGroupModal && (
        <UserGroupModal
          onClose={() => setShowGroupModal(false)}
        />
      )}

      {showConfirmDialog && confirmAction && (
        <ConfirmDialog
          title={
            confirmAction.type === 'delete' 
              ? 'Xác nhận xóa người dùng'
              : confirmAction.type === 'activate'
              ? 'Xác nhận kích hoạt tài khoản'
              : 'Xác nhận khóa tài khoản'
          }
          message={
            confirmAction.type === 'delete'
              ? `Bạn có chắc muốn xóa người dùng "${confirmAction.user.displayName}"? Hành động này không thể hoàn tác.`
              : confirmAction.type === 'activate'
              ? `Bạn có chắc muốn kích hoạt tài khoản "${confirmAction.user.displayName}"?`
              : `Bạn có chắc muốn khóa tài khoản "${confirmAction.user.displayName}"?`
          }
          confirmText={
            confirmAction.type === 'delete' ? 'Xóa' : 
            confirmAction.type === 'activate' ? 'Kích hoạt' : 'Khóa'
          }
          confirmVariant={confirmAction.type === 'delete' ? 'danger' : 'primary'}
          loading={loading}
          onConfirm={executeAction}
          onCancel={() => {
            setShowConfirmDialog(false);
            setConfirmAction(null);
          }}
        />
      )}
    </AdminLayout>
  );
}
