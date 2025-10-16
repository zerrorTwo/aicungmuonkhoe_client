import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { calculateAge } from "@/utils/age";
import PhysicalMeasuresSection from "../healthForm/PhysicalMeasuresSection";
import ActivityLevelSlider from "../healthForm/ActivityLevelSlider";
import HealthStatusDropdown from "../healthForm/HealthStatusDropdown";
import JobInputSection from "../healthForm/JobInputSection";
import ExerciseFrequencySlider from "../healthForm/ExerciseFrequencySlider";
import ExerciseTimeInputs from "../healthForm/ExerciseTimeInputs";
import { User, Calendar, Users } from "lucide-react";
import { showToast } from "../../utils/toast";

interface HealthDocument {
  ID?: number;
  FULL_NAME?: string;
  DOB?: string;
  GENDER_ID?: number;
  HEIGHT?: string;
  WEIGHT?: string;
  HEALTH_STATUS?: string;
  JOB?: string;
  EXERCISE_INTENSITY?: number;
  EXERCISE_FREQUENCY?: string; // Backend expects string
  DATE_WORKDAY?: number; // Backend expects number (minutes)
  DATE_OFF?: number; // Backend expects number (minutes)
  IS_MYSELF?: boolean;
  AVATAR?: string;
}

interface HealthFormPanelProps {
  healthDocument: HealthDocument | null;
  onUpdate: (data: HealthDocument) => void;
  isEditMode: boolean;
  onEditModeChange: (isEdit: boolean) => void;
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
  });

  const [age, setAge] = useState<number>(0);
  const [previousAge, setPreviousAge] = useState<number>(0);
  const [ageWarning, setAgeWarning] = useState<{
    show: boolean;
    message: string;
    detail: string;
    note: string;
  } | null>(null);
  const isUnderFive = age < 5;

  // Hàm xác định mức tuổi (1-5)
  const getAgeLevel = (age: number): number => {
    if (age < 5) return 1;
    if (age >= 5 && age < 12) return 2;
    if (age >= 12 && age < 19) return 3;
    if (age >= 19 && age <= 70) return 4;
    return 5; // > 70
  };

  // Hàm tạo cảnh báo theo mức tuổi
  // Cảnh báo về MỨC CŨ (fromLevel) khi chuyển sang mức mới
  const getAgeWarningMessage = (fromLevel: number, toLevel: number) => {
    // Không hiện cảnh báo nếu không thay đổi mức
    if (fromLevel === toLevel) return null;

    const isUpgrade = toLevel > fromLevel; // Tăng tuổi

    // CẢNH BÁO DỰA TRÊN MỨC CŨ (fromLevel)
    if (fromLevel === 1) {
      // Đang ở < 5 tuổi, chuyển lên > 5 tuổi
      return {
        show: true,
        message: `Bạn đang dưới 5 tuổi, phần mềm giúp bạn theo dõi các chỉ số quan trọng sau:`,
        detail: `• Cân nặng theo tuổi\n• Chiều dài/ chiều cao theo tuổi\n• Cân nặng theo chiều dài/chiều cao\n• Tuy nhiên, bạn không thể theo dõi các chỉ số này khi thay đổi độ tuổi của mình > 5 tuổi.`,
        note: `Lưu ý: Sau khi điều chỉnh khoảng tuổi (>5 tuổi), việc theo dõi các chỉ số sức khỏe dưới 5 tuổi có thể khôi phục nếu bạn điều chỉnh ngày/tháng/năm sinh như ban đầu.`,
      };
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
        };
      } else {
        // Chuyển xuống < 5 tuổi
        return {
          show: true,
          message: `Bạn đang từ trên 5 tuổi đến dưới 12 tuổi, phần mềm giúp bạn theo dõi chỉ số BMI theo tuổi. Tuy nhiên, bạn không thể theo dõi chỉ số này khi thay đổi độ tuổi của mình từ trên 5 tuổi đến dưới 12 tuổi thành dưới 5 tuổi.`,
          detail: ``,
          note: `Lưu ý: Sau khi điều chỉnh khoảng tuổi (5 tuổi - dưới 12 tuổi), việc theo dõi các chỉ số sức khỏe từ 5 tuổi - dưới 12 tuổi có thể khôi phục nếu bạn điều chỉnh ngày/tháng/năm sinh như ban đầu.`,
        };
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
        };
      } else {
        // Chuyển xuống < 12 tuổi
        return {
          show: true,
          message: `Giai đoạn từ 6 - dưới 12 tuổi và từ 12 - dưới 19 tuổi, phần mềm giúp bạn theo dõi chỉ số BMI theo tuổi. Tuy nhiên, khoảng tham chiếu dữa ra kết luận và khuyến nghị về tình trạng BMI của hai khoảng tuổi này khác nhau.`,
          detail: `Do đó, việc điều chỉnh khoảng tuổi từ 6- dưới 12 tuổi thành từ 12 - dưới 19 tuổi và ngược lại có thể làm thay đổi các kết luận và khuyến nghị.`,
          note: `Lưu ý: Sau khi điều chỉnh về lại khoảng tuổi ban đầu, kết luận và khuyến nghị về BMI có thể được khôi phục.`,
        };
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
        };
      } else {
        // Chuyển xuống < 19 tuổi
        return {
          show: true,
          message: `Bạn đang từ 19 tuổi đến dưới 70 tuổi, phần mềm giúp bạn theo dõi các chỉ số quan trọng sau:`,
          detail: `• BMI\n• Huyết áp\n• Chức năng gan\n• Chức năng thận\n• Mỡ máu\n• Đường huyết\n• Axit uric`,
          note: `Tuy nhiên, bạn không thể theo dõi các chỉ số này khi thay đổi độ tuổi của mình < 19 tuổi.`,
        };
      }
    }

    if (fromLevel === 5) {
      // Đang ở > 70 tuổi, chuyển xuống
      return {
        show: true,
        message: `Giai đoạn từ 19 tuổi - dưới 70 tuổi và từ 70 tuổi trở lên, phần mềm giúp bạn theo dõi các chỉ số quan trọng sau:`,
        detail: `• BMI\n• Huyết áp\n• Chức năng gan\n• Chức năng thận\n• Mỡ máu\n• Đường huyết\n• Axit uric`,
        note: `Tuy nhiên, khoảng tham chiếu đưa ra kết luận và khuyến nghị về các chỉ số sức khỏe của hai khoảng tuổi này khác nhau. Do đó, việc điều chỉnh khoảng tuổi từ 19 tuổi - dưới 70 tuổi thành từ 70 tuổi trở lên và ngược lại có thể làm thay đổi các kết luận và khuyến nghị.`,
      };
    }

    return null;
  };

  // Load data khi healthDocument thay đổi
  useEffect(() => {
    if (healthDocument) {
      console.log("📥 Loading health document data:", healthDocument);
      setFormData({
        ...formData,
        ...healthDocument,
      });
      // Set initial age
      if (healthDocument.DOB) {
        const initialAge = calculateAge(healthDocument.DOB);
        setAge(initialAge);
        setPreviousAge(initialAge);
      }
    }
  }, [healthDocument]);

  // Tính tuổi khi DOB thay đổi và hiện cảnh báo
  useEffect(() => {
    if (formData.DOB && isEditMode) {
      const calculatedAge = calculateAge(formData.DOB);
      const previousLevel = getAgeLevel(previousAge);
      const newLevel = getAgeLevel(calculatedAge);

      console.log(
        `🎂 Age changed: ${previousAge} (level ${previousLevel}) → ${calculatedAge} (level ${newLevel})`
      );

      // Hiện cảnh báo nếu thay đổi mức tuổi
      if (previousLevel !== newLevel && previousAge !== 0) {
        const warning = getAgeWarningMessage(previousLevel, newLevel);
        setAgeWarning(warning);
      } else {
        setAgeWarning(null);
      }

      setAge(calculatedAge);
      setPreviousAge(calculatedAge);
    }
  }, [formData.DOB, isEditMode]);

  const handleSubmit = () => {
    if (
      !formData.FULL_NAME ||
      !formData.DOB ||
      !formData.HEIGHT ||
      !formData.WEIGHT
    ) {
      showToast.warning("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    console.log("💾 Submitting health document update:", formData);
    onUpdate(formData);
  };

  // Nếu chưa có document nào được chọn
  if (!healthDocument) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg">Chọn một hồ sơ để xem chi tiết</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Card className="shadow-weather">
        <CardHeader className="bg-gradient-to-r from-[hsl(158,64%,52%)] to-[hsl(158,64%,42%)] text-white">
          <CardTitle className="flex items-center justify-between">
            <span>Hồ sơ sức khỏe</span>
            {!isEditMode && (
              <Button
                variant="outline"
                className="bg-white text-[hsl(158,64%,52%)] hover:bg-gray-100"
                onClick={() => onEditModeChange(true)}
              >
                ✏️ Chỉnh sửa
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Bỏ overflow-y-auto và max-h để scroll theo trang */}
          {/* Wrap toàn bộ form - disable interaction khi không edit */}
          <div className={!isEditMode ? "pointer-events-none opacity-70" : ""}>
            {/* Avatar Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl overflow-hidden">
                  {healthDocument.AVATAR ? (
                    <img
                      src={healthDocument.AVATAR}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "👤"
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-[hsl(158,64%,52%)] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[hsl(158,64%,45%)]">
                  <span className="text-sm">Cập nhật</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Tên hiển thị */}
              <div>
                <Label className="text-sm font-medium flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Tên hiển thị <span className="text-red-500 ml-1">*</span>
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
                <Label className="text-sm font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Ngày sinh <span className="text-red-500 ml-1">*</span>
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
                <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-orange-800 mb-2">
                        Cảnh báo
                      </p>
                      <p className="text-sm text-gray-800 mb-2">
                        {ageWarning.message}
                      </p>
                      {ageWarning.detail && (
                        <div className="text-sm text-gray-700 mb-2 whitespace-pre-line">
                          {ageWarning.detail}
                        </div>
                      )}
                      {ageWarning.note && (
                        <p className="text-xs text-gray-600 italic mt-2">
                          {ageWarning.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Warning cho tuổi 12-19 - GIỮ LẠI (hiện khi không thay đổi) */}
              {!ageWarning && age >= 12 && age < 19 && (
                <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                  <p className="text-xs font-semibold text-orange-600 flex items-center">
                    ⚠️ Cảnh báo
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    Bạn đang <strong>từ 12 tuổi đến dưới 19 tuổi</strong>, phần
                    mềm giúp bạn theo dõi chỉ số <strong>BMI theo tuổi</strong>.
                    Tuy nhiên, bạn không thể theo dõi chỉ số này khi thay đổi độ
                    tuổi của mình <strong>từ ≥ 19 tuổi</strong>.
                  </p>
                  <p className="text-xs text-gray-700 mt-2 italic underline">
                    Lưu ý: Sau khi điều chỉnh khoảng tuổi (12 tuổi - dưới 19
                    tuổi), việc theo dõi các chỉ số sức khỏe từ 12 tuổi - dưới
                    19 tuổi có thể khôi phục nếu bạn điều chỉnh ngày/tháng/năm
                    sinh như ban đầu.
                  </p>
                </div>
              )}

              {/* Giới tính */}
              <div>
                <Label className="text-sm font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Giới tính <span className="text-red-500 ml-1">*</span>
                </Label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(158,64%,52%)] disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              <div
                className={!isEditMode ? "pointer-events-none opacity-60" : ""}
              >
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
              <ActivityLevelSlider
                value={formData.EXERCISE_INTENSITY || 2}
                onChange={(value) =>
                  setFormData({ ...formData, EXERCISE_INTENSITY: value })
                }
                disabled={isUnderFive || !isEditMode}
              />

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
                      ];
                      setFormData({
                        ...formData,
                        EXERCISE_FREQUENCY: labels[value - 1] || labels[1],
                      });
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
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  onEditModeChange(false);
                  // Reload data từ healthDocument gốc
                  if (healthDocument) {
                    setFormData({ ...formData, ...healthDocument });
                  }
                }}
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white"
              >
                Lưu thay đổi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthFormPanel;
