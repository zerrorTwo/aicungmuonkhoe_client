import { SIMPLE_DATE_FORMAT } from "@/constants/common.constant"
import { VALIDATION_MESSAGE } from "@/constants/message.constant"
import {
  emailRegex,
  numberRegex,
  phoneNumberRegex,
} from "@/constants/regex.constant"
import dayjs from "dayjs"

export function toBoolean(input: any) {
  if (input === "0" || input === "false") return false
  return !!input
}

export function toNumber(input: any) {
  const val = +input
  if (isNaN(val)) return null
  return val
}

export function concatClasses(
  ...classes: (string | null | undefined | false | 0)[]
) {
  return classes.filter(Boolean).join(" ")
}

export function camelToSnake(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase()
}

export function snakeToCamel(str: string) {
  const result = str
    .toLowerCase()
    .replace(/_(.)/g, (_, char) => char.toUpperCase())

  return result
}

export function camelObject<O extends Record<string, any>>(
  obj: O
): Record<string, any> {
  return Object.keys(obj).reduce<Record<string, any>>((newObj, key) => {
    const value = obj[key]
    const camelKey = snakeToCamel(key)

    const finalKey = camelKey === "displayname" ? "displayName" : camelKey

    if (Array.isArray(value)) {
      newObj[finalKey] = value.map((item) => {
        if (item && typeof item === "object") {
          return camelObject(item)
        }
        return item
      })
    } else if (value && typeof value === "object") {
      newObj[finalKey] = camelObject(value)
    } else {
      newObj[finalKey] = value
    }

    return newObj
  }, {})
}

export function snakeObject<O extends Record<string, any>>(
  obj: O
): Record<string, any> {
  return Object.keys(obj).reduce<Record<string, any>>((newObj, key) => {
    const isObject =
      obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])

    newObj[camelToSnake(key)] = isObject ? camelToSnake(obj[key]) : obj[key]
    return newObj
  }, {})
}

export function delay(ms?: number) {
  if (ms == null) {
    return new Promise((_) => {
      // Never resolve
    })
  }
  return new Promise((res) => setTimeout(res, ms))
}

export function objectToQueryString(query: Record<string, any>, prefix = true) {
  const list = Object.keys(query).reduce((arr: any[], k) => {
    if (query[k] !== undefined) {
      arr.push(`${camelToSnake(k)}=${query[k]}`)
    }
    return arr
  }, [])

  return list.length ? `${prefix ? "?" : ""}${list.join("&")}` : ""
}

export const getCssVariableValue = (variable: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim()
}

export const encryptPhone = (phone: string = "") => {
  return phone.slice(0, -3) + "***"
}

export const encryptEmail = (email: string = "") => {
  const [name, domain] = email.split("@")

  if (name.length <= 3) {
    return email
  }

  const hiddenName = name.substring(0, 3) + "***"

  return hiddenName + "@" + domain
}

export const getUserDevice = () => {
  const userAgent = navigator.userAgent

  if (/android/i.test(userAgent)) {
    return "Android Device"
  }
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "iOS Device"
  }

  return "PC"
}

export const validateOtp = (_: any, otp: string[]) => {
  if (otp.includes("") || otp.length !== 6) {
    return Promise.reject(new Error(VALIDATION_MESSAGE.OTP_INVALID))
  }

  const otpValue = otp.join("")
  if (!/^\d{6}$/.test(otpValue)) {
    return Promise.reject(new Error(VALIDATION_MESSAGE.OTP_WRONG_FORMAT))
  }

  return Promise.resolve()
}

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const validatePhoneOrEmail = (_: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error(VALIDATION_MESSAGE.USERNAME_REQUIRED))
  }
  if (phoneNumberRegex.test(value)) {
    return Promise.resolve()
  }
  if (emailRegex.test(value)) {
    return Promise.resolve()
  }

  if (numberRegex.test(value)) {
    return Promise.reject(new Error(VALIDATION_MESSAGE.PHONE_INVALID))
  } else {
    return Promise.reject(new Error(VALIDATION_MESSAGE.EMAIL_INVALID))
  }
}

export const validatePhone = (_: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error(VALIDATION_MESSAGE.PHONE_REQUIRED))
  }
  if (phoneNumberRegex.test(value)) {
    return Promise.resolve()
  }

  return Promise.reject(new Error(VALIDATION_MESSAGE.PHONE_INVALID))
}

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export function getRandomIntegerArray(
  min: number,
  max: number,
  length: number
): number[] {
  const randomArray: number[] = []

  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    randomArray.push(randomNumber)
  }

  return randomArray
}

