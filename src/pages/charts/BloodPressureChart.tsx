import { useMemo } from 'react';
import ReactECharts, { type EChartsOption } from 'echarts-for-react';
import type { HealthDataPoint } from '../types/healthTypes';

type BloodPressureVariant = 'home' | 'facility';

interface BloodPressureChartProps {
    data: HealthDataPoint[];
    loading?: boolean;
    variant?: BloodPressureVariant; // đo tại nhà vs cơ sở y tế
}

export function BloodPressureChart({ data, loading = false, variant = 'home' }: BloodPressureChartProps) {
    const option: EChartsOption = useMemo(() => {
        const xAxisData = data.map(d => {
            const date = new Date(d.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });

        // Assuming blood pressure data has systolic and diastolic values
        const systolicData = data.map(d => d.value); // Main value as systolic
        const diastolicData = data.map(d => Math.round(d.value * 0.6)); // Mock diastolic as 60% of systolic

        // Add thin vertical connecting lines for each data point
        let connectingSeries = [];
        for (let i = 0; i < data.length; i++) {
            connectingSeries.push({
                name: `Nối ${i + 1}`,
                type: 'line',
                data: [
                    [i, systolicData[i]],
                    [i, diastolicData[i]]
                ],
                xAxisIndex: 0,
                yAxisIndex: 0,
                lineStyle: { color: '#374151', type: 'solid', width: 1, cap: 'round' },
                symbol: 'none',
                showSymbol: false,
                z: 20,
                tooltip: { show: false },
                connectNulls: true,
            });
        }

        const titleText = variant === 'home' ? 'Huyết áp (Đo tại nhà)' : 'Huyết áp (Cơ sở y tế)';

        return {
            title: {
                text: titleText,
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#1f2937'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params: any) {
                    const systolic = params[0];
                    const diastolic = params[1];
                    const formatValue = (val: number) => typeof val === 'number' ? val.toFixed(2) : val;
                    return `${systolic.axisValue}<br/>Tâm thu: ${formatValue(systolic.value)} mmHg<br/>Tâm trương: ${formatValue(diastolic.value)} mmHg`;
                }
            },
            legend: {
                data: ['Tâm thu', 'Tâm trương'],
                top: 30
            },
            grid: {
                left: '8%',
                right: '4%',
                bottom: '15%',
                top: '25%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLine: {
                    lineStyle: { color: '#e5e7eb' }
                },
                axisLabel: {
                    color: '#6b7280',
                    fontSize: 11,
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: 'mmHg',
                nameTextStyle: {
                    color: '#6b7280',
                    fontSize: 12
                },
                min: 60,
                max: 180,
                axisLine: {
                    lineStyle: { color: '#e5e7eb' }
                },
                axisLabel: {
                    color: '#6b7280',
                    fontSize: 11
                },
                splitLine: {
                    lineStyle: {
                        color: '#f3f4f6',
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    name: 'Tâm thu',
                    type: 'line',
                    data: systolicData,
                    itemStyle: { color: '#ef4444' },
                    lineStyle: { color: '#ef4444', width: 3 },
                    symbol: 'circle',
                    symbolSize: 8,
                    smooth: true,
                    markLine: {
                        silent: true,
                        symbol: 'none',
                        data: [
                            { yAxis: 140, name: 'Cao', lineStyle: { color: '#ef4444', type: 'dashed' } },
                            { yAxis: 120, name: 'Bình thường', lineStyle: { color: '#10b981', type: 'dashed' } }
                        ],
                        label: {
                            position: 'end',
                            fontSize: 10,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            padding: [2, 4]
                        }
                    }
                },
                {
                    name: 'Tâm trương',
                    type: 'line',
                    data: diastolicData,
                    itemStyle: { color: '#3b82f6' },
                    lineStyle: { color: '#3b82f6', width: 3 },
                    symbol: 'circle',
                    symbolSize: 8,
                    smooth: true,
                    markLine: {
                        silent: true,
                        symbol: 'none',
                        data: [
                            { yAxis: 90, name: 'Cao', lineStyle: { color: '#ef4444', type: 'dashed' } },
                            { yAxis: 80, name: 'Bình thường', lineStyle: { color: '#10b981', type: 'dashed' } }
                        ]
                    }
                },
                ...connectingSeries
            ]
        };
    }, [data, variant]);

    return (
        <div className="w-full h-full" >
            <ReactECharts
                option={option}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
                showLoading={loading}
            />
        </div >
    );
}