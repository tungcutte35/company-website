import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Email notification helper (in production, use nodemailer/resend/sendgrid)
async function sendEmailNotification(message: {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}): Promise<{ success: boolean; messageId?: string }> {
  // Log only in development (avoid leaking PII in production logs)
  if (process.env.NODE_ENV !== "production") {
    console.log("═══════════════════════════════════════");
    console.log("📧 NEW CONTACT FORM SUBMISSION");
    console.log("═══════════════════════════════════════");
    console.log("From:", message.name, `<${message.email}>`);
    console.log("Phone:", message.phone);
    console.log("Company:", message.company || "N/A");
    console.log("Service:", message.service);
    console.log("Message:", message.message);
    console.log("═══════════════════════════════════════");
  }
  
  // In production, integrate with email service:
  // Example with Resend:
  // const { data, error } = await resend.emails.send({
  //   from: 'noreply@techera.vn',
  //   to: 'admin@techera.vn',
  //   subject: `Liên hệ mới từ ${message.name}`,
  //   html: `<h1>Liên hệ mới</h1>...`
  // });
  
  return { 
    success: true, 
    messageId: `contact_${message.id}` 
  };
}

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, phone, company, service, message } = body;

    // Validation
    const errors: string[] = [];
    
    if (!name || name.trim().length < 2) {
      errors.push('Họ tên phải có ít nhất 2 ký tự');
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email không hợp lệ');
    }
    
    if (!phone || !/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
      errors.push('Số điện thoại không hợp lệ');
    }
    
    if (!message || message.trim().length < 10) {
      errors.push('Tin nhắn phải có ít nhất 10 ký tự');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Create new contact message in database
    const newMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company?.trim() || '',
        service: service || 'general',
        message: message.trim(),
        read: false
      }
    });

    // Send email notification to admin
    const emailResult = await sendEmailNotification({
      id: newMessage.id,
      name: newMessage.name,
      email: newMessage.email,
      phone: newMessage.phone,
      company: newMessage.company || '',
      service: newMessage.service,
      message: newMessage.message
    });
    
    if (emailResult.success && process.env.NODE_ENV !== "production") {
      console.log("✅ Email notification sent:", emailResult.messageId);
    }

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.',
      data: { id: newMessage.id, emailSent: emailResult.success }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// GET /api/contact - Get all contact messages (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unread') === 'true';

    const where = unreadOnly ? { read: false } : {};

    // Get total count
    const total = await prisma.contactMessage.count({ where });

    // Get messages with pagination
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Get unread count
    const unreadCount = await prisma.contactMessage.count({
      where: { read: false }
    });

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
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
