import { useEffect, useMemo, useState, useCallback } from "react";
import {
  useLazyGetConclusionsRangeQuery,
  useGetConclusionsPaginationQuery,
} from "@/store/api/conclusionApi";
import type { Conclusion } from "@/types/health";
import dayjs from "dayjs";

interface UseHealthConclusionsParams {
  healthDocumentId?: string;
  model: string; // 'BMI', 'BLOOD_PRESSURE', etc.
  ageType?: string; // Age type for BMI charts
  activeTab?: string; // Active tab for charts
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useHealthConclusions({
  healthDocumentId,
  model,
  ageType = "",
  activeTab = "",
  page = 1,
  pageSize = 12,
  enabled = true,
}: UseHealthConclusionsParams) {
  const [chartData, setChartData] = useState<Conclusion[]>([]);

  const offset = (page - 1) * pageSize;

  // Step 1: Fetch paginated data (for history list)
  const {
    data: paginationData,
    isLoading: isPaginationLoading,
    isFetching: isPaginationFetching,
    refetch: refetchPagination,
  } = useGetConclusionsPaginationQuery(
    {
      ID: healthDocumentId!,
      MODEL: model,
      AGE_TYPE: ageType,
      ACTIVE_TAB: activeTab,
      SORT: "CREATED_DATE:desc",
      OFFSET: String(offset),
      LIMIT: String(pageSize),
    },
    {
      skip: !enabled || !healthDocumentId || !model,
    }
  );

  const [
    triggerRange,
    { data: rangeData, isLoading: isRangeLoading, isFetching: isRangeFetching },
  ] = useLazyGetConclusionsRangeQuery();

  // Step 2: When pagination data arrives, extract min/max dates and fetch range data
  useEffect(() => {
    console.log("=== PAGINATION DATA CHANGED ===");
    console.log("paginationData:", paginationData);

    // API returns { listData: [], paging: { total } }
    const dataList = paginationData?.listData;

    if (dataList && dataList.length > 0) {
      console.log("Pagination has data, extracting dates...");
      console.log("First item:", dataList[0]);

      // Get min and max dates from paginated results
      // Handle both 'date' and 'DATE' field names
      const validDates = dataList
        .map((item: any) => item.date || item.DATE)
        .filter((date: string) => date && dayjs(date).isValid())
        .sort();

      console.log("Valid dates:", validDates);

      if (validDates.length > 0) {
        const minDate = validDates[0];
        const maxDate = validDates[validDates.length - 1];

        console.log("Min date:", minDate, "Max date:", maxDate);
        console.log("Triggering range API...");

        // Fetch range data for chart
        triggerRange({
          ID: healthDocumentId!,
          MODEL: model,
          AGE_TYPE: ageType,
          ACTIVE_TAB: activeTab,
          START_TIME: dayjs(minDate).format("YYYY-MM-DD"),
          END_TIME: dayjs(maxDate).format("YYYY-MM-DD"),
          SORT: "desc",
          OFFSET: "0",
          LIMIT: "100", // Get all data in range for chart
        });
      } else {
        console.log("No valid dates found");
      }
    } else if (dataList && dataList.length === 0) {
      console.log("Pagination returned empty data");
      // No data
      setChartData([]);
    } else {
      console.log("Pagination data is null or undefined");
    }
  }, [
    paginationData,
    healthDocumentId,
    model,
    ageType,
    activeTab,
    triggerRange,
  ]);

  // Step 3: Update chart data when range data arrives
  useEffect(() => {
    // Range API also returns { data: { listData: [] } }
    if (rangeData?.data?.listData) {
      // Transform API data to chart format (uppercase -> lowercase)
      const transformedData = rangeData.data.listData.map((item: any) => ({
        ...item,
        date: item.DATE || item.date,
        value: item.VALUE ? parseFloat(item.VALUE) : item.value,
        valueWeight: item.VALUE_WEIGHT || item.valueWeight,
        valueHeight: item.VALUE_HEIGHT || item.valueHeight,
        valueSys: item.VALUE_SYS || item.valueSys,
        valueDia: item.VALUE_DIA || item.valueDia,
        color: item.COLOR || item.color,
        type: item.TYPE || item.type,
        conclusion: item.CONCLUSION || item.conclusion,
        recommend: item.RECOMMEND || item.recommend,
        time: item.TIME || item.time,
        id: item.ID || item.id,
        model: item.MODEL || item.model,
      }));

      setChartData(transformedData);
    }
  }, [rangeData]);

  // Transform pagination data to match expected format
  const paginatedConclusions = useMemo(() => {
    if (!paginationData?.listData) return [];

    return paginationData.listData.map((item: any) => ({
      ...item,
      date: item.DATE || item.date,
      value: item.VALUE ? parseFloat(item.VALUE) : item.value,
      valueWeight: item.VALUE_WEIGHT || item.valueWeight,
      valueHeight: item.VALUE_HEIGHT || item.valueHeight,
      valueSys: item.VALUE_SYS || item.valueSys,
      valueDia: item.VALUE_DIA || item.valueDia,
      color: item.COLOR || item.color,
      type: item.TYPE || item.type,
      conclusion: item.CONCLUSION || item.conclusion,
      recommend: item.RECOMMEND || item.recommend,
      time: item.TIME || item.time,
      id: item.ID || item.id,
      model: item.MODEL || item.model,
    }));
  }, [paginationData?.listData]);

  const totalCount = paginationData?.paging?.total || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const isLoading = isPaginationLoading || isRangeLoading;
  const isFetching = isPaginationFetching || isRangeFetching;

  // Comprehensive refetch function that refetches pagination (which triggers range API)
  // Memoized to prevent infinite re-renders
  const refetch = useCallback(async () => {
    await refetchPagination();
    // Range API will be automatically triggered by the useEffect when pagination data changes
  }, [refetchPagination]);

  return {
    // For history list (paginated)
    paginatedConclusions,
    totalCount,
    totalPages,

    // For chart (range data)
    conclusions: chartData,

    // Loading states
    isLoading: isLoading || isFetching,
    isPaginationLoading,
    isChartLoading: isRangeLoading || isRangeFetching,

    // Refetch function - refetches both pagination and range data
    refetch,
  };
}
