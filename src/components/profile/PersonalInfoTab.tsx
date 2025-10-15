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
} from "@/store/api/userApi";
import { useGetAllProvincesQuery } from "@/store/api/provinceApi";
import ProfileAvatar from "./ProfileAvatar";
import PersonalInfoForm from "./PersonalInfoForm";

interface PersonalInfoTabProps {
  userInfo: {
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string | { ID: number } | any; // Support both string and object format
    addressId?: number; // Optional explicit addressId from backend
    avatar?: string;
  };
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ userInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    birthDate: "",
    address: "",
    avatar: "",
    genderId: 1,
    addressId: undefined as number | undefined, // Thêm addressId
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
      console.log("=== PROVINCES CACHED ===");
      console.log("Cached provinces count:", provincesResponse.data.length);
    }
  }, [provincesResponse]);

  // Debug provinces data
  React.useEffect(() => {
    if (provinces.length > 0) {
      console.log("=== PROVINCES AVAILABLE ===");
      console.log("First province:", provinces[0]);
      console.log("Total provinces:", provinces.length);
      console.log("Source:", provincesResponse?.data ? "RTK Query" : "Cached");
    }
  }, [provinces, provincesResponse]);

  // Helper function để convert address ID thành tên province
  const getAddressDisplayName = (
    address: string | { ID: number } | any,
    fallbackId?: number
  ): string => {
    console.log("=== getAddressDisplayName ===");
    console.log("Input address:", address);
    console.log("Provinces available:", provinces.length);

    if (typeof address === "string" && address) {
      console.log("Address is string, returning:", address);
      return address; // Nếu đã là string thì return luôn
    }

    if (address && typeof address === "object" && address.ID) {
      // Nếu là object có ID, tìm province name
      console.log("Looking for province with ID:", address.ID);
      const province = provinces.find((p) => p.PROVINCE_ID === address.ID);
      console.log("Found province:", province);
      const result = province ? province.NAME_WITH_TYPE : "";
      console.log("Returning:", result);
      return result;
    }

    // If address is numeric ID
    if (typeof address === "number") {
      console.log("Address is numeric ID, looking up:", address);
      const province = provinces.find((p) => p.PROVINCE_ID === address);
      const result = province ? province.NAME_WITH_TYPE : "";
      console.log("Returning via numeric ID:", result);
      return result;
    }

    if (fallbackId) {
      console.log("Using fallbackId to resolve province name:", fallbackId);
      const province = provinces.find((p) => p.PROVINCE_ID === fallbackId);
      const result = province ? province.NAME_WITH_TYPE : "";
      console.log("Returning via fallbackId:", result);
      return result;
    }

    console.log("No match, returning empty string");
    return "";
  };

  const getAddressId = (
    address: string | { ID: number } | any,
    fallbackId?: number
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
      console.log("=== INITIALIZING FORM DATA ===");
      console.log("userInfo.address:", userInfo.address);
      console.log("userInfo.addressId:", userInfo.addressId);

      // QUAN TRỌNG: Không reset formData nếu userInfo.address rỗng nhưng formData.address đã có
      const currentHasAddress =
        formData.address && formData.address.trim() !== "";
      const userInfoIsEmpty = !userInfo.address || userInfo.address === "";

      if (currentHasAddress && userInfoIsEmpty) {
        console.log(
          "Skipping init because formData already has address and userInfo is empty"
        );
        console.log("Keeping current formData.address:", formData.address);
        return; // Không reset formData
      }

      // LOGIC ĐƠN GIẢN: Nếu localStorage có address là số (như 3), dùng số đó làm ID
      let addressId = userInfo.addressId;
      let addressDisplayName = "";

      // Case 1: userInfo.address là số (từ localStorage)
      if (typeof userInfo.address === "number") {
        console.log("Address is numeric from localStorage:", userInfo.address);
        addressId = userInfo.address;
        const province = provinces.find(
          (p) => p.PROVINCE_ID === userInfo.address
        );
        addressDisplayName = province ? province.NAME_WITH_TYPE : "";
        console.log(
          "Found province for ID",
          userInfo.address,
          ":",
          province?.NAME_WITH_TYPE
        );
      }
      // Case 2: userInfo.address là object {ID: X}
      else if (
        userInfo.address &&
        typeof userInfo.address === "object" &&
        userInfo.address.ID
      ) {
        console.log("Address is object with ID:", userInfo.address.ID);
        addressId = userInfo.address.ID;
        const province = provinces.find(
          (p) => p.PROVINCE_ID === userInfo.address.ID
        );
        addressDisplayName = province ? province.NAME_WITH_TYPE : "";
        console.log(
          "Found province for ID",
          userInfo.address.ID,
          ":",
          province?.NAME_WITH_TYPE
        );
      }
      // Case 3: userInfo.address là string (tên tỉnh)
      else if (typeof userInfo.address === "string" && userInfo.address) {
        console.log("Address is string:", userInfo.address);
        addressDisplayName = userInfo.address;
        const province = provinces.find(
          (p) => p.NAME_WITH_TYPE === userInfo.address
        );
        addressId = province ? province.PROVINCE_ID : undefined;
      }
      // Case 4: Dùng addressId fallback
      else if (userInfo.addressId) {
        console.log("Using fallback addressId:", userInfo.addressId);
        addressId = userInfo.addressId;
        const province = provinces.find(
          (p) => p.PROVINCE_ID === userInfo.addressId
        );
        addressDisplayName = province ? province.NAME_WITH_TYPE : "";
      }

      console.log("Final addressDisplayName:", addressDisplayName);
      console.log("Final addressId:", addressId);

      setFormData({
        fullName: userInfo.name || "",
        phone: userInfo.phone || "",
        birthDate: userInfo.birthDate || "",
        address: addressDisplayName || "", // Tên tỉnh để hiển thị
        avatar: userInfo.avatar || "",
        genderId: userInfo.gender === "NỮ" ? 2 : 1,
        addressId: addressId, // ID để gửi lên backend
      });
      setAvatarPreview(userInfo.avatar || "");
    }
  }, [userInfo, provinces]); // Dependency trên provinces (bao gồm cả cached)

  // Effect xử lý update result khi provinces ready
  React.useEffect(() => {
    if (lastUpdateResult?.data?.address && provinces.length > 0) {
      console.log("=== PROCESSING SAVED UPDATE RESULT ===");
      console.log("address from saved result:", lastUpdateResult.data.address);
      console.log("provinces available for lookup:", provinces.length);

      const newAddressDisplayName = getAddressDisplayName(
        lastUpdateResult.data.address
      );
      const newAddressId = getAddressId(lastUpdateResult.data.address);
      console.log("New address display name:", newAddressDisplayName);
      console.log("New address ID:", newAddressId);

      // LUÔN CẬP NHẬT FORMDATA, KHÔNG CẦN CHECK newAddressDisplayName
      setFormData((prev) => {
        console.log("Updating formData from saved result...");
        const updated = {
          ...prev,
          address: newAddressDisplayName || `ID: ${newAddressId}`, // Fallback hiển thị ID nếu không tìm được tên
          addressId: newAddressId,
        };
        console.log("Updated formData:", updated);
        return updated;
      });

      // Clear saved result sau khi xử lý xong
      setLastUpdateResult(null);
    }
  }, [lastUpdateResult, provinces]); // Trigger khi có result mới hoặc provinces ready

  // Handle avatar file selection
  const handleAvatarChange = async (file: File | null) => {
    if (!file) {
      setAvatarPreview(userInfo.avatar || "");
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

      // Check if FormData has avatar
      const hasAvatar = formData.has("avatar");
      console.log("FormData has avatar:", hasAvatar);

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
            avatar: result.data.avatar,
            fullName: result.data.fullName || userData.fullName,
            phone: result.data.phone || userData.phone,
            birthDate: result.data.birthDate || userData.birthDate,
            address: result.data.address || userData.address,
            gender: result.data.gender || userData.gender,
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
      setAvatarPreview(userInfo.avatar || "");
    }
  };

  const handleSave = async () => {
    try {
      console.log("=== HANDLE SAVE ===");
      console.log("formData:", formData);
      console.log("userInfo:", userInfo);
      // Check if there are any text field changes
      const currentAddressDisplayName = getAddressDisplayName(
        userInfo.address,
        userInfo.addressId
      );

      console.log("=== COMPARING FOR CHANGES ===");
      console.log("formData.address:", formData.address);
      console.log("currentAddressDisplayName:", currentAddressDisplayName);
      console.log("userInfo.address:", userInfo.address);

      const hasTextChanges =
        formData.fullName !== userInfo.name ||
        formData.phone !== userInfo.phone ||
        formData.birthDate !== userInfo.birthDate ||
        formData.address !== currentAddressDisplayName ||
        formData.genderId !== (userInfo.gender === "NỮ" ? 2 : 1);

      console.log("hasTextChanges:", hasTextChanges);

      if (!hasTextChanges) {
        showToast.info("Không có thay đổi nào để lưu");
        setIsEditing(false);
        return;
      }

      // Prepare JSON data for profile update (text fields only)
      const updateData: any = {};

      if (formData.fullName !== userInfo.name) {
        updateData.fullName = formData.fullName;
      }
      if (formData.phone !== userInfo.phone) {
        updateData.phone = formData.phone;
      }
      if (formData.birthDate !== userInfo.birthDate) {
        updateData.birthDate = formData.birthDate;
      }
      if (formData.address !== currentAddressDisplayName) {
        // Ensure we have an addressId; if missing, derive from address string
        let addrId = formData.addressId;
        if (!addrId) {
          addrId = getAddressId(formData.address, userInfo.addressId);
        }
        console.log("Address changed, sending addressId:", addrId);
        updateData.addressId = addrId; // Gửi addressId thay vì address
      }

      // SPECIAL CASE: Nếu user chọn tỉnh lần đầu (từ rỗng sang có value)
      if (
        !currentAddressDisplayName &&
        formData.address &&
        formData.addressId
      ) {
        console.log(
          "First time selecting province, sending addressId:",
          formData.addressId
        );
        updateData.addressId = formData.addressId;
      }

      const currentGenderId = userInfo.gender === "NỮ" ? 2 : 1;
      if (formData.genderId !== currentGenderId) {
        updateData.genderId = formData.genderId;
      }

      console.log("Update data:", updateData);
      console.log("addressId trong updateData:", updateData.addressId);

      // Call API with JSON data
      const result = await toastPromise(
        updateUserProfile(updateData).unwrap(),
        {
          loading: "Đang cập nhật thông tin...",
          success: "Cập nhật thông tin thành công!",
          error: "Có lỗi xảy ra khi cập nhật thông tin!",
        }
      );
      console.log("Update result:", result);

      // Lưu result để xử lý sau khi provinces ready
      setLastUpdateResult(result);

      // Update localStorage with new user data after successful profile update
      if (result?.data) {
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
          const userData = JSON.parse(currentUser);

          // Handle address from backend response (string | { ID } | number)
          let updatedAddress = userData.address;
          if (result.data.address !== undefined) {
            console.log("=== UPDATING LOCALSTORAGE ADDRESS ===");
            console.log("result.data.address:", result.data.address);

            // Bạn đã sửa đúng: lấy ID từ object
            if (
              result.data.address &&
              typeof result.data.address === "object" &&
              "ID" in result.data.address
            ) {
              updatedAddress = result.data.address.ID; // Lưu ID số vào localStorage
              console.log("Saved ID to localStorage:", updatedAddress);
            } else {
              const numericId = getAddressId(result.data.address);
              updatedAddress =
                numericId !== undefined ? numericId : result.data.address;
              console.log("Fallback address saved:", updatedAddress);
            }
          }
          const updatedUserData = {
            ...userData,
            fullName: result.data.fullName || userData.fullName,
            phone: result.data.phone || userData.phone,
            birthDate: result.data.birthDate || userData.birthDate,
            address: updatedAddress, // Sử dụng address đã được convert
            gender: result.data.gender || userData.gender,
            avatar: result.data.avatar || userData.avatar,
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
  const safeUserInfo = {
    name: userInfo?.name || "Người dùng",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    birthDate: userInfo?.birthDate || "",
    gender: userInfo?.gender || "",
    // LUÔN ƯU TIÊN formData.address, NẾU KHÔNG CÓ THÌ MAPPING TỪ ID
    address: (() => {
      console.log("=== BUILDING SAFE USER INFO ADDRESS ===");
      console.log("formData.address:", formData.address);
      console.log("userInfo.address:", userInfo?.address);
      console.log("userInfo.addressId:", userInfo?.addressId);

      // Ưu tiên formData.address (đã được process)
      if (formData.address && formData.address.trim() !== "") {
        console.log("Using formData.address:", formData.address);
        return formData.address;
      }

      // Backup: Nếu userInfo.address là số (từ localStorage), map trực tiếp
      if (typeof userInfo?.address === "number" && provinces.length > 0) {
        const province = provinces.find(
          (p) => p.PROVINCE_ID === userInfo.address
        );
        const provinceName = province
          ? province.NAME_WITH_TYPE
          : `ID: ${userInfo.address}`;
        console.log("Mapped from numeric address:", provinceName);
        return provinceName;
      }

      // Backup: Dùng helper functions
      const mapped = getAddressDisplayName(
        userInfo?.address,
        userInfo?.addressId
      );
      console.log("Mapped address:", mapped);

      return mapped || "";
    })(),
    avatar: avatarPreview || userInfo?.avatar || "", // Use preview if available
  };

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
          userInfo={safeUserInfo}
          isEditing={isEditing}
          onAvatarChange={handleAvatarChange}
        />
        <PersonalInfoForm
          userInfo={safeUserInfo}
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
