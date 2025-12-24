import React, { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card } from "../ui/card"
import DatePicker from "../ui/date-picker"
import dayjs from "dayjs"
import ModalOverlay from "./ModalOverlay"

interface HealthInfoData {
  FULL_NAME?: string
  DOB?: string
  GENDER_ID?: number
  HEIGHT?: string
  WEIGHT?: string
  HEALTH_STATUS?: string
  EXERCISE_FREQUENCY?: string
  EXERCISE_INTENSITY_ID?: number
  DATE_WORKDAY?: string
  DATE_OFF?: string
  IS_MYSELF?: boolean
}

interface HealthInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: HealthInfoData) => void
  onSaveAndNavigate: (data: HealthInfoData) => void
  initialData?: HealthInfoData
}

const HealthInfoModal: React.FC<HealthInfoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onSaveAndNavigate,
  initialData,
}) => {
  const [formData, setFormData] = useState<HealthInfoData>({
    FULL_NAME: "",
    DOB: "",
    GENDER_ID: undefined,
    HEIGHT: "",
    WEIGHT: "",
    HEALTH_STATUS: "Tôi khỏe mạnh",
    EXERCISE_FREQUENCY: "1-3 lần / tuần",
    EXERCISE_INTENSITY_ID: 2,
    DATE_WORKDAY: "0",
    DATE_OFF: "0",
    IS_MYSELF: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [age, setAge] = useState<number>(0)

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData })
    }
  }, [initialData])

  useEffect(() => {
    if (formData.DOB) {
      const birthDate = new Date(formData.DOB)
      const today = new Date()
      const calculatedAge = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        setAge(calculatedAge - 1)
      } else {
        setAge(calculatedAge)
      }
    }
  }, [formData.DOB])

  const handleInputChange = (
    field: keyof HealthInfoData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.FULL_NAME?.trim()) {
      newErrors.FULL_NAME = "Tên hiển thị không được bỏ trống"
    }
    if (!formData.DOB) {
      newErrors.DOB = "Ngày sinh không được bỏ trống"
    }
    if (!formData.GENDER_ID) {
      newErrors.GENDER_ID = "Giới tính không được bỏ trống"
    }
    if (!formData.HEIGHT?.trim()) {
      newErrors.HEIGHT = "Chiều cao không được bỏ trống"
    }
    if (!formData.WEIGHT?.trim()) {
      newErrors.WEIGHT = "Cân nặng không được bỏ trống"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleSaveAndNavigate = () => {
    if (validateForm()) {
      onSaveAndNavigate(formData)
    }
  }

  const exerciseFrequencyOptions = [
    { value: "Rất ít/không", label: "Rất ít/không", icon: "😴" },
    { value: "1-3 lần / tuần", label: "1-3 lần / tuần", icon: "🚶" },
    { value: "4-5 lần / tuần", label: "4-5 lần / tuần", icon: "🏃" },
    { value: "Hàng ngày", label: "Hàng ngày", icon: "💪" },
  ]

  const healthStatusOptions = [
    "Tôi khỏe mạnh",
    "Tôi không mắc bệnh nào kể trên",
  ]

  if (!isOpen) return null

  return (
    <ModalOverlay onClose={onClose} isOpen={isOpen}>
      <Card className="z-[9999] max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-center text-xl font-semibold text-gray-800">
              Hồ sơ sức khỏe
            </h2>
          </div>

          {/* Profile Avatar Section */}
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <span className="text-2xl">👤</span>
            </div>
            <span className="cursor-pointer text-sm text-blue-500">
              Cập nhật
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Tên hiển thị */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">
                Tên hiển thị <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.FULL_NAME || ""}
                onChange={(e) => handleInputChange("FULL_NAME", e.target.value)}
                placeholder="ThacPhuongCute"
                className={errors.FULL_NAME ? "border-red-500" : ""}
              />
              {errors.FULL_NAME && (
                <p className="mt-1 text-xs text-red-500">{errors.FULL_NAME}</p>
              )}
            </div>

            {/* Ngày sinh */}
            <div>
              <Label htmlFor="dob" className="text-sm font-medium">
                Ngày sinh <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                placeholder="Chọn ngày sinh"
                value={formData.DOB || ""}
                onChange={(date) => handleInputChange("DOB", date)}
                format="YYYY-MM-DD"
                disabledDate={dayjs()}
                disabledType="max"
                className={errors.DOB ? "border-red-500" : ""}
              />
              {errors.DOB && (
                <p className="mt-1 text-xs text-red-500">{errors.DOB}</p>
              )}
            </div>

            {/* Tuổi (read-only) */}
            {age > 0 && (
              <div>
                <Label className="text-sm font-medium">Tuổi</Label>
                <div className="rounded-md bg-gray-100 px-3 py-2 text-sm">
                  {age} tuổi
                </div>
              </div>
            )}

            {/* Giới tính */}
            <div>
              <Label htmlFor="gender" className="text-sm font-medium">
                Giới tính <span className="text-red-500">*</span>
              </Label>
              <select
                id="gender"
                value={formData.GENDER_ID || ""}
                onChange={(e) =>
                  handleInputChange("GENDER_ID", Number(e.target.value))
                }
                className={`w-full rounded-md border px-3 py-2 ${errors.GENDER_ID ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Chọn giới tính</option>
                <option value={1}>Nam</option>
                <option value={2}>Nữ</option>
              </select>
              {errors.GENDER_ID && (
                <p className="mt-1 text-xs text-red-500">{errors.GENDER_ID}</p>
              )}
            </div>

            {/* Chiều cao */}
            <div>
              <Label htmlFor="height" className="text-sm font-medium">
                Chiều cao <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  value={formData.HEIGHT || ""}
                  onChange={(e) => handleInputChange("HEIGHT", e.target.value)}
                  placeholder="160"
                  className={errors.HEIGHT ? "border-red-500 pr-8" : "pr-8"}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500">
                  cm
                </span>
              </div>
              {errors.HEIGHT && (
                <p className="mt-1 text-xs text-red-500">{errors.HEIGHT}</p>
              )}
            </div>

            {/* Cân nặng */}
            <div>
              <Label htmlFor="weight" className="text-sm font-medium">
                Cân nặng <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  value={formData.WEIGHT || ""}
                  onChange={(e) => handleInputChange("WEIGHT", e.target.value)}
                  placeholder="48"
                  className={errors.WEIGHT ? "border-red-500 pr-8" : "pr-8"}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500">
                  kg
                </span>
              </div>
              {errors.WEIGHT && (
                <p className="mt-1 text-xs text-red-500">{errors.WEIGHT}</p>
              )}
            </div>

            {/* Tình trạng sức khỏe */}
            <div>
              <Label className="text-sm font-medium">Tình trạng sức khỏe</Label>
              <div className="mt-2 space-y-2">
                {healthStatusOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="healthStatus"
                      value={option}
                      checked={formData.HEALTH_STATUS === option}
                      onChange={(e) =>
                        handleInputChange("HEALTH_STATUS", e.target.value)
                      }
                      className="text-blue-600"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bạn là */}
            <div>
              <Label className="text-sm font-medium">Bạn là</Label>
              <div className="mt-2">
                <select
                  value="Giám đốc"
                  className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
                  disabled
                >
                  <option>Giám đốc</option>
                </select>
              </div>
            </div>

            {/* Tần suất vận động */}
            <div>
              <Label className="text-sm font-medium">
                ⚡ Tần suất vận động, tập luyện thể dục thể thao trong tuần
              </Label>
              <div className="mt-3 flex justify-between">
                {exerciseFrequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      handleInputChange("EXERCISE_FREQUENCY", option.value)
                    }
                    className={`flex flex-col items-center rounded-lg border-2 p-3 transition-colors ${
                      formData.EXERCISE_FREQUENCY === option.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="mb-1 text-2xl">{option.icon}</span>
                    <span className="text-center text-xs">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Thời gian mỗi lần vận động */}
            <div>
              <Label className="text-sm font-medium">
                🕐 Thời gian mỗi lần vận động, tập luyện thể dục thể thao
              </Label>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm">Ngày làm việc/đi học:</span>
                    <span className="text-sm font-medium">
                      {formData.DATE_WORKDAY} phút
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="320"
                    step="10"
                    value={formData.DATE_WORKDAY || "0"}
                    onChange={(e) =>
                      handleInputChange("DATE_WORKDAY", e.target.value)
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-200"
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>60</span>
                    <span>120</span>
                    <span>180</span>
                    <span>240</span>
                    <span>320</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm">Ngày nghỉ:</span>
                    <span className="text-sm font-medium">
                      {formData.DATE_OFF} phút
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="320"
                    step="10"
                    value={formData.DATE_OFF || "0"}
                    onChange={(e) =>
                      handleInputChange("DATE_OFF", e.target.value)
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-200"
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>60</span>
                    <span>120</span>
                    <span>180</span>
                    <span>240</span>
                    <span>320</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu
            </Button>

            <Button
              onClick={handleSaveAndNavigate}
              variant="outline"
              className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            >
              Lưu và chuyển đến theo dõi sức khỏe
            </Button>
          </div>
        </div>
      </Card>
    </ModalOverlay>
  )
}

export default HealthInfoModal
