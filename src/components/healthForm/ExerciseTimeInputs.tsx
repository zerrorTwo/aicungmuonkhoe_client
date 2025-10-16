import React from "react";
import { Label } from "@/components/ui/label";

interface ExerciseTimeInputsProps {
  workdayTime: number; // in minutes
  weekendTime: number; // in minutes
  onWorkdayChange: (value: number) => void;
  onWeekendChange: (value: number) => void;
}

const ExerciseTimeInputs: React.FC<ExerciseTimeInputsProps> = ({
  workdayTime,
  weekendTime,
  onWorkdayChange,
  onWeekendChange,
}) => {
  const timeMarks = [0, 60, 125, 185, 240, 300];

  return (
    <div>
      <Label className="text-sm font-medium flex items-center mb-3">
        ⏱️ Thời gian mỗi lần vận động
      </Label>

      {/* Ngày làm việc / đi học */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Ngày làm việc / đi học:</span>
          <span className="text-sm font-semibold text-[hsl(158,64%,52%)]">
            {workdayTime} phút
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="300"
          step="5"
          value={workdayTime}
          onChange={(e) => onWorkdayChange(Number(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-gray-200 to-teal-500 rounded-lg appearance-none cursor-pointer"
          style={{
            WebkitAppearance: "none",
          }}
        />
        <div className="flex justify-between mt-1 px-1">
          {timeMarks.map((mark) => (
            <span key={mark} className="text-xs text-gray-400">
              {mark}
            </span>
          ))}
        </div>
      </div>

      {/* Ngày nghỉ */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Ngày nghỉ:</span>
          <span className="text-sm font-semibold text-[hsl(158,64%,52%)]">
            {weekendTime} phút
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="300"
          step="5"
          value={weekendTime}
          onChange={(e) => onWeekendChange(Number(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-gray-200 to-teal-500 rounded-lg appearance-none cursor-pointer"
          style={{
            WebkitAppearance: "none",
          }}
        />
        <div className="flex justify-between mt-1 px-1">
          {timeMarks.map((mark) => (
            <span key={mark} className="text-xs text-gray-400">
              {mark}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseTimeInputs;
