// Environment configuration
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,

    // Auth endpoints
    auth: {
        login: '/auth/login',
        signup: '/auth/signup',
        logout: '/auth/logout',
        profile: '/auth/profile',
    },

    // User endpoints
    user: {
        base: '/user',
        byId: (id: number) => `/user/${id}`,
    },

    // Health Document endpoints
    healthDocument: {
        base: '/health-document',
        byId: (id: number) => `/health-document/${id}`,
        byUserId: (userId: number) => `/health-document/user/${userId}`,
    },
};

// API Response wrapper type
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

// Common error handling
export const handleApiError = (error: any) => {
    if (error?.data?.message) {
        return error.data.message;
    }
    if (error?.message) {
        return error.message;
    }
    return 'Đã xảy ra lỗi không xác định';
};

// Token management
export const tokenManager = {
    getToken: () => localStorage.getItem('access_token'),
    setToken: (token: string) => localStorage.setItem('access_token', token),
    removeToken: () => localStorage.removeItem('access_token'),
    isAuthenticated: () => !!localStorage.getItem('access_token'),
};