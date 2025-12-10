// /api/guardian/consent/[token]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const consentSchema = z.object({
  nationalID: z.string().optional(),
  willAttendEvent: z.boolean().default(false),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: 'Consent must be given',
  }),
  signature: z.string().min(1, 'Signature is required'),
});

async function getHandler(request: NextRequest, paramsPromise: any) {
  try {
    // paramsPromise may be a Promise (Next.js App Router), so await it
    const params = await paramsPromise;
    const rawToken = String(params?.token ?? '').trim();

    console.log('[server] GET /api/guardian/consent - received token:', rawToken);

    if (!rawToken) {
      return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 });
    }

    const guardian = await prisma.guardian.findUnique({
      where: { consentToken: rawToken },
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
            school: true,
            grade: true,
            city: true,
            country: true,
          },
        },
      },
    });

    if (!guardian) {
      console.warn('[server] No guardian found for token:', rawToken);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired consent link' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      guardian: {
        id: guardian.id,
        firstName: guardian.firstName,
        lastName: guardian.lastName,
        email: guardian.email,
        phoneNumber: guardian.phoneNumber,
        phoneKey: guardian.phoneKey,
        relationshipToStudent: guardian.relationshipToStudent,
        approvalStatus: guardian.approvalStatus,
        rejectionReason: guardian.rejectionReason,
        consentGiven: guardian.consentGiven,
      },
      student: guardian.user,
    });
  } catch (error) {
    console.error('Get consent form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch consent form' },
      { status: 500 }
    );
  }
}

async function postHandler(request: NextRequest, paramsPromise: any) {
  try {
    const params = await paramsPromise;
    const rawToken = String(params?.token ?? '').trim();

    console.log('[server] POST /api/guardian/consent - received token:', rawToken);

    if (!rawToken) {
      return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = consentSchema.parse(body);

    // Find guardian by token
    const guardian = await prisma.guardian.findUnique({
      where: { consentToken: rawToken },
      include: { user: true },
    });

    if (!guardian) {
      console.warn('[server] No guardian found for token (POST):', rawToken);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired consent link' },
        { status: 404 }
      );
    }

    // Update guardian with consent information
    const updatedGuardian = await prisma.guardian.update({
      where: { id: guardian.id },
      data: {
        nationalID: validatedData.nationalID,
        willAttendEvent: validatedData.willAttendEvent,
        consentGiven: true,
        consentDate: new Date(),
        signatureURL: validatedData.signature, // Base64 signature or URL
      },
    });

    console.info('[server] Guardian consent updated (id):', guardian.id);

    return NextResponse.json({
      success: true,
      message: 'Consent submitted successfully. Awaiting admin review.',
      guardian: {
        id: updatedGuardian.id,
        approvalStatus: updatedGuardian.approvalStatus,
        consentGiven: updatedGuardian.consentGiven,
      },
    });
  } catch (error) {
    console.error('Submit consent error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to submit consent' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: { params: any }) {
  return getHandler(request, context.params);
}

export async function POST(request: NextRequest, context: { params: any }) {
  return postHandler(request, context.params);
}
