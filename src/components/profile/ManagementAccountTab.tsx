import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
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
} from "lucide-react"
import SelfManagedAccountModal from "../modals/SelfManagedAccountModal"
import LinkedAccountModal from "../modals/LinkedAccountModal"
import HealthFormPanel from "../healthForm/HealthFormPanel"
import {
  useCreateHealthDocumentMutation,
  useGetAllHealthDocumentsOfUserQuery,
  useUpdateHealthDocumentMutation,
} from "../../store/api/healthDocumentApi"
import { showToast } from "../../utils/toast"

interface ManagementAccountTabProps {
  resetTrigger?: number // Trigger để reset về danh sách
}

const ManagementAccountTab: React.FC<ManagementAccountTabProps> = ({
  resetTrigger,
}) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [showSelfManagedModal, setShowSelfManagedModal] = useState(false)
  const [showLinkedAccountModal, setShowLinkedAccountModal] = useState(false)
  const [selectedHealthDocument, setSelectedHealthDocument] =
    useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false) // Chế độ chỉnh sửa

  // Reset về danh sách khi resetTrigger thay đổi (user click vào tab đang active)
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      console.log("🔄 Reset về danh sách do click vào tab đang active")
      setSelectedHealthDocument(null)
      setIsEditMode(false)
    }
  }, [resetTrigger])

  // RTK Query hooks để lấy dữ liệu thật từ backend
  const {
    data: myHealthDocumentResponse,
    isLoading: isLoadingMyDoc,
    error: myDocError,
  } = useGetAllHealthDocumentsOfUserQuery()

  const [createHealthDocument, { isLoading: isCreating }] =
    useCreateHealthDocumentMutation()

  const [updateHealthDocument] = useUpdateHealthDocumentMutation()

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
  ]

  // Tài khoản tự quản lý - Dùng dữ liệu từ API (TẤT CẢ health documents)
  const getAllUserAccounts = () => {
    if (
      myHealthDocumentResponse?.data &&
      Array.isArray(myHealthDocumentResponse.data)
    ) {
      console.log("All Health Documents:", myHealthDocumentResponse.data)

      return myHealthDocumentResponse.data.map((healthDoc) => ({
        id: `health-doc-${healthDoc.ID}`,
        name: healthDoc.FULL_NAME || healthDoc.NAME || "Chưa đặt tên",
        subtitle: healthDoc.IS_MYSELF
          ? "Tài khoản của tôi"
          : "Tài khoản gia đình",
        avatar: healthDoc.AVATAR || "/health-logo.jpg",
        menuItems: menuItems,
        healthData: healthDoc, // Lưu thêm data để quản lý
      }))
    }
    return []
  }

  const selfManagedAccounts = getAllUserAccounts()

  // Xử lý tạo HealthDocument mới - tạo trống rồi chuyển sang form edit
  const handleCreateNewHealthDocument = async (formData: {
    FULL_NAME: string
    DOB: string
    GENDER_ID: number
  }) => {
    try {
      console.log("Creating new health document:", formData)

      const result = await createHealthDocument({
        FULL_NAME: formData.FULL_NAME,
        DOB: formData.DOB,
        IS_MYSELF: false,
        TYPE: "family",
        GENDER_ID: formData.GENDER_ID,
      }).unwrap()

      console.log("Health document created successfully:", result)
      setShowSelfManagedModal(false) // Đóng modal
      showToast.success("Tạo hồ sơ sức khỏe thành công!")
      // Không cần confirm modal nữa
    } catch (error) {
      console.error("Failed to create health document:", error)
      showToast.error("Có lỗi xảy ra khi tạo tài khoản!")
    }
  }

  const toggleCard = (accountId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId)
    } else {
      newExpanded.add(accountId)
    }
    setExpandedCards(newExpanded)
  }

  // Handler khi click vào "Hồ sơ sức khỏe" trong menu
  const handleHealthRecordClick = (healthData: any) => {
    console.log("📂 Opening health record for:", healthData)
    setSelectedHealthDocument(healthData)
    setIsEditMode(false) // Mở ở chế độ xem
    // KHÔNG gọi onHealthRecordSelect() để tab không bị active/đậm
  }

  // Handler khi submit form cập nhật Health Document
  const handleUpdateHealthDocument = async (formData: any) => {
    try {
      if (!selectedHealthDocument?.ID) {
        showToast.error("Không tìm thấy thông tin hồ sơ!")
        return
      }

      console.log("💾 Updating health document:", formData)

      // Loại bỏ các field không được phép gửi lên backend
      const { ID, IS_DELETED, USER, ...validData } = formData

      console.log("📤 Cleaned data for API:", validData)

      const result = await updateHealthDocument({
        id: selectedHealthDocument.ID,
        data: validData,
      }).unwrap()

      console.log("✅ Health document updated successfully:", result)
      showToast.success("Cập nhật hồ sơ thành công!")

      // Thoát chế độ edit, giữ nguyên form để xem
      setIsEditMode(false)
      setSelectedHealthDocument(result) // Update với data mới
    } catch (error) {
      console.error("❌ Failed to update health document:", error)
      showToast.error("Có lỗi xảy ra khi cập nhật hồ sơ!")
    }
  }

  const AccountCard = ({ account }: { account: any }) => {
    const isExpanded = expandedCards.has(account.id)

    return (
      <div className="mb-3 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Account Header - Clickable */}
        <div
          className="cursor-pointer border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 p-3 transition-colors hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100"
          onClick={() => toggleCard(account.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={account.avatar} alt={account.name} />
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-sm font-semibold text-white">
                  {account.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {account.name}
                </h3>
                <p className="text-xs text-gray-600">{account.subtitle}</p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Menu Items - Collapsible */}
        {isExpanded && (
          <div className="p-2">
            {account.menuItems?.map((item: any) => (
              <div
                key={item.id}
                className="flex cursor-pointer items-center justify-between rounded-lg p-2.5 hover:bg-gray-50"
                onClick={() => {
                  if (item.id === "health-records") {
                    handleHealthRecordClick(account.healthData)
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-gray-100 p-1.5">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.title}
                  </span>
                </div>
                {item.hasArrow && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Nếu đã chọn health document -> hiện form full-width
  if (selectedHealthDocument) {
    return (
      <HealthFormPanel
        healthDocument={selectedHealthDocument}
        onUpdate={handleUpdateHealthDocument}
        isEditMode={isEditMode}
        onEditModeChange={setIsEditMode}
      />
    )
  }

  // Nếu chưa chọn -> hiện danh sách
  return (
    <>
      <Card className="shadow-weather">
        <CardHeader
          className="cursor-pointer transition-colors hover:bg-gray-50"
          onClick={() => setSelectedHealthDocument(null)}
          title="Click để quay lại danh sách"
        >
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Thông tin sức khỏe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="self-managed" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="self-managed"
                className="flex cursor-pointer items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Thông tin sức khỏe bản thân quản lý
              </TabsTrigger>
              <TabsTrigger
                value="linked-accounts"
                className="flex cursor-pointer items-center gap-2"
              >
                <Link className="h-4 w-4" />
                Thông tin sức khỏe của tài khoản đã liên kết
              </TabsTrigger>
            </TabsList>

            <TabsContent value="self-managed" className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-4">
                <h3 className="mb-4 text-lg font-semibold text-green-800">
                  Thông tin sức khỏe bản thân quản lý
                </h3>

                {/* Loading state */}
                {isLoadingMyDoc && (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <span>Đang tải thông tin...</span>
                  </div>
                )}

                {/* Error state */}
                {myDocError && (
                  <div className="p-4 text-center text-red-600">
                    <p>Không thể tải thông tin sức khỏe</p>
                    <p className="text-sm">Bạn có thể tạo hồ sơ sức khỏe mới</p>
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
                    <div className="p-6 text-center text-gray-600">
                      <p className="mb-2">Chưa có hồ sơ sức khỏe</p>
                      <p className="text-sm">
                        Hãy tạo hồ sơ sức khỏe đầu tiên của bạn
                      </p>
                    </div>
                  )}

                {/* Add Account Button */}
                <Button
                  variant="outline"
                  className="mt-4 w-full cursor-pointer border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => setShowSelfManagedModal(true)}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm tài khoản tự quản lý
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="linked-accounts" className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-green-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-blue-800">
                  Thông tin sức khỏe của tài khoản đã liên kết
                </h3>
                <div className="mb-4 flex items-center text-sm text-blue-700">
                  <span className="mr-2 h-3 w-3 rounded-full bg-green-500"></span>
                  Tài khoản có quyền xem và cập nhật thông tin sức khỏe cho bạn.{" "}
                  <Button
                    variant="link"
                    className="ml-1 h-auto p-0 text-blue-600 underline"
                  >
                    Chi tiết quyền tại đây
                  </Button>
                </div>

                {/* Add Linked Account Button */}
                <Button
                  variant="outline"
                  className="w-full cursor-pointer border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => setShowLinkedAccountModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm tài khoản bạn muốn liên kết
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
          setShowLinkedAccountModal(false)
          showToast.success("Gửi yêu cầu liên kết thành công!")
          console.log("Linked account email:", email)
        }}
      />
    </>
  )
}
export default ManagementAccountTab
