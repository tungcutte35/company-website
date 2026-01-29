import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'ok',
      database: 'connected',
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
      prisma: 'initialized'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({ 
      status: 'error',
      database: 'disconnected',
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
