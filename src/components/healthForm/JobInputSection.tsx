import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";

interface JobInputSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const JobInputSection: React.FC<JobInputSectionProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <Label className="text-sm font-medium flex items-center text-gray-700 mb-2">
        <Briefcase className="w-4 h-4 mr-2 text-teal-600" />
        Nghề nghiệp
      </Label>
      <Input
        placeholder="Nhập nghề nghiệp của bạn"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
      />
    </div>
  );
};

export default JobInputSection;
