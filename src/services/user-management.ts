import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryDocumentSnapshot,
  Timestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  ManagedUser, 
  UserGroup, 
  UserFormData, 
  GroupFormData,
  UserListParams,
  PaginatedResponse
} from '@/types';

// Collection references
const USERS_COLLECTION = 'users';
const USER_GROUPS_COLLECTION = 'user_groups';

// Convert Firestore Timestamp to Date
const timestampToDate = (timestamp: unknown): Date => {
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date(timestamp as string | number | Date);
};

// Convert User document to ManagedUser
const docToManagedUser = (doc: QueryDocumentSnapshot, currentUserId?: string): ManagedUser => {
  const data = doc.data();
  const user: ManagedUser = {
    id: doc.id,
    phoneNumber: data.phoneNumber,
    displayName: data.displayName,
    birthYear: data.birthYear,
    club: data.club,
    roles: data.roles || ['member'],
    ratingPoints: data.ratingPoints || 0,
    grade: data.grade || 'C',
    fcmTokens: data.fcmTokens || [],
    isActive: data.isActive !== false, // Default to true if not specified
    lastLoginAt: data.lastLoginAt ? timestampToDate(data.lastLoginAt) : undefined,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    createdBy: data.createdBy,
    // Add protection flags
    canDelete: doc.id !== currentUserId,
    canDeactivate: doc.id !== currentUserId || !data.roles?.includes('admin')
  };
  return user;
};

// Convert UserGroup document
const docToUserGroup = (doc: QueryDocumentSnapshot): UserGroup => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    roles: data.roles || [],
    color: data.color,
    isDefault: data.isDefault || false,
    memberCount: data.memberCount || 0,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    createdBy: data.createdBy
  };
};

/**
 * User Management Functions
 */

