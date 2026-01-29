import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/careers - Get all job openings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const location = searchParams.get('location');
    const level = searchParams.get('level');
    const type = searchParams.get('type');
    const activeOnly = searchParams.get('active') !== 'false';

    // Build where clause
    const where: any = {};

    if (activeOnly) {
      where.active = true;
    }

    if (department) {
      where.department = { equals: department, mode: 'insensitive' };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (level) {
      where.level = { contains: level, mode: 'insensitive' };
    }

    if (type) {
      where.type = { equals: type, mode: 'insensitive' };
    }

    // Get filtered jobs
    const jobs = await prisma.career.findMany({
      where,
      orderBy: { posted: 'desc' }
    });

    // Get unique values for filters
    const allJobs = await prisma.career.findMany({
      select: {
        department: true,
        location: true,
        level: true,
        type: true
      }
    });

    const departments = [...new Set(allJobs.map(job => job.department))];
    const locations = [...new Set(allJobs.map(job => job.location))];
    const levels = [...new Set(allJobs.map(job => job.level))];
    const types = [...new Set(allJobs.map(job => job.type))];

    // Get total open jobs count
    const totalOpen = await prisma.career.count({
      where: { active: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        filters: {
          departments,
          locations,
          levels,
          types
        },
        total: jobs.length,
        totalOpen
      }
    });
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job openings' },
      { status: 500 }
    );
  }
}
