import type { DishBasic, DishDetail } from "@/types/dish.type";
import { baseApi } from "./baseApi";

export const dishApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get dishes by age
    getDishesByAge: builder.query<
      { success: boolean; data: DishBasic[] },
      number
    >({
      query: (age) => `/dishes/by-age?age=${age}`,
    }),

    // Get dish detail
    getDishDetail: builder.query<
      { success: boolean; data: DishDetail },
      { id: string; ageGroupId: string }
    >({
      query: ({ id, ageGroupId }) =>
        `/dishes/${id}/detail?ageGroupId=${ageGroupId}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetDishesByAgeQuery, useGetDishDetailQuery } = dishApi;
