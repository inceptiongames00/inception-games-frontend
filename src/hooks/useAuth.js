'use client';

import { useContext } from 'react';
import { AuthContext } from '../app/context/AuthContext';

/**
 * 
 * Usage: const { user, loginSendOTP, loginVerifyOTP, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default useAuth;
