import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ModalOverlay from "./ModalOverlay";
import { calculateAge } from "@/utils/age";
import { User, Calendar, Users } from "lucide-react";
import DatePicker from '@/components/ui/date-picker';
import dayjs from 'dayjs';
import { useGetAllGendersQuery } from '@/store/api/genderApi';
import { useCreateHealthDocumentMutation } from '@/store/api/healthDocumentApi';

interface HealthDocument {
  ID?: number;
  FULL_NAME?: string;
  DOB?: string;
  GENDER_ID?: number;
  IS_MYSELF?: boolean;
  AVATAR?: string;
}

interface HealthInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HealthDocument) => void;
  initialData?: HealthDocument | null;
}

const HealthInfoModal: React.FC<HealthInfoModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [formData, setFormData] = useState<HealthDocument>({
    FULL_NAME: "",
    DOB: "",
    GENDER_ID: undefined,
  });

  const [age, setAge] = useState<number>(0);
  const isUnderFive = age < 5;

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        FULL_NAME: initialData.FULL_NAME || "",
        DOB: initialData.DOB || "",
        GENDER_ID: initialData.GENDER_ID,
        IS_MYSELF: initialData.IS_MYSELF,
        AVATAR: initialData.AVATAR
      });
    } else {
      setFormData({
        FULL_NAME: "",
        DOB: "",
        GENDER_ID: undefined,
      });
    }
  }, [initialData]);

  // Calculate age when DOB changes
  useEffect(() => {
    if (formData.DOB) {
      const calculatedAge = calculateAge(formData.DOB);
      setAge(calculatedAge);
    } else {
      setAge(0);
    }
  }, [formData.DOB]);

  const { data: gendersResponse, isLoading: gendersLoading, isError: gendersIsError } = useGetAllGendersQuery();
  // Normalize genders to { id, name } so component works with different API shapes
  const rawGenders = gendersResponse?.data || [];
  const genders = rawGenders.map((g: any) => ({
    id: Number(g.ID ?? g.id ?? 0),
    name: String(g.NAME ?? g.name ?? g.NAME ?? ""),
  }));


  const [createHealthDocument, { isLoading: isCreating }] = useCreateHealthDocumentMutation();

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.FULL_NAME || !formData.DOB || !formData.GENDER_ID) {
      toast.error("Vui lòng điền họ tên, ngày sinh và chọn giới tính!");
      return;
    }
    // Check if DOB is in the future
    if (dayjs(formData.DOB).isAfter(dayjs(), 'day')) {
      toast.error("Ngày sinh không được lớn hơn ngày hiện tại!");
      return;
    }
    try {
      await createHealthDocument({
        FULL_NAME: formData.FULL_NAME,
        DOB: formData.DOB,
        GENDER_ID: formData.GENDER_ID,
      }).unwrap();
      toast.success("Cập nhật thành công");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Tạo hồ sơ sức khỏe thất bại!");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-h-[80vh] overflow-y-auto" style={{ overflow: 'visible' }}>
        <h2 className="text-xl font-bold text-[hsl(158,64%,52%)] mb-6">
          Hồ sơ sức khỏe
          {age > 0 && (
            <span className="ml-2 text-sm text-gray-500">({age} tuổi)</span>
          )}
        </h2>

        {/* Avatar Section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
              👤
            </div>
            <button className="absolute bottom-0 right-0 bg-[hsl(158,64%,52%)] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[hsl(158,64%,45%)]">
              <span className="text-sm">✎</span>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Basic Info - Always shown */}
          <div>
            <Label className="text-sm font-medium flex items-center">
              <User className="w-4 h-4 mr-1" />
              Tên hiển thị <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              placeholder="Nhập họ và tên"
              value={formData.FULL_NAME}
              onChange={(e) =>
                setFormData({ ...formData, FULL_NAME: e.target.value })
              }
              className="mt-1"
            />
          </div>

          <div style={{ position: 'relative', zIndex: 10000 }}>
            <Label className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Ngày sinh <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="mt-1" style={{ overflow: 'visible', position: 'relative' }}>
              <DatePicker
                value={formData.DOB || ''}
                onChange={(val) => setFormData({ ...formData, DOB: val })}
                format="YYYY-MM-DD"
                disabledDate={dayjs()}
                disabledType="max"
              />
            </div>
          </div>

          {/* Warning for under 5 years old */}
          {age > 0 && isUnderFive && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
              <p className="text-xs font-semibold text-orange-600 flex items-center">
                ⚠️ Cảnh báo
              </p>
              <p className="text-xs text-gray-700 mt-1">
                Bạn dưới 12 tuổi cần điền đầy đủ các thông tin theo đúng độ tuổi{" "}
                <span className="font-semibold">
                  {age < 2 ? "dưới 2 tuổi" : "từ 2-5 tuổi"}
                </span>
                . Tuy nhiên, bạn không thể tự theo dõi ở độ tuổi này. Ở độ tuổi
                từ 12 tuổi trở lên, các tính năng sẽ được mở khóa đầy đủ.
              </p>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Giới tính <span className="text-red-500 ml-1">*</span>
            </Label>
            <select
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(158,64%,52%)]"
              value={formData.GENDER_ID ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, GENDER_ID: val ? Number(val) : undefined });
              }}
            >
              <option value="" disabled>Chọn giới tính</option>
              {gendersLoading && <option>Đang tải...</option>}
              {gendersIsError && <option>Không tải được giới tính</option>}
              {!gendersLoading && !gendersIsError && genders.length === 0 && (
                <>
                  <option value={1}>Nam</option>
                  <option value={2}>Nữ</option>
                </>
              )}
              {!gendersLoading && genders.map((g: any) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white curp"
            disabled={isCreating}
          >
            {isCreating ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default HealthInfoModal;
