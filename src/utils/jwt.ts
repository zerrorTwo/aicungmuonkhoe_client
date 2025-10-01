// JWT utilities for token management

export interface JWTPayload {
    user_id: number;
    email: string;
    iat: number; // issued at
    exp: number; // expires at
}

// Decode JWT token without verification (client-side only for checking expiry)
export const decodeJWT = (token: string): JWTPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
    const payload = decodeJWT(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

// Check if token will expire soon (within next 5 minutes)
export const isTokenExpiringSoon = (token: string, bufferMinutes: number = 5): boolean => {
    const payload = decodeJWT(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = bufferMinutes * 60; // Convert minutes to seconds

    return payload.exp < (currentTime + bufferTime);
};

// Get time until token expires (in seconds)
export const getTokenExpiryTime = (token: string): number => {
    const payload = decodeJWT(token);
    if (!payload) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - currentTime);
};

// Format expiry time to human readable string
export const formatExpiryTime = (seconds: number): string => {
    if (seconds <= 0) return 'Expired';

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ${hours % 24} hour${(hours % 24) !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} minute${(minutes % 60) !== 1 ? 's' : ''}`;
    } else {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
};