// Example: Cập nhật Blog API để sử dụng PostgreSQL
// File: app/api/blog/route.ts

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

    // Filter by category
    if (category && category !== 'Tất cả') {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }

    // Filter by featured
    if (featured === 'true') {
      where.featured = true;
    }

    // Search by title, excerpt, or tags
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          excerpt: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          tags: {
            hasSome: [search]
          }
        }
      ];
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'views':
        orderBy.views = order;
        break;
      case 'likes':
        orderBy.likes = order;
        break;
      case 'date':
      default:
        orderBy.date = order;
    }

    // Fetch posts with pagination
    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
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
      }),
      prisma.blogPost.count({ where })
    ]);

    // Get unique categories
    const categoriesResult = await prisma.blogPost.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    });
    
    const categories = ['Tất cả', ...categoriesResult.map(item => item.category)];

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1
        },
        categories
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

// POST /api/blog - Create new blog post (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      excerpt,
      content,
      image,
      category,
      author,
      authorAvatar,
      readTime,
      featured,
      tags
    } = body;

    // Validation
    const errors: string[] = [];
    
    if (!slug || slug.trim().length < 3) {
      errors.push('Slug phải có ít nhất 3 ký tự');
    }
    
    if (!title || title.trim().length < 10) {
      errors.push('Tiêu đề phải có ít nhất 10 ký tự');
    }
    
    if (!excerpt || excerpt.trim().length < 50) {
      errors.push('Mô tả phải có ít nhất 50 ký tự');
    }
    
    if (!content || content.trim().length < 100) {
      errors.push('Nội dung phải có ít nhất 100 ký tự');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: slug.trim() }
    });

    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'Slug đã tồn tại' },
        { status: 400 }
      );
    }

    // Create new blog post
    const newPost = await prisma.blogPost.create({
      data: {
        slug: slug.trim(),
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        image: image?.trim() || null,
        category: category.trim(),
        author: author.trim(),
        authorAvatar: authorAvatar?.trim() || null,
        readTime: readTime.trim(),
        featured: Boolean(featured),
        tags: Array.isArray(tags) ? tags : []
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Bài viết đã được tạo thành công',
      data: newPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tạo bài viết' },
      { status: 500 }
    );
  }
}