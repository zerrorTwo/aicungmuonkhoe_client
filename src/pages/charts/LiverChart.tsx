import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { HealthDataPoint } from '../types/healthTypes';

type LiverVariant = 'ALT' | 'AST';

interface LiverChartProps {
    data: HealthDataPoint[];
    variant?: LiverVariant;
}

export const LiverChart: React.FC<LiverChartProps> = ({ data, variant = 'ALT' }) => {
    const title = variant === 'ALT' ? 'Chức năng gan (ALT)' : 'Chức năng gan (AST)';
    const option = {
        title: {
            text: title,
            left: 'center',
            textStyle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' }
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const point = params[0];
                return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${point.axisValue}</div>
            <div style="color: #666;">Chức năng gan: ${point.value} U/L</div>
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
                    color: '#06b6d4',
                    width: 2,
                },
                itemStyle: {
                    color: '#06b6d4',
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};