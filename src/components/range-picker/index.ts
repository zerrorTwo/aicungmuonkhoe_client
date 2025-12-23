import { Dayjs } from "dayjs"

export interface Range {
  startDate: Dayjs
  endDate: Dayjs
}

export type RangePickerProps = {
  value?: Range
  onChange?: (range: Range) => void
  placeholder?: string
}

// Export Range as both named and default for compatibility
export type { Range as default }
