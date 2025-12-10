// /api/guardian/consent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const guardianConsentSchema = z.object({
  guardianName: z.string().min(1, "Guardian name is required"),
  guardianEmail: z.string().email("Valid email is required"),
  guardianPhone: z.string().min(10, "Valid phone number is required"),
  guardianPhoneKey: z.string().min(1, "Country code is required"),
  relationshipToStudent: z.string().min(1, "Relationship is required"),
});

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = guardianConsentSchema.parse(body);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_HUB_BASE_URL}/api/guardian/consent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Guardian consent error:', error);
    
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