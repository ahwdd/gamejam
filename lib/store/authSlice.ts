import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  phoneKey: string | null;
  dateOfBirth: Date | string | null;
  isMinor: boolean;
  preferredLanguage: string;
  profilePhoto: string | null;
  school: string | null;
  grade: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  profileComplete: boolean;
  guardianApprovalStatus: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  guardian?: any;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  otpLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  usingLoginFlow: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  otpLoading: false,
  error: null,
  isAuthenticated: false,
  usingLoginFlow: false,
};

const isAlreadyRegisteredError = (error: string): boolean => {
  const lowerError = error.toLowerCase();
  console.log('lowerError :>> ', lowerError);
  return (
    lowerError.includes('already registered') ||
    lowerError.includes('already exists') ||
    lowerError.includes('user already exists') ||
    lowerError.includes('email already registered') ||
    lowerError.includes('phone already registered') ||
    lowerError.includes('the email has already been taken') ||
    lowerError.includes('email has already been taken') ||
    lowerError.includes('email is already in use')
  );
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/me', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        return rejectWithValue('Not authenticated');
      }
      
      const data = await response.json();
      if (data.success) {
        return data.user;
      }
      return rejectWithValue('Failed to fetch user');
    } catch (error) {
      console.log('error :>> ', error);
      return rejectWithValue('Network error');
    }
  }
);

export const sendWhatsAppRegisterOTP = createAsyncThunk(
  'auth/sendWhatsAppRegisterOTP',
  async (
    { name, phone, phone_key }: { name: string; phone: string; phone_key: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HUB_BASE_URL}/api/auth/register/whatsapp/send-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            phone_key,
            type: 'whatsapp',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok && data.message && isAlreadyRegisteredError(data.message)) {
        const loginResponse = await fetch(
          `${process.env.NEXT_PUBLIC_HUB_BASE_URL}/api/auth/login/whatsapp/send-otp`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone,
              phone_key,
              type: 'whatsapp',
            }),
          }
        );

        const loginData = await loginResponse.json();
        
        if (!loginResponse.ok) {
          return rejectWithValue(loginData.message || 'Failed to send OTP');
        }

        return { ...loginData, switchedToLogin: true };
      }

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to send OTP');
      }

      return { ...data, switchedToLogin: false };
    } catch (error) {
      console.log('error :>> ', error);
      return rejectWithValue('Network error');
    }
  }
);

export const verifyWhatsAppRegisterOTP = createAsyncThunk(
  'auth/verifyWhatsAppRegisterOTP',
  async (
    { phone, otp }: { phone: string; otp: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { auth: AuthState };
      const usingLoginFlow = state.auth.usingLoginFlow;

      // Use login endpoint if we switched to login flow
      const endpoint = usingLoginFlow 
        ? '/api/auth/login/whatsapp/verify-otp'
        : '/api/auth/register/whatsapp/verify-otp';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || data.message || 'Invalid OTP');
      }

      return data.user || data.data?.user;
    } catch (error) {
      console.log('error :>> ', error);
      return rejectWithValue('Network error');
    }
  }
);

export const sendEmailRegisterOTP = createAsyncThunk(
  'auth/sendEmailRegisterOTP',
  async (
    { name, email }: { name: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/auth/register/email/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      console.log('error :>> ', error);
      return rejectWithValue('Network error');
    }
  }
);

export const verifyEmailRegisterOTP = createAsyncThunk(
  'auth/verifyEmailRegisterOTP',
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { auth: AuthState };
      const usingLoginFlow = state.auth.usingLoginFlow;

      const endpoint = usingLoginFlow 
        ? '/api/auth/login/email/verify-otp'
        : '/api/auth/register/email/verify-otp';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || data.message || 'Invalid OTP');
      }

      return data.user || data.data?.user;
    } catch (error) {
      console.log('error :>> ', error);
      return rejectWithValue('Network error');
    }
  }
);

export const sendWhatsAppLoginOTP = createAsyncThunk(
  'auth/sendWhatsAppLoginOTP',
  async (
    { phone, phone_key }: { phone: string; phone_key: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HUB_BASE_URL}/api/auth/login/whatsapp/send-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            phone_key,
            type: 'whatsapp',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      console.log('error :>> ', error);
      return rejectWithValue('Network error');
    }
  }
);

export const verifyWhatsAppLoginOTP = createAsyncThunk(
  'auth/verifyWhatsAppLoginOTP',
  async (
    { phone, otp }: { phone: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/auth/login/whatsapp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || data.message || 'Invalid OTP');
      }

      return data.user || data.data?.user;
    } catch (error) {
      console.log('error :>> ', error);
      return rejectWithValue('Network error');
    }
  }
);

export const sendEmailLoginOTP = createAsyncThunk(
  'auth/sendEmailLoginOTP',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HUB_BASE_URL}/api/auth/login/email/send-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            type: 'email',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      console.log('error :>> ', error);
      return rejectWithValue('Network error');
    }
  }
);

export const verifyEmailLoginOTP = createAsyncThunk(
  'auth/verifyEmailLoginOTP',
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/auth/login/email/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || data.message || 'Invalid OTP');
      }

      return data.user || data.data?.user;
    } catch (error) {
      console.log('error :>> ', error);
      return rejectWithValue('Network error');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      return null;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const signOutAll = createAsyncThunk(
  'auth/signOutAll',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('/api/auth/logout-all', {
        method: 'POST',
        credentials: 'include',
      });
      return null;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    resetLoginFlow: (state) => {
      state.usingLoginFlow = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(sendWhatsAppRegisterOTP.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.usingLoginFlow = false; // Reset
      })
      .addCase(sendWhatsAppRegisterOTP.fulfilled, (state, action) => {
        state.otpLoading = false;
        if (action.payload.switchedToLogin) {
          state.usingLoginFlow = true;
        }
      })
      .addCase(sendWhatsAppRegisterOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload as string;
        state.usingLoginFlow = false;
      });

    builder
      .addCase(verifyWhatsAppRegisterOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyWhatsAppRegisterOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.usingLoginFlow = false; // Reset after successful auth
      })
      .addCase(verifyWhatsAppRegisterOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(sendEmailRegisterOTP.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.usingLoginFlow = false; // Reset
      })
      .addCase(sendEmailRegisterOTP.fulfilled, (state, action) => {
        state.otpLoading = false;
        if (action.payload.switchedToLogin) {
          state.usingLoginFlow = true;
        }
      })
      .addCase(sendEmailRegisterOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload as string;
        state.usingLoginFlow = false;
      });

    builder
      .addCase(verifyEmailRegisterOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailRegisterOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.usingLoginFlow = false; // Reset after successful auth
      })
      .addCase(verifyEmailRegisterOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(sendWhatsAppLoginOTP.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(sendWhatsAppLoginOTP.fulfilled, (state) => {
        state.otpLoading = false;
      })
      .addCase(sendWhatsAppLoginOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(verifyWhatsAppLoginOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyWhatsAppLoginOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyWhatsAppLoginOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(sendEmailLoginOTP.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(sendEmailLoginOTP.fulfilled, (state) => {
        state.otpLoading = false;
      })
      .addCase(sendEmailLoginOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(verifyEmailLoginOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailLoginOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyEmailLoginOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.usingLoginFlow = false;
      })
      .addCase(signOutAll.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.usingLoginFlow = false;
      });
  },
});

export const { clearError, setUser, resetLoginFlow } = authSlice.actions;
export default authSlice.reducer;