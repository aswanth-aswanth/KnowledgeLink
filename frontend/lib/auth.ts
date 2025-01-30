// utils/auth.ts
import { get } from 'http';
import { jwtDecode } from 'jwt-decode';
import { getFromLocalStorage } from './utils';

interface JwtPayload {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    return true;
  }
};

export const decodedToken = (): Object => {
  const token: string = getFromLocalStorage('token') || '';
  const decoded = jwtDecode(token);
  return decoded;
};
