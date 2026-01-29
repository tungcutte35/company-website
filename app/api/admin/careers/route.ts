import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Middleware to check admin auth
function checkAdminAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  return token === 'techera-admin-session-token-2024';
}

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET /api/admin/careers - Get all jobs with admin details
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status'); // 'active' | 'inactive' | 'all'
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};

    if (department) {
      where.department = department;
    }

    if (status === 'active') {
      where.active = true;
    } else if (status === 'inactive') {
      where.active = false;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get jobs
    const jobs = await prisma.career.findMany({
      where,
      orderBy: { posted: 'desc' }
    });

    // Get departments
    const departments = await prisma.career.findMany({
      select: { department: true },
      distinct: ['department']
    });

    // Get stats
    const totalJobs = await prisma.career.count();
    const activeJobs = await prisma.career.count({ where: { active: true } });
    const inactiveJobs = await prisma.career.count({ where: { active: false } });

    const departmentStats = await Promise.all(
      departments.map(async (dept) => ({
        name: dept.department,
        count: await prisma.career.count({ where: { department: dept.department } })
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        departments: departments.map(d => d.department),
        stats: {
          total: totalJobs,
          active: activeJobs,
          inactive: inactiveJobs,
          byDepartment: departmentStats
        }
      }
    });
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch careers' },
      { status: 500 }
    );
  }
}

// POST /api/admin/careers - Create new job
export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      title, department, location, type, level, salary, 
      description, responsibilities, requirements, benefits, deadline 
    } = body;

    if (!title || !department || !description) {
      return NextResponse.json(
        { success: false, error: 'Title, department và description là bắt buộc' },
        { status: 400 }
      );
    }

    const newJob = await prisma.career.create({
      data: {
        slug: generateSlug(title),
        title: title.trim(),
        department: department.trim(),
        location: location?.trim() || 'Hà Nội',
        type: type || 'Full-time',
        level: level || 'Middle',
        salary: salary || 'Thỏa thuận',
        description: description.trim(),
        responsibilities: responsibilities || [],
        requirements: requirements || [],
        benefits: benefits || [],
        posted: new Date(),
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30*24*60*60*1000),
        active: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã tạo vị trí tuyển dụng thành công',
      data: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/careers - Update job
export async function PUT(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID là bắt buộc' },
        { status: 400 }
      );
    }

    const job = await prisma.career.findUnique({
      where: { id }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy vị trí' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = { ...updates };

    // Update slug if title changed
    if (updates.title) {
      updateData.slug = generateSlug(updates.title);
    }

    // Convert deadline to Date if provided
    if (updates.deadline) {
      updateData.deadline = new Date(updates.deadline);
    }

    // Ensure array fields are properly formatted
    // These fields should be arrays, not strings
    if (updateData.requirements !== undefined && !Array.isArray(updateData.requirements)) {
      updateData.requirements = updateData.requirements ? [updateData.requirements] : [];
    }
    if (updateData.responsibilities !== undefined && !Array.isArray(updateData.responsibilities)) {
      updateData.responsibilities = updateData.responsibilities ? [updateData.responsibilities] : [];
    }
    if (updateData.benefits !== undefined && !Array.isArray(updateData.benefits)) {
      updateData.benefits = updateData.benefits ? [updateData.benefits] : [];
    }

    const updatedJob = await prisma.career.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Đã cập nhật vị trí thành công',
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/careers - Delete job
export async function DELETE(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID là bắt buộc' },
        { status: 400 }
      );
    }

    const job = await prisma.career.findUnique({
      where: { id: parseInt(id) }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy vị trí' },
        { status: 404 }
      );
    }

    await prisma.career.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa vị trí thành công'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
