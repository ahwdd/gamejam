import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedAdminRequest } from '@/lib/middleware/adminAuth';
import { prisma } from '@/lib/prisma';

async function handler(request: AuthenticatedAdminRequest, { params }: { params: { id: string } }) {
  try {
    const adminId = request.adminId!;
    const body = await request.json();
    const { note } = body;

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
        approvalStatus: 'approved',
        approvedBy: adminId,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    });

    // Update user's guardian approval status
    await prisma.user.update({
      where: { id: guardian.userId },
      data: {
        guardianApprovalStatus: 'approved',
      },
    });

    // TODO: Send notification to user and guardian
    console.log('\n========================================');
    console.log('✅ GUARDIAN APPROVED');
    console.log('========================================');
    console.log(`Guardian: ${guardian.firstName} ${guardian.lastName}`);
    console.log(`Student: ${guardian.user.firstName} ${guardian.user.lastName}`);
    console.log(`Approved by Admin ID: ${adminId}`);
    if (note) console.log(`Note: ${note}`);
    console.log('========================================\n');

    return NextResponse.json({
      success: true,
      message: 'Guardian approved successfully',
      guardian: updatedGuardian,
    });
  } catch (error) {
    console.error('Approve guardian error:', error);
    return NextResponse.json(
      { error: 'Failed to approve guardian' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  return withAdminAuth(request, (req) => handler(req, context));
}