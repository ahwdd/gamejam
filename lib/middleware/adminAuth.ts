import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession, clearUserSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedAdminRequest extends NextRequest {
  adminId?: string;
  admin?: any;
}

/**
 * Middleware to authenticate admin requests
 * Checks for valid admin session and loads admin from database
 */
export async function withAdminAuth(
  request: NextRequest,
  handler: (request: AuthenticatedAdminRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Get admin session
    const session = getAdminSession(request);
    
    if (!session || session.type !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Load admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: session.id },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'Admin not found or inactive' },
        { status: 401 }
      );
    }

    // Attach admin to request
    (request as AuthenticatedAdminRequest).adminId = admin.id;
    (request as AuthenticatedAdminRequest).admin = admin;

    // Clear user session if present (mutual exclusion)
    const response = await handler(request as AuthenticatedAdminRequest);
    clearUserSession(response);

    return response;
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export function isSuperAdmin(admin: any): boolean {
  return admin.role === 'super_admin';
}