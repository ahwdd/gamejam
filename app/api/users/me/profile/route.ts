// /api/users/me/profile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { withUserAuth, AuthenticatedRequest } from '@/lib/middleware/userAuth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { calculateAge, isMinor, isAgeValid } from '@/lib/utils/age';

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  dateOfBirth: z.string().optional(),
  school: z.string().min(1).optional(),
  grade: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  country: z.string().length(2).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).optional(),
  phoneKey: z.string().optional(),
});

async function handler(request: AuthenticatedRequest) {
  try {
    const userId = request.userId!;
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            { email: validatedData.email },
          ],
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    if (validatedData.phoneNumber) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            { phoneNumber: validatedData.phoneNumber },
          ],
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Phone number already in use' },
          { status: 400 }
        );
      }
    }

    let isMinorUser = request.user.isMinor;
    if (validatedData.dateOfBirth) {
      if (!isAgeValid(validatedData.dateOfBirth)) {
        return NextResponse.json(
          { error: 'Age must be between 4 and 18 years' },
          { status: 400 }
        );
      }
      isMinorUser = isMinor(validatedData.dateOfBirth);
    }

    const currentUser = request.user;
    const updatedData = { ...currentUser, ...validatedData };
    const profileComplete = !!(
      updatedData.firstName &&
      updatedData.lastName &&
      updatedData.dateOfBirth &&
      updatedData.school &&
      updatedData.grade &&
      updatedData.address &&
      updatedData.city &&
      updatedData.country
    );

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...validatedData,
        ...(validatedData.dateOfBirth && { 
          dateOfBirth: new Date(validatedData.dateOfBirth),
          isMinor: isMinorUser,
        }),
        profileComplete,
      },
      include: {
        guardian: true,
      },
    });

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update profile error:', error);

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
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  return withUserAuth(request, handler);
}