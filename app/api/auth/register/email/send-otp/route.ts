// /api/auth/register/email/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const sendEmailOTPSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = sendEmailOTPSchema.parse(body);
    
    // First, try registration endpoint
    const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_HUB_BASE_URL}/api/auth/register/email/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });
    
    const registerData = await registerResponse.json();
    
    // Check if user already exists (smart routing)
    if (!registerResponse.ok) {
      let isAlreadyRegistered = false;
      
      // Check the main message
      if (registerData.message) {
        const errorMessage = registerData.message.toLowerCase();
        isAlreadyRegistered = 
          errorMessage.includes('the email has already been taken') ||
          errorMessage.includes('already registered') ||
          errorMessage.includes('already exists') ||
          errorMessage.includes('user already exists') ||
          errorMessage.includes('email already registered') ||
          errorMessage.includes('email has already been taken') ||
          errorMessage.includes('email is already in use');
      }
      
      // IMPORTANT: Also check errors.email array (Laravel validation format)
      if (!isAlreadyRegistered && registerData.errors?.email) {
        const emailErrors = Array.isArray(registerData.errors.email) 
          ? registerData.errors.email 
          : [registerData.errors.email];
        
        // Check each error message in the array
        for (const errorMsg of emailErrors) {
          const lowerError = String(errorMsg).toLowerCase();
          if (
            lowerError.includes('the email has already been taken') ||
            lowerError.includes('already registered') ||
            lowerError.includes('already exists') ||
            lowerError.includes('email already registered') ||
            lowerError.includes('email has already been taken') ||
            lowerError.includes('email is already in use')
          ) {
            isAlreadyRegistered = true;
            break;
          }
        }
      }
      
      console.log('[Email Register] Full error response:', JSON.stringify(registerData, null, 2));
      console.log('[Email Register] Is already registered:', isAlreadyRegistered);
      
      if (isAlreadyRegistered) {
        console.log(`📧 User already exists, switching to login flow: ${validatedData.email}`);
        
        // Switch to login endpoint
        const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_HUB_BASE_URL}/api/auth/login/email/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: validatedData.email,
            type: 'email',
          }),
        });
        
        const loginData = await loginResponse.json();
        
        if (!loginResponse.ok) {
          // Return the actual error message from login endpoint
          return NextResponse.json({
            success: false,
            message: loginData.message || 'Failed to send login OTP',
            errors: loginData.errors
          }, { status: loginResponse.status });
        }
        
        // Return success with flag indicating switched flow
        return NextResponse.json({
          success: loginData.success,
          message: loginData.message || 'Welcome back! Please enter your OTP to sign in.',
          data: loginData.data,
          switchedToLogin: true,
        });
      }
      
      // If error is not about existing user, return the original error
      // Extract the actual error message from errors object if available
      let displayMessage = registerData.message || 'Registration failed';
      
      // If it's a validation error, try to get more specific message
      if (registerData.errors) {
        if (registerData.errors.email && Array.isArray(registerData.errors.email)) {
          displayMessage = registerData.errors.email[0]; // Use first email error as main message
        } else if (registerData.errors.name && Array.isArray(registerData.errors.name)) {
          displayMessage = registerData.errors.name[0];
        }
      }
      
      return NextResponse.json({
        success: false,
        message: displayMessage,
        errors: registerData.errors
      }, { status: registerResponse.status });
    }
    
    // If registration was successful
    if (registerResponse.ok) {
      return NextResponse.json({
        success: registerData.success,
        message: registerData.message || 'OTP sent successfully',
        data: registerData.data,
        switchedToLogin: false,
      });
    }
    
    // Fallback for unexpected responses
    return NextResponse.json(registerData, { status: registerResponse.status });
    
  } catch (error) {
    console.error('Error sending Email OTP:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error"
    }, { status: 500 });
  }
}