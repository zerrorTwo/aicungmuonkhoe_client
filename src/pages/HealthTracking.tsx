import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Download, Pin, Share2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Import chart components following PMS structure
import BMIChart from './charts/BMIChart';
import { BloodPressureChart } from './charts/BloodPressureChart';
import { BloodSugarChart } from './charts/BloodSugarChart';
import { CholesterolChart } from './charts/CholesterolChart';
import { KidneyChart } from './charts/KidneyChart';
import { LiverChart } from './charts/LiverChart';
import { UricChart } from './charts/UricChart';

import { mockHealthData } from './data/mockHealthData';
import type { HealthDataPoint } from './types/healthTypes';

// Constants following PMS structure
const HealthIndex = {
    BMI: 'BMI',
    BloodPressure: 'BloodPressure',
    BloodSugar: 'BloodSugar',
    AcidUric: 'AcidUric',
    LiverFunction: 'LiverFunction',
    KidneyFunction: 'KidneyFunction',
    BloodLipid: 'BloodLipid'
} as const;

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

type HealthIndexType = typeof HealthIndex[keyof typeof HealthIndex];
type BMIAgeRangeType = typeof BMIAgeRange[keyof typeof BMIAgeRange];
type BMIChildrenTabsType = typeof BMIChildrenTabs[keyof typeof BMIChildrenTabs];

// Constants following PMS structure
const TRACKING_OPTIONS = [
    {
        label: 'Huyết áp',
        value: 'BloodPressure',
        type: HealthIndex.BloodPressure
    },
    {
        label: 'BMI',
        value: 'BMI',
        type: HealthIndex.BMI
    },
    {
        label: 'Đường huyết',
        value: 'BloodSugar',
        type: HealthIndex.BloodSugar
    },
    {
        label: 'Axit uric',
        value: 'AcidUric',
        type: HealthIndex.AcidUric
    },
    {
        label: 'Chức năng gan',
        value: 'LiverFunction',
        type: HealthIndex.LiverFunction
    },
    {
        label: 'Chức năng thận',
        value: 'KidneyFunction',
        type: HealthIndex.KidneyFunction
    },
    {
        label: 'Mỡ máu',
        value: 'BloodLipid',
        type: HealthIndex.BloodLipid
    }
];

interface Account {
    id: string;
    name: string;
    age: number;
    accountType: 'self' | 'link';
}

