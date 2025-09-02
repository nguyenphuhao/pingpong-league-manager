/**
 * Firebase Firestore Seeding Script
 * 
 * This script creates initial data for the user management system.
 * Run this once to populate your Firestore database with default data.
 */

import { 
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserRole } from '@/types';

// Default user groups
const defaultUserGroups = [
  {
    id: 'admin-group',
    name: 'Quản trị viên',
    description: 'Toàn quyền quản lý hệ thống ping pong',
    roles: ['admin'] as UserRole[],
    color: '#ef4444',
    isDefault: true,
    memberCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'organizer-group',
    name: 'Ban tổ chức',
    description: 'Tổ chức và quản lý các giải đấu ping pong',
    roles: ['organizer', 'member'] as UserRole[],
    color: '#8b5cf6',
    isDefault: false,
    memberCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'referee-group',
    name: 'Trọng tài',
    description: 'Điều hành và phân xử các trận đấu',
    roles: ['referee', 'member'] as UserRole[],
    color: '#3b82f6',
    isDefault: false,
    memberCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'treasurer-group',
    name: 'Thủ quỹ',
    description: 'Quản lý tài chính và phí tham gia',
    roles: ['treasurer', 'member'] as UserRole[],
    color: '#22c55e',
    isDefault: false,
    memberCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'captain-group',
    name: 'Đội trưởng',
    description: 'Lãnh đạo và điều phối đội thi đấu',
    roles: ['captain', 'player', 'member'] as UserRole[],
    color: '#f97316',
    isDefault: false,
    memberCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'player-group',
    name: 'Người chơi',
    description: 'Tham gia thi đấu ping pong',
    roles: ['player', 'member'] as UserRole[],
    color: '#6366f1',
    isDefault: false,
    memberCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'member-group',
    name: 'Thành viên',
    description: 'Thành viên cơ bản của hệ thống',
    roles: ['member'] as UserRole[],
    color: '#64748b',
    isDefault: true,
    memberCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'viewer-group',
    name: 'Khách',
    description: 'Chỉ được xem thông tin công khai',
    roles: ['viewer'] as UserRole[],
    color: '#94a3b8',
    isDefault: false,
    memberCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  }
];

// Default admin user
const defaultAdminUser = {
  id: 'admin-user-001',
  phoneNumber: '+84333141692',
  displayName: 'Quản trị viên hệ thống',
  birthYear: 1985,
  club: 'Admin Club',
  roles: ['admin'] as UserRole[],
  grade: 'A' as const,
  ratingPoints: 1000,
  fcmTokens: [],
  isActive: true,
  lastLoginAt: null, // Will be updated on first login
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  createdBy: 'system'
};

// Sample demo users
const demoUsers = [
  {
    id: 'demo-user-001',
    phoneNumber: '+84912345678',
    displayName: 'Nguyễn Văn An (Demo)',
    birthYear: 1990,
    club: 'Club Bình Thạnh',
    roles: ['organizer', 'member'] as UserRole[],
    grade: 'B' as const,
    ratingPoints: 850,
    fcmTokens: [],
    isActive: true,
    lastLoginAt: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'demo-user-002',
    phoneNumber: '+84987654321',
    displayName: 'Trần Thị Bình (Demo)',
    birthYear: 1988,
    club: 'Club Quận 1',
    roles: ['referee', 'member'] as UserRole[],
    grade: 'B' as const,
    ratingPoints: 720,
    fcmTokens: [],
    isActive: true,
    lastLoginAt: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'demo-user-003',
    phoneNumber: '+84555123456',
    displayName: 'Lê Văn Cường (Demo)',
    birthYear: 1992,
    club: 'Club Thủ Đức',
    roles: ['treasurer', 'member'] as UserRole[],
    grade: 'C' as const,
    ratingPoints: 650,
    fcmTokens: [],
    isActive: true,
    lastLoginAt: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'demo-user-004',
    phoneNumber: '+84333888999',
    displayName: 'Phạm Minh Đức (Demo)',
    birthYear: 1995,
    club: 'Club Gò Vấp',
    roles: ['captain', 'player', 'member'] as UserRole[],
    grade: 'A' as const,
    ratingPoints: 920,
    fcmTokens: [],
    isActive: true,
    lastLoginAt: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    id: 'demo-user-005',
    phoneNumber: '+84777555333',
    displayName: 'Hoàng Thị Nga (Demo)',
    birthYear: 1993,
    club: 'Club Tân Bình',
    roles: ['player', 'member'] as UserRole[],
    grade: 'B' as const,
    ratingPoints: 780,
    fcmTokens: [],
    isActive: false, // Inactive user for demo
    lastLoginAt: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system'
  }
];

/**
 * Seed user groups to Firestore
 */
