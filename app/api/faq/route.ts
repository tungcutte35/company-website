import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/faq - Get all FAQs with optional category filter
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

    // Group FAQs by category
    const groupedFaqs = faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, typeof faqs>);

    return NextResponse.json({
      success: true,
      data: {
        faqs,
        grouped: groupedFaqs,
        categories,
        total: faqs.length
      }
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}
