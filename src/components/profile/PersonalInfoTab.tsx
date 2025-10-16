import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, X, Save } from "lucide-react";
import { showToast, toastPromise } from "@/utils/toast";
import {
  useUpdateUserProfileMutation,
  useUploadUserAvatarMutation,
  useGetUserProfileQuery,
  type UpdateUserProfileRequest,
} from "@/store/api/userApi";
import { useGetAllProvincesQuery } from "@/store/api/provinceApi";
import ProfileAvatar from "./ProfileAvatar";
import PersonalInfoForm from "./PersonalInfoForm";
import type { UserInfo } from '@/types/user.type';

interface PersonalInfoTabProps {
  userInfo: UserInfo | null;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ userInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    FULL_NAME: "",
    PHONE: "",
    DOB: "",
    PROVINCE: "",
    AVATAR: "",
    GENDER_ID: 1,
    PROVINCE_ID: userInfo?.PROVINCE_ID, // Thêm PROVINCE_ID
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [cachedProvinces, setCachedProvinces] = useState<any[]>([]); // Cache provinces locally
  const [lastUpdateResult, setLastUpdateResult] = useState<any>(null); // Lưu result từ update

  // RTK Query hooks
  const [updateUserProfile, { isLoading: isUpdating, error: updateError }] =
    useUpdateUserProfileMutation();
  const [uploadUserAvatar] = useUploadUserAvatarMutation();
  const { data: provincesResponse } = useGetAllProvincesQuery();
  const { refetch: refetchUserProfile } = useGetUserProfileQuery();

  const provinces = provincesResponse?.data || cachedProvinces; // Ưu tiên RTK Query, fallback cached

  // Cache provinces khi load thành công
  React.useEffect(() => {
    if (provincesResponse?.data && provincesResponse.data.length > 0) {
      setCachedProvinces(provincesResponse.data);
    }
  }, [provincesResponse]);


  // Helper function để convert address ID thành tên province
  const getAddressDisplayName = (
    address: string | { ID: number } | any,
    fallbackId?: number | null | undefined
  ): string => {
    if (typeof address === "string" && address) {
      return address; // Nếu đã là string thì return luôn
    }

    if (address && typeof address === "object" && address.ID) {
      // Nếu là object có ID, tìm province name
      const province = provinces.find((p) => p.PROVINCE_ID === address.ID);
      const result = province ? province.NAME_WITH_TYPE : "";
      return result;
    }

    // If address is numeric ID
    if (typeof address === "number") {
      const province = provinces.find((p) => p.PROVINCE_ID === address);
      const result = province ? province.NAME_WITH_TYPE : "";
      return result;
    }

    if (fallbackId) {
      const province = provinces.find((p) => p.PROVINCE_ID === fallbackId);
      const result = province ? province.NAME_WITH_TYPE : "";
      return result;
    }

    return "";
  };

  const getprovinceId = (
    address: string | { ID: number } | any,
    fallbackId?: number | null | undefined
  ): number | undefined => {
    // Case 1: Backend returned object with ID
    if (address && typeof address === "object" && address.ID) {
      return address.ID;
    }
    // Case 1b: address is already a number ID
    if (typeof address === "number") {
      return address;
    }
    // Case 2: We only have a display string; map it to province ID
    if (typeof address === "string" && address && provinces.length > 0) {
      const found = provinces.find(
        (p) =>
          p.NAME_WITH_TYPE.trim().toLowerCase() === address.trim().toLowerCase()
      );
      if (found) return found.PROVINCE_ID;
    }
    // Case 3: Use explicit fallbackId from backend if provided
    if ((!address || address === "") && fallbackId) return fallbackId;
    return undefined;
  };

