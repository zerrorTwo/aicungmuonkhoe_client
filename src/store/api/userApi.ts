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
    }),
});

// Export hooks for components
export const {
    useCreateUserMutation,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetAllUsersQuery,
} = userApi;