import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <Label className="text-sm font-medium flex items-center">
          📏 Chiều cao
        </Label>
        <div className="relative mt-1">
          <Input
            type="number"
            placeholder="Chiều cao"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            className="pr-10"
            disabled={disabled}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            cm
          </span>
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium flex items-center">
          ⚖️ Cân nặng
        </Label>
        <div className="relative mt-1">
          <Input
            type="number"
            placeholder="Cân nặng"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            className="pr-10"
            disabled={disabled}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            kg
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhysicalMeasuresSection;
