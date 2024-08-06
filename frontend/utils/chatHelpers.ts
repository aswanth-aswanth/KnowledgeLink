import { jwtDecode } from "jwt-decode";

export const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
};

export const getCurrentUserId = (token: string) => {
    try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.userId;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};