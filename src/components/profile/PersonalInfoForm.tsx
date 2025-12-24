import { Select, SelectItem } from "@/components/ui/select"
import type { UserInfo } from "@/types/user.type"
import { Calendar, Mail, Phone, User } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import {
  useGetAllProvincesQuery,
  type Province,
} from "../../store/api/provinceApi"
import { useGetAllGendersQuery } from "../../store/api/genderApi"
import DatePicker from "../ui/date-picker"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export type PersonalInfoFormData = {
  FULL_NAME: string
  PHONE: string
  DOB: string
  PROVINCE: string
  AVATAR: string
  GENDER_ID: number
  PROVINCE_ID: number | null | undefined
}

type LocalPersonalInfoFormData = {
  FULL_NAME: string
  EMAIL: string
  PHONE: string
  DOB: string
  GENDER: string
  PROVINCE: string
  PROVINCE_ID?: number | null
}

interface PersonalInfoFormProps {
  userInfo: UserInfo | null

  isEditing: boolean

  formData?: PersonalInfoFormData

  onFormDataChange?: React.Dispatch<React.SetStateAction<PersonalInfoFormData>>
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  userInfo,
  isEditing,
  formData: parentFormData,
  onFormDataChange,
}) => {
  const { data: provincesResponse, isLoading: loading } =
    useGetAllProvincesQuery()

  const { data: gendersResponse } = useGetAllGendersQuery()

  const provinces = useMemo(
    () => provincesResponse?.data ?? [],
    [provincesResponse?.data]
  )

  const genders = useMemo(
    () => gendersResponse?.data ?? [],
    [gendersResponse?.data]
  )

  // console.log("Provinces:", provinces);
  // Use parent formData if provided, otherwise fall back to userInfo
  const [localFormData, setLocalFormData] = useState<LocalPersonalInfoFormData>(
    {
      FULL_NAME: userInfo?.FULL_NAME || "",
      EMAIL: userInfo?.EMAIL || "",
      PHONE: userInfo?.PHONE || "",
      DOB: userInfo?.DOB || "",
      GENDER: userInfo?.GENDER || "",
      PROVINCE: typeof userInfo?.PROVINCE === "string" ? userInfo.PROVINCE : "",
      PROVINCE_ID: userInfo?.PROVINCE_ID, // Đổi từ provinceId thành addressId
    }
  )

  // Sync with parent formData khi có
  useEffect(() => {
    if (parentFormData) {
      // Find gender name from ID using API data if available
      let genderName = "NAM" // Default fallback
      if (genders.length > 0) {
        const genderFromApi = genders.find((g) => g.ID === parentFormData.GENDER_ID)
        genderName = genderFromApi?.NAME || "NAM"
      }

      // Only update if values are different to avoid circular updates
      setLocalFormData((prev) => {
        const hasChanges =
          prev.FULL_NAME !== parentFormData.FULL_NAME ||
          prev.PHONE !== parentFormData.PHONE ||
          prev.DOB !== parentFormData.DOB ||
          prev.PROVINCE !== parentFormData.PROVINCE ||
          prev.GENDER !== genderName ||
          prev.PROVINCE_ID !== parentFormData.PROVINCE_ID

        if (!hasChanges) {
          return prev
        }

        return {
          ...prev,
          FULL_NAME: parentFormData.FULL_NAME,
          PHONE: parentFormData.PHONE,
          DOB: parentFormData.DOB,
          PROVINCE: parentFormData.PROVINCE,
          GENDER: genderName,
          PROVINCE_ID: parentFormData.PROVINCE_ID,
        }
      })
    }
  }, [parentFormData, genders])

  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }))

    // Notify parent component
    if (onFormDataChange) {
      const updatedData = { ...localFormData, [field]: value }

      // Get gender ID from API if available
      const genderFromApi = genders.find((g) => g.NAME === updatedData.GENDER)
      const genderId = genderFromApi?.ID || 7 // Default to 7 (NAM) if not found

      onFormDataChange({
        FULL_NAME: updatedData.FULL_NAME,
        PHONE: updatedData.PHONE,
        DOB: updatedData.DOB,
        PROVINCE: updatedData.PROVINCE,
        AVATAR: parentFormData?.AVATAR || "",
        GENDER_ID: genderId,
        PROVINCE_ID: updatedData?.PROVINCE_ID,
      })
    }
  }

  // Xử lý riêng cho province selection
  const handleProvinceChange = (provinceNameWithType: string) => {
    const selectedProvince = provinces.find(
      (p) => p.NAME_WITH_TYPE === provinceNameWithType
    )

    setLocalFormData((prev) => ({
      ...prev,
      PROVINCE: provinceNameWithType,
      PROVINCE_ID: selectedProvince?.PROVINCE_ID,
    }))

    // Notify parent component với addressId
    if (onFormDataChange) {
      // Get gender ID from API if available
      const genderFromApi = genders.find((g) => g.NAME === localFormData.GENDER)
      const genderId = genderFromApi?.ID || 7 // Default to 7 (NAM) if not found

      onFormDataChange({
        FULL_NAME: localFormData.FULL_NAME,
        PHONE: localFormData.PHONE,
        DOB: localFormData.DOB,
        PROVINCE: provinceNameWithType,
        AVATAR: parentFormData?.AVATAR || "",
        GENDER_ID: genderId,
        PROVINCE_ID: selectedProvince?.PROVINCE_ID,
      })
    }
  }
  const handleDateChange = (date: string) => {
    handleInputChange("DOB", date)
  }

  const handleGenderChange = (genderName: string) => {
    setLocalFormData((prev) => {
      return {
        ...prev,
        GENDER: genderName,
      }
    })

    // Notify parent component with gender ID from API
    if (onFormDataChange) {
      // Try case-insensitive match with trim
      const selectedGender = genders.find((g) =>
        g.NAME?.trim().toUpperCase() === genderName.trim().toUpperCase()
      )
      const genderId = selectedGender?.ID || 7 // Default to 7 (NAM) if not found

      onFormDataChange({
        FULL_NAME: localFormData.FULL_NAME,
        PHONE: localFormData.PHONE,
        DOB: localFormData.DOB,
        PROVINCE: localFormData.PROVINCE,
        AVATAR: parentFormData?.AVATAR || "",
        GENDER_ID: genderId,
        PROVINCE_ID: localFormData.PROVINCE_ID,
      })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fullName">Họ và tên</Label>
        <div className="relative">
          <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
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
          <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
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
          <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
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
          <Calendar className="text-muted-foreground absolute top-3 left-3 z-10 h-4 w-4" />
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
        <div className="relative">
          <Select
            className="w-full [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:rounded-md [&_.ant-select-selector]:border-gray-300 [&_.ant-select-selector]:pl-10 [&_.ant-select-selector]:transition"
            popupClassName="rounded-md border border-gray-200 bg-white"
            size="middle"
            disabled={!isEditing}
            value={localFormData.GENDER || undefined}
            onValueChange={handleGenderChange}
            placeholder="Chọn giới tính"
          >
            <SelectItem value="NAM">Nam</SelectItem>
            <SelectItem value="NỮ">Nữ</SelectItem>
            <SelectItem value="KHÁC">Khác</SelectItem>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ</Label>
        <div className="relative">
          <Select
            className="w-full [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:rounded-md [&_.ant-select-selector]:border-gray-300 [&_.ant-select-selector]:pl-10 [&_.ant-select-selector]:transition"
            popupClassName="rounded-md border border-gray-200 bg-white "
            size="middle"
            showSearch
            optionFilterProp="children"
            disabled={!isEditing}
            value={localFormData.PROVINCE || undefined}
            placeholder="Chọn tỉnh/thành phố"
            onValueChange={handleProvinceChange}
          >
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
          </Select>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoForm
