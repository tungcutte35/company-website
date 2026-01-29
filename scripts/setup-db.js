const { execSync } = require('child_process');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

console.log('🔧 Setting up database...');
console.log('NEXT_PUBLIC_DATABASE_URL:', process.env.NEXT_PUBLIC_DATABASE_URL ? 'Found' : 'Not found');

try {
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('🗄️ Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('🌱 Seeding database...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
  
  console.log('✅ Database setup completed!');
} catch (error) {
  console.error('❌ Error setting up database:', error.message);
  process.exit(1);
}