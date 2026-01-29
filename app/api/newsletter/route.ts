import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingSubscriber) {
      if (existingSubscriber.active) {
        return NextResponse.json(
          { success: false, error: 'Email này đã đăng ký nhận bản tin' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email: normalizedEmail },
          data: { 
            active: true,
            subscribedAt: new Date()
          }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Đăng ký nhận bản tin thành công! Chào mừng bạn trở lại.',
          data: { resubscribed: true }
        });
      }
    }

    // Add new subscriber
    await prisma.newsletter.create({
      data: {
        email: normalizedEmail,
        active: true,
        subscribedAt: new Date()
      }
    });

    // In real app, send welcome email here
    // await sendWelcomeEmail(normalizedEmail);

    return NextResponse.json({
      success: true,
      message: 'Đăng ký nhận bản tin thành công! Cảm ơn bạn.',
      data: { subscribed: true }
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletter - Unsubscribe from newsletter
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const subscriber = await prisma.newsletter.findUnique({
      where: { email: normalizedEmail }
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Email không tìm thấy trong danh sách' },
        { status: 404 }
      );
    }

    await prisma.newsletter.update({
      where: { email: normalizedEmail },
      data: { active: false }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã hủy đăng ký nhận bản tin thành công'
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

// GET /api/newsletter - Get newsletter stats (for admin)
export async function GET() {
  try {
    const totalSubscribers = await prisma.newsletter.count({
      where: { active: true }
    });

    const recentSubscribers = await prisma.newsletter.findMany({
      where: { active: true },
      orderBy: { subscribedAt: 'desc' },
      take: 10,
      select: {
        email: true,
        subscribedAt: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        totalSubscribers,
        recentSubscribers
      }
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
