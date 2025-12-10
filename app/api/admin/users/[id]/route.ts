// /api/admin/users/[id]/route.ts
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
    if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        guardian: true,
        registrations: {
          include: {
            event: {
              select: {
                id: true,
                eventNameEN: true,
                startDate: true,
              },
            },
          },
        },
        teamMembers: {
          include: {
            team: {
              select: {
                id: true,
                teamName: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user as any;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

async function patchHandler(
  request: AuthenticatedAdminRequest,
  paramsPromise: any
): Promise<NextResponse> {
  try {
    const params = await paramsPromise;
    const id = String(params?.id ?? '').trim();
    if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

    const body = await request.json();

    // Admin can update most fields
    const allowedFields = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'phoneKey',
      'dateOfBirth',
      'school',
      'grade',
      'address',
      'city',
      'country',
      'profileComplete',
      'guardianApprovalStatus',
      'isActive',
    ] as const;

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updateData[field] = body[field];
      }
    }

    // Convert dateOfBirth to Date if provided and non-empty
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        guardian: true,
      },
    });

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user as any;

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

async function deleteHandler(
  request: AuthenticatedAdminRequest,
  paramsPromise: any
): Promise<NextResponse> {
  try {
    const params = await paramsPromise;
    const id = String(params?.id ?? '').trim();
    if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

    // Soft delete by setting isActive to false
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    return NextResponse.json({ error: 'Failed to deactivate user' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, context: { params: any }) {
  return withAdminAuth(request, (req) => getHandler(req, context.params));
}

export async function PATCH(request: NextRequest, context: { params: any }) {
  return withAdminAuth(request, (req) => patchHandler(req, context.params));
}

export async function DELETE(request: NextRequest, context: { params: any }) {
  return withAdminAuth(request, (req) => deleteHandler(req, context.params));
}
