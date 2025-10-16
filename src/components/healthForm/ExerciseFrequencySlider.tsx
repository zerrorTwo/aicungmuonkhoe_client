import React from "react";
import { Label } from "@/components/ui/label";

interface ExerciseFrequencySliderProps {
  value: number; // 1 = Rất ít/không, 2 = 1-3 lần/tuần, 3 = 4-5 lần/tuần, 4 = Hằng ngày
  onChange: (value: number) => void;
}

const ExerciseFrequencySlider: React.FC<ExerciseFrequencySliderProps> = ({
  value,
  onChange,
}) => {
  const labels = [
    "Rất ít/không",
    "1-3 lần / tuần",
    "4-5 lần / tuần",
    "Hằng ngày",
  ];

  return (
    <div>
      <Label className="text-sm font-medium flex items-center mb-2">
        🏋️ Tần suất vận động, tập luyện thể dục thể thao trong tuần
      </Label>
      <div className="mt-2">
        <input
          type="range"
          min="1"
          max="4"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-gray-200 via-teal-300 to-teal-500 rounded-lg appearance-none cursor-pointer"
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

export default ExerciseFrequencySlider;
