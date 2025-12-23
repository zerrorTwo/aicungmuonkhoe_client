// Common types for health components

export type Sort = {
  field: string
  order: "asc" | "desc"
}

export type Item = {
  dataType: "Date" | "Number" | "String"
  value: string | number
  ingredient?: string
}
