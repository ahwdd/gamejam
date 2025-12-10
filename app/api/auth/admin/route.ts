import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedAdminRequest, isSuperAdmin } from '@/lib/middleware/adminAuth';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/bcrypt';
import { z } from 'zod';
// create new admin
const createAdminSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['admin', 'super_admin']).default('admin'),
});

async function handler(request: AuthenticatedAdminRequest) {
  try {
    const admin = request.admin;

    // Only super admins can create new admins
    if (!isSuperAdmin(admin)) {
      return NextResponse.json(
        { error: 'Only super admins can create new admins' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createAdminSchema.parse(body);

    // Check if username already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: validatedData.username },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (validatedData.email) {
      const existingEmail = await prisma.admin.findUnique({
        where: { email: validatedData.email },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create admin
    const newAdmin = await prisma.admin.create({
      data: {
        username: validatedData.username,
        passwordHash,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
        createdBy: admin.id,
      },
    });

    // Remove sensitive data
    const { passwordHash: _, ...adminWithoutPassword } = newAdmin;

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: adminWithoutPassword,
    });
  } catch (error) {
    console.error('Create admin error:', error);

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
      { error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return withAdminAuth(request, handler);
}