  // Initialize form data khi userInfo thay đổi
  React.useEffect(() => {
    // Đợi cả userInfo và có provinces (từ RTK Query hoặc cache)
    if (userInfo && provinces.length > 0) {
      // QUAN TRỌNG: Không reset formData nếu userInfo.PROVINCE rỗng nhưng formData.PROVINCE đã có
      const currentHasAddress =
        formData.PROVINCE && formData.PROVINCE.trim() !== "";
      const userInfoIsEmpty = !userInfo.PROVINCE || userInfo.PROVINCE === "";

      if (currentHasAddress && userInfoIsEmpty) {
        return; // Không reset formData
      }

      // LOGIC ĐƠN GIẢN: Nếu localStorage có address là số (như 3), dùng số đó làm ID
      let provinceId = userInfo.PROVINCE_ID;
      let addressDisplayName = "";

      // Case 1: userInfo.PROVINCE là số (từ localStorage)
      if (typeof userInfo.PROVINCE === "number") {
        provinceId = userInfo.PROVINCE;
        const province = provinces.find(
          (p) => p.PROVINCE_ID === userInfo.PROVINCE
        );
        addressDisplayName = province ? province.NAME_WITH_TYPE : "";
        console.log(
          "Found province for ID",
          userInfo.PROVINCE,
          ":",
          province?.NAME_WITH_TYPE
        );
      }
      // Case 2: userInfo.PROVINCE là object {ID: X}
     
      // Case 3: userInfo.PROVINCE là string (tên tỉnh)
      else if (typeof userInfo.PROVINCE === "string" && userInfo.PROVINCE) {
        addressDisplayName = userInfo.PROVINCE;
        const province = provinces.find(
          (p) => p.NAME_WITH_TYPE === userInfo.PROVINCE
        );
        provinceId = province ? province.PROVINCE_ID : undefined;
      }
      // Case 4: Dùng provinceId fallback
      else if (userInfo.PROVINCE_ID) {
        provinceId = userInfo.PROVINCE_ID;
        const province = provinces.find(
          (p) => p.PROVINCE_ID === userInfo.PROVINCE_ID
        );
        addressDisplayName = province ? province.NAME_WITH_TYPE : "";
      }

      setFormData({
        FULL_NAME: userInfo.FULL_NAME || "",
        PHONE: userInfo.PHONE || "",
        DOB: userInfo.DOB || "",
        PROVINCE: addressDisplayName || "", // Tên tỉnh để hiển thị
        AVATAR: userInfo.AVATAR || "",
        GENDER_ID: userInfo.GENDER === "NỮ" ? 2 : 1,
        PROVINCE_ID: provinceId, // ID để gửi lên backend
      });
      setAvatarPreview(userInfo.AVATAR || "");
    }
  }, [userInfo, provinces]); // Dependency trên provinces (bao gồm cả cached)

  // Effect xử lý update result khi provinces ready
  React.useEffect(() => {
    if (lastUpdateResult?.data?.PROVINCE && provinces.length > 0) {
      const newAddressDisplayName = getAddressDisplayName(
        lastUpdateResult.data.PROVINCE
      );
      const newprovinceId = getprovinceId(lastUpdateResult.data.PROVINCE);

      // LUÔN CẬP NHẬT FORMDATA, KHÔNG CẦN CHECK newAddressDisplayName
      setFormData((prev) => {
        console.log("Updating formData from saved result...");
        const updated = {
          ...prev,
          PROVINCE: newAddressDisplayName || `ID: ${newprovinceId}`, // Fallback hiển thị ID nếu không tìm được tên
          PROVINCE_ID: newprovinceId,
        };
        return updated;
      });

      // Clear saved result sau khi xử lý xong
      setLastUpdateResult(null);
    }
  }, [lastUpdateResult, provinces]); // Trigger khi có result mới hoặc provinces ready

  // Handle avatar file selection
  const handleAvatarChange = async (file: File | null) => {
    if (!file) {
      setAvatarPreview(userInfo?.AVATAR || "");
      return;
    }

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      showToast.error("Kích thước file quá lớn. Tối đa 5MB.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      showToast.error(
        "Định dạng file không hỗ trợ. Chỉ chấp nhận JPG, PNG, WebP."
      );
      return;
    }

    // Create preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Upload avatar immediately
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      // // Check if FormData has avatar
      // const hasAvatar = formData.has("avatar");
      // console.log("FormData has avatar:", hasAvatar);

