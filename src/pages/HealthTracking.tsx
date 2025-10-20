import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Download, Pin, Share2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetAllHealthDocumentsOfUserQuery } from '@/store/api/healthDocumentApi';
// import { ConclusionModal } from '@/components/modals';
import { BMIUpdateModal, BloodPressureUpdateModal, BloodSugarUpdateModal, UricUpdateModal, LiverUpdateModal, KidneyUpdateModal, LipidUpdateModal } from '@/components/modals/health';
import { toast } from 'react-toastify';

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
    BMI: 'BMI' // Removed WeightHeight for ages 0-5
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
    dob: string;
}

export default function HealthTracking() {
    // States following PMS structure
    const [selectedAccount, setSelectedAccount] = useState<string>('');
    const [selectedIndex, setSelectedIndex] = useState<HealthIndexType>(HealthIndex.BMI);
    const [activeTab, setActiveTab] = useState<BMIChildrenTabsType>(BMIChildrenTabs.Weight);
    const [ageRange, setAgeRange] = useState<BMIAgeRangeType>(BMIAgeRange.FROM_20_LESS_THEN_70);
    const [pinTab, setPinTab] = useState<HealthIndexType | null>(null);
    // const [isConclusionOpen, setConclusionOpen] = useState(false);
    // const [editingConclusion, setEditingConclusion] = useState<HealthConclusion | null>(null);
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [bpVariant, setBpVariant] = useState<'home' | 'facility'>('home');
    const [sugarVariant, setSugarVariant] = useState<'fasting' | 'twoHours' | 'hba1c'>('fasting');
    const [lipidVariant, setLipidVariant] = useState<'total' | 'ldl' | 'hdl' | 'triglyceride'>('total');
    const [liverVariant, setLiverVariant] = useState<'ALT' | 'AST'>('ALT');
    const [kidneyVariant, setKidneyVariant] = useState<'creatinine' | 'urea'>('creatinine');

    // State to hold current chart data (from API range)
    const [currentChartData, setCurrentChartData] = useState<any>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);


    // Fetch accounts from API
    const { data: accountsData, isLoading: accountsLoading } = useGetAllHealthDocumentsOfUserQuery();
    const accounts: Account[] = useMemo(() => {
        if (!accountsData?.data) return [];
        return accountsData.data.map((doc) => ({
            id: String(doc.ID),
            name: doc.IS_MYSELF ? 'Bản thân' : (doc.FULL_NAME || 'Không tên'),
            age: doc.DOB ? (new Date().getFullYear() - new Date(doc.DOB).getFullYear()) : 0,
            accountType: doc.IS_MYSELF ? 'self' : 'link',
            dob: doc.DOB || '',
        }));
    }, [accountsData]);

    // Set default selectedAccount to 'self' (bản thân) if exists, else first account
    useEffect(() => {
        if (!accounts || accounts.length === 0) return;
        // Tìm bản thân
        const selfAccount = accounts.find(acc => acc.accountType === 'self');
        if (selfAccount) {
            setSelectedAccount(selfAccount.id);
        } else {
            setSelectedAccount(accounts[0].id);
        }
    }, [accounts]);

    // Get current account data
    const currentAccount = useMemo(() => {
        if (!accounts || accounts.length === 0) return undefined;
        return accounts.find(acc => acc.id === selectedAccount) || accounts[0];
    }, [selectedAccount, accounts]);

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
        if (!currentAccount) return [];
        return getTrackingOptionsForAge(currentAccount.age);
    }, [currentAccount, getTrackingOptionsForAge]);

    // Get BMI tabs based on age
    const getBMITabsForAge = useCallback((age: number) => {
        if (age < 5) {
            return [
                { label: 'Cân nặng', value: BMIChildrenTabs.Weight },
                { label: 'Chiều cao', value: BMIChildrenTabs.Height }
            ];
        } else {
            return [
                { label: 'BMI', value: BMIChildrenTabs.BMI }
            ];
        }
    }, []);

    const bmiTabs = useMemo(() => {
        if (!currentAccount) return [];
        return getBMITabsForAge(currentAccount.age);
    }, [currentAccount, getBMITabsForAge]);

    // Get age range based on current age
    const getAgeRangeForAge = useCallback((age: number): BMIAgeRangeType => {
        if (age < 5) return BMIAgeRange.FROM_0_LESS_THAN_5;
        if (age < 12) return BMIAgeRange.FROM_5_LESS_THAN_12;
        if (age < 20) return BMIAgeRange.FROM_12_LESS_THAN_20;
        if (age < 70) return BMIAgeRange.FROM_20_LESS_THEN_70;
        return BMIAgeRange.EQUAL_MORE_THAN_70;
    }, []);

    // Update states when account changes: chỉ reset tab khi chuyển nhóm tuổi (<19 <-> >=19)
    const prevAgeGroup = useRef<'child' | 'adult' | null>(null);
    useEffect(() => {
        if (!currentAccount) return;
        const newAgeRange = getAgeRangeForAge(currentAccount.age);
        setAgeRange(newAgeRange);

        const ageGroup: 'child' | 'adult' = currentAccount.age < 19 ? 'child' : 'adult';
        if (prevAgeGroup.current === null) {
            // Lần đầu mount, luôn reset
            prevAgeGroup.current = ageGroup;
            const availableOptions = getTrackingOptionsForAge(currentAccount.age);
            if (availableOptions.length > 0) {
                setSelectedIndex(availableOptions[0].type);
            }
            setActiveTab(currentAccount.age < 5 ? BMIChildrenTabs.Weight : BMIChildrenTabs.BMI);
        } else if (prevAgeGroup.current !== ageGroup) {
            // Chuyển nhóm tuổi, reset tab
            prevAgeGroup.current = ageGroup;
            const availableOptions = getTrackingOptionsForAge(currentAccount.age);
            if (availableOptions.length > 0) {
                setSelectedIndex(availableOptions[0].type);
            }
            setActiveTab(currentAccount.age < 5 ? BMIChildrenTabs.Weight : BMIChildrenTabs.BMI);
        }
        // Nếu chỉ đổi account cùng nhóm tuổi, giữ nguyên tab
    }, [currentAccount, getAgeRangeForAge, getTrackingOptionsForAge]);

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
        if (selectedIndex === HealthIndex.BMI) {
            return (
                <BMIChart
                    ageRange={ageRange}
                    activeTab={activeTab}
                    age={currentAccount?.age ?? 0}
                    healthDocumentId={selectedAccount}
                    dob={currentAccount?.dob ?? ''}
                    onDataLoaded={(data) => setCurrentChartData(data)}
                    refreshTrigger={refreshTrigger}
                />
            );
        }
        const data = getCurrentData();

        switch (selectedIndex) {
            case HealthIndex.BloodPressure:
                return <BloodPressureChart data={data} variant={bpVariant} />;
            case HealthIndex.BloodSugar:
                return <BloodSugarChart data={data} variant={sugarVariant} />;
            case HealthIndex.AcidUric:
                return <UricChart data={data} />;
            case HealthIndex.LiverFunction:
                return <LiverChart data={data} variant={liverVariant} />;
            case HealthIndex.KidneyFunction:
                return <KidneyChart data={data} variant={kidneyVariant} />;
            case HealthIndex.BloodLipid:
                return <CholesterolChart data={data} variant={lipidVariant} />;
            default:
                return <BMIChart ageRange={ageRange} activeTab={activeTab} age={currentAccount?.age ?? 0} healthDocumentId={selectedAccount} dob={currentAccount?.dob ?? ''} refreshTrigger={refreshTrigger} />;
        }
    }, [selectedIndex, getCurrentData, ageRange, activeTab, currentAccount?.age, bpVariant, sugarVariant, lipidVariant, liverVariant, kidneyVariant, selectedAccount, currentAccount?.dob, refreshTrigger]);

    const handleAddClick = () => {
        // Open specific update modal depending on selectedIndex
        setUpdateOpen(true);
    };

    // Handle successful update - refetch data
    const handleUpdateSuccess = () => {
        toast.success('Đã cập nhật chỉ số thành công!');
        setUpdateOpen(false);
        // Trigger chart refresh
        setRefreshTrigger(prev => prev + 1);
    };

    // const submitConclusion = async (payload: HealthConclusion) => {
    //     // TODO: Replace with real API calls depending on selectedIndex (model)
    //     console.log('Create conclusion for', selectedIndex, payload);
    //     toast.success('Đã lưu kết luận');
    // };

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
                                    {accountsLoading && <div className="px-4 py-2">Đang tải...</div>}
                                    {!accountsLoading && accounts.length === 0 && <div className="px-4 py-2">Không có tài khoản</div>}
                                    {!accountsLoading && accounts.map((account) => (
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

                {/* Horizontal Tracking Options Bar - Only for age 19+ (adult with multiple charts) */}
                {currentAccount && currentAccount.age >= 19 && trackingOptions.length > 1 && (
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
                        {selectedIndex === HealthIndex.BMI && currentAccount && currentAccount.age < 19 && (
                            <div className="mb-6">
                                <Tabs value={activeTab as string} onValueChange={(value) => setActiveTab(value as BMIChildrenTabsType)}>
                                    <TabsList className="grid w-full grid-cols-2 ">
                                        {bmiTabs.map((tab) => (
                                            <TabsTrigger key={tab.value} value={tab.value}>
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}

                        {/* Blood Pressure sub-tabs: Home vs Facility */
                        }
                        {selectedIndex === HealthIndex.BloodPressure && (
                            <div className="mb-4">
                                <Tabs value={bpVariant} onValueChange={(v) => setBpVariant(v as 'home' | 'facility')}>
                                    <TabsList className="bg-muted grid grid-cols-2 gap-1 rounded-md p-1">
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="home">Đo tại nhà</TabsTrigger>
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="facility">Cơ sở y tế</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}

                        {/* Blood Sugar sub-tabs: Fasting vs 2-hour vs HbA1c */}
                        {selectedIndex === HealthIndex.BloodSugar && (
                            <div className="mb-4">
                                <Tabs value={sugarVariant} onValueChange={(v) => setSugarVariant(v as 'fasting' | 'twoHours' | 'hba1c')}>
                                    <TabsList className="bg-muted grid grid-cols-3 gap-1 rounded-md p-1">
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="fasting">Lúc đói</TabsTrigger>
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="twoHours">Sau 2 giờ uống</TabsTrigger>
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="hba1c">HbA1c</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}

                        {/* Blood Lipid sub-tabs */
                        }
                        {selectedIndex === HealthIndex.BloodLipid && (
                            <div className="mb-4">
                                <Tabs value={lipidVariant} onValueChange={(v) => setLipidVariant(v as any)}>
                                    <TabsList className="bg-muted grid grid-cols-4 gap-1 rounded-md p-1">
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="total">Cholesterol</TabsTrigger>
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="ldl">LDL</TabsTrigger>
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="hdl">HDL</TabsTrigger>
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="triglyceride">Triglyceride</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}

                        {/* Liver function sub-tabs */
                        }
                        {selectedIndex === HealthIndex.LiverFunction && (
                            <div className="mb-4">
                                <Tabs value={liverVariant} onValueChange={(v) => setLiverVariant(v as 'ALT' | 'AST')}>
                                    <TabsList className="bg-muted grid grid-cols-2 gap-1 rounded-md p-1">
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="ALT">ALT</TabsTrigger>
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="AST">AST</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}

                        {/* Kidney function sub-tabs */
                        }
                        {selectedIndex === HealthIndex.KidneyFunction && (
                            <div className="mb-4">
                                <Tabs value={kidneyVariant} onValueChange={(v) => setKidneyVariant(v as 'creatinine' | 'urea')}>
                                    <TabsList className="bg-muted grid grid-cols-2 gap-1 rounded-md p-1">
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="creatinine">Creatinine</TabsTrigger>
                                        <TabsTrigger className="data-[state=active]:bg-green-500 data-[state=active]:text-white" value="urea">Urea</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}

                        {/* Chart Container */}
                        <div className="h-96 w-full">
                            {renderChart()}
                        </div>

                        {/* Footer actions under chart */}
                        <div className="mt-4 flex items-center justify-center cursor-pointer">
                            <Button onClick={handleAddClick} className="cursor-pointer bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white px-8">
                                Cập nhật chỉ số
                            </Button>
                        </div>

                        {/* Specific update modals per tab */}
                        {selectedIndex === HealthIndex.BMI && (
                            <BMIUpdateModal
                                isOpen={isUpdateOpen}
                                onClose={() => setUpdateOpen(false)}
                                onSubmit={async (payload) => {
                                    console.log('BMI update', payload);
                                    handleUpdateSuccess();
                                }}
                                ageType={ageRange} // Pass ageType prop
                                healthDocumentId={Number(selectedAccount)} // Pass healthDocumentId prop
                            />
                        )}
                        {selectedIndex === HealthIndex.BloodPressure && (
                            <BloodPressureUpdateModal
                                isOpen={isUpdateOpen}
                                onClose={() => setUpdateOpen(false)}
                                onSubmit={async (payload) => {
                                    console.log('BP update', payload);
                                    handleUpdateSuccess();
                                }}
                            />
                        )}
                        {selectedIndex === HealthIndex.BloodSugar && (
                            <BloodSugarUpdateModal
                                isOpen={isUpdateOpen}
                                onClose={() => setUpdateOpen(false)}
                                onSubmit={async (payload) => {
                                    console.log('Sugar update', payload);
                                    handleUpdateSuccess();
                                }}
                            />
                        )}
                        {selectedIndex === HealthIndex.AcidUric && (
                            <UricUpdateModal
                                isOpen={isUpdateOpen}
                                onClose={() => setUpdateOpen(false)}
                                onSubmit={async (payload) => {
                                    console.log('Uric update', payload);
                                    handleUpdateSuccess();
                                }}
                            />
                        )}
                        {selectedIndex === HealthIndex.LiverFunction && (
                            <LiverUpdateModal
                                isOpen={isUpdateOpen}
                                onClose={() => setUpdateOpen(false)}
                                onSubmit={async (payload) => {
                                    console.log('Liver update', payload);
                                    handleUpdateSuccess();
                                }}
                            />
                        )}
                        {selectedIndex === HealthIndex.KidneyFunction && (
                            <KidneyUpdateModal
                                isOpen={isUpdateOpen}
                                onClose={() => setUpdateOpen(false)}
                                onSubmit={async (payload) => {
                                    console.log('Kidney update', payload);
                                    handleUpdateSuccess();
                                }}
                            />
                        )}
                        {selectedIndex === HealthIndex.BloodLipid && (
                            <LipidUpdateModal
                                isOpen={isUpdateOpen}
                                onClose={() => setUpdateOpen(false)}
                                onSubmit={async (payload) => {
                                    console.log('Lipid update', payload);
                                    handleUpdateSuccess();
                                }}
                            />
                        )}
                    </Card>

                    {/* Summary and Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Tóm tắt</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giá trị mới nhất:</span>
                                    <span className="font-medium">
                                        {currentChartData ? (
                                            selectedIndex === HealthIndex.BMI && activeTab === BMIChildrenTabs.Weight
                                                ? `${currentChartData.VALUE_WEIGHT} kg`
                                                : selectedIndex === HealthIndex.BMI && activeTab === BMIChildrenTabs.Height
                                                    ? `${currentChartData.VALUE_HEIGHT} cm`
                                                    : currentChartData.VALUE || '22.5'
                                        ) : '22.5'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <Badge
                                        variant="secondary"
                                        style={{
                                            backgroundColor: currentChartData?.COLOR || '#e5e7eb',
                                            color: '#fff'
                                        }}
                                    >
                                        {currentChartData?.TYPE || 'Bình thường'}
                                    </Badge>
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
                                {currentChartData?.RECOMMEND ? (
                                    <div
                                        className="text-sm text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: currentChartData.RECOMMEND }}
                                    />
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600">
                                            • Duy trì chế độ ăn cân bằng
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            • Tập thể dục đều đặn 150 phút/tuần
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            • Theo dõi định kỳ hàng tuần
                                        </p>
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
