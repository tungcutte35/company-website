import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blog/[slug] - Get single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });

    // Get related posts (same category, exclude current)
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        category: post.category,
        id: { not: post.id }
      },
      take: 3,
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
        // Exclude content
      }
    });

    // Get previous and next posts for navigation
    const prevPost = await prisma.blogPost.findFirst({
      where: { date: { lt: post.date } },
      orderBy: { date: 'desc' },
      select: { slug: true, title: true }
    });

    const nextPost = await prisma.blogPost.findFirst({
      where: { date: { gt: post.date } },
      orderBy: { date: 'asc' },
      select: { slug: true, title: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        post: { ...post, views: post.views + 1 }, // Return updated view count
        relatedPosts,
        navigation: {
          prev: prevPost,
          next: nextPost
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
