import React, { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { calculateAge } from "@/utils/age"
import PhysicalMeasuresSection from "../healthForm/PhysicalMeasuresSection"
import ActivityLevelSlider from "../healthForm/ActivityLevelSlider"
import HealthStatusDropdown from "../healthForm/HealthStatusDropdown"
import JobInputSection from "../healthForm/JobInputSection"
import ExerciseFrequencySlider from "../healthForm/ExerciseFrequencySlider"
import ExerciseTimeInputs from "../healthForm/ExerciseTimeInputs"
import { User, Calendar, Users } from "lucide-react"
import { showToast } from "../../utils/toast"

interface HealthDocument {
  ID?: number
  FULL_NAME?: string
  DOB?: string
  GENDER_ID?: number
  HEIGHT?: string
  WEIGHT?: string
  HEALTH_STATUS?: string
  JOB?: string
  EXERCISE_INTENSITY?: number
  EXERCISE_FREQUENCY?: string // Backend expects string
  DATE_WORKDAY?: number // Backend expects number (minutes)
  DATE_OFF?: number // Backend expects number (minutes)
  IS_MYSELF?: boolean
  AVATAR?: string
}

interface HealthFormPanelProps {
  healthDocument: HealthDocument | null
  onUpdate: (data: HealthDocument) => void
  isEditMode: boolean
  onEditModeChange: (isEdit: boolean) => void
}

const HealthFormPanel: React.FC<HealthFormPanelProps> = ({
  healthDocument,
  onUpdate,
  isEditMode,
  onEditModeChange,
}) => {
  const [formData, setFormData] = useState<HealthDocument>({
    FULL_NAME: "",
    DOB: "",
    GENDER_ID: 1,
    HEIGHT: "",
    WEIGHT: "",
    HEALTH_STATUS: "healthy",
    JOB: "",
    EXERCISE_INTENSITY: 2,
    EXERCISE_FREQUENCY: "1-3 lần/tuần", // String default
    DATE_WORKDAY: 0, // Number (minutes)
    DATE_OFF: 0, // Number (minutes)
  })

  const [age, setAge] = useState<number>(0)
  const [previousAge, setPreviousAge] = useState<number>(0)
  const [ageWarning, setAgeWarning] = useState<{
    show: boolean
    message: string
    detail: string
    note: string
  } | null>(null)
  const isUnderFive = age < 5

  // Hàm xác định mức tuổi (1-5)
  const getAgeLevel = (age: number): number => {
    if (age < 5) return 1
    if (age >= 5 && age < 12) return 2
    if (age >= 12 && age < 19) return 3
    if (age >= 19 && age <= 70) return 4
    return 5 // > 70
  }

  // Hàm tạo cảnh báo theo mức tuổi
  // Cảnh báo về MỨC CŨ (fromLevel) khi chuyển sang mức mới
  const getAgeWarningMessage = (fromLevel: number, toLevel: number) => {
    // Không hiện cảnh báo nếu không thay đổi mức
    if (fromLevel === toLevel) return null

    const isUpgrade = toLevel > fromLevel // Tăng tuổi

    // CẢNH BÁO DỰA TRÊN MỨC CŨ (fromLevel)
    if (fromLevel === 1) {
      // Đang ở < 5 tuổi, chuyển lên > 5 tuổi
      return {
        show: true,
        message: `Bạn đang dưới 5 tuổi, phần mềm giúp bạn theo dõi các chỉ số quan trọng sau:`,
        detail: `• Cân nặng theo tuổi\n• Chiều dài/ chiều cao theo tuổi\n• Cân nặng theo chiều dài/chiều cao\n• Tuy nhiên, bạn không thể theo dõi các chỉ số này khi thay đổi độ tuổi của mình > 5 tuổi.`,
        note: `Lưu ý: Sau khi điều chỉnh khoảng tuổi (>5 tuổi), việc theo dõi các chỉ số sức khỏe dưới 5 tuổi có thể khôi phục nếu bạn điều chỉnh ngày/tháng/năm sinh như ban đầu.`,
      }
    }

    if (fromLevel === 2) {
      // Đang ở 5-12 tuổi
      if (isUpgrade) {
        // Chuyển lên 12-19 hoặc cao hơn
        return {
          show: true,
          message: `Giai đoạn từ 6 - dưới 12 tuổi và từ 12 - dưới 19 tuổi, phần mềm giúp bạn theo dõi chỉ số BMI theo tuổi. Tuy nhiên, khoảng tham chiếu dữa ra kết luận và khuyến nghị về tình trạng BMI của hai khoảng tuổi này khác nhau.`,
          detail: `Do đó, việc điều chỉnh khoảng tuổi từ 6- dưới 12 tuổi thành từ 12 - dưới 19 tuổi và ngược lại có thể làm thay đổi các kết luận và khuyến nghị.`,
          note: `Lưu ý: Sau khi điều chỉnh về lại khoảng tuổi ban đầu, kết luận và khuyến nghị về BMI có thể được khôi phục.`,
        }
      } else {
        // Chuyển xuống < 5 tuổi
        return {
          show: true,
          message: `Bạn đang từ trên 5 tuổi đến dưới 12 tuổi, phần mềm giúp bạn theo dõi chỉ số BMI theo tuổi. Tuy nhiên, bạn không thể theo dõi chỉ số này khi thay đổi độ tuổi của mình từ trên 5 tuổi đến dưới 12 tuổi thành dưới 5 tuổi.`,
          detail: ``,
          note: `Lưu ý: Sau khi điều chỉnh khoảng tuổi (5 tuổi - dưới 12 tuổi), việc theo dõi các chỉ số sức khỏe từ 5 tuổi - dưới 12 tuổi có thể khôi phục nếu bạn điều chỉnh ngày/tháng/năm sinh như ban đầu.`,
        }
      }
    }

    if (fromLevel === 3) {
      // Đang ở 12-19 tuổi
      if (isUpgrade) {
        // Chuyển lên >= 19 tuổi
        return {
          show: true,
          message: `Bạn đang từ 12 tuổi đến dưới 19 tuổi, phần mềm giúp bạn theo dõi chỉ số BMI theo tuổi. Tuy nhiên, bạn không thể theo dõi chỉ số này khi thay đổi độ tuổi của mình từ ≥ 19 tuổi.`,
          detail: ``,
          note: `Lưu ý: Sau khi điều chỉnh khoảng tuổi (12 tuổi - dưới 19 tuổi), việc theo dõi các chỉ số sức khỏe từ 12 tuổi - dưới 19 tuổi có thể khôi phục nếu bạn điều chỉnh ngày/tháng/năm sinh như ban đầu.`,
        }
      } else {
        // Chuyển xuống < 12 tuổi
        return {
          show: true,
          message: `Giai đoạn từ 6 - dưới 12 tuổi và từ 12 - dưới 19 tuổi, phần mềm giúp bạn theo dõi chỉ số BMI theo tuổi. Tuy nhiên, khoảng tham chiếu dữa ra kết luận và khuyến nghị về tình trạng BMI của hai khoảng tuổi này khác nhau.`,
          detail: `Do đó, việc điều chỉnh khoảng tuổi từ 6- dưới 12 tuổi thành từ 12 - dưới 19 tuổi và ngược lại có thể làm thay đổi các kết luận và khuyến nghị.`,
          note: `Lưu ý: Sau khi điều chỉnh về lại khoảng tuổi ban đầu, kết luận và khuyến nghị về BMI có thể được khôi phục.`,
        }
      }
    }

    if (fromLevel === 4) {
      // Đang ở 19-70 tuổi
      if (isUpgrade) {
        // Chuyển lên > 70 tuổi
        return {
          show: true,
          message: `Giai đoạn từ 19 tuổi - dưới 70 tuổi và từ 70 tuổi trở lên, phần mềm giúp bạn theo dõi các chỉ số quan trọng sau:`,
          detail: `• BMI\n• Huyết áp\n• Chức năng gan\n• Chức năng thận\n• Mỡ máu\n• Đường huyết\n• Axit uric`,
          note: `Tuy nhiên, khoảng tham chiếu đưa ra kết luận và khuyến nghị về các chỉ số sức khỏe của hai khoảng tuổi này khác nhau. Do đó, việc điều chỉnh khoảng tuổi từ 19 tuổi - dưới 70 tuổi thành từ 70 tuổi trở lên và ngược lại có thể làm thay đổi các kết luận và khuyến nghị.`,
        }
      } else {
        // Chuyển xuống < 19 tuổi
        return {
          show: true,
          message: `Bạn đang từ 19 tuổi đến dưới 70 tuổi, phần mềm giúp bạn theo dõi các chỉ số quan trọng sau:`,
          detail: `• BMI\n• Huyết áp\n• Chức năng gan\n• Chức năng thận\n• Mỡ máu\n• Đường huyết\n• Axit uric`,
          note: `Tuy nhiên, bạn không thể theo dõi các chỉ số này khi thay đổi độ tuổi của mình < 19 tuổi.`,
        }
      }
    }

    if (fromLevel === 5) {
      // Đang ở > 70 tuổi, chuyển xuống
      return {
        show: true,
        message: `Giai đoạn từ 19 tuổi - dưới 70 tuổi và từ 70 tuổi trở lên, phần mềm giúp bạn theo dõi các chỉ số quan trọng sau:`,
        detail: `• BMI\n• Huyết áp\n• Chức năng gan\n• Chức năng thận\n• Mỡ máu\n• Đường huyết\n• Axit uric`,
        note: `Tuy nhiên, khoảng tham chiếu đưa ra kết luận và khuyến nghị về các chỉ số sức khỏe của hai khoảng tuổi này khác nhau. Do đó, việc điều chỉnh khoảng tuổi từ 19 tuổi - dưới 70 tuổi thành từ 70 tuổi trở lên và ngược lại có thể làm thay đổi các kết luận và khuyến nghị.`,
      }
    }

    return null
  }

  // Load data khi healthDocument thay đổi
  useEffect(() => {
    if (healthDocument) {
      setFormData((prev) => ({
        ...prev,
        ...healthDocument,
      }))
      // Set initial age
      if (healthDocument.DOB) {
        const initialAge = calculateAge(healthDocument.DOB)
        setAge(initialAge)
        setPreviousAge(initialAge)
      }
    }
  }, [healthDocument])

  // Tính tuổi khi DOB thay đổi và hiện cảnh báo
  useEffect(() => {
    if (formData.DOB && isEditMode) {
      const calculatedAge = calculateAge(formData.DOB)
      const previousLevel = getAgeLevel(previousAge)
      const newLevel = getAgeLevel(calculatedAge)

      // Hiện cảnh báo nếu thay đổi mức tuổi
      if (previousLevel !== newLevel && previousAge !== 0) {
        const warning = getAgeWarningMessage(previousLevel, newLevel)
        setAgeWarning(warning)
      } else {
        setAgeWarning(null)
      }

      setAge(calculatedAge)
      setPreviousAge(calculatedAge)
    }
  }, [formData.DOB, isEditMode, previousAge])

  const handleSubmit = () => {
    if (
      !formData.FULL_NAME ||
      !formData.DOB ||
      !formData.HEIGHT ||
      !formData.WEIGHT
    ) {
      showToast.warning("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }

    onUpdate(formData)
  }

  // Nếu chưa có document nào được chọn
  if (!healthDocument) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="mb-4 text-6xl">📋</div>
            <p className="text-lg">Chọn một hồ sơ để xem chi tiết</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full">
      <Card className="border-none shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 text-white py-6">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Hồ sơ sức khỏe</h2>
                <p className="text-xs text-teal-50 mt-0.5">
                  Quản lý thông tin cá nhân
                </p>
              </div>
            </div>
            {!isEditMode && (
              <Button
                variant="outline"
                className="bg-white text-teal-600 hover:bg-teal-50 hover:text-teal-700 border-none font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => onEditModeChange(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 bg-gradient-to-b from-gray-50 to-white">
          {/* Wrap toàn bộ form - disable interaction khi không edit */}
          <div className={!isEditMode ? "pointer-events-none opacity-70" : ""}>
            {/* Avatar Section */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-4xl text-gray-500">
                  {healthDocument.AVATAR ? (
                    <img
                      src={healthDocument.AVATAR}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-teal-600" />
                  )}
                </div>
                <button className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(158,64%,52%)] text-white hover:bg-[hsl(158,64%,45%)]">
                  <span className="text-sm">Cập nhật</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Tên hiển thị */}
              <div>
                <Label className="flex items-center text-sm font-medium">
                  <User className="mr-1 h-4 w-4" />
                  Tên hiển thị <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Nhập họ và tên"
                  value={formData.FULL_NAME}
                  onChange={(e) =>
                    setFormData({ ...formData, FULL_NAME: e.target.value })
                  }
                  className="mt-1"
                  disabled={!isEditMode}
                />
              </div>

              {/* Ngày sinh */}
              <div>
                <Label className="flex items-center text-sm font-medium">
                  <Calendar className="mr-1 h-4 w-4" />
                  Ngày sinh <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.DOB}
                  onChange={(e) =>
                    setFormData({ ...formData, DOB: e.target.value })
                  }
                  className="mt-1"
                  disabled={!isEditMode}
                />
              </div>

              {/* CẢNH BÁO ĐỘNG KHI THAY ĐỔI MỨC TUỔI */}
              {ageWarning && ageWarning.show && (
                <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div className="flex-1">
                      <p className="mb-2 text-sm font-bold text-orange-800">
                        Cảnh báo
                      </p>
                      <p className="mb-2 text-sm text-gray-800">
                        {ageWarning.message}
                      </p>
                      {ageWarning.detail && (
                        <div className="mb-2 text-sm whitespace-pre-line text-gray-700">
                          {ageWarning.detail}
                        </div>
                      )}
                      {ageWarning.note && (
                        <p className="mt-2 text-xs text-gray-600 italic">
                          {ageWarning.note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Warning cho tuổi 12-19 - GIỮ LẠI (hiện khi không thay đổi) */}
              {!ageWarning && age >= 12 && age < 19 && (
                <div className="rounded-md border border-orange-200 bg-orange-50 p-3">
                  <p className="flex items-center text-xs font-semibold text-orange-600">
                    ⚠️ Cảnh báo
                  </p>
                  <p className="mt-1 text-xs text-gray-700">
                    Bạn đang <strong>từ 12 tuổi đến dưới 19 tuổi</strong>, phần
                    mềm giúp bạn theo dõi chỉ số <strong>BMI theo tuổi</strong>.
                    Tuy nhiên, bạn không thể theo dõi chỉ số này khi thay đổi độ
                    tuổi của mình <strong>từ ≥ 19 tuổi</strong>.
                  </p>
                  <p className="mt-2 text-xs text-gray-700 italic underline">
                    Lưu ý: Sau khi điều chỉnh khoảng tuổi (12 tuổi - dưới 19
                    tuổi), việc theo dõi các chỉ số sức khỏe từ 12 tuổi - dưới
                    19 tuổi có thể khôi phục nếu bạn điều chỉnh ngày/tháng/năm
                    sinh như ban đầu.
                  </p>
                </div>
              )}

              {/* Giới tính */}
              <div>
                <Label className="flex items-center text-sm font-medium">
                  <Users className="mr-1 h-4 w-4" />
                  Giới tính <span className="ml-1 text-red-500">*</span>
                </Label>
                <select
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[hsl(158,64%,52%)] focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                  value={formData.GENDER_ID}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      GENDER_ID: Number(e.target.value),
                    })
                  }
                  disabled={!isEditMode}
                >
                  <option value={1}>Nam</option>
                  <option value={2}>Nữ</option>
                </select>
              </div>

              {/* Physical Measures */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center">
                  <div className="w-1 h-5 bg-teal-500 rounded-full mr-3"></div>
                  Chỉ số cơ thể
                </h3>
                <PhysicalMeasuresSection
                  height={formData.HEIGHT || ""}
                  weight={formData.WEIGHT || ""}
                  onHeightChange={(value) =>
                    setFormData({ ...formData, HEIGHT: value })
                  }
                  onWeightChange={(value) =>
                    setFormData({ ...formData, WEIGHT: value })
                  }
                  disabled={!isEditMode}
                />
              </div>

              {/* Activity Level - disabled cho < 5 tuổi hoặc không edit */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center">
                  <div className="w-1 h-5 bg-teal-500 rounded-full mr-3"></div>
                  Mức độ vận động
                </h3>
                <ActivityLevelSlider
                  value={formData.EXERCISE_INTENSITY || 2}
                  onChange={(value) =>
                    setFormData({ ...formData, EXERCISE_INTENSITY: value })
                  }
                  disabled={isUnderFive || !isEditMode}
                />
              </div>

              {/* Các fields chỉ hiện với age >= 5 */}
              {!isUnderFive && age >= 5 && (
                <>
                  <HealthStatusDropdown
                    value={formData.HEALTH_STATUS || "healthy"}
                    onChange={(value) =>
                      setFormData({ ...formData, HEALTH_STATUS: value })
                    }
                  />

                  <JobInputSection
                    value={formData.JOB || ""}
                    onChange={(value) =>
                      setFormData({ ...formData, JOB: value })
                    }
                  />

                  <ExerciseFrequencySlider
                    value={
                      typeof formData.EXERCISE_FREQUENCY === "string"
                        ? 2
                        : formData.EXERCISE_FREQUENCY || 2
                    }
                    onChange={(value) => {
                      // Convert number to string label for backend
                      const labels = [
                        "Rất ít/không",
                        "1-3 lần/tuần",
                        "4-5 lần/tuần",
                        "Hằng ngày",
                      ]
                      setFormData({
                        ...formData,
                        EXERCISE_FREQUENCY: labels[value - 1] || labels[1],
                      })
                    }}
                  />

                  <ExerciseTimeInputs
                    workdayTime={formData.DATE_WORKDAY || 0}
                    weekendTime={formData.DATE_OFF || 0}
                    onWorkdayChange={(value) =>
                      setFormData({ ...formData, DATE_WORKDAY: value })
                    }
                    onWeekendChange={(value) =>
                      setFormData({ ...formData, DATE_OFF: value })
                    }
                  />
                </>
              )}
            </div>
          </div>
          {/* End of pointer-events-none wrapper */}

          {/* Action Buttons - chỉ hiện khi đang edit */}
          {isEditMode && (
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  onEditModeChange(false)
                  // Reload data từ healthDocument gốc
                  if (healthDocument) {
                    setFormData({ ...formData, ...healthDocument })
                  }
                }}
                className="flex-1 border-2 border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 font-medium py-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <X className="w-5 h-5 mr-2" />
                Hủy bỏ
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-[hsl(158,64%,52%)] text-white hover:bg-[hsl(158,64%,45%)]"
              >
                <Save className="w-5 h-5 mr-2" />
                Lưu thay đổi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HealthFormPanel
