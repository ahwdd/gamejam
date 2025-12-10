// /lib/types/authType.ts

export interface Guardian {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalID?: string | null;
  relationshipToStudent: string;
  consentGiven: boolean;
  consentDate?: Date | string | null;
  consentDocumentURL?: string | null;
  signatureURL?: string | null;
  phoneKey: string;
  nationalIDImageURL?: string | null;
  approvalStatus?: string | null; // e.g. "pending", "approved", "rejected"
  rejectionReason?: string | null;
  approvedBy?: string | null;
  approvedAt?: Date | string | null;
  consentToken?: string | null;
  updatedAt?: Date | string;
  additionalStudents?: string[];
  willAttendEvent?: boolean;
  createdAt?: Date | string;
  winnerDocuments?: any[];
}

export interface User {
  id: string;
  email: string | null;
  passwordHash?: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  phoneKey: string | null;
  dateOfBirth: Date | string | null;
  isMinor: boolean;
  nationalID?: string | null;
  preferredLanguage: string;
  profilePhoto: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  isActive: boolean;
  school?: string | null;
  grade?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  profileComplete: boolean;
  guardianApprovalStatus: string | null; // null, "pending", "approved", "rejected"
  guardian?: Guardian | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  initializationComplete: boolean;
  sendWhatsAppRegisterOTP: (name: string, phone: string, phoneKey: string) => Promise<boolean>;
  verifyWhatsAppRegisterOTP: (phone: string, otp: string) => Promise<boolean>;
  sendEmailRegisterOTP: (name: string, email: string) => Promise<boolean>;
  verifyEmailRegisterOTP: (email: string, otp: string) => Promise<boolean>;
  sendWhatsAppLoginOTP: (phone: string, phoneKey: string) => Promise<boolean>;
  verifyWhatsAppLoginOTP: (phone: string, otp: string) => Promise<boolean>;
  sendEmailLoginOTP: (email: string) => Promise<boolean>;
  verifyEmailLoginOTP: (email: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearAuthError: () => void;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  data?: {
    phone?: string;
    email?: string;
    expires_in: number;
  };
  errors?: {
    [key: string]: string[];
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
  errors?: {
    [key: string]: string[];
  };
}