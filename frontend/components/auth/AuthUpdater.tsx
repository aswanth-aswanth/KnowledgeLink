'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import {
  setAuthState,
  clearAuthState,
  checkTokenExpiration,
} from '@/redux/authSlice';
import { saveToLocalStorage, removeFromLocalStorage } from '@/lib/utils';
import { isTokenExpired } from '@/lib/auth';

interface DecodedToken {
  id: string;
  username: string;
  email: string;
  image?: string;
  role?: string;
}

const AuthUpdater: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      saveToLocalStorage('token', tokenFromUrl);

      if (isTokenExpired(tokenFromUrl)) {
        removeFromLocalStorage('token');
        dispatch(clearAuthState());
        return;
      }

      const decoded = jwtDecode<DecodedToken>(tokenFromUrl);
      dispatch(
        setAuthState({
          isAuthenticated: true,
          token: tokenFromUrl,
          user: {
            id: decoded.id,
            name: decoded.username,
            email: decoded.email,
            imageUrl: decoded.image,
            role: decoded.role,
          },
        })
      );
    } else {
      dispatch(checkTokenExpiration());
    }
  }, [searchParams, dispatch, router]);

  return null;
};

export default AuthUpdater;
