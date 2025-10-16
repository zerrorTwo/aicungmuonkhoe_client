// Base API configuration for RTK Query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Define base URL for API - adjust according to your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/v1/api';

// Define base query with authentication header
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    // baseApi.ts - sửa prepareHeaders
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access_token');
        if (token) headers.set('authorization', `Bearer ${token}`);
        // Không set Content-Type ở đây: trình duyệt sẽ tự set khi body là FormData
        return headers;
    },

});


// Enhanced base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // If we get a 401 (unauthorized), try to refresh the token
    if (result.error && result.error.status === 410) {
        console.log('Access token expired, trying to refresh...');

        // Try to refresh the token
        const refreshResult = await baseQuery(
            {
                url: '/auth/refresh-token',
                method: 'GET',
            },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            // Extract the new access token from the response
            const refreshData = refreshResult.data as {
                data: { access_token: string; user: any };
            };

            // Store the new access token
            localStorage.setItem('access_token', refreshData.data.access_token);

            console.log('Token refreshed successfully, retrying original request...');

            // Retry the original query with the new token
            result = await baseQuery(args, api, extraOptions);
        } else {
            console.log('Token refresh failed, redirecting to login...');
            // Refresh failed, remove stored token and redirect to login
            localStorage.removeItem('access_token');
            // You might want to dispatch a logout action here
            window.location.href = '/login';
        }
    }

    return result;
};

// Base API slice with automatic tag system
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth, // Use the enhanced base query
    tagTypes: [
        'Auth',
        'User',
        'HealthDocument',
        'Gender',
        'ExerciseIntensity'
    ],
    endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const { } = baseApi;