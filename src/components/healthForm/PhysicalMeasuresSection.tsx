import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, Weight } from "lucide-react";

interface PhysicalMeasuresSectionProps {
  height: string;
  weight: string;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  disabled?: boolean;
}

const PhysicalMeasuresSection: React.FC<PhysicalMeasuresSectionProps> = ({
  height,
  weight,
  onHeightChange,
  onWeightChange,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-sm font-medium flex items-center text-gray-700 mb-2">
          <Ruler className="w-4 h-4 mr-2 text-teal-600" />
          Chiều cao <span className="text-red-500 ml-1">*</span>
        </Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="Nhập chiều cao"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            className="pr-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
            disabled={disabled}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium bg-gray-50 px-2 py-1 rounded">
            cm
          </span>
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium flex items-center text-gray-700 mb-2">
          <Weight className="w-4 h-4 mr-2 text-teal-600" />
          Cân nặng <span className="text-red-500 ml-1">*</span>
        </Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="Nhập cân nặng"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            className="pr-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
            disabled={disabled}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium bg-gray-50 px-2 py-1 rounded">
            kg
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhysicalMeasuresSection;
