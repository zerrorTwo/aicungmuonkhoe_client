import React from "react";
import { Label } from "@/components/ui/label";
import { Dumbbell } from "lucide-react";

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
      <Label className="text-sm font-medium flex items-center text-gray-700 mb-3">
        <Dumbbell className="w-4 h-4 mr-2 text-teal-600" />
        Tần suất vận động, tập luyện thể dục thể thao trong tuần
      </Label>
      <div className="relative">
        <input
          type="range"
          min="1"
          max="4"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-gradient-to-r from-gray-300 via-teal-400 to-teal-600 rounded-full appearance-none cursor-pointer shadow-inner"
          style={{
            WebkitAppearance: "none",
          }}
        />
        <div className="flex justify-between mt-3 px-1">
          {labels.map((label, index) => (
            <div
              key={index}
              className={`text-xs transition-all text-center ${
                value === index + 1
                  ? "text-teal-600 font-bold scale-110"
                  : "text-gray-500"
              }`}
            >
              <div
                className={`px-2 py-1 rounded-lg ${
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

export default ExerciseFrequencySlider;
