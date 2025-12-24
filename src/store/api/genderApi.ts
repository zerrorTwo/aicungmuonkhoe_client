// Gender API endpoints using RTK Query
import { baseApi } from "./baseApi"

export interface Gender {
  ID: number
  NAME: string
  CD?: string
  DESC?: string
  CREATED_DATE?: string
  CREATED_BY?: string | null
  MODIFIED_DATE?: string
  MODIFIED_BY?: string | null
  IS_DELETED?: number
}

export interface GendersListResponse {
  message?: string
  data: Gender[]
  status?: number
}

export const genderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGenders: builder.query<GendersListResponse, void>({
      query: () => "/gender",
      providesTags: ["Gender"],
    }),
  }),
})

export const { useGetAllGendersQuery } = genderApi
