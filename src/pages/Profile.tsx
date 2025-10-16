import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PersonalInfoTab from "../components/profile/PersonalInfoTab";
import SecurityTab from "../components/profile/SecurityTab";
import NotificationsTab from "../components/profile/NotificationsTab";
import ManagementAccountTab from "../components/profile/ManagementAccountTab";
import { useGetUserProfileQuery } from "../store/api/userApi";

const Profile: React.FC = () => {
  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState("personal");
  const [resetManagementTab, setResetManagementTab] = useState(0);

  // Handler khi click vào tab management
  const handleManagementClick = () => {
    if (activeTab === "management") {
      // Đang active → reset về danh sách
      setResetManagementTab((prev) => prev + 1);
    }
    // Luôn set active (TabsTrigger sẽ handle)
    setActiveTab("management");
  };

  // Call API để lấy user profile thay vì từ localStorage
  const {
    data: profileResponse,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery();

  console.log("API Profile Response:", profileResponse);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  // Chuyển đổi dữ liệu API response thành format cho PersonalInfoTab
  const formatUserInfo = (profileData: any) => {
    if (!profileData || !profileData.data) {
      console.log("No profile data available");
      return {
        name: "",
        email: "",
        phone: "",
        birthDate: "",
        gender: "",
        address: "",
        avatar: "",
      };
    }

    const userData = profileData.data;
    console.log("Raw userData from API:", userData);
    console.log("userData.address type:", typeof userData.address);
    console.log("userData.address value:", userData.address);

    const formattedInfo = {
      name: userData.fullName || userData.email?.split("@")[0] || "Người dùng",
      email: userData.email || "",
      phone: userData.phone || "",
      birthDate: userData.birthDate || "",
      gender: userData.gender || "",
      address: userData.address, // Giữ nguyên format từ backend (có thể là string hoặc {ID: number})
      addressId:
        userData.address &&
        typeof userData.address === "object" &&
        userData.address.ID
          ? userData.address.ID
          : userData.addressId, // Extract ID từ address object hoặc dùng addressId field
      avatar: userData.avatar || "",
    };

    console.log("Formatted user info:", formattedInfo);
    console.log("formattedInfo.address:", formattedInfo.address);
    return formattedInfo;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="from-background via-primary/5 to-accent/10 min-h-screen bg-gradient-to-br flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="from-background via-primary/5 to-accent/10 min-h-screen bg-gradient-to-br flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">Không thể tải thông tin profile</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const userInfo = formatUserInfo(profileResponse);

  console.log("Formatted user info for UI:", userInfo);

  return (
    <div className="from-background via-primary/5 to-accent/10 min-h-screen bg-gradient-to-br">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex gap-8"
          >
            {/* Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <TabsList className="border-border/50 flex h-auto w-full flex-col space-y-1 rounded-xl border bg-white/80 p-4 shadow-lg backdrop-blur-sm">
                <TabsTrigger
                  value="personal"
                  className="cursor-pointer hover:bg-primary/10 data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary w-full justify-start rounded-lg px-4 py-3 text-left transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:shadow-md data-[state=active]:font-bold"
                >
                  Thông tin cá nhân
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="cursor-pointer hover:bg-primary/10 data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary w-full justify-start rounded-lg px-4 py-3 text-left transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:shadow-md data-[state=active]:font-bold"
                >
                  Bảo mật
                </TabsTrigger>
                <TabsTrigger
                  value="management"
                  onClick={handleManagementClick}
                  className="cursor-pointer hover:bg-primary/10 data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary w-full justify-start rounded-lg px-4 py-3 text-left transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:shadow-md data-[state=active]:font-bold"
                >
                  Thông tin quản lý
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="cursor-pointer hover:bg-primary/10 data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary w-full justify-start rounded-lg px-4 py-3 text-left transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:shadow-md data-[state=active]:font-bold"
                >
                  Thông báo
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-6">
              <TabsContent value="personal" className="mt-0">
                <PersonalInfoTab userInfo={userInfo} />
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <SecurityTab />
              </TabsContent>

              <TabsContent value="management" className="mt-0">
                <ManagementAccountTab resetTrigger={resetManagementTab} />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <NotificationsTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
