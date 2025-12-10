// /api/auth/register/email/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { setUserSession } from '@/lib/auth/session';

const verifyEmailOTPSchema = z.object({
  email: z.string().email("Valid email is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verifyEmailOTPSchema.parse(body);
    
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_HUB_BASE_URL}/api/auth/register/email/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });
    
    const backendData = await backendResponse.json();
    
    if (!backendData.success) {
      return NextResponse.json(backendData, { status: backendResponse.status });
    }

    let user = await prisma.user.findFirst({
      where: { email: validatedData.email },
    });

    if (!user) {
      const firstName = backendData.data?.user?.name?.split(' ')[0] || 'User';
      const lastName = backendData.data?.user?.name?.split(' ').slice(1).join(' ') || '';

      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          firstName: firstName,
          lastName: lastName || undefined,
          preferredLanguage: 'en',
          profileComplete: false,
        },
      });

      console.log(`✅ New user created via email: ${user.email}`);
    } else {
      console.log(`✅ Existing user logged in via email: ${user.email}`);
    }

    const response = NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          phoneKey: user.phoneKey,
          dateOfBirth: user.dateOfBirth,
          isMinor: user.isMinor,
          preferredLanguage: user.preferredLanguage,
          profilePhoto: user.profilePhoto,
          school: user.school,
          grade: user.grade,
          address: user.address,
          city: user.city,
          country: user.country,
          profileComplete: user.profileComplete,
          guardianApprovalStatus: user.guardianApprovalStatus,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });

    setUserSession(response, {
      id: user.id,
      type: 'user',
      email: user.email || undefined,
    });
    
    return response;
    
  } catch (error) {
    console.error('Error verifying Email registration OTP:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}