import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import PersonalInfoTab from "../components/profile/PersonalInfoTab"
import SecurityTab from "../components/profile/SecurityTab"
import NotificationsTab from "../components/profile/NotificationsTab"
import ManagementAccountTab from "../components/profile/ManagementAccountTab"
import { useGetUserProfileQuery } from "../store/api/userApi"

const Profile: React.FC = () => {
  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState("personal")
  const [resetManagementTab, setResetManagementTab] = useState(0)

  // Handler khi click vào tab management
  const handleManagementClick = () => {
    if (activeTab === "management") {
      // Đang active → reset về danh sách
      setResetManagementTab((prev) => prev + 1)
    }
    // Luôn set active (TabsTrigger sẽ handle)
    setActiveTab("management")
  }

  // Call API để lấy user profile thay vì từ localStorage
  const {
    data: userDataResponse,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery()

  const userInfo = userDataResponse?.data || null

  // Loading state
  if (isLoading) {
    return (
      <div className="from-background via-primary/5 to-accent/10 flex min-h-screen items-center justify-center bg-gradient-to-br">
        <div className="text-center">
          <div className="border-primary mx-auto h-32 w-32 animate-spin rounded-full border-b-2"></div>
          <p className="mt-4 text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="from-background via-primary/5 to-accent/10 flex min-h-screen items-center justify-center bg-gradient-to-br">
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-500">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold">Có lỗi xảy ra</h2>
          <p className="mb-4 text-gray-600">Không thể tải thông tin profile</p>
          <button
            onClick={() => refetch()}
            className="bg-primary hover:bg-primary/90 rounded px-4 py-2 text-white"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

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
                  className="hover:bg-primary/10 data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary w-full cursor-pointer justify-start rounded-lg px-4 py-3 text-left transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:font-bold data-[state=active]:shadow-md"
                >
                  Thông tin cá nhân
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="hover:bg-primary/10 data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary w-full cursor-pointer justify-start rounded-lg px-4 py-3 text-left transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:font-bold data-[state=active]:shadow-md"
                >
                  Bảo mật
                </TabsTrigger>
                <TabsTrigger
                  value="management"
                  onClick={handleManagementClick}
                  className="hover:bg-primary/10 data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary w-full cursor-pointer justify-start rounded-lg px-4 py-3 text-left transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:font-bold data-[state=active]:shadow-md"
                >
                  Thông tin quản lý
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="hover:bg-primary/10 data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary w-full cursor-pointer justify-start rounded-lg px-4 py-3 text-left transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:font-bold data-[state=active]:shadow-md"
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
  )
}

export default Profile
