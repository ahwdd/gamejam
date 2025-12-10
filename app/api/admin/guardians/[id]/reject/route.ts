import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedAdminRequest } from '@/lib/middleware/adminAuth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const rejectSchema = z.object({
  reason: z.string().min(10, 'Rejection reason must be at least 10 characters'),
});

async function handler(request: AuthenticatedAdminRequest, { params }: { params: { id: string } }) {
  try {
    const adminId = request.adminId!;
    const body = await request.json();
    const { reason } = rejectSchema.parse(body);

    // Get guardian
    const guardian = await prisma.guardian.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!guardian) {
      return NextResponse.json(
        { error: 'Guardian not found' },
        { status: 404 }
      );
    }

    // Update guardian approval status
    const updatedGuardian = await prisma.guardian.update({
      where: { id: params.id },
      data: {
        approvalStatus: 'rejected',
        rejectionReason: reason,
        approvedBy: adminId,
        approvedAt: new Date(),
      },
    });

    // Update user's guardian approval status
    await prisma.user.update({
      where: { id: guardian.userId },
      data: {
        guardianApprovalStatus: 'rejected',
      },
    });

    // TODO: Send notification to guardian with reason
    console.log('\n========================================');
    console.log('❌ GUARDIAN REJECTED');
    console.log('========================================');
    console.log(`Guardian: ${guardian.firstName} ${guardian.lastName}`);
    console.log(`Student: ${guardian.user.firstName} ${guardian.user.lastName}`);
    console.log(`Rejected by Admin ID: ${adminId}`);
    console.log(`Reason: ${reason}`);
    console.log('========================================\n');

    return NextResponse.json({
      success: true,
      message: 'Guardian rejected',
      guardian: updatedGuardian,
    });
  } catch (error) {
    console.error('Reject guardian error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to reject guardian' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  return withAdminAuth(request, (req) => handler(req, context));
}