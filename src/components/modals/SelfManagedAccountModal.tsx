import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import DatePicker from "../ui/date-picker";
import { User, Calendar, Users } from "lucide-react";
import ModalOverlay from "./ModalOverlay";
import { showToast } from "../../utils/toast";

interface SelfManagedAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    FULL_NAME: string;
    DOB: string;
    GENDER_ID: number;
  }) => void;
}

const SelfManagedAccountModal: React.FC<SelfManagedAccountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    FULL_NAME: "",
    DOB: "",
    GENDER_ID: 1,
  });

  const handleSubmit = () => {
    if (formData.FULL_NAME && formData.DOB && formData.GENDER_ID) {
      onSubmit(formData);
      // Reset form
      setFormData({
        FULL_NAME: "",
        DOB: "",
        GENDER_ID: 1,
      });
      onClose();
    } else {
      showToast.warning("Vui lòng điền đầy đủ thông tin bắt buộc");
    }
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, DOB: date });
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-h-[600px] overflow-y-auto">
        <h2 className="text-xl font-bold text-[hsl(158,64%,52%)] mb-6">
          Thêm hồ sơ sức khỏe
        </h2>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium flex items-center">
              <User className="w-4 h-4 mr-1" />
              Họ và tên <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              placeholder="Nhập họ và tên đầy đủ"
              className="mt-1"
              value={formData.FULL_NAME}
              onChange={(e) =>
                setFormData({ ...formData, FULL_NAME: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Ngày sinh <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="mt-1 relative">
              <DatePicker
                value={formData.DOB}
                onChange={handleDateChange}
                placeholder="Chọn ngày sinh"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Giới tính <span className="text-red-500 ml-1">*</span>
            </Label>
            <select
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(158,64%,52%)]"
              value={formData.GENDER_ID}
              onChange={(e) =>
                setFormData({ ...formData, GENDER_ID: Number(e.target.value) })
              }
            >
              <option value={1}>Nam</option>
              <option value={2}>Nữ</option>
            </select>
          </div>
        </div>

        {/* Button */}
        <Button
          className="cursor-pointer w-full mt-6 bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white"
          onClick={handleSubmit}
        >
          Tạo hồ sơ sức khỏe
        </Button>
      </div>
    </ModalOverlay>
  );
};

export default SelfManagedAccountModal;
