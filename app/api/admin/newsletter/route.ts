import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Middleware to check admin auth
function checkAdminAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  return token === 'techera-admin-session-token-2024';
}

// GET /api/admin/newsletter - Get all subscribers with full details
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status'); // 'active' | 'inactive' | 'all'
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};

    if (status === 'active') {
      where.active = true;
    } else if (status === 'inactive') {
      where.active = false;
    }

    if (search) {
      where.email = { contains: search, mode: 'insensitive' };
    }

    // Get total count
    const total = await prisma.newsletter.count({ where });

    // Get subscribers with pagination
    const subscribers = await prisma.newsletter.findMany({
      where,
      orderBy: { subscribedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Get stats
    const totalSubscribers = await prisma.newsletter.count();
    const activeSubscribers = await prisma.newsletter.count({ where: { active: true } });
    const inactiveSubscribers = await prisma.newsletter.count({ where: { active: false } });

    return NextResponse.json({
      success: true,
      data: {
        subscribers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        stats: {
          total: totalSubscribers,
          active: activeSubscribers,
          inactive: inactiveSubscribers
        }
      }
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// POST /api/admin/newsletter - Add new subscriber (admin can add manually)
export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.newsletter.findUnique({
      where: { email: normalizedEmail }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email đã tồn tại' },
        { status: 400 }
      );
    }

    await prisma.newsletter.create({
      data: {
        email: normalizedEmail,
        active: true,
        subscribedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã thêm subscriber thành công'
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add subscriber' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/newsletter - Update subscriber status
export async function PUT(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, active } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email là bắt buộc' },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy subscriber' },
        { status: 404 }
      );
    }

    const updatedSubscriber = await prisma.newsletter.update({
      where: { email: email.toLowerCase() },
      data: { active: typeof active === 'boolean' ? active : subscriber.active }
    });

    return NextResponse.json({
      success: true,
      message: active ? 'Đã kích hoạt subscriber' : 'Đã vô hiệu hóa subscriber',
      data: updatedSubscriber
    });
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/newsletter - Delete subscriber permanently
export async function DELETE(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email là bắt buộc' },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy subscriber' },
        { status: 404 }
      );
    }

    await prisma.newsletter.delete({
      where: { email: email.toLowerCase() }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa subscriber thành công'
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}
