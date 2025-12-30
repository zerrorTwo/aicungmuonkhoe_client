import { baseApi } from "./baseApi"

export interface Banner {
  ID: number
  IMAGE: string
  TITLE: string
  ACTIVE: boolean
  CREATED_AT: string
  UPDATED_AT: string
}

export interface BannerResponse {
  success: boolean
  message: string
  data: Banner[]
}

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveBanners: builder.query<BannerResponse, void>({
      query: () => "/client/banners",
      providesTags: ["Banner"],
    }),
  }),
})

export const { useGetActiveBannersQuery } = bannerApi
