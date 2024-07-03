// utils/auth.ts
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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



export const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
            {
                refreshToken,
            }
        );
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null;
    }
};

