"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { 
  fetchCurrentUser, 
  sendWhatsAppRegisterOTP, 
  verifyWhatsAppRegisterOTP, 
  sendEmailRegisterOTP,
  verifyEmailRegisterOTP, 
  sendWhatsAppLoginOTP, 
  verifyWhatsAppLoginOTP, 
  sendEmailLoginOTP, 
  verifyEmailLoginOTP,
  signOut, 
  signOutAll, 
  clearError 
} from '@/lib/store/authSlice';
import { AuthContextType } from '@/lib/types/authType';

export const useAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, error, isAuthenticated, otpLoading } = useAppSelector((state) => state.auth);
  
  const fetchedOnce = useRef(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  const publicRoutes = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/about",
    "/contact",
  ];

  const alwaysAccessibleRoutes = [
    "/dashboard",
    "/profile/complete",
    "/profile/pending-approval",
  ];

  const isGuardianConsent = pathname?.startsWith("/guardian/consent/");

  const bypassProfileCheck =
    pathname?.startsWith("/profile/") || 
    pathname?.startsWith("/auth/") ||
    alwaysAccessibleRoutes.some(route => pathname === route);

  const isPublicRoute =
    publicRoutes.includes(pathname || "") || isGuardianConsent;

  useEffect(() => {
    if (!isAuthenticated && !loading && !fetchedOnce.current) {
      fetchedOnce.current = true;
      dispatch(fetchCurrentUser()).finally(() => {
        setInitializationComplete(true);
      });
    } else if (isAuthenticated) {
      setInitializationComplete(true);
    }
  }, [isAuthenticated, loading, dispatch]);

  useEffect(() => {
    if (!initializationComplete || loading || !user) return;

    if (isPublicRoute) return;

    if (bypassProfileCheck) return;

    // if (!user.isActive) {
    //   logout();
    //   return;
    // }

    if (!user.profileComplete && pathname !== "/dashboard") {
      router.push("/profile/complete");
      return;
    }
    
  }, [initializationComplete, loading, user, pathname, isPublicRoute, bypassProfileCheck, router]);

  const sendWhatsAppRegisterOTPHandler = async (
    name: string,
    phone: string,
    phoneKey: string
  ): Promise<boolean> => {
    try {
      const result = await dispatch(sendWhatsAppRegisterOTP({ name, phone, phone_key: phoneKey }));
      if (sendWhatsAppRegisterOTP.fulfilled.match(result)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Send WhatsApp Register OTP error:', error);
      return false;
    }
  };

  const verifyWhatsAppRegisterOTPHandler = async (
    phone: string,
    otp: string
  ): Promise<boolean> => {
    try {
      const result = await dispatch(verifyWhatsAppRegisterOTP({ phone, otp }));
      if (verifyWhatsAppRegisterOTP.fulfilled.match(result)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Verify WhatsApp Register OTP error:', error);
      return false;
    }
  };

  const sendEmailRegisterOTPHandler = async (
    name: string,
    email: string
  ): Promise<boolean> => {
    try {
      const result = await dispatch(sendEmailRegisterOTP({ name, email }));
      if (sendEmailRegisterOTP.fulfilled.match(result)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Send Email Register OTP error:', error);
      return false;
    }
  };

  const verifyEmailRegisterOTPHandler = async (
    email: string,
    otp: string
  ): Promise<boolean> => {
    try {
      const result = await dispatch(verifyEmailRegisterOTP({ email, otp }));
      if (verifyEmailRegisterOTP.fulfilled.match(result)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Verify Email Register OTP error:', error);
      return false;
    }
  };

  const sendWhatsAppLoginOTPHandler = async (
    phone: string,
    phoneKey: string
  ): Promise<boolean> => {
    try {
      const result = await dispatch(sendWhatsAppLoginOTP({ phone, phone_key: phoneKey }));
      if (sendWhatsAppLoginOTP.fulfilled.match(result)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Send WhatsApp Login OTP error:', error);
      return false;
    }
  };

  const verifyWhatsAppLoginOTPHandler = async (
    phone: string,
    otp: string
  ): Promise<boolean> => {
    try {
      const result = await dispatch(verifyWhatsAppLoginOTP({ phone, otp }));
      if (verifyWhatsAppLoginOTP.fulfilled.match(result)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Verify WhatsApp Login OTP error:', error);
      return false;
    }
  };

  const sendEmailLoginOTPHandler = async (
    email: string
  ): Promise<boolean> => {
    try {
      const result = await dispatch(sendEmailLoginOTP({ email }));
      if (sendEmailLoginOTP.fulfilled.match(result)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Send Email Login OTP error:', error);
      return false;
    }
  };

  const verifyEmailLoginOTPHandler = async (
    email: string,
    otp: string
  ): Promise<boolean> => {
    try {
      const result = await dispatch(verifyEmailLoginOTP({ email, otp }));
      if (verifyEmailLoginOTP.fulfilled.match(result)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Verify Email Login OTP error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await dispatch(signOut());
    router.push('/auth/signin');
  };

  const logoutAll = async (): Promise<void> => {
    await dispatch(signOutAll());
    router.push('/auth/signin');
  };

  const refreshUser = async (): Promise<void> => {
    await dispatch(fetchCurrentUser());
  };

  const clearAuthError = (): void => {
    dispatch(clearError());
  };

  return {
    user,
    loading: loading || otpLoading,
    error,
    isAuthenticated,
    initializationComplete,
    sendWhatsAppRegisterOTP: sendWhatsAppRegisterOTPHandler,
    verifyWhatsAppRegisterOTP: verifyWhatsAppRegisterOTPHandler,
    sendEmailRegisterOTP: sendEmailRegisterOTPHandler,
    verifyEmailRegisterOTP: verifyEmailRegisterOTPHandler,
    sendWhatsAppLoginOTP: sendWhatsAppLoginOTPHandler,
    verifyWhatsAppLoginOTP: verifyWhatsAppLoginOTPHandler,
    sendEmailLoginOTP: sendEmailLoginOTPHandler,
    verifyEmailLoginOTP: verifyEmailLoginOTPHandler,
    logout,
    logoutAll,
    refreshUser,
    clearAuthError,
  };
};

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireProfileComplete?: boolean;
    requireGuardianApproval?: boolean;
    redirectTo?: string;
  }
) => {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, isAuthenticated, initializationComplete } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (initializationComplete && !loading) {
        if (!isAuthenticated || !user) {
          router.push(options?.redirectTo || `/auth/signin?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        // Check profile completion
        if (options?.requireProfileComplete && !user.profileComplete) {
          router.push("/profile/complete");
          return;
        }

        // Check guardian approval for minors
        if (
          options?.requireGuardianApproval &&
          user.isMinor &&
          user.guardianApprovalStatus !== "approved"
        ) {
          router.push("/profile/pending-approval");
          return;
        }
      }
    }, [loading, initializationComplete, pathname, isAuthenticated, user, router]);

    if (!initializationComplete || loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return null;
    }

    return <Component {...props} />;
  };
};