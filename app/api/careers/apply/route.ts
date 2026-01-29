import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/careers/apply - Submit job application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { jobId, name, email, phone, resume, coverLetter } = body;

    // Validation
    const errors: string[] = [];
    
    if (!jobId) {
      errors.push('Job ID is required');
    }
    
    if (!name || name.trim().length < 2) {
      errors.push('Họ tên phải có ít nhất 2 ký tự');
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email không hợp lệ');
    }
    
    if (!phone || !/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
      errors.push('Số điện thoại không hợp lệ');
    }

    if (!resume) {
      errors.push('CV là bắt buộc');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Verify job exists
    const job = await prisma.career.findUnique({
      where: { id: parseInt(jobId) }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Vị trí tuyển dụng không tồn tại' },
        { status: 404 }
      );
    }

    if (!job.active) {
      return NextResponse.json(
        { success: false, error: 'Vị trí này đã đóng tuyển dụng' },
        { status: 400 }
      );
    }

    // Create new application
    const newApplication = await prisma.jobApplication.create({
      data: {
        jobId: parseInt(jobId),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        resume: resume.trim(),
        coverLetter: coverLetter?.trim() || '',
        status: 'pending'
      }
    });

    // In production, send notification email to HR
    console.log('New job application:', newApplication);

    return NextResponse.json({
      success: true,
      message: 'Ứng tuyển thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
      data: { id: newApplication.id }
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}