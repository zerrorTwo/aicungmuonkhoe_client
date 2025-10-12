export type HealthMetricType =
  | "bmi"
  | "bloodPressure"
  | "bloodSugar"
  | "heartRate"
  | "weight"

export interface HealthDataPoint {
  date: string
  value: number
  systolic?: number
  diastolic?: number
  status: "normal" | "warning" | "danger" | "good"
  note?: string
}

export interface HealthData {
  bmi: HealthDataPoint[]
  bloodPressure: HealthDataPoint[]
  bloodSugar: HealthDataPoint[]
  heartRate: HealthDataPoint[]
  weight: HealthDataPoint[]
}

export interface HealthSummaryData {
  current: number
  trend: "up" | "down" | "stable"
  change: number
  status: "normal" | "warning" | "danger" | "good"
  recommendation: string
}
