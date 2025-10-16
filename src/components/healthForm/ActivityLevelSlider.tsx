import React from "react";
import { Label } from "@/components/ui/label";

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
      <Label className="text-sm font-medium flex items-center">
        🏃 Hoạt động thể lực{" "}
        {disabled && (
          <span className="ml-2 text-xs text-gray-400">
            (Mặc định: Trung Bình)
          </span>
        )}
      </Label>
      <div className="mt-2">
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
            disabled
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gradient-to-r from-green-200 via-teal-300 to-teal-500"
          }`}
          style={{
            WebkitAppearance: "none",
          }}
        />
        <div className="flex justify-between mt-2 px-1">
          {labels.map((label, index) => (
            <span
              key={index}
              className={`text-xs ${
                value === index + 1
                  ? "text-[hsl(158,64%,52%)] font-semibold"
                  : "text-gray-500"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLevelSlider;
