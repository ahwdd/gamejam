// /api/guardian/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedAdminRequest } from '@/lib/middleware/adminAuth';
import { prisma } from '@/lib/prisma';

async function getHandler(
  request: AuthenticatedAdminRequest,
  paramsPromise: any
): Promise<NextResponse> {
  try {
    const params = await paramsPromise;
    const id = String(params?.id ?? '').trim();

    if (!id) {
      return NextResponse.json({ error: 'Missing guardian id' }, { status: 400 });
    }

    const guardian = await prisma.guardian.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            phoneKey: true,
            dateOfBirth: true,
            isMinor: true,
            school: true,
            grade: true,
          },
        },
      },
    });

    if (!guardian) {
      return NextResponse.json({ error: 'Guardian not found' }, { status: 404 });
    }

    // Get additional students if any
    const additionalStudents =
      guardian.additionalStudents && guardian.additionalStudents.length > 0
        ? await prisma.user.findMany({
            where: {
              id: { in: guardian.additionalStudents },
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          })
        : [];

    return NextResponse.json({
      success: true,
      guardian: {
        ...guardian,
        additionalStudentsDetails: additionalStudents,
      },
    });
  } catch (error) {
    console.error('Get guardian error:', error);
    return NextResponse.json({ error: 'Failed to fetch guardian' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, context: { params: any }) {
  // pass context.params (may be a Promise) — handler will await it
  return withAdminAuth(request, (req) => getHandler(req, context.params));
}
