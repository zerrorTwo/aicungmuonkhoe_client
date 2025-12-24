// Global type definitions for health charts
export interface Conclusion {
  date: string
  value?: number
  valueWeight?: number
  valueHeight?: number
  valueSys?: number
  valueDia?: number
  color?: string
  type?: string
  [key: string]: any
}

export type Gender = "nam" | "nu"

export interface HealthChartProps {
  loading: boolean
  conclusionList: Conclusion[]
  hiddenRange?: boolean
  gender?: Gender
}
