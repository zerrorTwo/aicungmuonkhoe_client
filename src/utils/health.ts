import {
  BMI_FEMALE_BY_AGE,
  BMI_MALE_BY_AGE,
  HEIGHT_FEMALE_BY_AGE,
  HEIGHT_MALE_BY_AGE,
  TRACKING_OPTIONS,
  WEIGHT_FEMALE_BY_AGE,
  WEIGHT_MALE_BY_AGE,
} from "@/constants/health.constant"
import {
  convertDecimalDotToComma,
  isValueInRange,
  roundDownToNearest5,
  roundUpToNearest5,
} from "./common"
import dayjs, { Dayjs } from "dayjs"
import type { Range } from "@/components/range-picker"
import { BMIChildrenTabs, BMIAgeRange } from "@/enum/health"
import type { Conclusion } from "@/types/health"

// Type definitions for missing types
type User = any
type SelfManagedAccount = any
type HealthTabs = string

export const bloodPressureHospitalDiagnosis = (
  valueSys: number,
  valueDia: number
) => {
  if (
    isValueInRange(valueSys, [120, 129]) ||
    isValueInRange(valueDia, [80, 84])
  ) {
    return {
      color: "#4FAD5B",
      label: "Huyết áp bình thường",
    }
  }

  if (valueSys < 120 && valueDia < 80) {
    return {
      color: "#4F71BE",
      label: "Huyết áp tối ưu",
    }
  }

  if (
    isValueInRange(valueSys, [130, 139]) ||
    isValueInRange(valueDia, [85, 89])
  ) {
    return {
      color: "#F5C242",
      label: "Tiền tăng huyết áp",
    }
  }

  if (
    isValueInRange(valueSys, [140, 159]) ||
    isValueInRange(valueDia, [90, 99])
  ) {
    return {
      color: "#FD9602",
      label: "Tăng huyết áp độ 1",
    }
  }

  if (
    isValueInRange(valueSys, [160, 179]) ||
    isValueInRange(valueDia, [100, 109])
  ) {
    return {
      color: "#B02418",
      label: "Tăng huyết áp độ 2",
    }
  }

  if (valueSys >= 180 || valueDia >= 110) {
    return {
      color: "#EA3323",
      label: "Tăng huyết áp độ 3",
    }
  }

  if (valueSys >= 140 && valueDia < 90) {
    return {
      color: "#A5A5A5",
      label: "Tăng huyết áp tâm thu đơn độc",
    }
  }
}

export const bloodPressureHomeDiagnosis = (
  valueSys: number,
  valueDia: number
) => {
  if (valueSys < 135 && valueDia < 85) {
    return {
      color: "#4FAD5B",
      label: "Không phân loại là tăng huyết áp",
    }
  }

  if (valueSys >= 135 || valueDia >= 85) {
    return {
      color: "#DE8344",
      label: "Tăng huyết áp",
    }
  }
}

export const bloodSugarHungryDiagnosis = (value: number) => {
  if (value < 3.9)
    return {
      color: "#1AA8E3",
      label: "Thấp hơn bình thường",
    }
  if (value >= 3.9 && value < 5.6)
    return {
      color: "#4CCA35",
      label: "Bình thường",
    }
  if (value >= 5.6 && value <= 6.9)
    return {
      color: "#FD9602",
      label: "Tiền đái tháo đường",
    }
  if (value > 6.9)
    return {
      color: "#F5540A",
      label: "Đái tháo đường",
    }
}

export const bloodSugar2HoursDiagnosis = (value: number) => {
  if (value < 7.8)
    return {
      color: "#4CCA35",
      label: "Không thuộc Tiền đái tháo đường/Đái tháo đường",
    }
  if (value >= 7.8 && value <= 11)
    return {
      color: "#FD9602",
      label: "Tiền đái tháo đường",
    }
  if (value > 11)
    return {
      color: "#F5540A",
      label: "Đái tháo đường",
    }
}

export const bloodSugarHbA1cDiagnosis = (value: number) => {
  if (value < 2.9)
    return {
      color: "#1AA8E3",
      label: "Thấp hơn bình thường",
    }
  if (value >= 2.9 && value <= 5.6)
    return {
      color: "#4CCA35",
      label: "Không thuộc Tiền đái tháo đường/Đái tháo đường",
    }
  if (value > 5.6 && value <= 6.4)
    return {
      color: "#FD9602",
      label: "Tiền đái tháo đường",
    }
  if (value > 6.4)
    return {
      color: "#F5540A",
      label: "Đái tháo đường",
    }
}

