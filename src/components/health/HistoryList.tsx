import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Conclusion } from "@/types/health"
import dayjs from "dayjs"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { DATE_FORMAT } from "@/constants/common.constant"

interface HistoryListProps {
    items: Conclusion[]
    loading?: boolean
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    onItemClick: (item: Conclusion) => void
    selectedItemId?: string | number
}

export default function HistoryList({
    items,
    loading = false,
    currentPage,
    totalPages,
    onPageChange,
    onItemClick,
    selectedItemId,
}: HistoryListProps) {
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

    const getStatusColor = (item: Conclusion) => {
        if (!item.color) return "bg-gray-100 text-gray-700"

        // Map color to Tailwind classes
        const colorMap: Record<string, string> = {
            "#00FF00": "bg-green-100 text-green-700",
            "#FFFF00": "bg-yellow-100 text-yellow-700",
            "#FFA500": "bg-orange-100 text-orange-700",
            "#FF0000": "bg-red-100 text-red-700",
            green: "bg-green-100 text-green-700",
            yellow: "bg-yellow-100 text-yellow-700",
            orange: "bg-orange-100 text-orange-700",
            red: "bg-red-100 text-red-700",
        }

        return colorMap[item.color] || "bg-gray-100 text-gray-700"
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
        <div className="space-y-4">
            <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Lịch sử theo dõi
                </h3>

                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.id || item.date}
                            onClick={() => onItemClick(item)}
                            className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${selectedItemId === item.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {dayjs(item.date).format(DATE_FORMAT)}
                                        </span>
                                        {item.time && (
                                            <span className="text-sm text-gray-500">
                                                {item.time}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 text-lg font-semibold text-gray-900">
                                        {getDisplayValue(item)}
                                    </div>
                                </div>

                                {item.type && (
                                    <div
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(item)}`}
                                    >
                                        {item.type}
                                    </div>
                                )}
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
    )
}
