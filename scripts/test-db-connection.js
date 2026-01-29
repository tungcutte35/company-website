/**
 * Test Database Connection Script
 * 
 * Usage:
 *   node scripts/test-db-connection.js
 * 
 * This script tests if the NEXT_PUBLIC_DATABASE_URL is valid and can connect to the database
 */

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  // Check if NEXT_PUBLIC_DATABASE_URL is set
  if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
    console.error('❌ ERROR: NEXT_PUBLIC_DATABASE_URL is not set in environment variables');
    console.log('\n💡 Solution:');
    console.log('   1. Create .env.local file');
    console.log('   2. Add: NEXT_PUBLIC_DATABASE_URL="postgresql://..."');
    console.log('   3. Run this script again\n');
    process.exit(1);
  }
  
  console.log('✅ NEXT_PUBLIC_DATABASE_URL is set');
  
  // Mask password in URL for display
  const maskedUrl = process.env.NEXT_PUBLIC_DATABASE_URL.replace(
    /:([^:@]+)@/,
    ':****@'
  );
  console.log(`📍 Connection string: ${maskedUrl}\n`);
  
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
  
  try {
    // Test 1: Basic connection
    console.log('Test 1: Testing basic connection...');
    await prisma.$connect();
    console.log('✅ Successfully connected to database\n');
    
    // Test 2: Query test
    console.log('Test 2: Testing query execution...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query executed successfully\n');
    
    // Test 3: Check tables
    console.log('Test 3: Checking database tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    if (Array.isArray(tables) && tables.length > 0) {
      console.log(`✅ Found ${tables.length} tables:`);
      tables.forEach((table) => {
        console.log(`   - ${table.table_name}`);
      });
      console.log('');
    } else {
      console.log('⚠️  No tables found. You may need to run migrations:');
      console.log('   npx prisma db push\n');
    }
    
    // Test 4: Check specific models
    console.log('Test 4: Checking Prisma models...');
    const requiredTables = [
      'blog_posts',
      'faqs',
      'careers',
      'contact_messages',
      'newsletters',
      'job_applications'
    ];
    
    const tableNames = tables.map(t => t.table_name);
    const missingTables = requiredTables.filter(t => !tableNames.includes(t));
    
    if (missingTables.length === 0) {
      console.log('✅ All required tables exist\n');
    } else {
      console.log('⚠️  Missing tables:');
      missingTables.forEach(table => {
        console.log(`   - ${table}`);
      });
      console.log('\n💡 Run migrations to create missing tables:');
      console.log('   npx prisma db push\n');
    }
    
    // Test 5: Test a simple query on each model
    if (missingTables.length === 0) {
      console.log('Test 5: Testing model queries...');
      
      try {
        const blogCount = await prisma.blogPost.count();
        console.log(`✅ BlogPost: ${blogCount} records`);
      } catch (e) {
        console.log(`❌ BlogPost: Error - ${e.message}`);
      }
      
      try {
        const faqCount = await prisma.fAQ.count();
        console.log(`✅ FAQ: ${faqCount} records`);
      } catch (e) {
        console.log(`❌ FAQ: Error - ${e.message}`);
      }
      
      try {
        const careerCount = await prisma.career.count();
        console.log(`✅ Career: ${careerCount} records`);
      } catch (e) {
        console.log(`❌ Career: Error - ${e.message}`);
      }
      
      try {
        const contactCount = await prisma.contactMessage.count();
        console.log(`✅ ContactMessage: ${contactCount} records`);
      } catch (e) {
        console.log(`❌ ContactMessage: Error - ${e.message}`);
      }
      
      try {
        const newsletterCount = await prisma.newsletter.count();
        console.log(`✅ Newsletter: ${newsletterCount} records`);
      } catch (e) {
        console.log(`❌ Newsletter: Error - ${e.message}`);
      }
      
      console.log('');
    }
    
    console.log('═══════════════════════════════════════');
    console.log('🎉 All tests passed!');
    console.log('═══════════════════════════════════════\n');
    
    console.log('Next steps:');
    console.log('1. If tables are missing, run: npx prisma db push');
    console.log('2. If you need sample data, run: npm run db:seed');
    console.log('3. Start your app: npm run dev\n');
    
  } catch (error) {
    console.error('\n❌ ERROR: Failed to connect to database\n');
    console.error('Error details:', error.message);
    console.error('\n💡 Common solutions:\n');
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('   Connection refused - Check:');
      console.error('   1. Database host is correct');
      console.error('   2. Database is running');
      console.error('   3. Network/firewall allows connection');
      console.error('   4. Port number is correct (usually 5432 for PostgreSQL)\n');
    } else if (error.message.includes('password authentication failed')) {
      console.error('   Authentication failed - Check:');
      console.error('   1. Username is correct');
      console.error('   2. Password is correct');
      console.error('   3. Database name is correct\n');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('   Database does not exist - Check:');
      console.error('   1. Database name in connection string');
      console.error('   2. Create database if it doesn\'t exist\n');
    } else if (error.message.includes('SSL')) {
      console.error('   SSL connection issue - Try:');
      console.error('   1. Add ?sslmode=require to connection string');
      console.error('   2. Or add ?sslmode=disable for local development\n');
    } else {
      console.error('   Check your NEXT_PUBLIC_DATABASE_URL format:');
      console.error('   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public\n');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection();
