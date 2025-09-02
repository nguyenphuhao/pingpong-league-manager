#!/usr/bin/env tsx

/**
 * Database Seeding Script
 * 
 * Run this script to populate your Firestore database with initial data.
 * 
 * Usage:
 *   npx tsx src/scripts/seed-database.ts
 * 
 * Or add to package.json scripts:
 *   "seed": "tsx src/scripts/seed-database.ts"
 */

import { seedDatabase, cleanDatabase } from '../services/firebase-seed';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'clean':
        console.log('🧹 Cleaning database...');
        await cleanDatabase();
        break;
        
      case 'seed':
      default:
        console.log('🌱 Seeding database...');
        await seedDatabase();
        break;
    }
    
    console.log('✅ Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🌱 Database Seeding Script

Usage:
  npx tsx src/scripts/seed-database.ts [command]

Commands:
  seed      Seed the database with initial data (default)
  clean     Clean the database (development only)

Examples:
  npx tsx src/scripts/seed-database.ts seed
  npx tsx src/scripts/seed-database.ts clean

Environment:
  Make sure your Firebase configuration is properly set up
  in src/lib/firebase.ts before running this script.
`);
  process.exit(0);
}

main();
