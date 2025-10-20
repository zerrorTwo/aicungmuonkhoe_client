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
    }),
    createConclusion: builder.mutation({
      query: (data) => ({
        url: "/conclusion",
        method: "POST",
        body: data,
      }),
    }),
    deleteConclusion: builder.mutation({
      query: (id) => ({
        url: `/conclusion/${id}`,
        method: "DELETE",
      }),
    }),
    createConclusionClient: builder.mutation({
      query: (data) => ({
        url: "/conclusion/client",
        method: "POST",
        body: data,
      }),
    }),
    updateConclusionClient: builder.mutation({
      query: ({ id, data }) => ({
        url: `/conclusion/client/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    getConclusionsPagination: builder.query({
      query: (params) => ({
        url: "/conclusion/pagination",
        method: "GET",
        params,
      }),
    }),
    getConclusionsRange: builder.query({
      query: (params: GetConclusionsRangeParams) => ({
        url: `/conclusion/range?MODEL=${params.MODEL}&START_TIME=${params.START_TIME}&END_TIME=${params.END_TIME}&ID=${params.ID}&AGE_TYPE=${params.AGE_TYPE}&ACTIVE_TAB=${params.ACTIVE_TAB}&SORT=${params.SORT || ""}&OFFSET=${params.OFFSET || ""}&LIMIT=${params.LIMIT || ""}`,
        method: "GET",
      }),
    }),
  }),
})

export const {
  useGetConclusionByIdQuery,
  useCreateConclusionMutation,
  useDeleteConclusionMutation,
  useCreateConclusionClientMutation,
  useUpdateConclusionClientMutation,
  useGetConclusionsPaginationQuery,
  useLazyGetConclusionsRangeQuery,
} = conclusionApi
