import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth/session';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getUserSession(request);
    if (!session || session.type !== 'user') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        guardian: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    if (!user.isMinor) {
      return NextResponse.json({
        success: false,
        error: 'Only minors can resend guardian consent'
      }, { status: 400 });
    }

    if (!user.guardian) {
      return NextResponse.json({
        success: false,
        error: 'No guardian information found. Please submit guardian info first.'
      }, { status: 400 });
    }

    if (user.guardian.approvalStatus === 'approved') {
      return NextResponse.json({
        success: false,
        error: 'Guardian consent already approved'
      }, { status: 400 });
    }

    // Generate new consent token (optional - reuse existing or create new)
    const consentToken = crypto.randomBytes(32).toString('hex');
    
    const updatedGuardian = await prisma.guardian.update({
      where: { id: user.guardian.id },
      data: {
        consentToken: consentToken,
        updatedAt: new Date(),
      },
    });

    // Generate consent link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const consentLink = `${baseUrl}/guardian/consent/${consentToken}`;

    console.log(`📤 Consent form resent for user: ${user.id}`);
    console.log(`📧 Guardian: ${updatedGuardian.email}`);
    console.log(`🔗 New consent link: ${consentLink}`);

    // TODO: In production, send email/WhatsApp with consent link
    // For now, just return success with the link for dev mode

    return NextResponse.json({
      success: true,
      message: 'Consent form resent successfully',
      data: {
        consentLink: process.env.NODE_ENV === 'development' ? consentLink : undefined,
        guardian: {
          email: updatedGuardian.email,
          phoneNumber: updatedGuardian.phoneNumber,
        },
      },
    });
  } catch (error) {
    console.error('Error resending consent:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}