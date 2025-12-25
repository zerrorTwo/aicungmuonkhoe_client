import { baseApi } from "./baseApi"

interface GetConclusionsRangeParams {
  MODEL: string
  START_TIME?: string
  END_TIME?: string
  ID: string
  AGE_TYPE: string
  ACTIVE_TAB: string
  SORT?: string
  OFFSET?: string
  LIMIT?: string
}

export const conclusionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConclusionById: builder.query({
      query: (id) => `/conclusion/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Conclusion", id }],
    }),
    createConclusion: builder.mutation({
      query: (data) => ({
        url: "/conclusion",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Conclusion"],
    }),
    deleteConclusion: builder.mutation({
      query: (id) => ({
        url: `/conclusion/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conclusion"],
    }),
    createConclusionClient: builder.mutation({
      query: (data) => ({
        url: "/conclusion/client",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Conclusion"],
    }),
    updateConclusionClient: builder.mutation({
      query: ({ id, data }) => ({
        url: `/conclusion/client/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Conclusion"],
    }),
    deleteConclusionClient: builder.mutation({
      query: (id) => ({
        url: `/conclusion/client/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conclusion"],
    }),
    getConclusionsPagination: builder.query({
      query: (params) => ({
        url: "/conclusion/pagination",
        method: "GET",
        params,
      }),
      providesTags: ["Conclusion"],
    }),
    getConclusionsRange: builder.query({
      query: (params: GetConclusionsRangeParams) => ({
        url: `/conclusion/range`,
        method: "GET",
        params,
      }),
      providesTags: ["Conclusion"],
    }),
  }),
})

export const {
  useGetConclusionByIdQuery,
  useCreateConclusionMutation,
  useDeleteConclusionMutation,
  useCreateConclusionClientMutation,
  useUpdateConclusionClientMutation,
  useDeleteConclusionClientMutation,
  useGetConclusionsPaginationQuery,
  useLazyGetConclusionsRangeQuery,
} = conclusionApi
