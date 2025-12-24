import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectItem } from "../ui/select";
import DatePicker from "../ui/date-picker";
import { User, Calendar, Users } from "lucide-react";
import ModalOverlay from "./ModalOverlay";
import { showToast } from "../../utils/toast";
import dayjs from 'dayjs';
import { useGetAllGendersQuery } from '@/store/api/genderApi';

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
    GENDER: "",
  });

  const { data: gendersResponse, isLoading: gendersLoading, isError: gendersIsError } = useGetAllGendersQuery();
  const genders = gendersResponse?.data || [];

  const handleSubmit = () => {
    if (!formData.FULL_NAME || !formData.DOB || !formData.GENDER) {
      showToast.error("Vui lòng điền họ tên, ngày sinh và chọn giới tính!");
      return;
    }
    if (dayjs(formData.DOB).isAfter(dayjs(), 'day')) {
      showToast.error("Ngày sinh không được lớn hơn ngày hiện tại!");
      return;
    }

    // Convert gender name to ID
    const selectedGender = genders.find((g) =>
      g.NAME?.trim().toUpperCase() === formData.GENDER.trim().toUpperCase()
    );
    const genderId = selectedGender?.ID || 7; // Default to 7 (NAM) if not found

    onSubmit({
      FULL_NAME: formData.FULL_NAME,
      DOB: formData.DOB,
      GENDER_ID: genderId,
    });
    setFormData({ FULL_NAME: "", DOB: "", GENDER: "" });
    onClose();
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, DOB: date });
  };

  const handleGenderChange = (genderName: string) => {
    setFormData({ ...formData, GENDER: genderName });
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-h-[600px] overflow-x-hidden" style={{ overflow: 'visible' }}>
        <h2 className="text-xl font-bold text-[hsl(158,64%,52%)] mb-6">
          Thêm hồ sơ sức khỏe
        </h2>

        {/* Form Fields */}
        <div className="space-y-4" style={{ overflow: 'visible' }}>
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

          <div style={{ position: 'relative', zIndex: 10000 }}>
            <Label className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Ngày sinh <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="mt-1" style={{ overflow: 'visible', position: 'relative' }}>
              <DatePicker
                value={formData.DOB}
                onChange={handleDateChange}
                placeholder="Chọn ngày sinh"
                format="YYYY-MM-DD"
                disabledDate={dayjs()}
                disabledType="max"
              />
            </div>
          </div>

          <div style={{ position: 'relative', overflow: 'visible', zIndex: 1 }}>
            <Label className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Giới tính <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative" id="gender-select-container" style={{ overflow: 'visible' }}>
              <Select
                className="w-full [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:rounded-md [&_.ant-select-selector]:border-gray-300 [&_.ant-select-selector]:transition"
                popupClassName="rounded-md border border-gray-200 bg-white z-[10000]"
                size="middle"
                value={formData.GENDER || undefined}
                onValueChange={handleGenderChange}
                placeholder="Chọn giới tính"
                getPopupContainer={() => document.getElementById('gender-select-container') || document.body}
              >
                {gendersLoading && (
                  <SelectItem value="loading" disabled>
                    Đang tải...
                  </SelectItem>
                )}
                {gendersIsError && (
                  <SelectItem value="error" disabled>
                    Không tải được giới tính
                  </SelectItem>
                )}
                {!gendersLoading && !gendersIsError && genders.length === 0 && (
                  <>
                    <SelectItem value="NAM">Nam</SelectItem>
                    <SelectItem value="NỮ">Nữ</SelectItem>
                    <SelectItem value="KHÁC">Khác</SelectItem>
                  </>
                )}
                {!gendersLoading && genders.map((g: any) => (
                  <SelectItem key={g.ID} value={g.NAME}>{g.NAME}</SelectItem>
                ))}
              </Select>
            </div>
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
