import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ['auth/fetchCurrentUser/fulfilled', 'auth/verifyWhatsAppRegisterOTP/fulfilled', 'auth/verifyEmailRegisterOTP/fulfilled'],
          // Ignore these field paths in all actions
          ignoredActionPaths: ['payload.dateOfBirth', 'payload.createdAt', 'payload.updatedAt'],
          // Ignore these paths in the state
          ignoredPaths: ['auth.user.dateOfBirth', 'auth.user.createdAt', 'auth.user.updatedAt'],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];