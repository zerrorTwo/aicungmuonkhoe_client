// Auth API endpoints using RTK Query
import { baseApi } from "./baseApi";

export interface ProvinceResponse {
  status: number;
  message: string;
  data: Province[];
}

export interface Province {
  PROVINCE_ID: number;
  NAME: string;
  CODE: string;
  TYPE: string;
  NAME_WITH_TYPE: string;
  CREATED_AT?: string;
  UPDATED_AT?: string;
}

// Auth API slice
export const provinceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all provinces
    getAllProvinces: builder.query<ProvinceResponse, void>({
      query: () => "/province",
      providesTags: ["Province"],
    }),
  }),
});

// Export hooks for components
export const { useGetAllProvincesQuery } = provinceApi;
