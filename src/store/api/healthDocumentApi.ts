// Health Document API endpoints using RTK Query
import { baseApi } from "./baseApi";

// Types based on backend DTOs
export interface HealthDocument {
  ID: number;
  NAME?: string;
  FULL_NAME?: string;
  DOB?: string;
  PHONE?: string;
  IS_LINK: boolean;
  IS_SYNC: boolean;
  TYPE?: string;
  HEIGHT?: string;
  WEIGHT?: string;
  HEALTH_STATUS?: string;
  JOB?: string;
  DATE_WORKDAY?: number;
  DATE_OFF?: number;
  IS_MYSELF: boolean;
  IS_UPDATE: boolean;
  AVATAR?: string;
  EXERCISE_FREQUENCY?: string;
  PROVINCE?: string;
  USER?: {
    user_id: number;
    email: string;
    phone?: string;
  };
  GENDER?: {
    id: number;
    name: string;
    cd?: string;
    desc?: string;
  };
  EXERCISE_INTENSITY?: {
    id: number;
    code: string;
    displayName: string;
  };
}

export interface CreateHealthDocumentRequest {
  NAME?: string;
  FULL_NAME?: string;
  DOB?: string;
  PHONE?: string;
  IS_LINK?: boolean;
  IS_SYNC?: boolean;
  TYPE?: string;
  HEIGHT?: string;
  WEIGHT?: string;
  HEALTH_STATUS?: string;
  JOB?: string;
  DATE_WORKDAY?: number;
  DATE_OFF?: number;
  IS_MYSELF?: boolean;
  IS_UPDATE?: boolean;
  AVATAR?: string;
  EXERCISE_FREQUENCY?: string;
  PROVINCE?: string;
  GENDER_ID?: number;
  EXERCISE_INTENSITY_ID?: number;
}

export interface UpdateHealthDocumentRequest
  extends CreateHealthDocumentRequest {
  id: number;
}

export interface HealthDocumentResponse {
  message: string;
  data: HealthDocument;
  status: number;
}

export interface HealthDocumentsListResponse {
  message: string;
  data: HealthDocument[];
  status: number;
}

// Health Document API slice
export const healthDocumentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create new health document
    createHealthDocument: builder.mutation<
      HealthDocumentResponse,
      CreateHealthDocumentRequest
    >({
      query: (data) => ({
        url: "/health-document",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HealthDocument"],
    }),

    // Get current user's health document
    getMyHealthDocument: builder.query<HealthDocumentResponse, void>({
      query: () => "/health-document/myself",
      providesTags: ["HealthDocument"],
    }),

    // Get all health documents of current user
    getAllHealthDocumentsOfUser: builder.query<
      HealthDocumentsListResponse,
      void
    >({
      query: () => `/health-document/all`,
      providesTags: ["HealthDocument"],
    }),

    // Get health document by ID
    getHealthDocumentById: builder.query<HealthDocumentResponse, number>({
      query: (id) => `/health-document/${id}`,
      providesTags: (_result, _error, id) => [{ type: "HealthDocument", id }],
    }),

    // Get health documents by user ID
    getHealthDocumentsByUserId: builder.query<
      HealthDocumentsListResponse,
      number
    >({
      query: (userId) => `/health-document/user/${userId}`,
      providesTags: ["HealthDocument"],
    }),

    // Update health document by ID
    updateHealthDocument: builder.mutation<
      HealthDocumentResponse,
      { id: number; data: UpdateHealthDocumentRequest }
    >({
      query: ({ id, data }) => ({
        url: `/health-document/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "HealthDocument", id },
      ],
    }),

    // Delete health document by ID
    deleteHealthDocument: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/health-document/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "HealthDocument", id },
      ],
    }),

    // Get all health documents (admin only)
    getAllHealthDocuments: builder.query<HealthDocumentsListResponse, void>({
      query: () => "/health-document",
      providesTags: ["HealthDocument"],
    }),
  }),
});

// Export hooks for components
export const {
  useCreateHealthDocumentMutation,
  useGetHealthDocumentByIdQuery,
  useGetHealthDocumentsByUserIdQuery,
  useGetMyHealthDocumentQuery,
  useUpdateHealthDocumentMutation,
  useDeleteHealthDocumentMutation,
  useGetAllHealthDocumentsQuery,
  useGetAllHealthDocumentsOfUserQuery,
} = healthDocumentApi;