export const kidneyFunctionUreDiagnosis = (value: number) => {
  if (value < 2.5)
    return {
      color: "#1AA8E3",
      label: "Thấp hơn bình thường",
    }
  if (value >= 2.5 && value <= 7.5)
    return {
      color: "#4CCA35",
      label: "Bình thường",
    }
  if (value > 7.5)
    return {
      color: "#FD9602",
      label: "Cao hơn bình thường",
    }
}

export const kidneyFunctionCreDiagnosis = (
  value: number,
  gender: "nam" | "nu"
) => {
  if (gender === "nam") {
    if (value < 62)
      return {
        color: "#1AA8E3",
        label: "Thấp hơn bình thường",
      }
    if (value >= 62 && value <= 120)
      return {
        color: "#4CCA35",
        label: "Bình thường",
      }
    if (value > 120)
      return {
        color: "#FD9602",
        label: "Cao hơn bình thường",
      }
  } else {
    if (value < 53)
      return {
        color: "#1AA8E3",
        label: "Thấp hơn bình thường",
      }
    if (value >= 53 && value <= 100)
      return {
        color: "#4CCA35",
        label: "Bình thường",
      }
    if (value > 100)
      return {
        color: "#FD9602",
        label: "Cao hơn bình thường",
      }
  }
}

export const liverFunctionSGOTDiagnosis = (
  value: number,
  gender: "nam" | "nu"
) => {
  if (gender === "nam") {
    if (value < 37)
      return {
        color: "#4CCA35",
        label: "Bình thường",
      }
    if (value >= 37)
      return {
        color: "#FD9602",
        label: "Cao hơn bình thường",
      }
  } else {
    if (value < 31)
      return {
        color: "#4CCA35",
        label: "Bình thường",
      }
    if (value >= 31)
      return {
        color: "#FD9602",
        label: "Cao hơn bình thường",
      }
  }
}

export const liverFunctionSGPTDiagnosis = (
  value: number,
  gender: "nam" | "nu"
) => {
  if (gender === "nam") {
    if (value < 40)
      return {
        color: "#4CCA35",
        label: "Bình thường",
      }
    if (value >= 40)
      return {
        color: "#FD9602",
        label: "Cao hơn bình thường",
      }
  } else {
    if (value < 31)
      return {
        color: "#4CCA35",
        label: "Bình thường",
      }
    if (value >= 31)
      return {
        color: "#FD9602",
        label: "Cao hơn bình thường",
      }
  }
}

export const bloodLipidCholesterolDiagnosis = (value: number) => {
  if (value < 3.9)
    return {
      color: "#1AA8E3",
      label: "Thấp hơn bình thường",
    }
  if (value >= 3.9 && value <= 5.2)
    return {
      color: "#4CCA35",
      label: "Bình thường",
    }
  if (value > 5.2)
    return {
      color: "#FD9602",
      label: "Cao hơn bình thường",
    }
}

export const bloodLipidLDLDiagnosis = (value: number) => {
  if (value <= 3.4)
    return {
      color: "#4CCA35",
      label: "Bình thường",
    }
  if (value > 3.4)
    return {
      color: "#FD9602",
      label: "Cao hơn bình thường",
    }
}

export const bloodLipidHDLDiagnosis = (value: number) => {
  if (value < 0.9)
    return {
      color: "#1AA8E3",
      label: "Bình thường",
    }
  if (value >= 0.9)
    return {
      color: "#4CCA35",
      label: "Cao hơn bình thường",
    }
}

export const bloodLipidTriDiagnosis = (value: number) => {
  if (value < 0.46)
    return {
      color: "#1AA8E3",
      label: "Thấp hơn bình thường",
    }
  if (value >= 0.46 && value <= 1.88)
    return {
      color: "#4CCA35",
      label: "Bình thường",
    }
  if (value > 1.88)
    return {
      color: "#FD9602",
      label: "Cao hơn bình thường",
    }
}

export const acidUricDiagnosis = (value: number, gender: "nam" | "nu") => {
  if (gender === "nam") {
    if (value < 180)
      return {
        color: "#1AA8E3",
        label: "Thấp hơn bình thường",
      }
    if (value >= 180 && value <= 420)
      return {
        color: "#4CCA35",
        label: "Bình thường",
      }
    if (value > 420)
      return {
        color: "#FD9602",
        label: "Cao hơn bình thường",
      }
  } else {
    if (value < 150)
      return {
        color: "#1AA8E3",
        label: "Thấp hơn bình thường",
      }
    if (value >= 150 && value <= 360)
      return {
        color: "#4CCA35",
        label: "Bình thường",
      }
    if (value > 360)
      return {
        color: "#FD9602",
        label: "Cao hơn bình thường",
      }
  }
}

