import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Settings,
  Calendar,
  Heart,
  History,
  ChevronRight,
  ChevronDown,
  Plus,
  Users,
  Link,
  Loader2,
} from "lucide-react";
import SelfManagedAccountModal from "../modals/SelfManagedAccountModal";
import LinkedAccountModal from "../modals/LinkedAccountModal";
import HealthFormPanel from "../healthForm/HealthFormPanel";
import {
  useCreateHealthDocumentMutation,
  useGetAllHealthDocumentsOfUserQuery,
  useUpdateHealthDocumentMutation,
} from "../../store/api/healthDocumentApi";
import { showToast } from "../../utils/toast";

interface ManagementAccountTabProps {
  resetTrigger?: number; // Trigger để reset về danh sách
}

const ManagementAccountTab: React.FC<ManagementAccountTabProps> = ({
  resetTrigger,
}) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showSelfManagedModal, setShowSelfManagedModal] = useState(false);
  const [showLinkedAccountModal, setShowLinkedAccountModal] = useState(false);
  const [selectedHealthDocument, setSelectedHealthDocument] =
    useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false); // Chế độ chỉnh sửa

  // Reset về danh sách khi resetTrigger thay đổi (user click vào tab đang active)
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      console.log("🔄 Reset về danh sách do click vào tab đang active");
      setSelectedHealthDocument(null);
      setIsEditMode(false);
    }
  }, [resetTrigger]);

  // RTK Query hooks để lấy dữ liệu thật từ backend
  const {
    data: myHealthDocumentResponse,
    isLoading: isLoadingMyDoc,
    error: myDocError,
  } = useGetAllHealthDocumentsOfUserQuery();

  const [createHealthDocument, { isLoading: isCreating }] =
    useCreateHealthDocumentMutation();

  const [updateHealthDocument] = useUpdateHealthDocumentMutation();

  //   console.log("=== HEALTH DOCUMENT DATA ===");
  //   console.log("myHealthDocumentResponse:", myHealthDocumentResponse);
  //   console.log("isLoadingMyDoc:", isLoadingMyDoc);
  //   console.log("myDocError:", myDocError);

  const menuItems = [
    {
      id: "health-records",
      title: "Hồ sơ sức khỏe",
      icon: <Settings className="h-5 w-5 text-gray-600" />,
      hasArrow: true,
    },
    {
      id: "health-tracking",
      title: "Theo dõi sức khỏe",
      icon: <Calendar className="h-5 w-5 text-gray-600" />,
      hasArrow: true,
    },
    {
      id: "health-consultation",
      title: "Tư vấn sức khỏe",
      icon: <Heart className="h-5 w-5 text-gray-600" />,
      hasArrow: true,
    },
    {
      id: "update-history",
      title: "Lịch sử cập nhật thông tin",
      icon: <History className="h-5 w-5 text-gray-600" />,
      hasArrow: true,
    },
  ];

  // Tài khoản tự quản lý - Dùng dữ liệu từ API (TẤT CẢ health documents)
  const getAllUserAccounts = () => {
    if (
      myHealthDocumentResponse?.data &&
      Array.isArray(myHealthDocumentResponse.data)
    ) {
      console.log("All Health Documents:", myHealthDocumentResponse.data);

      return myHealthDocumentResponse.data.map((healthDoc) => ({
        id: `health-doc-${healthDoc.ID}`,
        name: healthDoc.FULL_NAME || healthDoc.NAME || "Chưa đặt tên",
        subtitle: healthDoc.IS_MYSELF
          ? "Tài khoản của tôi"
          : "Tài khoản gia đình",
        avatar: healthDoc.AVATAR || "/health-logo.jpg",
        menuItems: menuItems,
        healthData: healthDoc, // Lưu thêm data để quản lý
      }));
    }
    return [];
  };

  const selfManagedAccounts = getAllUserAccounts();

  // Xử lý tạo HealthDocument mới - tạo trống rồi chuyển sang form edit
  const handleCreateNewHealthDocument = async (formData: {
    FULL_NAME: string;
    DOB: string;
    GENDER_ID: number;
  }) => {
    try {
      console.log("Creating new health document:", formData);

      const result = await createHealthDocument({
        FULL_NAME: formData.FULL_NAME,
        DOB: formData.DOB,
        IS_MYSELF: false,
        TYPE: "family",
        GENDER_ID: formData.GENDER_ID,
      }).unwrap();

      console.log("Health document created successfully:", result);
      setShowSelfManagedModal(false); // Đóng modal
      showToast.success("Tạo hồ sơ sức khỏe thành công!");
      // Không cần confirm modal nữa
    } catch (error) {
      console.error("Failed to create health document:", error);
      showToast.error("Có lỗi xảy ra khi tạo tài khoản!");
    }
  };

  const toggleCard = (accountId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedCards(newExpanded);
  };

  // Handler khi click vào "Hồ sơ sức khỏe" trong menu
  const handleHealthRecordClick = (healthData: any) => {
    console.log("📂 Opening health record for:", healthData);
    setSelectedHealthDocument(healthData);
    setIsEditMode(false); // Mở ở chế độ xem
    // KHÔNG gọi onHealthRecordSelect() để tab không bị active/đậm
  };

  // Handler khi submit form cập nhật Health Document
  const handleUpdateHealthDocument = async (formData: any) => {
    try {
      if (!selectedHealthDocument?.ID) {
        showToast.error("Không tìm thấy thông tin hồ sơ!");
        return;
      }

      console.log("💾 Updating health document:", formData);

      // Loại bỏ các field không được phép gửi lên backend
      const { ID, IS_DELETED, USER, ...validData } = formData;

      console.log("📤 Cleaned data for API:", validData);

      const result = await updateHealthDocument({
        id: selectedHealthDocument.ID,
        data: validData,
      }).unwrap();

      console.log("✅ Health document updated successfully:", result);
      showToast.success("Cập nhật hồ sơ thành công!");

      // Thoát chế độ edit, giữ nguyên form để xem
      setIsEditMode(false);
      setSelectedHealthDocument(result); // Update với data mới
    } catch (error) {
      console.error("❌ Failed to update health document:", error);
      showToast.error("Có lỗi xảy ra khi cập nhật hồ sơ!");
    }
  };

  const AccountCard = ({ account }: { account: any }) => {
    const isExpanded = expandedCards.has(account.id);

    return (
      <div className="group mb-4 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:border-green-200">
        {/* Account Header - Clickable */}
        <div
          className="cursor-pointer border-b border-green-50 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 transition-all duration-300 hover:from-emerald-100 hover:via-teal-100 hover:to-cyan-100"
          onClick={() => toggleCard(account.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-14 w-14 border-2 border-white shadow-lg ring-2 ring-emerald-100 transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage src={account.avatar} alt={account.name} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-lg font-bold text-white shadow-inner">
                    {account.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-emerald-500 shadow-md"></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 transition-colors duration-200 group-hover:text-emerald-700">
                  {account.name}
                </h3>
                <p className="mt-0.5 flex items-center text-sm text-gray-600">
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                  {account.subtitle}
                </p>
              </div>
            </div>
            <div className="rounded-full bg-white/60 p-2 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-md">
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-emerald-600 transition-transform duration-300" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500 transition-transform duration-300 group-hover:text-emerald-600" />
              )}
            </div>
          </div>
        </div>

        {/* Menu Items - Collapsible */}
        {isExpanded && (
          <div className="bg-gradient-to-b from-white to-gray-50/50 p-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {account.menuItems?.map((item: any, index: number) => (
              <div
                key={item.id}
                className="group/item flex cursor-pointer items-center justify-between rounded-xl p-3.5 transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  if (item.id === "health-records") {
                    handleHealthRecordClick(account.healthData);
                  }
                }}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 p-2.5 shadow-sm transition-all duration-200 group-hover/item:shadow-md group-hover/item:scale-110 group-hover/item:from-emerald-200 group-hover/item:to-teal-200">
                    {React.cloneElement(item.icon, {
                      className: "h-5 w-5 text-emerald-700",
                    })}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 transition-colors duration-200 group-hover/item:text-emerald-700">
                    {item.title}
                  </span>
                </div>
                {item.hasArrow && (
                  <ChevronRight className="h-5 w-5 text-gray-400 transition-all duration-200 group-hover/item:translate-x-1 group-hover/item:text-emerald-600" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Nếu đã chọn health document -> hiện form full-width
  if (selectedHealthDocument) {
    return (
      <HealthFormPanel
        healthDocument={selectedHealthDocument}
        onUpdate={handleUpdateHealthDocument}
        isEditMode={isEditMode}
        onEditModeChange={setIsEditMode}
      />
    );
  }

  // Nếu chưa chọn -> hiện danh sách
  return (
    <>
      <Card className="overflow-hidden border-0 shadow-2xl shadow-emerald-100/50">
        <CardHeader
          className="cursor-pointer bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-300 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600"
          onClick={() => setSelectedHealthDocument(null)}
          title="Click để quay lại danh sách"
        >
          <CardTitle className="flex items-center text-white">
            <div className="mr-3 rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Thông tin sức khỏe</h2>
              <p className="mt-0.5 text-sm font-normal text-white/90">
                Quản lý hồ sơ sức khỏe gia đình
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-gradient-to-b from-gray-50 to-white p-6">
          <Tabs defaultValue="self-managed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 gap-3 bg-transparent p-0">
              <TabsTrigger
                value="self-managed"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md data-[state=active]:border-emerald-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-200"
              >
                <Users className="h-5 w-5" />
                <span className="hidden sm:inline">Tự quản lý</span>
                <span className="sm:hidden">Bản thân</span>
              </TabsTrigger>
              <TabsTrigger
                value="linked-accounts"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-cyan-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-cyan-300 hover:shadow-md data-[state=active]:border-cyan-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-200"
              >
                <Link className="h-5 w-5" />
                <span className="hidden sm:inline">Đã liên kết</span>
                <span className="sm:hidden">Liên kết</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="self-managed"
              className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 shadow-inner">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-emerald-800">
                      Hồ sơ sức khỏe bản thân quản lý
                    </h3>
                    <p className="mt-1 text-sm text-emerald-700/80">
                      Quản lý thông tin sức khỏe của bạn và gia đình
                    </p>
                  </div>
                  <div className="rounded-full bg-white/60 p-3 shadow-md backdrop-blur-sm">
                    <Heart
                      className="h-6 w-6 text-emerald-600"
                      fill="currentColor"
                    />
                  </div>
                </div>

                {/* Loading state */}
                {isLoadingMyDoc && (
                  <div className="flex flex-col items-center justify-center space-y-4 rounded-xl bg-white/60 p-12 backdrop-blur-sm">
                    <div className="relative">
                      <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
                      <Heart
                        className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-emerald-600 animate-pulse"
                        fill="currentColor"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-800">
                        Đang tải thông tin...
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Vui lòng chờ trong giây lát
                      </p>
                    </div>
                  </div>
                )}

                {/* Error state */}
                {myDocError && (
                  <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 p-6 text-center shadow-inner">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                      <Settings className="h-8 w-8 text-red-600 animate-pulse" />
                    </div>
                    <p className="font-semibold text-red-700">
                      Không thể tải thông tin sức khỏe
                    </p>
                    <p className="mt-1 text-sm text-red-600/80">
                      Bạn có thể tạo hồ sơ sức khỏe mới bên dưới
                    </p>
                  </div>
                )}

                {/* Hiển thị tài khoản từ API */}
                {!isLoadingMyDoc &&
                  selfManagedAccounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}

                {/* Nếu chưa có health document, hiển thị message */}
                {!isLoadingMyDoc &&
                  !myDocError &&
                  selfManagedAccounts.length === 0 && (
                    <div className="rounded-xl bg-white/60 p-8 text-center shadow-inner backdrop-blur-sm">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100">
                        <Users className="h-10 w-10 text-emerald-600" />
                      </div>
                      <p className="mb-2 text-lg font-semibold text-gray-800">
                        Chưa có hồ sơ sức khỏe
                      </p>
                      <p className="text-sm text-gray-600">
                        Hãy tạo hồ sơ sức khỏe đầu tiên của bạn bằng cách nhấn
                        nút bên dưới
                      </p>
                    </div>
                  )}

                {/* Add Account Button */}
                <div className="relative mt-6">
                  {/* Decorative background elements */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-30 blur-lg"></div>

                  <Button
                    variant="default"
                    className="!p-5 group relative w-full cursor-pointer overflow-hidden rounded-xl border-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-6 text-white shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-300/60 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                    onClick={() => setShowSelfManagedModal(true)}
                    disabled={isCreating}
                  >
                    {/* Animated background shine effect */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

                    {isCreating ? (
                      <div className="relative flex items-center justify-center">
                        <div className="relative mr-3">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <Heart
                            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                            fill="currentColor"
                          />
                        </div>
                        <span className="font-bold text-lg">
                          Đang tạo hồ sơ...
                        </span>
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-x shadow-inner backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                          <Plus className="h-6 w-6 font-bold" strokeWidth={3} />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-lg leading-tight">
                            Thêm hồ sơ sức khỏe mới
                          </span>
                          <span className="text-xs text-white/90">
                            Tạo hồ sơ cho bản thân hoặc gia đình
                          </span>
                        </div>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="linked-accounts"
              className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="rounded-2xl bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-6 shadow-inner">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-cyan-800">
                      Tài khoản đã liên kết
                    </h3>
                    <p className="mt-1 text-sm text-cyan-700/80">
                      Chia sẻ và theo dõi sức khỏe cùng người thân
                    </p>
                  </div>
                  <div className="rounded-full bg-white/60 p-3 shadow-md backdrop-blur-sm">
                    <Link className="h-6 w-6 text-cyan-600" />
                  </div>
                </div>

                <div className="mb-6 rounded-xl bg-gradient-to-r from-cyan-100/50 to-blue-100/50 p-4 backdrop-blur-sm">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-sm">
                      <span className="text-xs font-bold text-white">✓</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-cyan-800">
                        Tài khoản liên kết có quyền xem và cập nhật thông tin
                        sức khỏe cho bạn.
                      </p>
                      <Button
                        variant="link"
                        className="mt-1 h-auto p-0 text-sm font-semibold text-cyan-700 underline underline-offset-2 hover:text-cyan-800"
                      >
                        Tìm hiểu thêm về quyền truy cập →
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Add Linked Account Button */}
                <Button
                  variant="outline"
                  className="group w-full cursor-pointer rounded-xl border-2 border-cyan-300 bg-white py-6 text-cyan-700 shadow-md transition-all duration-300 hover:border-cyan-500 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white hover:shadow-xl hover:shadow-cyan-200"
                  onClick={() => setShowLinkedAccountModal(true)}
                >
                  <div className="mr-2 rounded-lg bg-cyan-100 p-1.5 transition-all duration-300 group-hover:bg-white/20">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">
                    Thêm tài khoản liên kết mới
                  </span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      <SelfManagedAccountModal
        isOpen={showSelfManagedModal}
        onClose={() => setShowSelfManagedModal(false)}
        onSubmit={handleCreateNewHealthDocument}
      />

      <LinkedAccountModal
        isOpen={showLinkedAccountModal}
        onClose={() => setShowLinkedAccountModal(false)}
        onSubmit={(email) => {
          setShowLinkedAccountModal(false);
          showToast.success("Gửi yêu cầu liên kết thành công!");
          console.log("Linked account email:", email);
        }}
      />
    </>
  );
};
export default ManagementAccountTab;
