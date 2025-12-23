import { useEffect, useMemo } from "react"
import { useLazyGetConclusionsRangeQuery } from "@/store/api/conclusionApi"
import type { Conclusion } from "@/types/health"
import dayjs from "dayjs"

interface UseHealthConclusionsParams {
  healthDocumentId?: string
  model: string // 'BMI', 'BLOOD_PRESSURE', etc.
  ageType?: string // Age type for BMI charts
  activeTab?: string // Active tab for charts
  startDate?: string
  endDate?: string
  enabled?: boolean
}

export function useHealthConclusions({
  healthDocumentId,
  model,
  ageType = "",
  activeTab = "",
  startDate,
  endDate,
  enabled = true,
}: UseHealthConclusionsParams) {
  // Calculate default date range (last 30 days)
  const defaultEndDate = dayjs().format("YYYY-MM-DD")
  const defaultStartDate = dayjs().subtract(30, "days").format("YYYY-MM-DD")

  const [trigger, { data, isLoading, isFetching, error }] =
    useLazyGetConclusionsRangeQuery()

  // Auto-fetch when params are ready
  useEffect(() => {
    if (enabled && healthDocumentId && model) {
      trigger({
        ID: healthDocumentId,
        MODEL: model,
        AGE_TYPE: ageType,
        ACTIVE_TAB: activeTab,
        START_TIME: startDate || defaultStartDate,
        END_TIME: endDate || defaultEndDate,
        SORT: "desc",
        OFFSET: "0",
        LIMIT: "100",
      })
    }
  }, [
    enabled,
    healthDocumentId,
    model,
    ageType,
    activeTab,
    startDate,
    endDate,
    trigger,
    defaultStartDate,
    defaultEndDate,
  ])

  const conclusions: Conclusion[] = useMemo(() => {
    if (!data?.data) return []
    return data.data
  }, [data])

  return {
    conclusions,
    isLoading: isLoading || isFetching,
    error,
    refetch: () => {
      if (healthDocumentId && model) {
        trigger({
          ID: healthDocumentId,
          MODEL: model,
          AGE_TYPE: ageType,
          ACTIVE_TAB: activeTab,
          START_TIME: startDate || defaultStartDate,
          END_TIME: endDate || defaultEndDate,
          SORT: "desc",
          OFFSET: "0",
          LIMIT: "100",
        })
      }
    },
  }
}
