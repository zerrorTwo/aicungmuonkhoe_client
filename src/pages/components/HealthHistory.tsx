import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { HealthMetricType } from '../types/healthTypes';
import { mockHealthData } from '../data/mockHealthData';
import { Calendar, Download } from 'lucide-react';

interface HealthHistoryProps {
    metric: HealthMetricType;
}

export const HealthHistory: React.FC<HealthHistoryProps> = ({ metric }) => {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    const getHistoryData = () => {
        const data = mockHealthData[metric];
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        return data.slice(-days);
    };

    const getStatusColor = (value: number) => {
        switch (metric) {
            case 'bmi':
                if (value < 18.5) return 'bg-blue-500';
                if (value < 25) return 'bg-green-500';
                if (value < 30) return 'bg-yellow-500';
                return 'bg-red-500';
            case 'bloodPressure':
                if (value < 120) return 'bg-green-500';
                if (value < 140) return 'bg-yellow-500';
                return 'bg-red-500';
            case 'bloodSugar':
                if (value < 100) return 'bg-green-500';
                if (value < 140) return 'bg-yellow-500';
                return 'bg-red-500';
            case 'heartRate':
                if (value >= 60 && value <= 100) return 'bg-green-500';
                if (value < 60 || value <= 120) return 'bg-yellow-500';
                return 'bg-red-500';
            case 'weight':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = (value: number) => {
        switch (metric) {
            case 'bmi':
                if (value < 18.5) return 'Thiếu cân';
                if (value < 25) return 'Bình thường';
                if (value < 30) return 'Thừa cân';
                return 'Béo phì';
            case 'bloodPressure':
                if (value < 120) return 'Bình thường';
                if (value < 140) return 'Cao nhẹ';
                return 'Cao';
            case 'bloodSugar':
                if (value < 100) return 'Bình thường';
                if (value < 140) return 'Tiền tiểu đường';
                return 'Cao';
            case 'heartRate':
                if (value >= 60 && value <= 100) return 'Bình thường';
                if (value < 60) return 'Chậm';
                return 'Nhanh';
            case 'weight':
                return 'Đo lường';
            default:
                return 'Không rõ';
        }
    };

    const getUnit = () => {
        switch (metric) {
            case 'bmi':
                return 'kg/m²';
            case 'bloodPressure':
                return 'mmHg';
            case 'bloodSugar':
                return 'mg/dL';
            case 'heartRate':
                return 'bpm';
            case 'weight':
                return 'kg';
            default:
                return '';
        }
    };

    const historyData = getHistoryData();

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Lịch sử đo</h3>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {(['7d', '30d', '90d'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === range
                                        ? 'bg-white shadow-sm text-blue-600'
                                        : 'text-gray-600 hover:text-blue-600'
                                    }`}
                            >
                                {range === '7d' ? '7 ngày' : range === '30d' ? '30 ngày' : '3 tháng'}
                            </button>
                        ))}
                    </div>

                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất
                    </Button>
                </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {historyData.reverse().map((dataPoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(dataPoint.value)}`} />
                            <div>
                                <p className="font-medium">
                                    {dataPoint.value.toFixed(1)} {getUnit()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(dataPoint.date).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        weekday: 'short'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                                {getStatusText(dataPoint.value)}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(dataPoint.date).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {historyData.length === 0 && (
                <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Chưa có dữ liệu trong khoảng thời gian này</p>
                </div>
            )}

            <div className="border-t my-4" />

            <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Tổng số lần đo: {historyData.length}</span>
                <span>
                    Trung bình: {historyData.length > 0
                        ? (historyData.reduce((sum, item) => sum + item.value, 0) / historyData.length).toFixed(1)
                        : '0'} {getUnit()}
                </span>
            </div>
        </Card>
    );
};