export const getBMIDataByAge = (type: "nam" | "nu", age: number) => {
  const startMonth = age * 12
  const monthArray = Array.from({ length: 13 }, (_, i) => startMonth + i)

  return (type === "nam" ? BMI_MALE_BY_AGE : BMI_FEMALE_BY_AGE).filter((item) =>
    monthArray.includes(item.key)
  )
}

export const getHeightDataByAge = (type: "nam" | "nu", age: number) => {
  const startMonth = age * 12
  const monthArray = Array.from({ length: 13 }, (_, i) => startMonth + i)

  return (type === "nam" ? HEIGHT_MALE_BY_AGE : HEIGHT_FEMALE_BY_AGE).filter(
    (item) => monthArray.includes(item.key)
  )
}

export const getWeightDataByAge = (type: "nam" | "nu", age: number) => {
  const startMonth = age * 12
  const monthArray = Array.from({ length: 13 }, (_, i) => startMonth + i)

  return (type === "nam" ? WEIGHT_MALE_BY_AGE : WEIGHT_FEMALE_BY_AGE).filter(
    (item) => monthArray.includes(item.key)
  )
}

export const calculateBMI = (weight: number, height: number) => {
  const convertHeight = height / 100
  return (weight / (convertHeight * convertHeight)).toFixed(2)
}

export const BMIDiagnosis = (bmi: number) => {
  if (bmi < 16)
    return {
      color: "#00A9F0CC",
      label: "Gầy độ III",
    }
  if (bmi >= 16 && bmi < 17)
    return {
      color: "#00ADF5",
      label: "Gầy độ II",
    }
  if (bmi >= 17 && bmi < 18.5)
    return {
      color: "#A4DDF5CC",
      label: "Gầy độ I",
    }
  if (bmi >= 18.5 && bmi < 25)
    return {
      color: "#99E18CCC",
      label: "Bình thường",
    }
  if (bmi >= 25 && bmi < 30)
    return {
      color: "#FFE666CC",
      label: "Tiền béo phì",
    }
  if (bmi >= 30 && bmi < 35)
    return {
      color: "#FECF8BCC",
      label: "Béo phì độ I",
    }
  if (bmi >= 35 && bmi < 40)
    return {
      color: "#FAA781CC",
      label: "Béo phì độ II",
    }
  if (bmi >= 40)
    return {
      color: "#EB5447CC",
      label: "Béo phì độ III",
    }
}

export const weightByAgeDiagnosis = (
  gender: "nam" | "nu",
  weight: number,
  birthday: Dayjs
) => {
  const monthAge = dayjs().diff(birthday, "month")
  const data = (
    gender === "nam" ? WEIGHT_MALE_BY_AGE : WEIGHT_FEMALE_BY_AGE
  ).find((item) => item.key === monthAge)
  if (!data)
    return {
      color: "#000",
      label: "Không xác định",
    }

  const value = data.value

  if (weight < value[0])
    return {
      color: "#1AA8E3",
      label: "Suy dinh dưỡng nhẹ cân, mức độ nặng",
    }
  if (weight >= value[0] && weight < value[1])
    return {
      color: "#FD9602",
      label: "Suy dinh dưỡng nhẹ cân, mức độ vừa",
    }
  if (weight >= value[1] && weight < value[5])
    return {
      color: "#FD9602",
      label: "Cân nặng bình thường",
    }
  if (weight >= value[5] && weight < value[6])
    return {
      color: "#F5540A",
      label: "Có nguy cơ thừa cân",
    }
  if (weight > value[6])
    return {
      color: "#E52A1A",
      label: "Có nguy cơ thừa cân",
    }
}

export const getGender = (user?: User | SelfManagedAccount) => {
  return user?.gender?.toLowerCase().includes("nam") ? "nam" : "nu"
}

export const getAge = (user?: User) => {
  return user ? dayjs().diff(dayjs(user.bod), "year") : 0
}

export const getHealthModelName = (tab?: HealthTabs) => {
  switch (tab) {
    case "HOSPITAL":
    case "HOME":
      return "huyết áp"
    case "HUNGRY":
      return "đường huyết lúc đói"
    case "2_HOURS":
      return "đường huyết sau 2 giờ uống"
    case "HBA1C":
      return "đường huyết HbA1c"
    case "URE":
      return "chỉ số Ure"
    case "CREA":
      return "chỉ số Creatinine"
    case "SGOT":
      return "chỉ số SGOT/AST"
    case "SGPT":
      return "chỉ số SGPT/ALT"
    case "CHOL":
      return "Cholesterol toàn phần"
    case "LDL":
      return "Cholesterol loại LDL"
    case "HDL":
      return "Cholesterol loại HDL"
    case "TRI":
      return "Triglyceride"
    case "AXIT_URIC":
      return "Axit uric"
    case "BMI":
      return "BMI"
    default:
      return ""
  }
}

