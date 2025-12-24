import React from "react";
import { Label } from "@/components/ui/label";
import { HeartPulse } from "lucide-react";

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
      <Label className="text-sm font-medium flex items-center text-gray-700 mb-3">
        <HeartPulse className="w-4 h-4 mr-2 text-teal-600" />
        Tình trạng sức khỏe
      </Label>
      <div className="space-y-3">
        {healthStatusOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-start space-x-3 cursor-pointer group hover:bg-teal-50 p-3 rounded-lg transition-all duration-200"
          >
            <input
              type="checkbox"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 mt-0.5 cursor-pointer"
            />
            <span className="text-sm text-gray-700 group-hover:text-teal-700 transition-colors leading-relaxed">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default HealthStatusDropdown;
