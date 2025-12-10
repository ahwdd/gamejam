// auth/logout-all/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { clearAllSessions } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out from all sessions',
    });

    clearAllSessions(response);

    return response;
  } catch (error) {
    console.error('Logout all error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}