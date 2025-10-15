import type { HealthData } from "../types/healthTypes"

// Mock data generator
const generateDateRange = (days: number) => {
  const dates = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split("T")[0])
  }
  return dates
}

const dates = generateDateRange(30)

export const mockHealthData: HealthData = {
  bmi: dates.map((date, index) => ({
    date,
    value: 22.5 + Math.sin(index / 5) * 0.8 + (Math.random() - 0.5) * 0.3,
    status: index < 15 ? "normal" : "good",
    note: index === 10 ? "Bắt đầu chế độ ăn kiêng" : undefined,
  })),

  bloodPressure: dates.map((date, index) => ({
    date,
    value: 120, // systolic
    systolic: 120 + Math.sin(index / 4) * 8 + (Math.random() - 0.5) * 5,
    diastolic: 80 + Math.sin(index / 4) * 5 + (Math.random() - 0.5) * 3,
    status: index > 20 && index < 25 ? "warning" : "normal",
    note: index === 22 ? "Stress cao do công việc" : undefined,
  })),

  bloodSugar: dates.map((date, index) => ({
    date,
    value: 95 + Math.sin(index / 3) * 10 + (Math.random() - 0.5) * 8,
    status: index > 15 && index < 20 ? "warning" : "normal",
    note: index === 18 ? "Ăn nhiều đường" : undefined,
  })),

  heartRate: dates.map((date, index) => ({
    date,
    value: 72 + Math.sin(index / 6) * 8 + (Math.random() - 0.5) * 5,
    status: "normal",
    note: index === 5 ? "Sau khi tập thể dục" : undefined,
  })),

  weight: dates.map((date, index) => ({
    date,
    value:
      68.5 -
      index * 0.05 +
      Math.sin(index / 7) * 0.3 +
      (Math.random() - 0.5) * 0.2,
    status: index > 20 ? "good" : "normal",
    note: index === 15 ? "Giảm cân thành công" : undefined,
  })),
}
