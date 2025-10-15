import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { HealthMetricType } from '../types/healthTypes';
import { Lightbulb, ExternalLink } from 'lucide-react';

interface HealthRecommendationsProps {
    metric: HealthMetricType;
}

export const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({ metric }) => {
    const getRecommendations = () => {
        switch (metric) {
            case 'bmi':
                return [
                    'Duy trì chế độ ăn cân bằng với đủ 5 nhóm dưỡng chất',
                    'Tập thể dục ít nhất 150 phút/tuần',
                    'Uống đủ 2-2.5L nước mỗi ngày',
                    'Ngủ đủ 7-8 tiếng mỗi đêm',
                ];
            case 'bloodPressure':
                return [
                    'Giảm lượng muối trong thức ăn xuống < 5g/ngày',
                    'Tăng cường ăn rau củ quả tươi',
                    'Tập thể dục aerobic đều đặn',
                    'Quản lý stress và thư giãn',
                    'Hạn chế rượu bia và thuốc lá',
                ];
            case 'bloodSugar':
                return [
                    'Hạn chế đường và tinh bột tinh chế',
                    'Ăn nhiều chất xơ từ rau củ quả',
                    'Chia nhỏ bữa ăn trong ngày',
                    'Kiểm soát cân nặng',
                    'Tập thể dục sau bữa ăn',
                ];
            case 'heartRate':
                return [
                    'Tập luyện tim mạch đều đặn',
                    'Thực hành hít thở sâu',
                    'Giảm caffeine nếu cần',
                    'Ngủ đủ giấc và chất lượng',
                    'Quản lý stress hiệu quả',
                ];
            case 'weight':
                return [
                    'Cân bằng năng lượng nạp vào và tiêu hao',
                    'Ăn chậm và nhai kỹ',
                    'Tăng hoạt động thể chất hàng ngày',
                    'Theo dõi cân nặng đều đặn',
                    'Tránh ăn vặt muộn màng',
                ];
            default:
                return [];
        }
    };

    const recommendations = getRecommendations();

    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Khuyến nghị</h3>
            </div>

            <div className="space-y-3">
                {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Xem thêm lời khuyên
                </Button>
            </div>
        </Card>
    );
};