import { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts, { type EChartsOption } from 'echarts-for-react';
import type { HealthDataPoint } from '../types/healthTypes';
import { useLazyGetConclusionsRangeQuery } from '@/store/api/conclusionApi';

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
    ageRange: BMIAgeRangeType;
    activeTab: BMIChildrenTabsType;
    age: number;
    healthDocumentId: string;
    startTime?: string;
    endTime?: string;
    dob?: string;
    onDataLoaded?: (data: any) => void; // Callback to send data to parent
    refreshTrigger?: number; // Add trigger to force refresh
}

export default function BMIChart({
    loading = false,
    activeTab,
    age,
    healthDocumentId,
    startTime,
    endTime,
    ageRange,
    dob,
    onDataLoaded,
    refreshTrigger = 0
}: BMIChartProps) {
    const eChartsRef = useRef<ReactECharts | null>(null);
    const [chartOption, setChartOption] = useState<EChartsOption>({});
    console.log(age);

    const [fetchConclusionsRange, { data: rangeData }] = useLazyGetConclusionsRangeQuery();

    useEffect(() => {
        if (!healthDocumentId) {
            console.error('Health document ID is undefined');
            return;
        }

        if (ageRange === 'FROM_0_LESS_THAN_5') {
            if (!dob) {
                console.error('Date of birth is undefined for health document ID:', healthDocumentId);
                return;
            }
            const birth = new Date(dob);
            if (isNaN(birth.getTime())) {
                console.error('Invalid date of birth for health document ID:', healthDocumentId);
                return;
            }

            const startDate = new Date(birth);
            const endDate = new Date(birth);
            endDate.setFullYear(birth.getFullYear() + 5);

            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            fetchConclusionsRange({
                MODEL: 'BMI',
                START_TIME: formatDate(startDate),
                END_TIME: formatDate(endDate),
                ID: healthDocumentId,
                AGE_TYPE: ageRange,
                ACTIVE_TAB: activeTab,
                SORT: 'ASC',
                OFFSET: '0',
                LIMIT: '12'
            });
        } else {
            fetchConclusionsRange({
                MODEL: 'BMI',
                START_TIME: startTime,
                END_TIME: endTime,
                ID: healthDocumentId,
                AGE_TYPE: ageRange,
                ACTIVE_TAB: activeTab,
                SORT: 'ASC',
                OFFSET: '0',
                LIMIT: '12'
            });
        }
    }, [ageRange, fetchConclusionsRange, startTime, endTime, healthDocumentId, activeTab, dob, refreshTrigger]);

    // Send data to parent component when rangeData changes
    useEffect(() => {
        if (rangeData?.data?.listData && onDataLoaded) {
            onDataLoaded(rangeData.data.listData[0]);
        }
    }, [rangeData, onDataLoaded]);

    // Updated styles and configurations for PMS alignment
    const PMS_CHART_COLOR = ['#00A9F0CC', '#33C3FFCC', '#99E18CCC', '#FAA781CC', '#EB5447CC'];
    const PMS_LINE_COLOR = ['#1AA8E3', '#FD9602', '#4CCA35', '#F5540A', '#E52A1A'];

    const PMS_WHO_PERCENTILES = {
        WEIGHT_0_5: [
            { name: '-3SD', values: [2.5, 3.4, 4.2, 5.0, 5.7, 6.4] },
            { name: '-2SD', values: [2.9, 3.9, 4.9, 5.8, 6.7, 7.5] },
            { name: 'Median', values: [3.3, 4.5, 5.6, 6.7, 7.8, 8.9] },
            { name: '+2SD', values: [3.8, 5.1, 6.4, 7.7, 9.1, 10.5] },
            { name: '+3SD', values: [4.2, 5.7, 7.1, 8.6, 10.2, 11.8] }
        ],
        HEIGHT_0_5: [
            { name: '-3SD', values: [44.2, 49.8, 54.4, 58.4, 61.8, 65.0] },
            { name: '-2SD', values: [46.1, 52.0, 57.1, 61.4, 65.0, 68.6] },
            { name: 'Median', values: [49.9, 56.7, 62.9, 68.0, 72.8, 77.2] },
            { name: '+2SD', values: [53.7, 61.4, 68.6, 74.5, 80.5, 85.7] },
            { name: '+3SD', values: [55.6, 63.4, 70.6, 76.9, 83.2, 88.9] }
        ]
    };

    const chartConfig = useMemo(() => {
        if (ageRange === BMIAgeRange.FROM_0_LESS_THAN_5) {
            switch (activeTab) {
                case BMIChildrenTabs.Weight:
                    return {
                        title: 'Cân nặng theo tuổi (WHO 2006)',
                        yAxisName: 'Cân nặng (kg)',
                        yMin: 2,
                        yMax: 15,
                        unit: 'kg',
                        referenceLines: PMS_WHO_PERCENTILES.WEIGHT_0_5
                    };
                case BMIChildrenTabs.Height:
                    return {
                        title: 'Chiều cao theo tuổi (WHO 2006)',
                        yAxisName: 'Chiều cao (cm)',
                        yMin: 40,
                        yMax: 95,
                        unit: 'cm',
                        referenceLines: PMS_WHO_PERCENTILES.HEIGHT_0_5
                    };
                default:
                    return null;
            }
        }
        return null;
    }, [ageRange, activeTab]);

    // Ensure markLines is always an array to avoid TypeError
    const option: EChartsOption = useMemo(() => {
        // Prepare chart data from API range
        const chartData = rangeData?.data?.listData || [];

        // Create x-axis data from dates
        const xAxisData = chartData.map((item: any) => {
            const date = new Date(item.DATE);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });

        // Create series data based on active tab
        const seriesData = chartData.map((item: any) => {
            if (activeTab === BMIChildrenTabs.Weight) {
                return item.VALUE_WEIGHT;
            } else if (activeTab === BMIChildrenTabs.Height) {
                return item.VALUE_HEIGHT;
            }
            return item.VALUE;
        });

        const markLines = chartConfig?.referenceLines?.map((ref, index) => ({
            yAxis: ref.values[2], // Median value
            name: ref.name,
            lineStyle: {
                color: PMS_LINE_COLOR[index],
                type: 'dashed',
                width: 1
            },
            label: {
                position: 'end',
                fontSize: 10,
                color: PMS_LINE_COLOR[index],
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: [2, 4],
                borderRadius: 2
            }
        })) || []; // Default to an empty array if undefined

        return {
            title: {
                text: chartConfig?.title,
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#1f2937'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params: any) {
                    const dataItem = chartData[params.dataIndex];
                    if (!dataItem) return '';

                    const value = activeTab === BMIChildrenTabs.Weight
                        ? dataItem.VALUE_WEIGHT
                        : dataItem.VALUE_HEIGHT;
                    const unit = activeTab === BMIChildrenTabs.Weight ? 'kg' : 'cm';

                    return `
                        <div style="padding: 8px;">
                            <div><strong>Ngày:</strong> ${new Date(dataItem.DATE).toLocaleDateString('vi-VN')}</div>
                            <div><strong>${chartConfig?.yAxisName}:</strong> ${value} ${unit}</div>
                            <div style="color: ${dataItem.COLOR}"><strong>Trạng thái:</strong> ${dataItem.TYPE}</div>
                        </div>
                    `;
                }
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLabel: {
                    rotate: 45,
                    fontSize: 11,
                    color: '#6b7280'
                },
                axisLine: {
                    lineStyle: {
                        color: '#e5e7eb'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: chartConfig?.yAxisName,
                min: chartConfig?.yMin,
                max: chartConfig?.yMax,
                nameTextStyle: {
                    color: '#6b7280',
                    fontSize: 12
                },
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
            grid: {
                left: '8%',
                right: '4%',
                bottom: '15%',
                top: '20%',
                containLabel: true
            },
            series: [{
                data: seriesData.map((value: number, index: number) => ({
                    value: value,
                    itemStyle: {
                        color: chartData[index]?.COLOR || '#3b82f6',
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }
                })),
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    color: '#9747ff',
                    width: 2
                },
                label: {
                    show: true,
                    position: 'top',
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: '#000',
                    formatter: function (params: any) {
                        return params.value;
                    }
                },
                markLine: {
                    silent: true,
                    symbol: 'none',
                    data: markLines
                }
            }]
        };
    }, [rangeData, chartConfig, activeTab]);

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