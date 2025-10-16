import React from "react";
import { Label } from "@/components/ui/label";

interface HealthStatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const healthStatusOptions = [
  {
    value: "lipid_disorder",
    label: "Rối loạn chuyển hóa lipid/ Rối loạn chuyển hóa mỡ máu",
  },
  { value: "healthy", label: "Tôi khỏe mạnh" },
  { value: "no_disease", label: "Tôi không mắc bệnh nào kể trên" },
];

const HealthStatusDropdown: React.FC<HealthStatusDropdownProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <Label className="text-sm font-medium flex items-center">
        💊 Tình trạng sức khỏe
      </Label>
      <div className="mt-1 space-y-2">
        {healthStatusOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 text-[hsl(158,64%,52%)] border-gray-300 rounded focus:ring-[hsl(158,64%,52%)]"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default HealthStatusDropdown;
