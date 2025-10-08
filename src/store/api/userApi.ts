// User API endpoints using RTK Query
import { baseApi } from './baseApi';
import type { AuthUser } from './authApi';

// Types based on backend DTOs
export interface CreateUserRequest {
    email: string;
    password: string;
    full_name?: string;
    phone_number?: string;
    date_of_birth?: string;
    gender_id?: number;
}

export interface UpdateUserRequest {
    full_name?: string;
    phone_number?: string;
    date_of_birth?: string;
    gender_id?: number;
}

export interface UserResponse {
    success: boolean;
    message: string;
    data: AuthUser;
}

export interface UsersListResponse {
    success: boolean;
    message: string;
    data: AuthUser[];
}

export interface UserProfileHealthDocument {
    id: number;
    height: string;
    weight: string;
    healthStatus: string;
    exerciseFrequency: string;
    isCompleted: boolean;
}

export interface UserProfileData {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string;
    avatar: string;
    isActive: boolean;
    isAdmin: boolean;
    healthDocument: UserProfileHealthDocument;
}

export interface UserProfileResponse {
    data: UserProfileData;
    message: string;
    status: number;
}

// Update user profile request
export interface UpdateUserProfileRequest {
    fullName?: string;
    phone?: string;
    birthDate?: string;
    address?: string;
    avatar?: string;
    genderId?: number;
}

// User API slice
export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create new user
        createUser: builder.mutation<UserResponse, CreateUserRequest>({
            query: (userData) => ({
                url: '/user',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),

        // Get user by ID
        getUserById: builder.query<UserResponse, number>({
            query: (id) => `/user/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        // Update user by ID
        updateUser: builder.mutation<UserResponse, { id: number; data: UpdateUserRequest }>({
            query: ({ id, data }) => ({
                url: `/user/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
        }),

        // Delete user by ID
        deleteUser: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        // Get all users (admin only)
        getAllUsers: builder.query<UsersListResponse, void>({
            query: () => '/user',
            providesTags: ['User'],
        }),

        // Get user profile (including health document)
        getUserProfile: builder.query<UserProfileResponse, void>({
            query: () => '/user/profile/me',
            providesTags: ['User'],
        }),

        // Update user profile
        updateUserProfile: builder.mutation<UserProfileResponse, UpdateUserProfileRequest>({
            query: (updateData) => ({
                url: '/user/profile/me',
                method: 'PUT',
                body: updateData,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

// Export hooks for components
export const {
    useCreateUserMutation,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetAllUsersQuery,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
} = userApi;