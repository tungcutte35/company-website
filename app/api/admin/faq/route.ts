import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/faq - Get all FAQs for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }

    if (search) {
      where.OR = [
        {
          question: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          answer: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          category: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Fetch FAQs from database
    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get unique categories
    const categoriesResult = await prisma.fAQ.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    });
    
    const categories = categoriesResult.map(item => item.category);

    // Get total count
    const totalAll = await prisma.fAQ.count();

    return NextResponse.json({
      success: true,
      data: {
        faqs,
        categories,
        total: faqs.length,
        totalAll
      }
    });
  } catch (error) {
    console.error('Error fetching admin FAQs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

// POST /api/admin/faq - Create new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, question, answer } = body;

    // Validation
    const errors: string[] = [];
    
    if (!category || category.trim().length < 2) {
      errors.push('Danh mục phải có ít nhất 2 ký tự');
    }
    
    if (!question || question.trim().length < 10) {
      errors.push('Câu hỏi phải có ít nhất 10 ký tự');
    }
    
    if (!answer || answer.trim().length < 20) {
      errors.push('Câu trả lời phải có ít nhất 20 ký tự');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Create new FAQ in database
    const newFaq = await prisma.fAQ.create({
      data: {
        category: category.trim(),
        question: question.trim(),
        answer: answer.trim()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'FAQ đã được tạo thành công',
      data: newFaq
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tạo FAQ' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/faq - Update FAQ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, category, question, answer } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID FAQ là bắt buộc' },
        { status: 400 }
      );
    }

    // Check if FAQ exists
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingFaq) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy FAQ' },
        { status: 404 }
      );
    }

    // Validation
    const errors: string[] = [];
    
    if (!category || category.trim().length < 2) {
      errors.push('Danh mục phải có ít nhất 2 ký tự');
    }
    
    if (!question || question.trim().length < 10) {
      errors.push('Câu hỏi phải có ít nhất 10 ký tự');
    }
    
    if (!answer || answer.trim().length < 20) {
      errors.push('Câu trả lời phải có ít nhất 20 ký tự');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Update FAQ in database
    const updatedFaq = await prisma.fAQ.update({
      where: { id: parseInt(id) },
      data: {
        category: category.trim(),
        question: question.trim(),
        answer: answer.trim()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'FAQ đã được cập nhật thành công',
      data: updatedFaq
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi cập nhật FAQ' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/faq - Delete FAQ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID FAQ là bắt buộc' },
        { status: 400 }
      );
    }

    // Check if FAQ exists
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!existingFaq) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy FAQ' },
        { status: 404 }
      );
    }

    // Delete FAQ from database
    const deletedFaq = await prisma.fAQ.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'FAQ đã được xóa thành công',
      data: deletedFaq
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi xóa FAQ' },
      { status: 500 }
    );
  }
}