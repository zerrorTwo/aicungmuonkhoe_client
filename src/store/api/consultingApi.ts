import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CONSULTING_API_URL = import.meta.env.VITE_CONSULTING_API_URL || "http://localhost:7071/api";

export interface NutritionalStandardResponse {
    NUTRITIONAL_STANDARD_ID: number;
    ENERGY_MIN: number;
    ENERGY_MAX: number;
    PLG_DAY_P_PERCENT_MIN: number;
    PLG_DAY_P_PERCENT_MAX: number;
    PLG_DAY_L_PERCENT_MIN: number;
    PLG_DAY_L_PERCENT_MAX: number;
    PLG_DAY_G_PERCENT_MIN: number;
    PLG_DAY_G_PERCENT_MAX: number;
    STANDARD_DAY_SALT: number;
    SUGAR_STANDARD_DAY: number;
    WATER_STANDARD_DAY_MIN: number;
    WATER_STANDARD_DAY_MAX: number;
    [key: string]: any;
}

export interface FoodRecommendation {
    FOOD_ID: number;
    FOOD_NAME: string;
    IMAGE_URL?: string;
    ENERGY: number;
    PROTID: number;
    LIPID: number;
    GLUCID: number;
    [key: string]: any;
}

export interface FoodRecommendationsResponse {
    healthStatusId: string;
    listData: FoodRecommendation[];
    paging: {
        curPage: number;
        limitPage: number;
        totalRows: number;
        totalPage: number;
    };
}

export const consultingApi = createApi({
  reducerPath: "consultingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CONSULTING_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getNutritionalStandard: builder.query<NutritionalStandardResponse, { healthDocumentId: number }>({
      // MOCK DATA IMPLEMENTATION
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
          data: {
            NUTRITIONAL_STANDARD_ID: 1,
            ENERGY_MIN: 1800,
            ENERGY_MAX: 2200,
            PLG_DAY_P_PERCENT_MIN: 13,
            PLG_DAY_P_PERCENT_MAX: 20,
            PLG_DAY_L_PERCENT_MIN: 20,
            PLG_DAY_L_PERCENT_MAX: 30,
            PLG_DAY_G_PERCENT_MIN: 55,
            PLG_DAY_G_PERCENT_MAX: 65,
            STANDARD_DAY_SALT: 5,
            SUGAR_STANDARD_DAY: 25,
            WATER_STANDARD_DAY_MIN: 1500,
            WATER_STANDARD_DAY_MAX: 2500,
            CALCI_STANDARD_DAY: 1000,
            IRON_STANDARD_DAY: 18,
            VITAMIN_A_STANDARD_DAY: 600,
            VITAMIN_C_STANDARD_DAY: 75,
            VITAMIN_D_STANDARD_DAY: 600,
            ZINC_STANDARD_DAY: 11,
            FIBER_STANDARD_DAY_MIN: 25,
            FIBER_STANDARD_DAY_MAX: 30,
            CHOLESTEROL_STANDARD_DAY: 300
          }
        };
      },
    }),
    getFoodRecommendations: builder.query<FoodRecommendationsResponse, { 
      HEALTH_DOCUMENT_ID: number;
      TYPE_ADVICE: 'NENAN' | 'HANCHEAN';
      SEARCH?: string;
      FOOD_GROUPS?: string[];
      PAGE?: number;
      LIMIT?: number;
    }>({
      // MOCK DATA IMPLEMENTATION
      queryFn: async (args) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const isRecommended = args.TYPE_ADVICE === 'NENAN';
        
        const mockFoods: FoodRecommendation[] = isRecommended ? [
            {
                FOOD_ID: 1,
                FOOD_NAME: "Cá hồi áp chảo",
                IMAGE_URL: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=500",
                ENERGY: 208,
                PROTID: 20,
                LIPID: 13,
                GLUCID: 0
            },
            {
                FOOD_ID: 2,
                FOOD_NAME: "Ức gà luộc",
                IMAGE_URL: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=500",
                ENERGY: 165,
                PROTID: 31,
                LIPID: 3.6,
                GLUCID: 0
            },
            {
                FOOD_ID: 3,
                FOOD_NAME: "Súp lơ xanh hấp",
                IMAGE_URL: "https://images.unsplash.com/photo-1583064313642-a7c149480c7e?auto=format&fit=crop&q=80&w=500",
                ENERGY: 34,
                PROTID: 2.8,
                LIPID: 0.4,
                GLUCID: 7
            },
            {
                FOOD_ID: 4,
                FOOD_NAME: "Gạo lứt",
                IMAGE_URL: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=500",
                ENERGY: 110,
                PROTID: 2.6,
                LIPID: 0.9,
                GLUCID: 23
            }
        ] : [
            {
                FOOD_ID: 5,
                FOOD_NAME: "Khoai tây chiên",
                IMAGE_URL: "https://images.unsplash.com/photo-1573080496987-a199f8cd4058?auto=format&fit=crop&q=80&w=500",
                ENERGY: 312,
                PROTID: 3.4,
                LIPID: 15,
                GLUCID: 41
            },
            {
                FOOD_ID: 6,
                FOOD_NAME: "Nước ngọt có gas",
                IMAGE_URL: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=500",
                ENERGY: 42,
                PROTID: 0,
                LIPID: 0,
                GLUCID: 10.6
            },
            {
                FOOD_ID: 7,
                FOOD_NAME: "Thịt ba chỉ kho",
                IMAGE_URL: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=500",
                ENERGY: 518,
                PROTID: 9,
                LIPID: 53,
                GLUCID: 0
            }
        ];

        return {
          data: {
            healthStatusId: "TTSK001",
            listData: mockFoods,
            paging: {
                curPage: args.PAGE || 1,
                limitPage: args.LIMIT || 10,
                totalRows: mockFoods.length,
                totalPage: 1
            }
          }
        };
      },
    }),
    getSaltAdvice: builder.query<number, { id: number; type: 'SALT' | 'SUGAR' | 'WATER' }>({
      // MOCK DATA IMPLEMENTATION
      queryFn: async (args) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        let value = 0;
        if (args.type === 'SALT') value = 5;
        if (args.type === 'SUGAR') value = 25;
        if (args.type === 'WATER') value = 2; // Liters
        return { data: value };
      },
    }),
  }),
});

export const {
  useGetNutritionalStandardQuery,
  useGetFoodRecommendationsQuery,
  useGetSaltAdviceQuery,
} = consultingApi;
