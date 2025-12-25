import { baseApi } from "./baseApi"

export interface UserStartedTour {
  ID: number
  USER_ID: number
  FEATURE: string
  IS_COMPLETED: number
  CREATED_AT?: string
  UPDATED_AT?: string
}

export interface CreateStartedTourRequest {
  FEATURE: string
}

export interface GetStartedTourRequest {
  FEATURE: string
}

export interface StartedTourResponse {
  message?: string
  data: UserStartedTour | null
  status?: number
}

export const startedTourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStartedTour: builder.mutation<
      StartedTourResponse,
      CreateStartedTourRequest
    >({
      query: (body) => ({
        url: "/started-tour",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StartedTour"],
    }),

    getStartedTourByFeature: builder.query<
      StartedTourResponse,
      GetStartedTourRequest
    >({
      query: ({ FEATURE }) => ({
        url: "/started-tour",
        params: { FEATURE },
      }),
      providesTags: ["StartedTour"],
    }),
  }),
})

export const {
  useCreateStartedTourMutation,
  useGetStartedTourByFeatureQuery,
  useLazyGetStartedTourByFeatureQuery,
} = startedTourApi
