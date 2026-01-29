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

// Helper to estimate read time
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} phút`;
}

// GET /api/admin/blog - Get all posts with admin details
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
    } else if (featured === 'false') {
      where.featured = false;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count
    const total = await prisma.blogPost.count({ where });

    // Get posts with pagination
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { date: 'desc' },
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
        createdAt: true,
        updatedAt: true,
        // Exclude content for performance
      }
    });

    // Get categories
    const categories = await prisma.blogPost.findMany({
      select: { category: true },
      distinct: ['category']
    });

    // Get stats
    const totalPosts = await prisma.blogPost.count();
    const featuredPosts = await prisma.blogPost.count({ where: { featured: true } });
    const totalViews = await prisma.blogPost.aggregate({
      _sum: { views: true }
    });
    const totalLikes = await prisma.blogPost.aggregate({
      _sum: { likes: true }
    });

    const categoryStats = await Promise.all(
      categories.map(async (cat) => ({
        name: cat.category,
        count: await prisma.blogPost.count({ where: { category: cat.category } })
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        posts,
        categories: categories.map(c => c.category),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        stats: {
          total: totalPosts,
          featured: featuredPosts,
          totalViews: totalViews._sum.views || 0,
          totalLikes: totalLikes._sum.likes || 0,
          byCategory: categoryStats
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog - Create new blog post
export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      title, excerpt, content, image, category, author, authorAvatar,
      tags, featured 
    } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'Title, content và category là bắt buộc' },
        { status: 400 }
      );
    }

    const newPost = await prisma.blogPost.create({
      data: {
        slug: generateSlug(title),
        title: title.trim(),
        excerpt: excerpt?.trim() || content.substring(0, 150) + '...',
        content: content.trim(),
        image: image || '/images/blog/default.jpg',
        category: category.trim(),
        author: author || 'Techera Team',
        authorAvatar: authorAvatar || '/images/authors/techera-team.jpg',
        date: new Date(),
        readTime: estimateReadTime(content),
        featured: featured || false,
        tags: tags || [],
        views: 0,
        likes: 0
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã tạo bài viết thành công',
      data: newPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blog - Update blog post
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

    const post = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = { ...updates };

    // Update slug if title changed
    if (updates.title) {
      updateData.slug = generateSlug(updates.title);
    }

    // Update read time if content changed
    if (updates.content) {
      updateData.readTime = estimateReadTime(updates.content);
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Đã cập nhật bài viết thành công',
      data: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog - Delete blog post
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

    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa bài viết thành công'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
