import { useState, useEffect } from "react"
import {
  useGetStartedTourByFeatureQuery,
  useCreateStartedTourMutation,
} from "@/store/api/startedTourApi"

export const useTour = (feature: string) => {
  const [runTour, setRunTour] = useState(false)

  // Check if tour has been completed via API
  const { data: tourData, isLoading } = useGetStartedTourByFeatureQuery({
    FEATURE: feature,
  })

  // Mutation to mark tour as completed
  const [createStartedTour] = useCreateStartedTourMutation()

  useEffect(() => {
    // Don't start tour while loading
    if (isLoading) {
      return
    }

    // Check if tour has been completed before via API
    if (!tourData?.data) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setRunTour(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [tourData, isLoading])

  const handleTourFinish = async () => {
    setRunTour(false)
    // Save tour completion via API
    try {
      await createStartedTour({ FEATURE: feature }).unwrap()
    } catch (error) {
      console.error("Failed to save tour completion:", error)
    }
  }

  const startTour = () => {
    setRunTour(true)
  }

  const resetTour = () => {
    setRunTour(true)
  }

  return {
    runTour,
    handleTourFinish,
    startTour,
    resetTour,
    isCompleted: !!tourData?.data,
    isLoading,
  }
}