// Get paginated users with filtering and sorting
export async function getUsers(params: UserListParams = {}, currentUserId?: string): Promise<PaginatedResponse<ManagedUser>> {
  try {
    const {
      page = 1,
      limit: pageLimit = 50,
      filter = {},
      sortBy = 'displayName',
      sortDirection = 'asc'
    } = params;

    // Build base query
    const baseQuery = collection(db, USERS_COLLECTION);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryConstraints: any[] = [];

    // Apply filters
    if (filter.roles && filter.roles.length > 0) {
      queryConstraints.push(where('roles', 'array-contains-any', filter.roles));
    }

    if (filter.grade && filter.grade.length > 0) {
      queryConstraints.push(where('grade', 'in', filter.grade));
    }

    if (filter.isActive !== undefined) {
      queryConstraints.push(where('isActive', '==', filter.isActive));
    }

    if (filter.club) {
      queryConstraints.push(where('club', '>=', filter.club));
      queryConstraints.push(where('club', '<=', filter.club + '\uf8ff'));
    }

    if (filter.createdAfter) {
      queryConstraints.push(where('createdAt', '>=', Timestamp.fromDate(filter.createdAfter)));
    }

    if (filter.createdBefore) {
      queryConstraints.push(where('createdAt', '<=', Timestamp.fromDate(filter.createdBefore)));
    }

    // Add sorting
    queryConstraints.push(orderBy(sortBy, sortDirection));

    // Add pagination
    queryConstraints.push(limit(pageLimit));

    const q = query(baseQuery, ...queryConstraints);
    const snapshot = await getDocs(q);

    const users = snapshot.docs.map(doc => docToManagedUser(doc, currentUserId));

    // Apply client-side search filter (Firestore doesn't support full-text search)
    let filteredUsers = users;
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredUsers = users.filter(user => 
        user.displayName.toLowerCase().includes(searchTerm) ||
        user.phoneNumber.includes(searchTerm) ||
        user.club?.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate pagination info
    const total = filteredUsers.length; // In production, you'd get this from a separate count query
    const totalPages = Math.ceil(total / pageLimit);

    return {
      data: filteredUsers,
      pagination: {
        page,
        limit: pageLimit,
        total,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error getting users:', error);
    throw new Error('Failed to fetch users');
  }
}

// Get user by ID
export async function getUserById(userId: string, currentUserId?: string): Promise<ManagedUser | null> {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (!userDoc.exists()) {
      return null;
    }
    return docToManagedUser(userDoc as QueryDocumentSnapshot, currentUserId);
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Failed to fetch user');
  }
}

// Create new user
export async function createUser(userData: UserFormData, createdBy: string): Promise<string> {
  try {
    const now = Timestamp.now();
    const userDoc = {
      phoneNumber: userData.phoneNumber,
      displayName: userData.displayName.trim(),
      birthYear: userData.birthYear,
      club: userData.club?.trim() || null,
      roles: userData.roles,
      grade: userData.grade,
      ratingPoints: 0, // Default rating
      fcmTokens: [],
      isActive: userData.isActive,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
      createdBy
    };

    const docRef = await addDoc(collection(db, USERS_COLLECTION), userDoc);
    
    // Update member counts for affected groups
    await updateGroupMemberCounts(userData.roles, 'increment');
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

// Update user
export async function updateUser(userId: string, userData: UserFormData, updatedBy: string): Promise<void> {
  try {
    const now = Timestamp.now();
    
    // Get current user data to compare roles
    const currentUserDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (!currentUserDoc.exists()) {
      throw new Error('User not found');
    }
    
    const currentData = currentUserDoc.data();
    const oldRoles: string[] = currentData.roles || [];
    
    const updateData = {
      phoneNumber: userData.phoneNumber,
      displayName: userData.displayName.trim(),
      birthYear: userData.birthYear,
      club: userData.club?.trim() || null,
      roles: userData.roles,
      grade: userData.grade,
      isActive: userData.isActive,
      updatedAt: now,
      updatedBy: updatedBy
    };

    await updateDoc(doc(db, USERS_COLLECTION, userId), updateData);
    
    // Update member counts for role changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removedRoles = oldRoles.filter(role => !userData.roles.includes(role as any));
    const addedRoles = userData.roles.filter(role => !oldRoles.includes(role));
    
    if (removedRoles.length > 0) {
      await updateGroupMemberCounts(removedRoles, 'decrement');
    }
    if (addedRoles.length > 0) {
      await updateGroupMemberCounts(addedRoles, 'increment');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

// Delete user
export async function deleteUser(userId: string, currentUserId: string): Promise<void> {
  try {
    if (userId === currentUserId) {
      throw new Error('Cannot delete your own account');
    }

    // Get user data to update member counts
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    const userRoles = userData.roles || [];

    await deleteDoc(doc(db, USERS_COLLECTION, userId));
    
    // Update member counts for removed roles
    if (userRoles.length > 0) {
      await updateGroupMemberCounts(userRoles, 'decrement');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

// Activate/Deactivate user
export async function toggleUserStatus(userId: string, isActive: boolean, currentUserId: string): Promise<void> {
  try {
    if (userId === currentUserId && !isActive) {
      throw new Error('Cannot deactivate your own account');
    }

    await updateDoc(doc(db, USERS_COLLECTION, userId), {
      isActive,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw new Error('Failed to update user status');
  }
}

/**
 * User Group Management Functions
 */

// Get all user groups
export async function getUserGroups(): Promise<UserGroup[]> {
  try {
    const q = query(collection(db, USER_GROUPS_COLLECTION), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => docToUserGroup(doc));
  } catch (error) {
    console.error('Error getting user groups:', error);
    throw new Error('Failed to fetch user groups');
  }
}

// Create user group
export async function createUserGroup(groupData: GroupFormData, createdBy: string): Promise<string> {
  try {
    const now = Timestamp.now();
    const groupDoc = {
      name: groupData.name.trim(),
      description: groupData.description.trim(),
      roles: groupData.roles,
      color: groupData.color,
      isDefault: false,
      memberCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy
    };

    const docRef = await addDoc(collection(db, USER_GROUPS_COLLECTION), groupDoc);
    return docRef.id;
  } catch (error) {
    console.error('Error creating user group:', error);
    throw new Error('Failed to create user group');
  }
}

// Update user group
export async function updateUserGroup(groupId: string, groupData: GroupFormData): Promise<void> {
  try {
    const updateData = {
      name: groupData.name.trim(),
      description: groupData.description.trim(),
      roles: groupData.roles,
      color: groupData.color,
      updatedAt: Timestamp.now()
    };

    await updateDoc(doc(db, USER_GROUPS_COLLECTION, groupId), updateData);
  } catch (error) {
    console.error('Error updating user group:', error);
    throw new Error('Failed to update user group');
  }
}

// Delete user group
export async function deleteUserGroup(groupId: string): Promise<void> {
  try {
    // Check if group is default
    const groupDoc = await getDoc(doc(db, USER_GROUPS_COLLECTION, groupId));
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }
    
    const groupData = groupDoc.data();
    if (groupData.isDefault) {
      throw new Error('Cannot delete default group');
    }

    await deleteDoc(doc(db, USER_GROUPS_COLLECTION, groupId));
  } catch (error) {
    console.error('Error deleting user group:', error);
    throw new Error('Failed to delete user group');
  }
}

/**
 * Helper Functions
 */

// Update member counts for groups based on roles
async function updateGroupMemberCounts(roles: string[], operation: 'increment' | 'decrement'): Promise<void> {
  try {
    const batch = writeBatch(db);
    
    // This is a simplified approach - in a real app, you might want to 
    // maintain a separate mapping or use cloud functions for this
    for (const role of roles) {
      // Find groups that contain this role
      const groupsQuery = query(
        collection(db, USER_GROUPS_COLLECTION),
        where('roles', 'array-contains', role)
      );
      
      const groupsSnapshot = await getDocs(groupsQuery);
      
      groupsSnapshot.docs.forEach(groupDoc => {
        const incrementValue = operation === 'increment' ? 1 : -1;
        batch.update(groupDoc.ref, {
          memberCount: increment(incrementValue),
          updatedAt: Timestamp.now()
        });
      });
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error updating group member counts:', error);
    // Don't throw here as this is a secondary operation
  }
}

// Get user statistics
export async function getUserStatistics(): Promise<{
  total: number;
  active: number;
  inactive: number;
  admins: number;
}> {
  try {
    // In production, you might want to cache these or use aggregation queries
    const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users = usersSnapshot.docs.map(doc => doc.data());
    
    const stats = {
      total: users.length,
      active: users.filter(user => user.isActive !== false).length,
      inactive: users.filter(user => user.isActive === false).length,
      admins: users.filter(user => user.roles?.includes('admin')).length
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting user statistics:', error);
    throw new Error('Failed to fetch user statistics');
  }
}

// Check if phone number already exists
export async function checkPhoneNumberExists(phoneNumber: string, excludeUserId?: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('phoneNumber', '==', phoneNumber)
    );
    
    const snapshot = await getDocs(q);
    
    if (excludeUserId) {
      // When updating, exclude the current user's ID
      return snapshot.docs.some(doc => doc.id !== excludeUserId);
    }
    
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking phone number:', error);
    throw new Error('Failed to check phone number');
  }
}
