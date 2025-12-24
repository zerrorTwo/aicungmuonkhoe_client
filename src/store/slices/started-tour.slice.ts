import { StartTourModule } from "@/enum/start-tour"
import { createAppSlice } from "../createAppSlice"

export type isCompletedTourKey =
  | "HEALTH-TRACKING"
  | "MEAL-PLANNER"
  | "HEALTH-HISTORY"
  | "YOUR-GOAL"
  | "HEALTH-CONSULTING"

export type StartedTourSliceState = {
  loading: boolean
  createSuccess?: boolean
  isCompletedTour?: Partial<Record<isCompletedTourKey, boolean>>
  error?: string
}

const initialState: StartedTourSliceState = {
  loading: true,
  createSuccess: false,
}

export const startedTourSlice = createAppSlice({
  name: "startedTour",
  initialState,
  reducers: (create) => ({
    createStartedTour: create.asyncThunk(
      async (data: CreateStartedTour, { dispatch }) => {
        const jsonData = {
          ...data,
          items: JSON.stringify(data.items),
        }
        const response = await apiFetcher.post(
          "user/start-tour/create",
          jsonData
        )

        await dispatch(getStartedTourInfo(data.module))
        return response.data
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
    getStartedTourInfo: create.asyncThunk(
      async (module: string) => {
        const response = await apiFetcher.get("user/start-tour/get", {
          query: {
            module,
          },
        })
        return response.data
      },
      {
        pending: (state) => {
          state.loading = true
          if (!state.isCompletedTour) {
            state.isCompletedTour = {
              "HEALTH-TRACKING": false,
              "MEAL-PLANNER": undefined,
              "HEALTH-HISTORY": false,
              "YOUR-GOAL": false,
              "HEALTH-CONSULTING": false,
            }
          }
        },
        fulfilled: (state, action) => {
          state.loading = false
          switch (action.meta.arg) {
            case StartTourModule.HEALTH_TRACKING:
              state.isCompletedTour!["HEALTH-TRACKING"] = action.payload
              break
            case StartTourModule.MEAL_PLANNER:
              state.isCompletedTour!["MEAL-PLANNER"] = action.payload
              break
            case StartTourModule.HEALTH_HISTORY:
              state.isCompletedTour!["HEALTH-HISTORY"] = action.payload
              break
            case StartTourModule.YOUR_GOAL:
              state.isCompletedTour!["YOUR-GOAL"] = action.payload
              break
            case StartTourModule.HEALTH_CONSULTING:
              state.isCompletedTour!["HEALTH-CONSULTING"] = action.payload
              break
            default:
              break
          }
        },
        rejected: (state, action) => {
          state.loading = false
          state.isCompletedTour = {
            "HEALTH-TRACKING": false,
            "MEAL-PLANNER": false,
            "HEALTH-HISTORY": false,
            "YOUR-GOAL": false,
            "HEALTH-CONSULTING": false,
          }
          state.error = action.error.message
        },
      }
    ),
  }),

  selectors: {
    watchLoadingStartedTour: (config) => config.loading,
    watchCreateSuccessStartedTour: (config) => config.createSuccess,
    watchIsCompletedTour: (config) => config.isCompletedTour,
  },
})

export const {
  watchLoadingStartedTour,
  watchCreateSuccessStartedTour,
  watchIsCompletedTour,
} = startedTourSlice.selectors

export const { createStartedTour, getStartedTourInfo } =
  startedTourSlice.actions
