import { NextRequest, NextResponse } from 'next/server';
import { getUserSession, clearAdminSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  user?: any;
}

/**
 * Middleware to authenticate user requests
 * Checks for valid user session and loads user from database
 */
export async function withUserAuth(
  request: NextRequest,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Get user session
    const session = getUserSession(request);
    
    if (!session || session.type !== 'user') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Load user from database
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        guardian: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    // Attach user to request
    (request as AuthenticatedRequest).userId = user.id;
    (request as AuthenticatedRequest).user = user;

    // Clear admin session if present (mutual exclusion)
    const response = await handler(request as AuthenticatedRequest);
    clearAdminSession(response);

    return response;
  } catch (error) {
    console.error('User auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}