'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const cache = new Map();
const CACHE_TIME = 5000; // 5 sekund

export function useApi() {
  const router = useRouter();

  const getAuthHeaders = useCallback(() => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  }), []);

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    // Sprawdź cache
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      const { data, timestamp } = cachedData;
      if (Date.now() - timestamp < CACHE_TIME) {
        return data;
      }
      cache.delete(cacheKey);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...(options.headers || {}),
        },
      });

      if (response.status === 401) {
        router.push('/login');
        return null;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Zapisz w cache
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }, [router, getAuthHeaders]);

  return { fetchWithAuth, getAuthHeaders };
} 