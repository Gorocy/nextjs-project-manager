'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return false;
    }
    return true;
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const getAuthHeaders = useCallback(() => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  }), []);

  return {
    getAuthHeaders,
    checkAuth,
    isAuthenticated: () => !!localStorage.getItem('token'),
  };
} 