export const isValueInRange = (
  value: number,
  [start, end]: [number, number]
) => {
  return value >= start && value <= end
}

export function createSteppedArray(min = 0, max: number, step: number) {
  if (!isFinite(min) || !isFinite(max) || !isFinite(step)) {
    return []
  }

  if (step <= 0) {
    return []
  }

  if (max < min) {
    return []
  }

  const length = Math.floor((max - min) / step) + 1

  if (length <= 0 || length > Number.MAX_SAFE_INTEGER || length > 1000000) {
    return []
  }

  return Array.from({ length }, (_, i) => min + i * step)
}

export function convertDecimalDotToComma(
  value: number | string,
  fractionDigits: number = 2
): string {
  if (!value) return ""
  const numberValue = typeof value === "string" ? parseFloat(value) : value
  if (Number.isInteger(numberValue)) {
    return numberValue.toString()
  }

  return numberValue.toFixed(fractionDigits).replace(".", ",")
}

export function fillDatesToTwelve(dates: string[]): string[] {
  if (!dates || !Array.isArray(dates)) {
    return Array(12).fill("")
  }

  let result = Array(12).fill("")
  const parsedDates = dates
    .filter((item) => item !== "Invalid Date")
    .map((dateStr) => dayjs(dateStr, SIMPLE_DATE_FORMAT))
  if (parsedDates.length > 12) {
    result = Array(parsedDates.length).fill("")
    parsedDates.forEach((date, index) => {
      result[index] = date.format(SIMPLE_DATE_FORMAT)
    })
  } else {
    const startIndex = Math.floor((12 - parsedDates.length) / 2)

    parsedDates.forEach((date, index) => {
      result[startIndex + index] = date.format(SIMPLE_DATE_FORMAT)
    })
  }

  return result
}

export function formatDateTimeValue(time: number) {
  return time < 10 ? `0${time}` : time.toString()
}

export function validateRequired(_: any, value: string) {
  if (!value) {
    return Promise.reject(new Error(VALIDATION_MESSAGE.FIELD_REQUIRED))
  }
  return Promise.resolve()
}

export function validateRequiredMultiple(_: any, value: string[]) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return Promise.reject(new Error(VALIDATION_MESSAGE.FIELD_REQUIRED))
  }
  return Promise.resolve()
}

export function rangeByStep(
  min: number,
  max: number,
  step = 5,
  lowerBound = 45,
  upperBound = 120
) {
  const start = Math.max(Math.floor(min / step) * step, lowerBound)
  const end = Math.min(Math.ceil(max / step) * step, upperBound)
  const result = []

  for (let i = start; i <= end; i += step) {
    result.push(i)
  }

  return result
}

export function roundDownToNearest5(num: number) {
  return Math.floor(num / 5) * 5
}

export function roundUpToNearest5(num: number) {
  return Math.ceil(num / 5) * 5
}

export function formatDateTimeDMY(dateString?: string): string {
  if (!dateString) return ""
  const d = dayjs(dateString)
  if (!d.isValid()) return ""
  return d.format("HH:mm | DD/MM/YYYY")
}

export const validateExerciseTime = (
  _: any,
  value: { dayOff: number; normalDay: number },
  exerciseFrequency: string
) => {
  if (exerciseFrequency === "1") {
    return Promise.resolve()
  }
  if (!value || (value.dayOff === 0 && value.normalDay === 0)) {
    return Promise.reject(new Error("Trường thông tin này không được bỏ trống"))
  }
  if (value.normalDay === 0) {
    return Promise.reject(
      new Error("Vui lòng chọn thời gian cho ngày làm việc")
    )
  }
  if (value.dayOff === 0) {
    return Promise.reject(new Error("Vui lòng chọn thời gian cho ngày nghỉ"))
  }
  return Promise.resolve()
}

type SelfManagedAccount = {
  id: string
  name?: string
  isMyself: number
}

export function getDisplayNameFromHealthDocument(
  healthDocumentList: SelfManagedAccount[],
  documentId: string | undefined
): string | "" {
  if (!documentId) return ""

  const document = healthDocumentList.find((item) => item.id == documentId)
  if (document && document.isMyself == 1) {
    return "bạn"
  } else if (document && document.isMyself == 0) {
    return document.name ?? ""
  }
  return ""
}
