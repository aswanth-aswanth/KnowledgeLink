// utils/auth.ts
import {jwtDecode} from 'jwt-decode';

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
