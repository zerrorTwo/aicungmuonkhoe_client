import { useEffect, useCallback } from 'react';
import { useRefreshTokenMutation } from '../store/api/authApi';

// Custom hook for managing authentication and token refresh
export const useAuth = () => {
    const [refreshToken, { isLoading: isRefreshing }] = useRefreshTokenMutation();

    // Function to manually refresh token
    const handleRefreshToken = useCallback(async () => {
        try {
            const result = await refreshToken().unwrap();

            // Update stored access token
            localStorage.setItem('access_token', result.data.access_token);

            console.log('Token refreshed successfully');
            return result;
        } catch (error) {
            console.error('Token refresh failed:', error);

            // Clear stored token and redirect to login
            localStorage.removeItem('access_token');
            window.location.href = '/login';

            throw error;
        }
    }, [refreshToken]);

    // Check if user is authenticated
    const isAuthenticated = useCallback(() => {
        const token = localStorage.getItem('access_token');
        return !!token;
    }, []);

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    }, []);

    // Auto refresh token on app startup if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            // Try to refresh token on app startup to ensure it's valid
            // This is optional - you might want to only refresh when needed
            console.log('Checking token validity on app startup...');
        }
    }, []);

    return {
        isAuthenticated,
        handleRefreshToken,
        logout,
        isRefreshing,
    };
};