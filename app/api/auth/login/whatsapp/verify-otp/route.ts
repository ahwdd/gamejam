import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { setUserSession } from '@/lib/auth/session';

const verifyWhatsAppLoginOTPSchema = z.object({
  phone: z.string().min(10, "Valid phone number is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verifyWhatsAppLoginOTPSchema.parse(body);
    
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_HUB_BASE_URL}/api/auth/login/whatsapp/verify-otp`, {
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
      where: { phoneNumber: validatedData.phone },
    });

    if (!user) {
      console.log(`📝 Creating new user from smart routing: ${validatedData.phone}`);
      
      const hubUserData = backendData.data?.user || {};
      
      user = await prisma.user.create({
        data: {
          phoneNumber: validatedData.phone,
          phoneKey: hubUserData.phone_key || null,
          firstName: hubUserData.first_name || null,
          lastName: hubUserData.last_name || null,
          email: hubUserData.email || null,
          preferredLanguage: 'en',
          profileComplete: false,
          isActive: true,
        },
      });
      
      console.log(`✅ New user created via smart routing: ${user.id}`);
    }

    console.log(`✅ User logged in via WhatsApp: ${user.phoneNumber}`);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
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
    console.error('Error verifying WhatsApp login OTP:', error);
    
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