      const result = await toastPromise(uploadUserAvatar(formData).unwrap(), {
        loading: "Đang upload ảnh đại diện...",
        success: "Cập nhật ảnh đại diện thành công!",
        error: "Có lỗi xảy ra khi upload ảnh!",
      });

      // Update localStorage with new user data after successful avatar upload
      if (result?.data) {
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          const updatedUserData = {
            ...userData,
            FACE_IMAGE: result.data.AVATAR
          };
          localStorage.setItem("user", JSON.stringify(updatedUserData));
          console.log(
            "Updated localStorage user data after avatar upload:",
            updatedUserData
          );
        }
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      // Revert preview on error
      setAvatarPreview(userInfo?.AVATAR || "");
    }
  };

  const handleSave = async () => {
    try {
      // Check if there are any text field changes
      const currentAddressDisplayName = getAddressDisplayName(
        userInfo?.PROVINCE,
        userInfo?.PROVINCE_ID
      );

      const hasTextChanges =
        formData.FULL_NAME !== userInfo?.FULL_NAME ||
        formData.PHONE !== userInfo?.PHONE ||
        formData.DOB !== userInfo?.DOB ||
        formData.PROVINCE !== currentAddressDisplayName ||
        formData.GENDER_ID !== (userInfo?.GENDER === "NỮ" ? 2 : 1);

      if (!hasTextChanges) {
        showToast.info("Không có thay đổi nào để lưu");
        setIsEditing(false);
        return;
      }

      // Prepare JSON data for profile update (text fields only)
      const updateData: UpdateUserProfileRequest = {};

      if (formData.FULL_NAME !== userInfo?.FULL_NAME) {
        updateData.FULL_NAME = formData.FULL_NAME;
      }
      if (formData.PHONE !== userInfo?.PHONE) {
        updateData.PHONE = formData.PHONE;
      }
      if (formData.DOB !== userInfo?.DOB) {
        updateData.DOB = formData.DOB;
      }
      if (formData.PROVINCE !== currentAddressDisplayName) {
        // Ensure we have an PROVINCE_ID; if missing, derive from address string
        let addrId = formData.PROVINCE_ID;
        if (!addrId) {
          addrId = getprovinceId(formData.PROVINCE, userInfo?.PROVINCE_ID);
        }
        updateData.PROVINCE_ID = addrId; // Gửi provinceId thay vì address
      }

      // SPECIAL CASE: Nếu user chọn tỉnh lần đầu (từ rỗng sang có value)
      if (
        !currentAddressDisplayName &&
        formData.PROVINCE &&
        formData.PROVINCE_ID
      ) {
        console.log(
          "First time selecting province, sending provinceId:",
          formData.PROVINCE_ID
        );
        updateData.PROVINCE_ID = formData.PROVINCE_ID;
      }

      const currentGenderId = userInfo?.GENDER === "NỮ" ? 2 : 1;
      if (formData.GENDER_ID !== currentGenderId) {
        updateData.GENDER_ID = formData.GENDER_ID;
      }

      // console.log("Update data:", updateData);
      // console.log("provinceId trong updateData:", updateData.PROVINCE_ID);

      // Call API with JSON data
      const result = await toastPromise(
        updateUserProfile(updateData).unwrap(),
        {
          loading: "Đang cập nhật thông tin...",
          success: "Cập nhật thông tin thành công!",
          error: "Có lỗi xảy ra khi cập nhật thông tin!",
        }
      );
      // console.log("Update result:", result);

      // Lưu result để xử lý sau khi provinces ready
      setLastUpdateResult(result);

      // Update localStorage with new user data after successful profile update
      if (result?.data) {
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
          const userData = JSON.parse(currentUser);

          // Handle address from backend response (string | { ID } | number)
          // let updatedAddress = userData.address;
          // if (result.data.address !== undefined) {
          //   // Bạn đã sửa đúng: lấy ID từ object
          //   if (
          //     result.data.address &&
          //     typeof result.data.address === "object" &&
          //     "ID" in result.data.address
          //   ) {
          //     updatedAddress = result.data.address.ID; // Lưu ID số vào localStorage
          //     console.log("Saved ID to localStorage:", updatedAddress);
          //   } else {
          //     const numericId = getprovinceId(result.data.address);
          //     updatedAddress =
          //       numericId !== undefined ? numericId : result.data.address;
          //     console.log("Fallback address saved:", updatedAddress);
          //   }
          // }
          const updatedUserData = {
            ...userData,
            //fullName: result.data.fullName || userData.fullName,
            PHONE: result.data.PHONE || userData.PHONE,
            //birthDate: result.data.birthDate || userData.birthDate,
            // address: updatedAddress, // Sử dụng address đã được convert

            //FACE_IMAGE: result.data.AVATAR || userData.FACE_IMAGE,
          };
          localStorage.setItem("user", JSON.stringify(updatedUserData));
          console.log(
            "Updated localStorage user data after profile update:",
            updatedUserData
          );

          // Refetch user profile để cập nhật userInfo từ parent
          refetchUserProfile();
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Đảm bảo userInfo có đầy đủ properties với default values
  // const safeUserInfo = {
  //   FULL_NAME: userInfo?.FULL_NAME || "Người dùng",
  //   EMAIL: userInfo?.EMAIL || "",
  //   PHONE: userInfo?.PHONE || "",
  //   DOB: userInfo?.DOB || "",
  //   GENDER: userInfo?.GENDER || "",
  //   // LUÔN ƯU TIÊN formData.address, NẾU KHÔNG CÓ THÌ MAPPING TỪ ID
  //   address: (() => {
  //     console.log("=== BUILDING SAFE USER INFO ADDRESS ===");
  //     console.log("formData.address:", formData.address);
  //     console.log("userInfo.address:", userInfo?.address);
  //     console.log("userInfo.provinceId:", userInfo?.provinceId);

  //     // Ưu tiên formData.address (đã được process)
  //     if (formData.address && formData.address.trim() !== "") {
  //       console.log("Using formData.address:", formData.address);
  //       return formData.address;
  //     }

  //     // Backup: Nếu userInfo.address là số (từ localStorage), map trực tiếp
  //     if (typeof userInfo?.address === "number" && provinces.length > 0) {
  //       const province = provinces.find(
  //         (p) => p.PROVINCE_ID === userInfo.address
  //       );
  //       const provinceName = province
  //         ? province.NAME_WITH_TYPE
  //         : `ID: ${userInfo.address}`;
  //       console.log("Mapped from numeric address:", provinceName);
  //       return provinceName;
  //     }

  //     // Backup: Dùng helper functions
  //     const mapped = getAddressDisplayName(
  //       userInfo?.address,
  //       userInfo?.provinceId
  //     );
  //     console.log("Mapped address:", mapped);

  //     return mapped || "";
  //   })(),
  //   avatar: avatarPreview || userInfo?.avatar || "", // Use preview if available
  // };

  return (
    <Card className="shadow-weather animate-scale-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-2xl">Thông tin cá nhân</CardTitle>
          <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
        </div>
        <Button
          variant={isEditing ? "destructive" : "outline"}
          size="sm"
          className="cursor-pointer"
          onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
        >
          {isEditing ? (
            <X className="cursor-pointer w-4 h-4 mr-2" />
          ) : (
            <Edit3 className="cursor-pointer w-4 h-4 mr-2" />
          )}
          {isEditing ? "Hủy" : "Chỉnh sửa"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <ProfileAvatar
          userInfo={userInfo}
          isEditing={isEditing}
          onAvatarChange={handleAvatarChange}
        />
        <PersonalInfoForm
          userInfo={userInfo}
          isEditing={isEditing}
          formData={formData}
          onFormDataChange={setFormData}
        />

        {updateError && (
          <div className="text-red-500 text-sm mt-2">
            Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="cursor-pointer bg-gradient-primary hover:opacity-90"
            >
              {isUpdating ? (
                "Đang lưu..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoTab;