export default function HealthTracking() {
    // States following PMS structure
    const [selectedAccount, setSelectedAccount] = useState<string>('self');
    const [selectedIndex, setSelectedIndex] = useState<HealthIndexType>(HealthIndex.BMI);
    const [activeTab, setActiveTab] = useState<BMIChildrenTabsType>(BMIChildrenTabs.Weight);
    const [ageRange, setAgeRange] = useState<BMIAgeRangeType>(BMIAgeRange.FROM_20_LESS_THEN_70);
    const [pinTab, setPinTab] = useState<HealthIndexType | null>(null);

    // Mock accounts data
    const accounts: Account[] = [
        { id: 'self', name: 'Tôi (25 tuổi)', age: 25, accountType: 'self' },
        { id: 'spouse', name: 'Vợ/Chồng (28 tuổi)', age: 28, accountType: 'link' },
        { id: 'child1', name: 'Con trai (16 tuổi)', age: 16, accountType: 'link' },
        { id: 'child2', name: 'Con gái (3 tuổi)', age: 3, accountType: 'link' },
        { id: 'parent', name: 'Bố/Mẹ (58 tuổi)', age: 58, accountType: 'link' },
    ];

    // Get current account data
    const currentAccount = useMemo(() => {
        return accounts.find(acc => acc.id === selectedAccount) || accounts[0];
    }, [selectedAccount]);

    // Get tracking options based on age - following PMS logic
    const getTrackingOptionsForAge = useCallback((age: number) => {
        if (age < 5) {
            // 0-5 tuổi: chỉ có Weight, Height, Weight-Height (thông qua BMI)
            return [TRACKING_OPTIONS.find(opt => opt.type === HealthIndex.BMI)!];
        } else if (age < 19) {
            // 5-19 tuổi: chỉ có BMI
            return [TRACKING_OPTIONS.find(opt => opt.type === HealthIndex.BMI)!];
        } else {
            // 19+ tuổi: có tất cả
            return TRACKING_OPTIONS;
        }
    }, []);

    const trackingOptions = useMemo(() => {
        return getTrackingOptionsForAge(currentAccount.age);
    }, [currentAccount.age, getTrackingOptionsForAge]);

    // Get BMI tabs based on age
    const getBMITabsForAge = useCallback((age: number) => {
        if (age < 5) {
            return [
                { label: 'Cân nặng', value: BMIChildrenTabs.Weight },
                { label: 'Chiều cao', value: BMIChildrenTabs.Height },
                { label: 'Cân nặng theo chiều cao', value: BMIChildrenTabs.WeightHeight },
            ];
        } else {
            return [
                { label: 'BMI', value: BMIChildrenTabs.BMI },
            ];
        }
    }, []);

    const bmiTabs = useMemo(() => {
        return getBMITabsForAge(currentAccount.age);
    }, [currentAccount.age, getBMITabsForAge]);

    // Get age range based on current age
    const getAgeRangeForAge = useCallback((age: number): BMIAgeRangeType => {
        if (age < 5) return BMIAgeRange.FROM_0_LESS_THAN_5;
        if (age < 12) return BMIAgeRange.FROM_5_LESS_THAN_12;
        if (age < 20) return BMIAgeRange.FROM_12_LESS_THAN_20;
        if (age < 70) return BMIAgeRange.FROM_20_LESS_THEN_70;
        return BMIAgeRange.EQUAL_MORE_THAN_70;
    }, []);

    // Update states when account changes
    useEffect(() => {
        const newAgeRange = getAgeRangeForAge(currentAccount.age);
        setAgeRange(newAgeRange);

        // Reset to first available tracking option
        const availableOptions = getTrackingOptionsForAge(currentAccount.age);
        if (availableOptions.length > 0) {
            setSelectedIndex(availableOptions[0].type);
        }

        // Reset to first available BMI tab for 0-5 age group
        if (currentAccount.age < 5) {
            setActiveTab(BMIChildrenTabs.Weight);
        } else {
            setActiveTab(BMIChildrenTabs.BMI);
        }
    }, [currentAccount.age, getAgeRangeForAge, getTrackingOptionsForAge]);

    // Get chart data
    const getCurrentData = useCallback((): HealthDataPoint[] => {
        switch (selectedIndex) {
            case HealthIndex.BMI:
                return mockHealthData.bmi;
            case HealthIndex.BloodPressure:
                return mockHealthData.bloodPressure;
            case HealthIndex.BloodSugar:
                return mockHealthData.bloodSugar;
            case HealthIndex.AcidUric:
                return mockHealthData.bloodSugar; // Use as placeholder
            case HealthIndex.LiverFunction:
                return mockHealthData.bloodPressure; // Use as placeholder
            case HealthIndex.KidneyFunction:
                return mockHealthData.heartRate; // Use as placeholder
            case HealthIndex.BloodLipid:
                return mockHealthData.bmi; // Use as placeholder
            default:
                return mockHealthData.bmi;
        }
    }, [selectedIndex]);

    // Render chart component
    const renderChart = useCallback(() => {
        const data = getCurrentData();

        switch (selectedIndex) {
            case HealthIndex.BMI:
                return (
                    <BMIChart
                        data={data}
                        ageRange={ageRange}
                        activeTab={activeTab}
                        age={currentAccount.age}
                    />
                );
            case HealthIndex.BloodPressure:
                return <BloodPressureChart data={data} />;
            case HealthIndex.BloodSugar:
                return <BloodSugarChart data={data} />;
            case HealthIndex.AcidUric:
                return <UricChart data={data} />;
            case HealthIndex.LiverFunction:
                return <LiverChart data={data} />;
            case HealthIndex.KidneyFunction:
                return <KidneyChart data={data} />;
            case HealthIndex.BloodLipid:
                return <CholesterolChart data={data} />;
            default:
                return <BMIChart data={data} ageRange={ageRange} activeTab={activeTab} age={currentAccount.age} />;
        }
    }, [selectedIndex, getCurrentData, ageRange, activeTab, currentAccount.age]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Theo dõi sức khỏe
                            </h1>
                            <p className="text-gray-600">
                                Quản lý và theo dõi tình trạng sức khỏe của bạn và gia đình
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Account Selection */}
                            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger >
                                <SelectContent className='bg-white'>
                                    {accounts.map((account) => (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Xuất PDF
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Chia sẻ
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Horizontal Tracking Options Bar - Only for age 20+ */}
                {currentAccount.age >= 20 && (
                    <Card className="p-4 mb-6">
                        <Tabs value={selectedIndex} onValueChange={(value) => setSelectedIndex(value as HealthIndexType)} className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-muted">
                                {trackingOptions.map((option) => (
                                    <TabsTrigger
                                        key={option.value}
                                        value={option.type}
                                        className="data-[state=active]:bg-green-500 data-[state=active]:text-white cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            {pinTab === option.type && <Pin className="h-3 w-3" />}
                                            {option.label}
                                        </div>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </Card>
                )}

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Chart Section */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {trackingOptions.find(opt => opt.type === selectedIndex)?.label}
                                </h3>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    30 ngày gần nhất
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Lọc thời gian
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPinTab(pinTab === selectedIndex ? null : selectedIndex)}
                                >
                                    <Pin className={`h-4 w-4 ${pinTab === selectedIndex ? 'text-blue-600' : ''}`} />
                                </Button>
                            </div>
                        </div>

                        {/* BMI Tabs for children */}
                        {selectedIndex === HealthIndex.BMI && currentAccount.age < 19 && (
                            <div className="mb-6">
                                <Tabs value={activeTab as string} onValueChange={(value) => setActiveTab(value as BMIChildrenTabsType)}>
                                    <TabsList className="grid w-full grid-cols-3">
                                        {bmiTabs.map((tab) => (
                                            <TabsTrigger key={tab.value} value={tab.value}>
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}

                        {/* Chart Container */}
                        <div className="h-96 w-full">
                            {renderChart()}
                        </div>
                    </Card>

                    {/* Summary and Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Tóm tắt</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giá trị mới nhất:</span>
                                    <span className="font-medium">22.5</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <Badge variant="secondary">Bình thường</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Xu hướng:</span>
                                    <span className="text-green-600">↗ Tăng nhẹ</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Khuyến nghị</h4>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    • Duy trì chế độ ăn cân bằng
                                </p>
                                <p className="text-sm text-gray-600">
                                    • Tập thể dục đều đặn 150 phút/tuần
                                </p>
                                <p className="text-sm text-gray-600">
                                    • Theo dõi định kỳ hàng tuần
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
