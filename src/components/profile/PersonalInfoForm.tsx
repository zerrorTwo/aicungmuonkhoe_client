import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "../ui/date-picker";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import {
  useGetAllProvincesQuery,
  type Province,
} from "../../store/api/provinceApi";

interface PersonalInfoFormProps {
  userInfo: {
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string;
  };
  isEditing: boolean;
  formData?: {
    fullName: string;
    phone: string;
    birthDate: string;
    address: string;
    avatar: string;
    genderId: number;
    addressId?: number;
  };
  onFormDataChange?: (data: any) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  userInfo,
  isEditing,
  formData: parentFormData,
  onFormDataChange,
}) => {
  const { data: provincesResponse, isLoading: loading } =
    useGetAllProvincesQuery();

  const provinces = provincesResponse?.data || [];

  // console.log("Provinces:", provinces);

  // Use parent formData if provided, otherwise fall back to userInfo
  const [localFormData, setLocalFormData] = useState({
    name: userInfo.name,
    email: userInfo.email,
    phone: userInfo.phone,
    birthDate: userInfo.birthDate,
    gender: userInfo.gender,
    address: userInfo.address,
    addressId: undefined as number | undefined, // Đổi từ provinceId thành addressId
  });

  // Debug effect để kiểm tra Select value
  useEffect(() => {
    if (provinces.length > 0 && localFormData.address) {
      console.log("=== SELECT DEBUG ===");
      console.log("localFormData.address:", localFormData.address);
      console.log("provinces length:", provinces.length);
      console.log("First province:", provinces[0]);
      const matchingProvince = provinces.find(
        (p) => p.NAME_WITH_TYPE === localFormData.address
      );
      console.log("Looking for match:", matchingProvince);
      console.log("Exact match found:", !!matchingProvince);
    }
  }, [localFormData.address, provinces]);

  // Sync with parent formData khi có
  useEffect(() => {
    if (parentFormData) {
      console.log("=== PERSONAL INFO FORM SYNC ===");
      console.log("parentFormData.address:", parentFormData.address);
      console.log("parentFormData.addressId:", parentFormData.addressId);

      setLocalFormData((prev) => ({
        ...prev,
        name: parentFormData.fullName,
        phone: parentFormData.phone,
        birthDate: parentFormData.birthDate,
        address: parentFormData.address,
        gender: parentFormData.genderId === 2 ? "NỮ" : "NAM",
        addressId: parentFormData.addressId, // Đổi từ provinceId thành addressId
      }));

      console.log("Updated localFormData.address:", parentFormData.address);
    }
  }, [parentFormData]);

  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));

    // Notify parent component
    if (onFormDataChange) {
      const updatedData = { ...localFormData, [field]: value };
      onFormDataChange({
        fullName: updatedData.name,
        phone: updatedData.phone,
        birthDate: updatedData.birthDate,
        address: updatedData.address,
        avatar: parentFormData?.avatar || "",
        genderId: updatedData.gender === "NỮ" ? 2 : 1,
        addressId: updatedData.addressId, // Đổi từ provinceId thành addressId
      });
    }
  };

  // Xử lý riêng cho province selection
  const handleProvinceChange = (provinceNameWithType: string) => {
    const selectedProvince = provinces.find(
      (p) => p.NAME_WITH_TYPE === provinceNameWithType
    );

    setLocalFormData((prev) => ({
      ...prev,
      address: provinceNameWithType,
      addressId: selectedProvince?.PROVINCE_ID, // Đổi từ provinceId thành addressId
    }));

    // Notify parent component với addressId
    if (onFormDataChange) {
      onFormDataChange({
        fullName: localFormData.name,
        phone: localFormData.phone,
        birthDate: localFormData.birthDate,
        address: provinceNameWithType,
        avatar: parentFormData?.avatar || "",
        genderId: localFormData.gender === "NỮ" ? 2 : 1,
        addressId: selectedProvince?.PROVINCE_ID, // Gửi addressId lên parent
      });
    }
  };
  const handleDateChange = (date: string) => {
    handleInputChange("birthDate", date);
  };

  const handleGenderChange = (gender: string) => {
    handleInputChange("gender", gender);
  };

  const handleProvinceDropdownOpen = () => {
    // RTK Query tự động fetch khi component mount
    // Không cần manual dispatch
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Họ và tên</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            value={localFormData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="pl-10"
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            defaultValue={userInfo.email}
            className="pl-10"
            disabled={true}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            value={localFormData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="pl-10"
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Ngày sinh</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
          <DatePicker
            placeholder="Chọn ngày sinh"
            value={localFormData.birthDate}
            onChange={handleDateChange}
            disabled={!isEditing}
            format="YYYY-MM-DD"
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Giới tính</Label>
        <Select
          disabled={!isEditing}
          value={localFormData.gender}
          onValueChange={handleGenderChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NAM">Nam</SelectItem>
            <SelectItem value="NỮ">Nữ</SelectItem>
            <SelectItem value="KHÁC">Khác</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
          <Select
            disabled={!isEditing}
            value={localFormData.address || ""} // Đảm bảo value không bị undefined
            onValueChange={handleProvinceChange} // Sử dụng handleProvinceChange
            onOpenChange={(open) => {
              if (open) {
                handleProvinceDropdownOpen();
              }
            }}
          >
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Chọn tỉnh/thành phố" />
            </SelectTrigger>
            <SelectContent>
              {loading && (
                <SelectItem value="loading" disabled>
                  Đang tải...
                </SelectItem>
              )}
              {!loading && provinces.length === 0 && (
                <SelectItem value="no-data" disabled>
                  Không có dữ liệu tỉnh thành
                </SelectItem>
              )}
              {provinces.map((province: Province) => (
                <SelectItem
                  key={province.PROVINCE_ID}
                  value={province.NAME_WITH_TYPE}
                >
                  {province.NAME_WITH_TYPE}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
