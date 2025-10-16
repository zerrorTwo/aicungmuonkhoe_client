import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <Label className="text-sm font-medium flex items-center">
        💼 Nghề nghiệp
      </Label>
      <Input
        placeholder="Nhập nghề nghiệp"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
      />
    </div>
  );
};

export default JobInputSection;