export async function seedUserGroups(): Promise<void> {
  console.log('🌱 Seeding user groups...');
  
  try {
    for (const group of defaultUserGroups) {
      const { id, ...groupData } = group;
      await setDoc(doc(db, 'user_groups', id), groupData);
      console.log(`✅ Created user group: ${group.name}`);
    }
    
    console.log(`🎉 Successfully seeded ${defaultUserGroups.length} user groups`);
  } catch (error) {
    console.error('❌ Error seeding user groups:', error);
    throw error;
  }
}

/**
 * Seed users to Firestore
 */
export async function seedUsers(): Promise<void> {
  console.log('🌱 Seeding users...');
  
  try {
    // Create admin user
    const { id: adminId, ...adminData } = defaultAdminUser;
    await setDoc(doc(db, 'users', adminId), adminData);
    console.log(`✅ Created admin user: ${defaultAdminUser.displayName}`);
    
    // Create demo users
    for (const user of demoUsers) {
      const { id, ...userData } = user;
      await setDoc(doc(db, 'users', id), userData);
      console.log(`✅ Created demo user: ${user.displayName}`);
    }
    
    console.log(`🎉 Successfully seeded ${1 + demoUsers.length} users`);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

/**
 * Update group member counts based on seeded users
 */
export async function updateGroupMemberCounts(): Promise<void> {
  console.log('🔄 Updating group member counts...');
  
  try {
    const allUsers = [defaultAdminUser, ...demoUsers];
    const roleCounts: Record<string, number> = {};
    
    // Count users per role
    allUsers.forEach(user => {
      if (user.isActive) {
        user.roles.forEach(role => {
          roleCounts[role] = (roleCounts[role] || 0) + 1;
        });
      }
    });
    
    // Update group member counts
    for (const group of defaultUserGroups) {
      let memberCount = 0;
      group.roles.forEach(role => {
        memberCount += roleCounts[role] || 0;
      });
      
      await setDoc(doc(db, 'user_groups', group.id), {
        ...group,
        memberCount,
        updatedAt: Timestamp.now()
      });
      
      console.log(`✅ Updated ${group.name}: ${memberCount} members`);
    }
    
    console.log('🎉 Successfully updated group member counts');
  } catch (error) {
    console.error('❌ Error updating group member counts:', error);
    throw error;
  }
}

/**
 * Main seeding function - run this to populate your database
 */
export async function seedDatabase(): Promise<void> {
  console.log('🚀 Starting database seeding...');
  
  try {
    await seedUserGroups();
    await seedUsers();
    await updateGroupMemberCounts();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   • ${defaultUserGroups.length} user groups created`);
    console.log(`   • ${1 + demoUsers.length} users created`);
    console.log(`   • Admin user: ${defaultAdminUser.phoneNumber}`);
    console.log('');
    console.log('🔐 Admin Login:');
    console.log('   Phone: 0333141692');
    console.log('   Use this number to login as admin');
    console.log('');
    console.log('👥 Demo Users:');
    demoUsers.forEach(user => {
      console.log(`   • ${user.displayName}: ${user.phoneNumber.replace('+84', '0')}`);
    });
    console.log('');
    console.log('🔄 Authentication Flow:');
    console.log('   1. Users login with phone + OTP');
    console.log('   2. System checks Firestore for user data');
    console.log('   3. If user exists and active → Login success');
    console.log('   4. If user inactive → Access denied');
    console.log('   5. If user not found → Auto-create member profile');
    console.log('');
    console.log('✨ Key Features:');
    console.log('   🚀 Quick Registration: New users can login with just phone + OTP');
    console.log('   👑 Admin-created users can login immediately');
    console.log('   🔒 Inactive user protection built-in');
    console.log('   📊 Automatic profile creation with sensible defaults');
    console.log('');
    console.log('💡 How to test Registration Flow:');
    console.log('   1. Go to /login with a new phone number (e.g., 0999111222)');
    console.log('   2. Complete OTP verification');
    console.log('   3. 📝 Registration form appears - enter your name');
    console.log('   4. Click "Hoàn tất đăng ký" to complete');
    console.log('   5. User gets member role and dashboard access');
    console.log('   6. Check /admin/users to see the user with real name');
    
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
    throw error;
  }
}

/**
 * Clean database (for development only)
 * WARNING: This will delete all user and group data!
 */
export async function cleanDatabase(): Promise<void> {
  console.warn('⚠️  WARNING: This will delete all user and group data!');
  console.log('🧹 Cleaning database...');
  
  try {
    // Delete all users
    const allUsers = [defaultAdminUser, ...demoUsers];
    for (const user of allUsers) {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, { deleted: true, deletedAt: Timestamp.now() });
    }
    
    // Delete all groups
    for (const group of defaultUserGroups) {
      const groupRef = doc(db, 'user_groups', group.id);
      await setDoc(groupRef, { deleted: true, deletedAt: Timestamp.now() });
    }
    
    console.log('🗑️ Database cleaned (soft delete)');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    throw error;
  }
}
