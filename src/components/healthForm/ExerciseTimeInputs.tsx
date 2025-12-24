import React from "react";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

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
      <Label className="text-sm font-medium flex items-center text-gray-700 mb-4">
        <Clock className="w-4 h-4 mr-2 text-teal-600" />
        Thời gian mỗi lần vận động
      </Label>

      {/* Ngày làm việc / đi học */}
      <div className="mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">
            Ngày làm việc / đi học:
          </span>
          <span className="text-base font-bold text-teal-600 bg-white px-3 py-1 rounded-full shadow-sm">
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
          className="w-full h-3 bg-gradient-to-r from-gray-300 via-teal-400 to-teal-600 rounded-full appearance-none cursor-pointer shadow-inner"
          style={{
            WebkitAppearance: "none",
          }}
        />
        <div className="flex justify-between mt-2 px-1">
          {timeMarks.map((mark) => (
            <span key={mark} className="text-xs text-gray-500 font-medium">
              {mark}
            </span>
          ))}
        </div>
      </div>

      {/* Ngày nghỉ */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">Ngày nghỉ:</span>
          <span className="text-base font-bold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
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
          className="w-full h-3 bg-gradient-to-r from-gray-300 via-emerald-400 to-emerald-600 rounded-full appearance-none cursor-pointer shadow-inner"
          style={{
            WebkitAppearance: "none",
          }}
        />
        <div className="flex justify-between mt-2 px-1">
          {timeMarks.map((mark) => (
            <span key={mark} className="text-xs text-gray-500 font-medium">
              {mark}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseTimeInputs;
