import type { Range } from "@/components/range-picker"
import { createAppSlice } from "../createAppSlice"
import type { Conclusion } from "@/types/health"
import type { Sort } from "@/types/common"
import { BMIAgeRange } from "@/enum/health"

export type ConclusionSliceState = {
  loading: boolean
  createSuccess?: boolean
  conclusionList: Conclusion[]
  conclusionListPagination: Conclusion[]
  error?: string
  pagination: {
    curPage: number
    limitPage: number
    totalPage: number
    totalRows: number
  }
}

const initialState: ConclusionSliceState = {
  loading: false,
  conclusionList: [],
  conclusionListPagination: [],
  pagination: {
    curPage: 1,
    limitPage: 10,
    totalPage: 1,
    totalRows: 1,
  },
}

export const conclusionSlice = createAppSlice({
  name: "conclusion",
  initialState,
  reducers: (create) => ({
    createConclusion: create.asyncThunk(
      async (data: any) => {
        // TODO: Implement API call
        console.log("createConclusion:", data)
        return { success: true }
      },
      {
        pending: (state) => {
          state.loading = true
          state.createSuccess = false
        },
        fulfilled: (state) => {
          state.loading = false
          state.createSuccess = true
        },
        rejected: (state, action) => {
          state.loading = false
          state.createSuccess = false
          state.error = action.error.message
        },
      }
    ),
    updateConclusion: create.asyncThunk(
      async (data: any) => {
        // TODO: Implement API call
        console.log("updateConclusion:", data)
        return { success: true, id: data.id }
      },
      {
        pending: (state) => {
          state.loading = true
          state.createSuccess = false
        },
        fulfilled: (state) => {
          state.loading = false
          state.createSuccess = true
        },
        rejected: (state, action) => {
          state.loading = false
          state.createSuccess = false
          state.error = action.error.message
        },
      }
    ),
    getDetailConclusionByModelPagination: create.asyncThunk(
      async (params: {
        id?: string
        model: string
        limit?: number
        sort?: Sort
        ageType?: BMIAgeRange
        activeTab?: string
      }) => {
        // TODO: Implement API call
        console.log("getDetailConclusionByModelPagination:", params)
        return { listData: [], paging: initialState.pagination }
      },
      {
        pending: (state) => {
          state.loading = true
          state.conclusionListPagination = initialState.conclusionListPagination
        },
        fulfilled: (state, action) => {
          state.loading = false
          state.pagination = action.payload.paging
          state.conclusionListPagination = action.payload.listData || []
        },
        rejected: (state, action) => {
          state.loading = false
          state.error = action.error.message
        },
      }
    ),
    resetConclusionStatus: create.reducer((state) => {
      state.error = undefined
      state.createSuccess = false
    }),
    resetConclusionData: create.reducer((state) => {
      state.conclusionList = []
      state.conclusionListPagination = []
    }),
  }),

  selectors: {
    watchConclusionState: (conclusion) => conclusion,
    watchConclusionCreateStatus: (conclusion) => conclusion.createSuccess,
    watchConclusionList: (conclusion) => conclusion.conclusionList,
    watchConclusionListPagination: (conclusion) =>
      conclusion.conclusionListPagination,
    watchConclusionPagination: (conclusion) => conclusion.pagination,
    watchConclusionError: (conclusion) => conclusion.error,
    watchConclusionLoading: (conclusion) => conclusion.loading,
  },
})

export const {
  watchConclusionState,
  watchConclusionCreateStatus,
  watchConclusionList,
  watchConclusionListPagination,
  watchConclusionPagination,
  watchConclusionError,
  watchConclusionLoading,
} = conclusionSlice.selectors

export const {
  createConclusion,
  updateConclusion,
  resetConclusionStatus,
  getDetailConclusionByModelPagination,
  resetConclusionData,
} = conclusionSlice.actions

export default conclusionSlice.reducer