export const getHealthModelLabel = (tab?: HealthTabs) => {
  switch (tab) {
    case "HOSPITAL":
    case "HOME":
      return ["Huyết áp Tâm thu", "Huyết áp Tâm trương"]
    case "HUNGRY":
      return ["Đường huyết lúc đói"]
    case "2_HOURS":
      return ["Đường huyết sau 2 giờ uống"]
    case "HBA1C":
      return ["Đường huyết HbA1c"]
    case "URE":
      return ["Ure"]
    case "CREA":
      return ["Creatinine"]
    case "SGOT":
      return ["SGOT/AST"]
    case "SGPT":
      return ["SGPT/ALT"]
    case "CHOL":
      return ["Cholesterol toàn phần"]
    case "LDL":
      return ["Cholesterol loại LDL"]
    case "HDL":
      return ["Cholesterol loại HDL"]
    case "TRI":
      return ["Triglyceride"]
    case "AXIT_URIC":
      return ["Axit uric"]
    case "BMI":
      return ["BMI"]
    case "WEIGHT":
    case "WEIGHT_HEIGHT":
      return ["Cân nặng"]
    case "HEIGHT":
      return ["Chiều cao"]
    default:
      return ""
  }
}

export const getHealthModelUnit = (tab?: HealthTabs) => {
  switch (tab) {
    case "HOSPITAL":
    case "HOME":
      return "mmHg"
    case "HUNGRY":
    case "2_HOURS":
    case "CHOL":
    case "LDL":
    case "HDL":
    case "TRI":
    case "URE":
      return "mmol/L"
    case "HBA1C":
      return "%"
    case "SGOT":
    case "SGPT":
      return "U/L"
    case "CREA":
    case "AXIT_URIC":
      return "µmol/L"
    case "BMI":
      return "kg/m²"
    case "WEIGHT":
    case "WEIGHT_HEIGHT":
      return "kg"
    case "HEIGHT":
      return "cm"
    default:
      return ""
  }
}

export const getMaxValue = (
  arr: (number | undefined)[],
  offset: number = 0,
  defaultValue = 0,
  tooltipHeight = 0
) => {
  const validValues = arr.filter(
    (val): val is number =>
      typeof val === "number" && isFinite(val) && !isNaN(val)
  )

  let value =
    validValues.length > 0
      ? Math.max(...validValues) < defaultValue
        ? defaultValue
        : Math.max(...validValues) + offset + tooltipHeight
      : defaultValue

  if (offset > 0 && isFinite(value)) {
    value = Math.ceil(value / offset) * offset
  }

  return isFinite(value) ? value : defaultValue
}

export const getMemberTrackingOptions = (
  selfManagedAccounts: SelfManagedAccount[]
) => {
  const member = selfManagedAccounts.map((item) => ({
    label: item.isMyself ? "Bản thân" : item.fullName!,
    value: item.id!,
    avatar: item.avatar,
  }))

  return member
}

export const getTrackingOptions = (healthDocument?: SelfManagedAccount) => {
  if (!healthDocument) return []

  if (healthDocument.age < 19) {
    return [
      {
        label: "BMI",
        value: "BMI",
        type: "BMI",
      },
    ]
  }

  return TRACKING_OPTIONS
}

export function clampDateToRange(newDate: Dayjs, rangeDate: Range) {
  const { startDate, endDate } = rangeDate

  if (newDate.isBefore(startDate)) {
    return {
      startDate: newDate,
      endDate,
    }
  }

  if (newDate.isAfter(endDate)) {
    return {
      startDate,
      endDate: newDate,
    }
  }

  return {
    startDate,
    endDate,
  }
}

export function getIsoRangeDate(rangeDate: Range) {
  const isoStartDate =
    rangeDate.startDate && rangeDate.startDate.isValid()
      ? rangeDate.startDate.toISOString()
      : null
  const isoEndDate =
    rangeDate.endDate && rangeDate.endDate.isValid()
      ? rangeDate.endDate.toISOString()
      : null

  return { isoStartDate, isoEndDate }
}

export function getBMITabName(tab: BMIChildrenTabs) {
  switch (tab) {
    case BMIChildrenTabs.Weight:
    case BMIChildrenTabs.WeightHeight:
      return "Cân nặng"
    case BMIChildrenTabs.Height:
      return "Chiều cao"
    default:
      return ""
  }
}

