// Auth API endpoints using RTK Query
import { baseApi } from './baseApi';

// Types based on backend DTOs
export interface LoginRequest {
    EMAIL: string;
    PASSWORD: string;
}

export interface SignupRequest {
    EMAIL: string;
    PHONE: string;
    PASSWORD: string;
    FIRST_NAME?: string;
    LAST_NAME?: string;
}

export interface LoginResponse {
    status: number;
    message: string;
    data: {
        user: AuthUser;
        access_token: string;
    };
}

export interface AuthUser {
    USER_ID: number;
    EMAIL: string;
    PHONE?: string;
    STATUS_ACTIVE?: number;
    IS_ADMIN?: number;
    IS_DELETED?: number;
    FACE_IMAGE?: string;
    START_TOUR?: string;
    CREATED_AT?: string;
    UPDATED_AT?: string;
}

// Auth API slice
export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login mutation
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),

        // Signup mutation  
        signup: builder.mutation<LoginResponse, SignupRequest>({
            query: (userData) => ({
                url: '/auth/signup',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
        }),

        // Logout mutation
        logout: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),

        // Get current user profile
        getProfile: builder.query<{ data: AuthUser }, void>({
            query: () => '/auth/profile',
            providesTags: ['Auth'],
        }),

        // Refresh access token
        refreshToken: builder.mutation<LoginResponse, void>({
            query: () => ({
                url: '/auth/refresh-token',
                method: 'GET',
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

// Export hooks for components
export const {
    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useRefreshTokenMutation,
} = authApi;