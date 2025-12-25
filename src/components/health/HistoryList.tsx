import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import type { Conclusion } from "@/types/health"
import dayjs from "dayjs"
import { ChevronLeft, ChevronRight, Calendar, User, Flag, Edit, Trash2 } from "lucide-react"
import { DATE_FORMAT } from "@/constants/common.constant"

interface HistoryListProps {
    items: Conclusion[]
    loading?: boolean
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    onEdit?: (item: Conclusion) => void
    onDelete?: (itemId: number | string) => Promise<void>
}

export default function HistoryList({
    items,
    loading = false,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
}: HistoryListProps) {
    const [selectedItem, setSelectedItem] = useState<Conclusion | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<Conclusion | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const getDisplayValue = (item: Conclusion) => {
        // Format value based on model type
        if (item.valueSys && item.valueDia) {
            return `${item.valueSys}/${item.valueDia} mmHg`
        }
        if (item.valueWeight && item.valueHeight) {
            return `${item.valueWeight}kg / ${item.valueHeight}cm`
        }
        if (item.value) {
            return `${item.value}`
        }
        return "N/A"
    }

    const getModelLabel = (item: Conclusion) => {
        const modelMap: Record<string, string> = {
            BMI: "BMI",
            HOME: "Huyết áp (Tại nhà)",
            HOSPITAL: "Huyết áp (Cơ sở y tế)",
            BLOOD_PRESSURE_HOME: "Huyết áp (Tại nhà)",
            BLOOD_PRESSURE_HOSPITAL: "Huyết áp (Cơ sở y tế)",
            HUNGRY: "Đường huyết (Lúc đói)",
            TWO_HOURS: "Đường huyết (Sau 2h)",
            HBA1C: "HbA1c",
            BLOOD_SUGAR_HUNGRY: "Đường huyết (Lúc đói)",
            BLOOD_SUGAR_2H: "Đường huyết (Sau 2h)",
            AXIT_URIC: "Axit uric",
            ACID_URIC: "Axit uric",
            SGPT: "ALT",
            SGOT: "AST",
            CREA: "Creatinine",
            URE: "Urea",
            CHOL: "Cholesterol",
            LDL: "LDL",
            HDL: "HDL",
            TRIGLYCERIDE: "Triglyceride",
        }
        return modelMap[item.model || ""] || item.model || "Chỉ số sức khỏe"
    }

    const handleViewDetail = (item: Conclusion) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const handleEdit = (item: Conclusion, e: React.MouseEvent) => {
        e.stopPropagation()
        if (onEdit) {
            onEdit(item)
        }
    }

    const handleDelete = (item: Conclusion, e: React.MouseEvent) => {
        e.stopPropagation()
        setItemToDelete(item)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (onDelete && itemToDelete?.id) {
            setIsDeleting(true)
            try {
                await onDelete(itemToDelete.id)
                setIsDeleteModalOpen(false)
                setItemToDelete(null)
            } finally {
                setIsDeleting(false)
            }
        }
    }

    if (loading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải...</span>
                </div>
            </Card>
        )
    }

    if (!items || items.length === 0) {
        return (
            <Card className="p-6">
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Calendar className="mb-4 h-12 w-12" />
                    <p className="text-lg font-medium">Chưa có dữ liệu</p>
                    <p className="text-sm">Hãy thêm chỉ số sức khỏe của bạn</p>
                </div>
            </Card>
        )
    }

    return (
        <>
            <div className="space-y-4">
                <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                        Lịch sử theo dõi
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item) => (
                            <div
                                key={item.id || item.date}
                                className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
                            >
                                {/* Header: Avatar + Name + Date */}
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 overflow-hidden">
                                            {item.createdAvatar || item.CREATED_AVATAR ? (
                                                <img
                                                    src={item.createdAvatar || item.CREATED_AVATAR}
                                                    alt={item.createdName || item.CREATED_NAME || 'User'}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        // Fallback to icon if image fails to load
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.parentElement!.innerHTML = '<svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                                                    }}
                                                />
                                            ) : (
                                                <User className="h-5 w-5 text-gray-600" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {item.createdName || item.CREATED_NAME || 'Unknown User'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        {dayjs(item.date).format(DATE_FORMAT)}
                                    </div>
                                </div>

                                {/* Model Label */}
                                <div className="mb-2 text-center text-sm font-medium text-gray-600">
                                    {getModelLabel(item)}
                                </div>

                                {/* Value */}
                                <div className="mb-3 text-center text-3xl font-bold text-[hsl(158,64%,52%)]">
                                    {getDisplayValue(item)}
                                </div>

                                {/* Status Badge */}
                                <div className="mb-4 flex items-center justify-center gap-2">
                                    <Flag className="h-4 w-4 text-yellow-500" />
                                    <span
                                        className="rounded-full px-3 py-1 text-sm font-medium"
                                        style={{
                                            backgroundColor: item.color || "#e5e7eb",
                                            color: "#fff",
                                        }}
                                    >
                                        {item.type || "Bình thường"}
                                    </span>
                                </div>

                                {/* Footer: View Detail + Actions */}
                                <div className="flex items-center justify-between border-t pt-3">
                                    <button
                                        onClick={() => handleViewDetail(item)}
                                        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        Xem chi tiết →
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleEdit(item, e)}
                                            className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(item, e)}
                                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between border-t pt-4">
                            <div className="text-sm text-gray-600">
                                Trang {currentPage} / {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Trước
                                </Button>
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Sau
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Detail Modal */}
            <Modal
                title={
                    <div className="text-lg font-semibold">
                        Chi tiết {getModelLabel(selectedItem || ({} as Conclusion))}
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalOpen(false)}>
                        Đóng
                    </Button>,
                ]}
                width={600}
            >
                {selectedItem && (
                    <div className="space-y-6 py-4">
                        {/* Date and Time */}
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-5 w-5" />
                            <span className="font-medium">
                                {dayjs(selectedItem.date).format("DD/MM/YYYY")}
                            </span>
                            {selectedItem.time && (
                                <span className="text-gray-500">• {selectedItem.time}</span>
                            )}
                        </div>

                        {/* Value Section */}
                        <div className="rounded-lg bg-gray-50 p-6">
                            <div className="mb-2 text-center text-sm font-medium text-gray-600">
                                Giá trị đo được
                            </div>
                            <div className="text-center text-4xl font-bold text-[hsl(158,64%,52%)]">
                                {getDisplayValue(selectedItem)}
                            </div>
                        </div>

                        {/* Conclusion Section */}
                        <div>
                            <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                                <Flag className="h-5 w-5" />
                                Kết luận
                            </h4>
                            <div
                                className="inline-block rounded-full px-4 py-2 text-sm font-medium"
                                style={{
                                    backgroundColor: selectedItem.color || "#e5e7eb",
                                    color: "#fff",
                                }}
                            >
                                {selectedItem.type || "Bình thường"}
                            </div>
                        </div>

                        {/* Recommendation Section */}
                        {selectedItem.recommend && (
                            <div>
                                <h4 className="mb-2 font-semibold text-gray-900">
                                    Lời khuyên
                                </h4>
                                <div
                                    className="rounded-lg bg-blue-50 p-4 text-sm text-gray-700"
                                    dangerouslySetInnerHTML={{
                                        __html: selectedItem.recommend,
                                    }}
                                />
                            </div>
                        )}

                        {/* Additional Info */}
                        {selectedItem.note && (
                            <div>
                                <h4 className="mb-2 font-semibold text-gray-900">Ghi chú</h4>
                                <p className="text-sm text-gray-600">{selectedItem.note}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-red-600">
                        <ExclamationCircleOutlined />
                        <span>Xác nhận xóa</span>
                    </div>
                }
                open={isDeleteModalOpen}
                onOk={confirmDelete}
                onCancel={() => {
                    setIsDeleteModalOpen(false)
                    setItemToDelete(null)
                }}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true, loading: isDeleting }}
            >
                <p>Bạn có chắc chắn muốn xóa bản ghi này không?</p>
            </Modal>
        </>
    )
}
