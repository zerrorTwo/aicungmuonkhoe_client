import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { HealthDataPoint, HealthMetricType } from '../types/healthTypes';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HealthSummaryProps {
    data: HealthDataPoint[];
    metric: HealthMetricType;
}

export const HealthSummary: React.FC<HealthSummaryProps> = ({ data, metric }) => {
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    const change = latest && previous ? latest.value - previous.value : 0;
    const trend = change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable';

    const getMetricInfo = () => {
        switch (metric) {
            case 'bmi':
                return {
                    title: 'BMI',
                    unit: '',
                    target: '18.5 - 23',
                    advice: latest.value > 23 ? 'Nên giảm cân' : latest.value < 18.5 ? 'Nên tăng cân' : 'Duy trì cân nặng hiện tại',
                };
            case 'bloodPressure':
                return {
                    title: 'Huyết áp',
                    unit: 'mmHg',
                    target: '< 120/80',
                    advice: 'Giữ lối sống lành mạnh, tập thể dục đều đặn',
                };
            case 'bloodSugar':
                return {
                    title: 'Đường huyết',
                    unit: 'mg/dL',
                    target: '70 - 100',
                    advice: latest.value > 100 ? 'Hạn chế đường, tăng vận động' : 'Duy trì chế độ ăn hiện tại',
                };
            case 'heartRate':
                return {
                    title: 'Nhịp tim',
                    unit: 'bpm',
                    target: '60 - 100',
                    advice: 'Tập thể dục đều đặn để cải thiện sức khỏe tim mạch',
                };
            case 'weight':
                return {
                    title: 'Cân nặng',
                    unit: 'kg',
                    target: '65 - 70',
                    advice: 'Duy trì chế độ ăn cân bằng và tập thể dục',
                };
            default:
                return { title: '', unit: '', target: '', advice: '' };
        }
    };

    const metricInfo = getMetricInfo();

    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="h-4 w-4 text-red-500" />;
            case 'down':
                return <TrendingDown className="h-4 w-4 text-green-500" />;
            default:
                return <Minus className="h-4 w-4 text-gray-500" />;
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case 'up':
                return 'text-red-600';
            case 'down':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good':
                return 'bg-green-100 text-green-800';
            case 'normal':
                return 'bg-blue-100 text-blue-800';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800';
            case 'danger':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tóm tắt {metricInfo.title}</h3>

            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Giá trị hiện tại</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                            {metric === 'bloodPressure'
                                ? `${latest?.systolic?.toFixed(0)}/${latest?.diastolic?.toFixed(0)}`
                                : latest?.value.toFixed(1)
                            }
                        </span>
                        <span className="text-sm text-gray-500">{metricInfo.unit}</span>
                        <Badge className={getStatusColor(latest?.status || 'normal')}>
                            {latest?.status === 'good' ? 'Tốt' :
                                latest?.status === 'normal' ? 'Bình thường' :
                                    latest?.status === 'warning' ? 'Cảnh báo' : 'Nguy hiểm'}
                        </Badge>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-600 mb-1">Xu hướng</p>
                    <div className="flex items-center gap-2">
                        {getTrendIcon()}
                        <span className={`text-sm font-medium ${getTrendColor()}`}>
                            {trend === 'up' ? 'Tăng' : trend === 'down' ? 'Giảm' : 'Ổn định'}
                        </span>
                        <span className="text-xs text-gray-500">
                            ({change > 0 ? '+' : ''}{change.toFixed(1)})
                        </span>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-600 mb-1">Mục tiêu</p>
                    <p className="text-sm font-medium">{metricInfo.target}</p>
                </div>

                <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-1">Lời khuyên</p>
                    <p className="text-sm text-gray-800">{metricInfo.advice}</p>
                </div>
            </div>
        </Card>
    );
};