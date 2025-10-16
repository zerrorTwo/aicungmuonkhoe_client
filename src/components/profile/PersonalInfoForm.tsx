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
import type { UserInfo } from "@/types/user.type";

type PersonalInfoFormData = {
  FULL_NAME: string;
  PHONE: string;
  DOB: string;
  PROVINCE: string;
  AVATAR: string;
  GENDER_ID: number;
  PROVINCE_ID?: number | null;
};

interface PersonalInfoFormProps {
  userInfo: UserInfo | null;

  isEditing: boolean;

  formData?: PersonalInfoFormData;

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
    FULL_NAME: userInfo?.FULL_NAME || "",
    EMAIL: userInfo?.EMAIL || "",
    PHONE: userInfo?.PHONE || "",
    DOB: userInfo?.DOB || "",
    GENDER: userInfo?.GENDER || "",
    PROVINCE: userInfo?.PROVINCE || "",
    PROVINCE_ID: userInfo?.PROVINCE_ID, // Đổi từ provinceId thành addressId
  });
  
  console.log("parent info", parentFormData)
  console.log("user info", userInfo)
  console.log("local info", localFormData)
  // Debug effect để kiểm tra Select value
  useEffect(() => {
    if (provinces.length > 0 && localFormData.PROVINCE) {
      console.log("=== SELECT DEBUG ===");
      console.log("localFormData.PROVINCE:", localFormData.PROVINCE);
      console.log("provinces length:", provinces.length);
      console.log("First province:", provinces[0]);
      const matchingProvince = provinces.find(
        (p) => p.NAME_WITH_TYPE === localFormData.PROVINCE
      );
      console.log("Looking for match:", matchingProvince);
      console.log("Exact match found:", !!matchingProvince);
    }
  }, [localFormData.PROVINCE, provinces]);

  // Sync with parent formData khi có
  useEffect(() => {
    if (parentFormData) {
      // console.log("=== PERSONAL INFO FORM SYNC ===");
      // console.log("parentFormData.address:", parentFormData.address);
      // console.log("parentFormData.addressId:", parentFormData.addressId);

      setLocalFormData((prev) => ({
        ...prev,
        FULL_NAME: parentFormData.FULL_NAME,
        PHONE: parentFormData.PHONE,
        DOB: parentFormData.DOB,
        PROVINCE: parentFormData.PROVINCE,
        GENDER: parentFormData.GENDER_ID === 2 ? "NỮ" : "NAM",
        PROVINCE_ID: parentFormData.PROVINCE_ID, // Đổi từ provinceId thành addressId
      }));

      console.log("Updated localFormData.PROVINCE:", parentFormData.PROVINCE);
    }
  }, [parentFormData]);

  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));

    // Notify parent component
    if (onFormDataChange) {
      const updatedData = { ...localFormData, [field]: value };
      onFormDataChange({
        FULL_NAME: updatedData.FULL_NAME,
        PHONE: updatedData.PHONE,
        DOB: updatedData.DOB,
        PROVINCE: updatedData.PROVINCE,
        AVATAR: parentFormData?.AVATAR || "",
        GENDER_ID: updatedData?.GENDER === "NỮ" ? 2 : 1,
        PROVINCE_ID: updatedData?.PROVINCE_ID, 
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
        FULL_NAME: localFormData.FULL_NAME,
        PHONE: localFormData.PHONE,
        DOB: localFormData.DOB,
        PROVINCE: provinceNameWithType,
        AVATAR: parentFormData?.AVATAR || "",
        GENDER_ID: localFormData.GENDER === "NỮ" ? 2 : 1,
        PROVINCE_ID: selectedProvince?.PROVINCE_ID, // Gửi addressId lên parent
      });
    }
  };
  const handleDateChange = (date: string) => {
    handleInputChange("DOB", date);
  };

  const handleGenderChange = (gender: string) => {
    handleInputChange("GENDER", gender);
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
            value={localFormData.FULL_NAME}
            onChange={(e) => handleInputChange("FULL_NAME", e.target.value)}
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
            defaultValue={localFormData?.EMAIL}
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
            value={localFormData.PHONE}
            onChange={(e) => handleInputChange("PHONE", e.target.value)}
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
            value={localFormData.DOB}
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
          value={localFormData.GENDER}
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
            value={localFormData.PROVINCE || ""} // Đảm bảo value không bị undefined
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
            <SelectContent className="bg-white  border-gray-200 shadow-lg">
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
