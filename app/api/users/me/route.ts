import { NextRequest, NextResponse } from 'next/server';
import { withUserAuth, AuthenticatedRequest } from '@/lib/middleware/userAuth';

async function handler(request: AuthenticatedRequest) {
  try {
    const user = request.user;

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return withUserAuth(request, handler);
}