export function getBMIValue(
  tab: BMIChildrenTabs,
  conclusion: Conclusion,
  age?: number,
  ageType?: BMIAgeRange
) {
  if (
    (age && age >= 5) ||
    (ageType &&
      ageType !== "FROM_0_LESS_THAN_5" &&
      ageType !== "FROM_2_LESS_THAN_5" &&
      ageType !== "FROM_0_LESS_THAN_2")
  ) {
    return conclusion?.value !== undefined
      ? convertDecimalDotToComma(conclusion.value)
      : ""
  } else {
    if (
      tab === BMIChildrenTabs.Weight ||
      tab === BMIChildrenTabs.WeightHeight
    ) {
      return conclusion.valueWeight !== undefined
        ? convertDecimalDotToComma(conclusion.valueWeight)
        : ""
    } else {
      return conclusion.valueHeight !== undefined
        ? convertDecimalDotToComma(conclusion.valueHeight)
        : ""
    }
  }
}

export function getBMIIndicator(
  tab: BMIChildrenTabs,
  age?: number,
  ageType?: BMIAgeRange
) {
  if (
    (age && age >= 5) ||
    (ageType &&
      ageType !== "FROM_0_LESS_THAN_5" &&
      ageType !== "FROM_2_LESS_THAN_5" &&
      ageType !== "FROM_0_LESS_THAN_2")
  ) {
    return "kg/m²"
  } else {
    if (
      tab === BMIChildrenTabs.Weight ||
      tab === BMIChildrenTabs.WeightHeight
    ) {
      return "kg"
    } else {
      return "cm"
    }
  }
}

export function filterBMIUnder20Values(data: Conclusion[], dob: string) {
  const grouped = data.reduce((acc: Map<number, any>, item) => {
    const ageMonth = calculateExactMonthAge(dob, item.date!)

    const existing = acc.get(ageMonth)

    if (!existing || dayjs(item.date).isAfter(dayjs(existing.date))) {
      acc.set(ageMonth, item)
    }

    return acc
  }, new Map())

  return Array.from(grouped.entries())
}

export function filterBMIWeightHeightValues(data: Conclusion[]) {
  const filtered = data.filter(({ valueHeight }) => {
    if (valueHeight === undefined) return false
    const isInRange = valueHeight >= 45 && valueHeight <= 120
    const decimal = valueHeight % 1
    const isAllowedDecimal = decimal === 0 || decimal === 0.5
    return isInRange && isAllowedDecimal
  })

  const map = new Map()

  for (const item of filtered) {
    const existing = map.get(item.valueHeight)
    if (!existing || dayjs(item.date).isAfter(dayjs(existing.date))) {
      map.set(item.valueHeight, item)
    }
  }

  return Array.from(map.values())
}

export function getBMIWeightHeightMinMax(data: Conclusion[]) {
  if (!data.length) {
    return {
      min: 45,
      max: 100,
    }
  }

  const values = data
    .map((item) => item.valueHeight)
    .filter((v): v is number => v !== undefined)
  const min = Math.min(...values)
  const max = Math.max(...values)

  return { min, max }
}

export function calculateExactMonthAge(
  birthDateStr: string,
  targetDateStr: string
) {
  const birthDate = dayjs(birthDateStr)
  const targetDate = dayjs(targetDateStr)

  if (birthDate.isAfter(targetDate, "day")) {
    return 0
  }

  const yearDiff = targetDate.year() - birthDate.year()
  const monthDiff = targetDate.month() - birthDate.month()
  let totalMonths = yearDiff * 12 + monthDiff

  if (targetDate.date() < birthDate.date()) {
    totalMonths -= 1
  }

  const monthPart = totalMonths % 12

  return monthPart
}

export function calculateExactMonthAge012(
  birthDateStr: string,
  targetDateStr: string
) {
  const birthDate = dayjs(birthDateStr)
  const targetDate = dayjs(targetDateStr)

  if (birthDate.isAfter(targetDate, "day")) {
    return 0
  }

  const yearDiff = targetDate.year() - birthDate.year()
  const monthDiff = targetDate.month() - birthDate.month()
  const dayDiff = targetDate.date() >= birthDate.date() ? 0 : -1

  return yearDiff * 12 + monthDiff + dayDiff
}

export function getMaxXValueBMIWeightHeightChart(min: number, max: number) {
  const value =
    (roundUpToNearest5(max) - roundDownToNearest5(min)) / 5 + 1 < 12
      ? roundDownToNearest5(min) + 5 * 11
      : roundUpToNearest5(max)
  return value <= 120 ? value : 120
}
