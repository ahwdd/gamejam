// /api/users/me/guardian-info/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { withUserAuth, AuthenticatedRequest } from '@/lib/middleware/userAuth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

const guardianInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  phoneKey: z.string(),
  relationshipToStudent: z.string().min(1),
});

async function handler(request: AuthenticatedRequest) {
  try {
    const userId = request.userId!;
    const user = request.user;

    // Check if user is a minor
    if (!user.isMinor) {
      return NextResponse.json(
        { error: 'Guardian information not required for adults' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = guardianInfoSchema.parse(body);

    // Generate unique consent token
    const consentToken = crypto.randomBytes(32).toString('hex');

    // Create or update guardian
    const guardian = await prisma.guardian.upsert({
      where: { userId },
      create: {
        userId,
        ...validatedData,
        consentToken,
        approvalStatus: 'pending',
      },
      update: {
        ...validatedData,
        consentToken, // Generate new token on re-submission
        approvalStatus: 'pending',
        rejectionReason: null, // Clear previous rejection
      },
    });

    // Update user's guardian approval status
    await prisma.user.update({
      where: { id: userId },
      data: {
        guardianApprovalStatus: 'pending',
      },
    });

    // Generate consent link
    const consentLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/guardian/consent/${consentToken}`;

    // In development, log the link
    if (process.env.DEV_MODE === 'true') {
      console.log('\n========================================');
      console.log('🔗 GUARDIAN CONSENT LINK');
      console.log('========================================');
      console.log(`Student: ${user.firstName} ${user.lastName}`);
      console.log(`Guardian: ${validatedData.firstName} ${validatedData.lastName}`);
      console.log(`Email: ${validatedData.email}`);
      console.log(`Phone: ${validatedData.phoneKey} ${validatedData.phoneNumber}`);
      console.log(`\nConsent Link:`);
      console.log(consentLink);
      console.log('========================================\n');
    }

    // TODO: Send WhatsApp message
    // await sendWhatsAppMessage(
    //   `${validatedData.phoneKey}${validatedData.phoneNumber}`,
    //   `Hi ${validatedData.firstName}! Your child ${user.firstName} has registered for Student Hub. Please complete the consent form: ${consentLink}`
    // );

    // TODO: Send email
    // await sendEmail(
    //   validatedData.email,
    //   'Guardian Consent Required - Student Hub',
    //   `Hi ${validatedData.firstName},\n\nYour child ${user.firstName} ${user.lastName} has registered for Student Hub Game Jam...\n\nConsent Link: ${consentLink}`
    // );

    return NextResponse.json({
      success: true,
      message: 'Guardian information submitted. Consent link sent.',
      data: {
        guardian: {
          id: guardian.id,
          firstName: guardian.firstName,
          lastName: guardian.lastName,
          email: guardian.email,
          approvalStatus: guardian.approvalStatus,
        },
        consentLink: process.env.DEV_MODE === 'true' ? consentLink : undefined,
      },
    });
  } catch (error) {
    console.error('Submit guardian info error:', error);

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
      { error: 'Failed to submit guardian information' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return withUserAuth(request, handler);
}