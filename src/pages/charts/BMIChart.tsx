import { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts, { type EChartsOption } from 'echarts-for-react';
import type { HealthDataPoint } from '../types/healthTypes';

// Constants following PMS structure
const BMIAgeRange = {
    FROM_0_LESS_THAN_5: 'FROM_0_LESS_THAN_5',
    FROM_5_LESS_THAN_12: 'FROM_5_LESS_THAN_12',
    FROM_12_LESS_THAN_20: 'FROM_12_LESS_THAN_20',
    FROM_20_LESS_THEN_70: 'FROM_20_LESS_THEN_70',
    EQUAL_MORE_THAN_70: 'EQUAL_MORE_THAN_70'
} as const;

const BMIChildrenTabs = {
    Weight: 'WEIGHT',
    Height: 'HEIGHT',
    WeightHeight: 'WEIGHT_HEIGHT',
    BMI: 'BMI'
} as const;

type BMIAgeRangeType = typeof BMIAgeRange[keyof typeof BMIAgeRange];
type BMIChildrenTabsType = typeof BMIChildrenTabs[keyof typeof BMIChildrenTabs];

// WHO Standards data following PMS structure
const BMI_CHART_COLOR = [
    '#7BCCFA',
    '#F8DAA9',
    '#B9E5A9',
    '#BCE6AC',
    '#F1BC9F',
    '#ff0000'
];

const BMI_LINE_COLOR = [
    '#4FA5DE',
    '#EF9B37',
    '#71C74E',
    '#E3602B',
    '#D33E2A',
    '#ff0000'
];

// WHO Standards reference lines
const WHO_PERCENTILES = {
    // For 0-5 years Weight (kg)
    WEIGHT_0_5: [
        { name: '-3SD', values: [2.5, 3.4, 4.2, 5.0, 5.7, 6.4] },
        { name: '-2SD', values: [2.9, 3.9, 4.9, 5.8, 6.7, 7.5] },
        { name: 'Median', values: [3.3, 4.5, 5.6, 6.7, 7.8, 8.9] },
        { name: '+2SD', values: [3.8, 5.1, 6.4, 7.7, 9.1, 10.5] },
        { name: '+3SD', values: [4.2, 5.7, 7.1, 8.6, 10.2, 11.8] }
    ],
    // For 0-5 years Height (cm)
    HEIGHT_0_5: [
        { name: '-3SD', values: [44.2, 49.8, 54.4, 58.4, 61.8, 65.0] },
        { name: '-2SD', values: [46.1, 52.0, 57.1, 61.4, 65.0, 68.6] },
        { name: 'Median', values: [49.9, 56.7, 62.9, 68.0, 72.8, 77.2] },
        { name: '+2SD', values: [53.7, 61.4, 68.6, 74.5, 80.5, 85.7] },
        { name: '+3SD', values: [55.6, 63.4, 70.6, 76.9, 83.2, 88.9] }
    ],
    // For 5-19 years BMI
    BMI_5_19: [
        { name: '-3SD', values: [12.1, 12.4, 12.8, 13.4, 14.2, 15.3] },
        { name: '-2SD', values: [13.0, 13.4, 13.9, 14.6, 15.6, 16.9] },
        { name: 'Median', values: [15.3, 15.9, 16.6, 17.6, 18.9, 20.5] },
        { name: '+2SD', values: [18.4, 19.3, 20.3, 21.7, 23.4, 25.4] },
        { name: '+3SD', values: [20.6, 21.7, 22.9, 24.5, 26.4, 28.8] }
    ],
    // For adults BMI
    BMI_ADULT: [
        { name: 'Thiếu cân', value: 18.5 },
        { name: 'Thừa cân', value: 25 },
        { name: 'Béo phì độ I', value: 30 },
        { name: 'Béo phì độ II', value: 35 }
    ]
};

interface BMIChartProps {
    loading?: boolean;
    data: HealthDataPoint[];
    ageRange: BMIAgeRangeType;
    activeTab: BMIChildrenTabsType;
    age: number;
}

export default function BMIChart({
    loading = false,
    data,
    activeTab,
    age
}: BMIChartProps) {
    const eChartsRef = useRef<ReactECharts | null>(null);
    const [chartOption, setChartOption] = useState<EChartsOption>({});

    const chartConfig = useMemo(() => {
        // For children under 5 - different charts based on active tab
        if (age < 5) {
            switch (activeTab) {
                case BMIChildrenTabs.Weight:
                    return {
                        title: 'Cân nặng theo tuổi (WHO 2006)',
                        yAxisName: 'Cân nặng (kg)',
                        yMin: 2,
                        yMax: 15,
                        unit: 'kg',
                        referenceLines: WHO_PERCENTILES.WEIGHT_0_5
                    };
                case BMIChildrenTabs.Height:
                    return {
                        title: 'Chiều cao theo tuổi (WHO 2006)',
                        yAxisName: 'Chiều cao (cm)',
                        yMin: 40,
                        yMax: 95,
                        unit: 'cm',
                        referenceLines: WHO_PERCENTILES.HEIGHT_0_5
                    };
                case BMIChildrenTabs.WeightHeight:
                    return {
                        title: 'Cân nặng theo chiều cao (WHO 2006)',
                        yAxisName: 'Cân nặng (kg)',
                        yMin: 2,
                        yMax: 15,
                        unit: 'kg',
                        referenceLines: WHO_PERCENTILES.WEIGHT_0_5
                    };
                default:
                    return {
                        title: 'BMI theo tuổi (WHO 2007)',
                        yAxisName: 'BMI',
                        yMin: 10,
                        yMax: 30,
                        unit: '',
                        referenceLines: WHO_PERCENTILES.BMI_5_19
                    };
            }
        }

        // For children 5-19 - only BMI
        if (age < 19) {
            return {
                title: 'BMI theo tuổi (WHO 2007)',
                yAxisName: 'BMI',
                yMin: 10,
                yMax: 35,
                unit: '',
                referenceLines: WHO_PERCENTILES.BMI_5_19
            };
        }

        // For adults 19+ - standard BMI
        return {
            title: 'Chỉ số BMI',
            yAxisName: 'BMI',
            yMin: 15,
            yMax: 40,
            unit: '',
            referenceLines: WHO_PERCENTILES.BMI_ADULT
        };
    }, [age, activeTab]);

    const option: EChartsOption = useMemo(() => {
        const xAxisData = data.map(d => {
            const date = new Date(d.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });

        const seriesData = data.map(d => d.value);

        // Create reference lines
        const markLines: any[] = [];

        if (age >= 19) {
            // Adult BMI reference lines
            chartConfig.referenceLines.forEach((ref: any, index: number) => {
                markLines.push({
                    yAxis: ref.value,
                    name: ref.name,
                    lineStyle: {
                        color: BMI_LINE_COLOR[index] || '#666',
                        type: 'dashed',
                        width: 2
                    },
                    label: {
                        position: 'end',
                        fontSize: 10,
                        color: BMI_LINE_COLOR[index] || '#666',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: [2, 4],
                        borderRadius: 2
                    }
                });
            });
        } else {
            // Children WHO percentile lines
            chartConfig.referenceLines.forEach((ref: any, index: number) => {
                if (ref.values) {
                    // Use median value for now (more complex logic needed for age-specific values)
                    const medianValue = ref.values[Math.floor(ref.values.length / 2)];
                    markLines.push({
                        yAxis: medianValue,
                        name: ref.name,
                        lineStyle: {
                            color: BMI_LINE_COLOR[index] || '#666',
                            type: 'dashed',
                            width: 1
                        },
                        label: {
                            position: 'end',
                            fontSize: 10,
                            color: BMI_LINE_COLOR[index] || '#666',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    });
                }
            });
        }

        return {
            title: {
                text: chartConfig.title,
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
                    const point = params[0];
                    return `${point.axisValue}<br/>${chartConfig.yAxisName}: ${point.value}${chartConfig.unit}`;
                }
            },
            grid: {
                left: '8%',
                right: '4%',
                bottom: '15%',
                top: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLine: {
                    lineStyle: {
                        color: '#e5e7eb'
                    }
                },
                axisLabel: {
                    color: '#6b7280',
                    fontSize: 11,
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: chartConfig.yAxisName,
                nameTextStyle: {
                    color: '#6b7280',
                    fontSize: 12
                },
                min: chartConfig.yMin,
                max: chartConfig.yMax,
                axisLine: {
                    lineStyle: {
                        color: '#e5e7eb'
                    }
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
                    name: chartConfig.yAxisName,
                    type: 'line',
                    data: seriesData,
                    itemStyle: {
                        color: '#3b82f6',
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    },
                    lineStyle: {
                        color: '#3b82f6',
                        width: 3
                    },
                    symbol: 'circle',
                    symbolSize: 8,
                    smooth: true,
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                            ]
                        }
                    },
                    markLine: {
                        silent: true,
                        symbol: 'none',
                        data: markLines
                    }
                }
            ]
        };
    }, [data, chartConfig, age]);

    useEffect(() => {
        setChartOption(option);
    }, [option]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <ReactECharts
                ref={eChartsRef}
                option={chartOption}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
                showLoading={loading}
            />
        </div>
    );
}