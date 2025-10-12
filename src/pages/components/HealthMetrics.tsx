import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { HealthData } from '../types/healthTypes';
import { Activity, Heart, TrendingUp, Scale } from 'lucide-react';

interface HealthMetricsProps {
    data: HealthData;
}

export const HealthMetrics: React.FC<HealthMetricsProps> = ({ data }) => {
    const getLatestValue = (metricData: any[]) => {
        return metricData[metricData.length - 1];
    };

    const metrics = [
        {
            label: 'BMI',
            value: getLatestValue(data.bmi).value.toFixed(1),
            unit: '',
            status: getLatestValue(data.bmi).status,
            icon: Activity,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Huyết áp',
            value: `${getLatestValue(data.bloodPressure).systolic?.toFixed(0)}/${getLatestValue(data.bloodPressure).diastolic?.toFixed(0)}`,
            unit: 'mmHg',
            status: getLatestValue(data.bloodPressure).status,
            icon: Heart,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            label: 'Đường huyết',
            value: getLatestValue(data.bloodSugar).value.toFixed(0),
            unit: 'mg/dL',
            status: getLatestValue(data.bloodSugar).status,
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            label: 'Cân nặng',
            value: getLatestValue(data.weight).value.toFixed(1),
            unit: 'kg',
            status: getLatestValue(data.weight).status,
            icon: Scale,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
    ];

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

    const getStatusText = (status: string) => {
        switch (status) {
            case 'good':
                return 'Tốt';
            case 'normal':
                return 'Bình thường';
            case 'warning':
                return 'Cảnh báo';
            case 'danger':
                return 'Nguy hiểm';
            default:
                return 'Không xác định';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                    <Card key={metric.label} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                                <Icon className={`h-6 w-6 ${metric.color}`} />
                            </div>
                            <Badge className={getStatusColor(metric.status)}>
                                {getStatusText(metric.status)}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600">{metric.label}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {metric.value} <span className="text-sm text-gray-500">{metric.unit}</span>
                            </p>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};