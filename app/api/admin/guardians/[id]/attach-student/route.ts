// /api/guardian/attach-student/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedAdminRequest } from '@/lib/middleware/adminAuth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const attachSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
});

async function handler(
  request: AuthenticatedAdminRequest,
  paramsPromise: any
): Promise<NextResponse> {
  try {
    const params = await paramsPromise;
    const id = String(params?.id ?? '').trim();

    if (!id) {
      return NextResponse.json({ error: 'Missing guardian id' }, { status: 400 });
    }

    const body = await request.json();
    const { studentId } = attachSchema.parse(body);

    // Get guardian
    const guardian = await prisma.guardian.findUnique({
      where: { id },
    });

    if (!guardian) {
      return NextResponse.json({ error: 'Guardian not found' }, { status: 404 });
    }

    // Check if guardian is approved
    if (guardian.approvalStatus !== 'approved') {
      return NextResponse.json(
        { error: 'Only approved guardians can be attached to additional students' },
        { status: 400 }
      );
    }

    // Get student
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check if student is a minor
    if (!student.isMinor) {
      return NextResponse.json({ error: 'Student is not a minor' }, { status: 400 });
    }

    // Check if student is primary
    if (guardian.userId === studentId) {
      return NextResponse.json(
        { error: 'This is the primary student for this guardian' },
        { status: 400 }
      );
    }

    // Check if already in additional students
    const currentAdditional: string[] = guardian.additionalStudents || [];
    if (currentAdditional.includes(studentId)) {
      return NextResponse.json(
        { error: 'Student already attached to this guardian' },
        { status: 400 }
      );
    }

    // Add student to guardian's additional students
    const updatedGuardian = await prisma.guardian.update({
      where: { id },
      data: {
        additionalStudents: {
          set: [...currentAdditional, studentId],
        },
      },
    });

    // Update student's guardian approval status
    await prisma.user.update({
      where: { id: studentId },
      data: {
        guardianApprovalStatus: 'approved',
      },
    });

    console.log('\n========================================');
    console.log('🔗 GUARDIAN ATTACHED TO STUDENT');
    console.log('========================================');
    console.log(`Guardian: ${guardian.firstName} ${guardian.lastName}`);
    console.log(`Student: ${student.firstName} ${student.lastName}`);
    console.log('========================================\n');

    return NextResponse.json({
      success: true,
      message: 'Guardian attached to student successfully',
      guardian: updatedGuardian,
    });
  } catch (error) {
    console.error('Attach guardian error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to attach guardian to student' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: any }) {
  return withAdminAuth(request, (req) => handler(req, context.params));
}
