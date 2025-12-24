import React from "react";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";

interface ActivityLevelSliderProps {
  value: number; // 1 = Nhẹ, 2 = Trung Bình, 3 = Nặng
  onChange: (value: number) => void;
  disabled?: boolean;
}

const ActivityLevelSlider: React.FC<ActivityLevelSliderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const labels = ["Nhẹ", "Trung Bình", "Nặng"];

  return (
    <div>
      <Label className="text-sm font-medium flex items-center text-gray-700 mb-3">
        <Activity className="w-4 h-4 mr-2 text-teal-600" />
        Hoạt động thể lực
        {disabled && (
          <span className="ml-2 text-xs text-gray-500 font-normal bg-gray-100 px-2 py-1 rounded-full">
            Mặc định: Trung Bình
          </span>
        )}
      </Label>
      <div className="relative">
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={`w-full h-3 rounded-full appearance-none cursor-pointer transition-all ${
            disabled
              ? "bg-gray-200 cursor-not-allowed opacity-60"
              : "bg-gradient-to-r from-green-300 via-teal-400 to-teal-600"
          }`}
          style={{
            WebkitAppearance: "none",
          }}
        />
        <div className="flex justify-between mt-3 px-1">
          {labels.map((label, index) => (
            <div
              key={index}
              className={`text-xs transition-all ${
                value === index + 1
                  ? "text-teal-600 font-bold scale-110"
                  : "text-gray-500"
              }`}
            >
              <div
                className={`text-center px-2 py-1 rounded-lg ${
                  value === index + 1 ? "bg-teal-50" : ""
                }`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLevelSlider;
