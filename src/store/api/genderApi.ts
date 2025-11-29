// Gender API endpoints using RTK Query
import { baseApi } from "./baseApi"

export interface Gender {
  id: number
  name: string
  cd?: string
  desc?: string
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
