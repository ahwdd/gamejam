import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedAdminRequest } from '@/lib/middleware/adminAuth';
import { prisma } from '@/lib/prisma';

async function handler(request: AuthenticatedAdminRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const profileComplete = searchParams.get('profileComplete');
    const isMinor = searchParams.get('isMinor');
    const guardianStatus = searchParams.get('guardianStatus');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search } },
      ];
    }

    if (profileComplete !== null) {
      where.profileComplete = profileComplete === 'true';
    }

    if (isMinor !== null) {
      where.isMinor = isMinor === 'true';
    }

    if (guardianStatus) {
      where.guardianApprovalStatus = guardianStatus;
    }

    // Get users
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          guardian: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              approvalStatus: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    const sanitizedUsers = users.map(({ passwordHash, ...user }: any) => user);

    return NextResponse.json({
      success: true,
      data: {
        users: sanitizedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('List users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return withAdminAuth(request, handler);
}