import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { HealthDataPoint } from '../types/healthTypes';

interface CholesterolChartProps {
    data: HealthDataPoint[];
}

export const CholesterolChart: React.FC<CholesterolChartProps> = ({ data }) => {
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const point = params[0];
                return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${point.axisValue}</div>
            <div style="color: #666;">Cholesterol: ${point.value} mg/dL</div>
          </div>
        `;
            },
        },
        grid: {
            left: 50,
            right: 20,
            top: 20,
            bottom: 50,
        },
        xAxis: {
            type: 'category',
            data: data.map(item => new Date(item.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })),
            axisLine: { lineStyle: { color: '#e5e7eb' } },
            axisTick: { show: false },
            axisLabel: { color: '#6b7280', fontSize: 12 },
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#6b7280', fontSize: 12 },
            splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        },
        series: [
            {
                type: 'line',
                data: data.map(item => item.value),
                smooth: true,
                lineStyle: {
                    color: '#eab308',
                    width: 2,
                },
                itemStyle: {
                    color: '#eab308',
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};