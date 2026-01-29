import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/careers/[slug] - Get single job by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const job = await prisma.career.findUnique({
      where: { slug }
    });
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Get related jobs (same department, exclude current)
    const relatedJobs = await prisma.career.findMany({
      where: {
        department: job.department,
        id: { not: job.id },
        active: true
      },
      take: 3,
      orderBy: { posted: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        job,
        relatedJobs
      }
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}
