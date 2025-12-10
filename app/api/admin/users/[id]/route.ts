import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedAdminRequest } from '@/lib/middleware/adminAuth';
import { prisma } from '@/lib/prisma';

async function getHandler(request: AuthenticatedAdminRequest, { params }: { params: any }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

async function patchHandler(request: AuthenticatedAdminRequest, { params }: { params: any }) {
  try {
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
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Convert dateOfBirth to Date if provided
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      include: {
        guardian: true,
      },
    });

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request: AuthenticatedAdminRequest, { params }: { params: any }) {
  try {
    // Soft delete by setting isActive to false
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate user' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: { params: any }) {
  return withAdminAuth(request, (req) => getHandler(req, context));
}

export async function PATCH(request: NextRequest, context: { params: any }) {
  return withAdminAuth(request, (req) => patchHandler(req, context));
}

export async function DELETE(request: NextRequest, context: { params: any }) {
  return withAdminAuth(request, (req) => deleteHandler(req, context));
}