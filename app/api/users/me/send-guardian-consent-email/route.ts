// /api/users/me/send-guardian-consent-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = getUserSession(request);
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
        error: 'Only minors can send guardian consent emails'
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

    // Generate consent link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const consentLink = `${baseUrl}/guardian/consent/${user.guardian.consentToken}`;

    // Prepare email data
    const emailData = {
      email: user.guardian.email,
      name: `${user.guardian.firstName} ${user.guardian.lastName}`,
      subject: 'Guardian Consent Required - Student Hub Game Jam',
      message: `
Dear ${user.guardian.firstName} ${user.guardian.lastName},

Your child, ${user.firstName} ${user.lastName}, has registered for the Student Hub Game Jam and requires your consent to participate.

Please click the link below to complete the consent form:
${consentLink}

This link is unique to your child's registration. Please complete the form at your earliest convenience.

If you have any questions, please contact us at support@studenthub.com

Best regards,
GameThon Initiative Team
      `.trim(),
    };

    // Send email via HUB API
    const response = await fetch(`${process.env.NEXT_PUBLIC_HUB_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to send email via HUB:', data);
      return NextResponse.json({
        success: false,
        error: data.message || 'Failed to send email'
      }, { status: response.status });
    }

    console.log(`✅ Guardian consent email sent to: ${user.guardian.email}`);

    return NextResponse.json({
      success: true,
      message: 'Consent email sent successfully',
      data: {
        email: user.guardian.email,
        consentLink: process.env.NODE_ENV === 'development' ? consentLink : undefined,
      },
    });
  } catch (error) {
    console.error('Error sending guardian consent email:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}