import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import PersonalInfoTab from "../components/profile/PersonalInfoTab"
import SecurityTab from "../components/profile/SecurityTab"
import NotificationsTab from "../components/profile/NotificationsTab"
import ManagementAccountTab from "../components/profile/ManagementAccountTab"

const Profile: React.FC = () => {
    // Lấy dữ liệu user từ localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Chuyển đổi dữ liệu backend thành format cho PersonalInfoTab
    const formatUserInfo = (userData: any) => {
        if (!userData || !userData.EMAIL) {
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

        // Tách tên từ email nếu không có tên riêng
        const nameFromEmail = userData.EMAIL.split('@')[0] || "Người dùng";
        
        return {
            name: nameFromEmail,
            email: userData.EMAIL || "",
            phone: userData.PHONE || "",
            birthDate: "", // Sẽ lấy từ health document sau
            gender: "", // Sẽ lấy từ health document sau  
            address: "", // Sẽ lấy từ health document sau
            avatar: userData.FACE_IMAGE || "",
        };
    };

    const userInfo = formatUserInfo(user);
    
    console.log('Raw user data from localStorage:', user);
    console.log('Formatted user info:', userInfo);
   

    return (
        <div className="from-background via-primary/5 to-accent/10 min-h-screen bg-gradient-to-br">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-6xl">
                    <Tabs defaultValue="personal" className="flex gap-8">
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
                                <ManagementAccountTab />
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
