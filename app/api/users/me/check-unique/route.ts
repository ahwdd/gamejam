// /api/users/me/check-unique/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withUserAuth, AuthenticatedRequest } from '@/lib/middleware/userAuth';
import { prisma } from '@/lib/prisma';

async function handler(request: AuthenticatedRequest) {
  try {
    const userId = request.userId!;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phoneNumber = searchParams.get('phoneNumber');

    if (!email && !phoneNumber) {
      return NextResponse.json(
        { error: 'Email or phone number required' },
        { status: 400 }
      );
    }

    const where: any = {
      AND: [
        { id: { not: userId } },
        {
          OR: []
        }
      ]
    };

    if (email) {
      where.AND[1].OR.push({ email });
    }

    if (phoneNumber) {
      where.AND[1].OR.push({ phoneNumber });
    }

    const existingUser = await prisma.user.findFirst({ where });

    return NextResponse.json({
      success: true,
      available: !existingUser,
      message: existingUser 
        ? 'Email or phone number already in use'
        : 'Available',
    });
  } catch (error) {
    console.error('Check unique error:', error);
    return NextResponse.json(
      { error: 'Failed to check uniqueness' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return withUserAuth(request, handler);
}