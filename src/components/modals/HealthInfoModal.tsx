import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ModalOverlay from "./ModalOverlay";
import { calculateAge } from "@/utils/age";
import PhysicalMeasuresSection from "../healthForm/PhysicalMeasuresSection";
import ActivityLevelSlider from "../healthForm/ActivityLevelSlider";
import HealthStatusDropdown from "../healthForm/HealthStatusDropdown";
import JobInputSection from "../healthForm/JobInputSection";
import ExerciseFrequencySlider from "../healthForm/ExerciseFrequencySlider";
import ExerciseTimeInputs from "../healthForm/ExerciseTimeInputs";
import { User, Calendar, Users } from "lucide-react";

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

interface HealthInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HealthDocument) => void;
  initialData?: HealthDocument | null;
}

const HealthInfoModal: React.FC<HealthInfoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<HealthDocument>({
    FULL_NAME: "",
    DOB: "",
    GENDER_ID: 1,
    HEIGHT: "",
    WEIGHT: "",
    HEALTH_STATUS: "healthy",
    JOB: "",
    EXERCISE_INTENSITY: 2, // Default: Trung Bình
    EXERCISE_FREQUENCY: "1-3 lần/tuần", // String default
    DATE_WORKDAY: 0, // Number (minutes)
    DATE_OFF: 0, // Number (minutes)
  });

  const [age, setAge] = useState<number>(0);
  const isUnderFive = age < 5;

  // Load initial data
  useEffect(() => {
    if (initialData) {
      console.log("Loading initial data:", initialData);
      setFormData({
        ...formData,
        ...initialData,
      });
    } else {
      // Reset form if no initial data
      setFormData({
        FULL_NAME: "",
        DOB: "",
        GENDER_ID: 1,
        HEIGHT: "",
        WEIGHT: "",
        HEALTH_STATUS: "",
        JOB: "",
        EXERCISE_INTENSITY: 2,
        EXERCISE_FREQUENCY: "1-3 lần/tuần",
        DATE_WORKDAY: 0,
        DATE_OFF: 0,
      });
    }
  }, [initialData]);

  // Calculate age when DOB changes
  useEffect(() => {
    if (formData.DOB) {
      const calculatedAge = calculateAge(formData.DOB);
      setAge(calculatedAge);
      console.log("Age calculated:", calculatedAge);
    }
  }, [formData.DOB]);

  const handleSubmit = () => {
    // Basic validation
    if (
      !formData.FULL_NAME ||
      !formData.DOB ||
      !formData.HEIGHT ||
      !formData.WEIGHT
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    console.log("Submitting health document:", formData);
    onSubmit(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[hsl(158,64%,52%)] mb-6">
          Hồ sơ sức khỏe
          {age > 0 && (
            <span className="ml-2 text-sm text-gray-500">({age} tuổi)</span>
          )}
        </h2>

        {/* Avatar Section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
              👤
            </div>
            <button className="absolute bottom-0 right-0 bg-[hsl(158,64%,52%)] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[hsl(158,64%,45%)]">
              <span className="text-sm">✎</span>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Basic Info - Always shown */}
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
            />
          </div>

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
            />
          </div>

          {/* Warning for under 5 years old */}
          {age > 0 && isUnderFive && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
              <p className="text-xs font-semibold text-orange-600 flex items-center">
                ⚠️ Cảnh báo
              </p>
              <p className="text-xs text-gray-700 mt-1">
                Bạn dưới 12 tuổi cần điền đầy đủ các thông tin theo đúng độ tuổi{" "}
                <span className="font-semibold">
                  {age < 2 ? "dưới 2 tuổi" : "từ 2-5 tuổi"}
                </span>
                . Tuy nhiên, bạn không thể tự theo dõi ở độ tuổi này. Ở độ tuổi
                từ 12 tuổi trở lên, các tính năng sẽ được mở khóa đầy đủ.
              </p>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Giới tính <span className="text-red-500 ml-1">*</span>
            </Label>
            <select
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(158,64%,52%)]"
              value={formData.GENDER_ID}
              onChange={(e) =>
                setFormData({ ...formData, GENDER_ID: Number(e.target.value) })
              }
            >
              <option value={1}>Nam</option>
              <option value={2}>Nữ</option>
            </select>
          </div>

          {/* Physical Measures - Always shown */}
          <PhysicalMeasuresSection
            height={formData.HEIGHT || ""}
            weight={formData.WEIGHT || ""}
            onHeightChange={(value) =>
              setFormData({ ...formData, HEIGHT: value })
            }
            onWeightChange={(value) =>
              setFormData({ ...formData, WEIGHT: value })
            }
          />

          {/* Activity Level - Always shown, disabled for under 5 */}
          <ActivityLevelSlider
            value={formData.EXERCISE_INTENSITY || 2}
            onChange={(value) =>
              setFormData({ ...formData, EXERCISE_INTENSITY: value })
            }
            disabled={isUnderFive}
          />

          {/* Age >= 5: Show additional fields */}
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
                onChange={(value) => setFormData({ ...formData, JOB: value })}
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

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white"
          >
            Lưu
          </Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default HealthInfoModal;
