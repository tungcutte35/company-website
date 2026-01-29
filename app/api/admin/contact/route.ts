import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Middleware to check admin auth
function checkAdminAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  return token === 'techera-admin-session-token-2024';
}

// Email notification helper (simulate - in production use nodemailer/resend/etc)
async function sendEmailNotification(message: {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}): Promise<{ success: boolean; messageId?: string }> {
  // In real app, integrate with email service like:
  // - Nodemailer with SMTP
  // - Resend
  // - SendGrid
  // - AWS SES
  
  console.log('📧 Email notification would be sent:');
  console.log('To: admin@techera.vn');
  console.log('Subject: Liên hệ mới từ', message.name);
  console.log('Content:', message);
  
  // Simulate email sending
  return { 
    success: true, 
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` 
  };
}

// GET /api/admin/contact - Get all contact messages with filtering
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // 'read' | 'unread' | 'all'
    const search = searchParams.get('search');
    const service = searchParams.get('service');

    // Build where clause
    const where: any = {};

    if (status === 'read') {
      where.read = true;
    } else if (status === 'unread') {
      where.read = false;
    }

    if (service) {
      where.service = service;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count
    const total = await prisma.contactMessage.count({ where });

    // Get messages with pagination
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Get stats
    const totalMessages = await prisma.contactMessage.count();
    const unreadMessages = await prisma.contactMessage.count({ where: { read: false } });
    const readMessages = await prisma.contactMessage.count({ where: { read: true } });

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        stats: {
          total: totalMessages,
          unread: unreadMessages,
          read: readMessages
        }
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/contact - Update message (mark as read, etc)
export async function PUT(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, read, reply } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID là bắt buộc' },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tin nhắn' },
        { status: 404 }
      );
    }

    // Update message
    const updateData: any = {};
    if (typeof read === 'boolean') {
      updateData.read = read;
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: updateData
    });

    // If admin wants to reply, send email to customer
    if (reply) {
      // Send reply email to customer
      console.log('📧 Reply email would be sent to:', message.email);
      console.log('Reply content:', reply);
      
      // In production, actually send email here
    }

    return NextResponse.json({
      success: true,
      message: read ? 'Đã đánh dấu đã đọc' : 'Đã cập nhật',
      data: updatedMessage
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/contact - Delete message
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

    const message = await prisma.contactMessage.findUnique({
      where: { id: parseInt(id) }
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tin nhắn' },
        { status: 404 }
      );
    }

    await prisma.contactMessage.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa tin nhắn thành công'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}

// POST /api/admin/contact - Admin can reply to message (sends email)
export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { messageId, replyContent, replySubject } = body;

    if (!messageId || !replyContent) {
      return NextResponse.json(
        { success: false, error: 'Message ID và nội dung trả lời là bắt buộc' },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tin nhắn' },
        { status: 404 }
      );
    }

    // Send reply email to customer
    const emailResult = await sendEmailNotification({
      name: 'Techera Team',
      email: message.email,
      phone: '',
      company: 'Techera',
      service: 'reply',
      message: replyContent
    });

    // Mark as read
    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { read: true }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã gửi email phản hồi thành công',
      data: {
        emailSent: emailResult.success,
        messageId: emailResult.messageId,
        sentTo: message.email,
        subject: replySubject || 'Phản hồi từ Techera'
      }
    });
  } catch (error) {
    console.error('Error replying to message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
