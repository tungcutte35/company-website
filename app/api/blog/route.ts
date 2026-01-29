import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blog - Get all blog posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy') || 'date'; // date, views, likes
    const order = searchParams.get('order') || 'desc';

    // Build where clause
    const where: any = {};

    if (category && category !== 'Tất cả') {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'views':
        orderBy = { views: order };
        break;
      case 'likes':
        orderBy = { likes: order };
        break;
      case 'date':
      default:
        orderBy = { date: order };
    }

    // Get total count for pagination
    const total = await prisma.blogPost.count({ where });

    // Get posts with pagination
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        image: true,
        category: true,
        author: true,
        authorAvatar: true,
        date: true,
        readTime: true,
        featured: true,
        tags: true,
        views: true,
        likes: true,
        // Exclude content for performance
      }
    });

    // Get unique categories
    const categories = await prisma.blogPost.findMany({
      select: { category: true },
      distinct: ['category']
    });
    const categoryList = ['Tất cả', ...categories.map(c => c.category)];

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        },
        categories: categoryList
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
