import { NextRequest, NextResponse } from 'next/server';

// Simple admin credentials (in production, use proper auth like NextAuth + database)
const ADMIN_CREDENTIALS = {
  username: 'admin@techera.com',
  password: 'Techera@123'
};

// Simple session token (in production, use JWT or session management)
const VALID_TOKEN = 'techera-admin-session-token-2024';

// POST /api/admin/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username và password là bắt buộc' },
        { status: 400 }
      );
    }

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: { 
          token: VALID_TOKEN,
          user: { username: 'admin', role: 'Administrator' }
        }
      });

      // Set cookie for session
      response.cookies.set('admin_token', VALID_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Username hoặc password không đúng' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

// GET /api/admin/login - Verify session
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (token === VALID_TOKEN) {
      return NextResponse.json({
        success: true,
        data: { 
          authenticated: true,
          user: { username: 'admin', role: 'Administrator' }
        }
      });
    }

    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/login - Logout
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Đăng xuất thành công'
  });

  response.cookies.delete('admin_token');
  return response;
}
