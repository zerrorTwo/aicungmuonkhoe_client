import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectItem } from "@/components/ui/select"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BMIAgeRange as BMIAgeRangeEnum,
  BMIChildrenTabs as BMIChildrenTabsEnum,
  BloodLipidTabs,
  BloodPressureTabs,
  BloodSugarTabs,
  KidneyFunctionTabs,
  LiverFunctionTabs,
} from "@/enum/health"
import { useGetAllHealthDocumentsOfUserQuery } from "@/store/api/healthDocumentApi"
import { Calendar, Clock, Download, Info, Pin, Share2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
// import { ConclusionModal } from '@/components/modals';
import {
  BMIUpdateModal,
  BloodPressureUpdateModal,
  BloodSugarUpdateModal,
  ChartInstructionModal,
  KidneyUpdateModal,
  LipidUpdateModal,
  LiverUpdateModal,
  UricUpdateModal,
} from "@/components/modals/health"
import { useHealthConclusions } from "@/hooks/useHealthConclusions"
import { toast } from "react-toastify"
import { useDeleteConclusionClientMutation } from "@/store/api/conclusionApi"

// Import advanced chart components with WHO standards
import AcidUricChart from "@/components/health/charts/acid-uric.chart"
import BloodLipidChart from "@/components/health/charts/blood-lipid.chart"
import BloodPressureChart from "@/components/health/charts/blood-pressure.chart"
import BloodSugarChart from "@/components/health/charts/blood-sugar.chart"
import BMIChart from "@/components/health/charts/bmi.chart"
import KidneyFunctionChart from "@/components/health/charts/kidney-function.chart"
import LiverFunctionChart from "@/components/health/charts/liver-function.chart"
import HistoryList from "@/components/health/HistoryList"

// Constants following PMS structure
const HealthIndex = {
  BMI: "BMI",
  BloodPressure: "BLOOD_PRESSURE",
  BloodSugar: "BLOOD_SUGAR",
  AcidUric: "ACID_URIC",
  LiverFunction: "LIVER_FUNCTION",
  KidneyFunction: "KIDNEY_FUNCTION",
  BloodLipid: "BLOOD_LIPID",
} as const

type HealthIndexType = (typeof HealthIndex)[keyof typeof HealthIndex]

// Constants following PMS structure
const TRACKING_OPTIONS = [
  {
    label: "Huyết áp",
    value: "BloodPressure",
    type: HealthIndex.BloodPressure,
  },
  {
    label: "BMI",
    value: "BMI",
    type: HealthIndex.BMI,
  },
  {
    label: "Đường huyết",
    value: "BloodSugar",
    type: HealthIndex.BloodSugar,
  },
  {
    label: "Axit uric",
    value: "AcidUric",
    type: HealthIndex.AcidUric,
  },
  {
    label: "Chức năng gan",
    value: "LiverFunction",
    type: HealthIndex.LiverFunction,
  },
  {
    label: "Chức năng thận",
    value: "KidneyFunction",
    type: HealthIndex.KidneyFunction,
  },
  {
    label: "Mỡ máu",
    value: "BloodLipid",
    type: HealthIndex.BloodLipid,
  },
]

interface Account {
  id: string
  name: string
  age: number
  accountType: "self" | "link"
  dob: string
}

export default function HealthTracking() {
  // URL parameters and navigation
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // States following PMS structure
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [selectedIndex, setSelectedIndex] = useState<HealthIndexType>(
    HealthIndex.BMI
  )
  const [activeTab, setActiveTab] = useState<BMIChildrenTabsEnum>(
    BMIChildrenTabsEnum.Weight
  )
  const [ageRange, setAgeRange] = useState<BMIAgeRangeEnum>(
    BMIAgeRangeEnum.FROM_20_LESS_THEN_70
  )
  const [pinTab, setPinTab] = useState<HealthIndexType | null>(null)
  // const [isConclusionOpen, setConclusionOpen] = useState(false);
  // const [editingConclusion, setEditingConclusion] = useState<HealthConclusion | null>(null);
  const [isUpdateOpen, setUpdateOpen] = useState(false)
  const [isInstructionOpen, setInstructionOpen] = useState(false)
  const [bpVariant, setBpVariant] = useState<BloodPressureTabs>(
    BloodPressureTabs.Home
  )
  const [sugarVariant, setSugarVariant] = useState<BloodSugarTabs>(
    BloodSugarTabs.Hungry
  )
  const [lipidVariant, setLipidVariant] = useState<BloodLipidTabs>(
    BloodLipidTabs.Cholesterol
  )
  const [liverVariant, setLiverVariant] = useState<LiverFunctionTabs>(
    LiverFunctionTabs.SGPT
  )
  const [kidneyVariant, setKidneyVariant] = useState<KidneyFunctionTabs>(
    KidneyFunctionTabs.Creatinine
  )
  const [editingItem, setEditingItem] = useState<any>(null)

  // State to hold current chart data (from API range)
  // const [currentChartData, setCurrentChartData] = useState<any>(null);
  // const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Delete mutation
  const [deleteConclusion] = useDeleteConclusionClientMutation()

  // Fetch accounts from API
  const { data: accountsData, isLoading: accountsLoading } =
    useGetAllHealthDocumentsOfUserQuery()

  const accounts: Account[] = useMemo(() => {
    if (!accountsData?.data) return []
    return accountsData.data.map((doc) => ({
      id: String(doc.ID),
      name: doc.IS_MYSELF ? "Bản thân" : doc.FULL_NAME || "Không tên",
      age: doc.DOB
        ? new Date().getFullYear() - new Date(doc.DOB).getFullYear()
        : 0,
      accountType: doc.IS_MYSELF ? "self" : "link",
      dob: doc.DOB || "",
    }))
  }, [accountsData])

  // Initialize selectedAccount from URL parameter or default to 'self'
  useEffect(() => {
    console.log('=== URL INIT EFFECT ===')
    console.log('accounts:', accounts?.length)
    console.log('URL id:', id)
    console.log('current selectedAccount:', selectedAccount)

    if (!accounts || accounts.length === 0) return

    // If URL has ID parameter, use it
    if (id) {
      const accountExists = accounts.find((acc) => acc.id === id)
      console.log('Account exists for URL id?', !!accountExists)
      if (accountExists) {
        console.log('Setting selectedAccount from URL:', id)
        // Only update if different to trigger refetch
        if (selectedAccount !== id) {
          setSelectedAccount(id)
        }
        return
      }
    }

    // Otherwise, default to 'self' or first account
    const selfAccount = accounts.find((acc) => acc.accountType === "self")
    const defaultId = selfAccount ? selfAccount.id : accounts[0].id
    console.log('Setting default selectedAccount:', defaultId)

    // Only update if different
    if (selectedAccount !== defaultId) {
      setSelectedAccount(defaultId)
      // Update URL to reflect the default selection
      navigate(`/health-tracking/${defaultId}`, { replace: true })
    }
  }, [accounts, id, navigate, selectedAccount])

  // Get current account data
  const currentAccount = useMemo(() => {
    if (!accounts || accounts.length === 0) return undefined
    return accounts.find((acc) => acc.id === selectedAccount) || accounts[0]
  }, [selectedAccount, accounts])

  // Get tracking options based on age - following PMS logic
  const getTrackingOptionsForAge = useCallback((age: number) => {
    if (age < 5) {
      // 0-5 tuổi: chỉ có Weight, Height, Weight-Height (thông qua BMI)
      return [TRACKING_OPTIONS.find((opt) => opt.type === HealthIndex.BMI)!]
    } else if (age < 19) {
      // 5-19 tuổi: chỉ có BMI
      return [TRACKING_OPTIONS.find((opt) => opt.type === HealthIndex.BMI)!]
    } else {
      // 19+ tuổi: có tất cả
      return TRACKING_OPTIONS
    }
  }, [])

  const trackingOptions = useMemo(() => {
    if (!currentAccount) return []
    return getTrackingOptionsForAge(currentAccount.age)
  }, [currentAccount, getTrackingOptionsForAge])

  // Get BMI tabs based on age
  const getBMITabsForAge = useCallback((age: number) => {
    if (age < 5) {
      return [
        { label: "Cân nặng", value: BMIChildrenTabsEnum.Weight },
        { label: "Chiều cao", value: BMIChildrenTabsEnum.Height },
      ]
    } else {
      return [{ label: "BMI", value: BMIChildrenTabsEnum.BMI }]
    }
  }, [])

  const bmiTabs = useMemo(() => {
    if (!currentAccount) return []
    return getBMITabsForAge(currentAccount.age)
  }, [currentAccount, getBMITabsForAge])

  // Get age range based on current age
  const getAgeRangeForAge = useCallback((age: number): BMIAgeRangeEnum => {
    if (age < 5) return BMIAgeRangeEnum.FROM_0_LESS_THAN_5
    if (age < 12) return BMIAgeRangeEnum.FROM_5_LESS_THAN_12
    if (age < 20) return BMIAgeRangeEnum.FROM_12_LESS_THAN_20
    if (age < 70) return BMIAgeRangeEnum.FROM_20_LESS_THEN_70
    return BMIAgeRangeEnum.EQUAL_MORE_THAN_70
  }, [])

  // Update states when account changes: chỉ reset tab khi chuyển nhóm tuổi (<19 <-> >=19)
  const prevAgeGroup = useRef<"child" | "adult" | null>(null)
  useEffect(() => {
    if (!currentAccount) return
    const newAgeRange = getAgeRangeForAge(currentAccount.age)
    setAgeRange(newAgeRange)

    const ageGroup: "child" | "adult" =
      currentAccount.age < 19 ? "child" : "adult"
    if (prevAgeGroup.current === null) {
      // Lần đầu mount, luôn reset
      prevAgeGroup.current = ageGroup
      const availableOptions = getTrackingOptionsForAge(currentAccount.age)
      if (availableOptions.length > 0) {
        setSelectedIndex(availableOptions[0].type)
      }
      setActiveTab(
        currentAccount.age < 5
          ? BMIChildrenTabsEnum.Weight
          : BMIChildrenTabsEnum.BMI
      )
    } else if (prevAgeGroup.current !== ageGroup) {
      // Chuyển nhóm tuổi, reset tab
      prevAgeGroup.current = ageGroup
      const availableOptions = getTrackingOptionsForAge(currentAccount.age)
      if (availableOptions.length > 0) {
        setSelectedIndex(availableOptions[0].type)
      }
      setActiveTab(
        currentAccount.age < 5
          ? BMIChildrenTabsEnum.Weight
          : BMIChildrenTabsEnum.BMI
      )
    }
    // Nếu chỉ đổi account cùng nhóm tuổi, giữ nguyên tab
  }, [currentAccount, getAgeRangeForAge, getTrackingOptionsForAge])

  // Reset pagination when account or chart changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedAccount, selectedIndex, activeTab])

  // Get chart data - kept for backward compatibility but not used
  /*
    const getCurrentData = useCallback(): HealthDataPoint[] => {
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
    */

  // State to hold current chart data (from API range)
  // const [currentChartData, setCurrentChartData] = useState<any>(null);
  // const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)

  // Compute current active tab based on selected index
  const currentActiveTab = useMemo(() => {
    switch (selectedIndex) {
      case HealthIndex.BloodPressure:
        return bpVariant
      case HealthIndex.BloodSugar:
        return sugarVariant
      case HealthIndex.BloodLipid:
        return lipidVariant
      case HealthIndex.LiverFunction:
        return liverVariant
      case HealthIndex.KidneyFunction:
        return kidneyVariant
      case HealthIndex.BMI:
        return activeTab
      default:
        return ""
    }
  }, [selectedIndex, bpVariant, sugarVariant, lipidVariant, liverVariant, kidneyVariant, activeTab])

  // Fetch health data based on selected index
  const {
    conclusions, // For chart
    paginatedConclusions, // For history list
    totalPages,
    isLoading: dataLoading,
    isPaginationLoading,
    refetch,
  } = useHealthConclusions({
    healthDocumentId: selectedAccount,
    model: selectedIndex,
    ageType: ageRange,
    activeTab: currentActiveTab,
    page: currentPage,
    pageSize,
    enabled: !!selectedAccount && !!selectedIndex,
  })

  // Refetch data when account changes (including URL changes)
  useEffect(() => {
    if (selectedAccount && selectedIndex) {
      console.log('Account changed, refetching data for ID:', selectedAccount)
      refetch()
    }
  }, [selectedAccount, selectedIndex, refetch])

  // Render chart component
  const renderChart = useCallback(() => {
    if (selectedIndex === HealthIndex.BMI) {
      return (
        <BMIChart
          loading={dataLoading}
          ageRange={ageRange}
          activeTab={activeTab}
          age={currentAccount?.age ?? 0}
          conclusionList={conclusions}
        />
      )
    }

    switch (selectedIndex) {
      case HealthIndex.BloodPressure:
        return (
          <BloodPressureChart
            loading={dataLoading}
            conclusionList={conclusions}
            type={bpVariant}
          />
        )
      case HealthIndex.BloodSugar:
        return (
          <BloodSugarChart
            loading={dataLoading}
            conclusionList={conclusions}
            type={sugarVariant}
          />
        )
      case HealthIndex.AcidUric:
        return (
          <AcidUricChart
            loading={dataLoading}
            conclusionList={conclusions}
            gender="nam"
          />
        )
      case HealthIndex.LiverFunction:
        return (
          <LiverFunctionChart
            loading={dataLoading}
            conclusionList={conclusions}
            type={liverVariant}
          />
        )
      case HealthIndex.KidneyFunction:
        return (
          <KidneyFunctionChart
            loading={dataLoading}
            conclusionList={conclusions}
            type={kidneyVariant}
          />
        )
      case HealthIndex.BloodLipid:
        return (
          <BloodLipidChart
            loading={dataLoading}
            conclusionList={conclusions}
            type={lipidVariant}
          />
        )
      default:
        return (
          <BMIChart
            loading={dataLoading}
            ageRange={ageRange}
            activeTab={activeTab}
            age={currentAccount?.age ?? 0}
            conclusionList={conclusions}
          />
        )
    }
  }, [
    selectedIndex,
    ageRange,
    activeTab,
    currentAccount?.age,
    bpVariant,
    sugarVariant,
    lipidVariant,
    liverVariant,
    kidneyVariant,
    conclusions,
    dataLoading,
  ])

  const handleAddClick = () => {
    // Open specific update modal depending on selectedIndex
    setUpdateOpen(true)
  }

  // Handle successful update - refetch data
  const handleUpdateSuccess = () => {
    toast.success("Đã cập nhật chỉ số thành công!")
    setUpdateOpen(false)
    // Trigger chart refresh by refetching data
    refetch()
  }

  // Handle account selection change - update both state and URL
  const handleAccountChange = (accountId: string) => {
    console.log('=== HANDLE ACCOUNT CHANGE ===')
    console.log('New account ID:', accountId)
    console.log('Previous selectedAccount:', selectedAccount)
    setSelectedAccount(accountId)
    navigate(`/health-tracking/${accountId}`)
  }

  // const submitConclusion = async (payload: HealthConclusion) => {
  //     // TODO: Replace with real API calls depending on selectedIndex (model)
  //     console.log('Create conclusion for', selectedIndex, payload);
  //     toast.success('Đã lưu kết luận');
  // };

  // Handler for editing history item
  const handleEditHistoryItem = (item: any) => {
    console.log("Edit item:", item)
    setEditingItem(item)

    // Map model to appropriate modal and set variant
    const model = item.model || item.MODEL

    // Determine which modal to open based on model
    if (model === 'BMI') {
      // BMI modal doesn't need variant
      setUpdateOpen(true)
      setSelectedIndex(HealthIndex.BMI)
    } else if (model === 'HOME' || model === 'HOSPITAL') {
      // Blood Pressure
      setBpVariant(model === 'HOME' ? BloodPressureTabs.Home : BloodPressureTabs.Hospital)
      setSelectedIndex(HealthIndex.BloodPressure)
      setUpdateOpen(true)
    } else if (model === 'HUNGRY' || model === 'TWO_HOURS' || model === 'HBA1C') {
      // Blood Sugar
      if (model === 'HUNGRY') setSugarVariant(BloodSugarTabs.Hungry)
      else if (model === 'TWO_HOURS') setSugarVariant(BloodSugarTabs.TwoHours)
      else if (model === 'HBA1C') setSugarVariant(BloodSugarTabs.HbA1c)
      setSelectedIndex(HealthIndex.BloodSugar)
      setUpdateOpen(true)
    } else if (model === 'ACID_URIC' || model === 'AXIT_URIC') {
      // Uric Acid
      setSelectedIndex(HealthIndex.AcidUric)
      setUpdateOpen(true)
    } else if (model === 'SGPT' || model === 'SGOT') {
      // Liver Function
      setLiverVariant(model === 'SGPT' ? LiverFunctionTabs.SGPT : LiverFunctionTabs.SGOT)
      setSelectedIndex(HealthIndex.LiverFunction)
      setUpdateOpen(true)
    } else if (model === 'CREA' || model === 'URE') {
      // Kidney Function
      setKidneyVariant(model === 'CREA' ? KidneyFunctionTabs.Creatinine : KidneyFunctionTabs.Ure)
      setSelectedIndex(HealthIndex.KidneyFunction)
      setUpdateOpen(true)
    } else if (model === 'CHOL' || model === 'LDL' || model === 'HDL' || model === 'TRIGLYCERIDE') {
      // Blood Lipid
      if (model === 'CHOL') setLipidVariant(BloodLipidTabs.Cholesterol)
      else if (model === 'LDL') setLipidVariant(BloodLipidTabs.LDL)
      else if (model === 'HDL') setLipidVariant(BloodLipidTabs.HDL)
      else if (model === 'TRIGLYCERIDE') setLipidVariant(BloodLipidTabs.Triglyceride)
      setSelectedIndex(HealthIndex.BloodLipid)
      setUpdateOpen(true)
    }
  }

  // Handler for deleting history item
  const handleDeleteHistoryItem = async (itemId: number | string) => {
    try {
      await deleteConclusion(itemId).unwrap()
      toast.success("Xóa bản ghi thành công!")
      // Explicitly refetch data to ensure UI updates immediately
      await refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || "Xóa thất bại!")
      console.error("Delete error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Theo dõi sức khỏe
              </h1>
              <p className="text-gray-600">
                Quản lý và theo dõi tình trạng sức khỏe của bạn và gia đình
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Account Selection */}
              <Select
                value={selectedAccount}
                onValueChange={handleAccountChange}
                className="w-48"
                loading={accountsLoading}
              >
                {!accountsLoading &&
                  accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
              </Select>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="small">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất PDF
                </Button>
                <Button variant="outline" size="small">
                  <Share2 className="mr-2 h-4 w-4" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Tracking Options Bar - Only for age 19+ (adult with multiple charts) */}
        {currentAccount &&
          currentAccount.age >= 19 &&
          trackingOptions.length > 1 && (
            <div className="mb-6 p-4">
              <TabsList className="flex flex-wrap justify-between gap-2">
                {trackingOptions.map((option) => (
                  <TabsTrigger
                    key={option.value}
                    value={option.type}
                    active={selectedIndex === option.type}
                    borderRadius={true}
                    onClick={() => setSelectedIndex(option.type)}
                  >
                    {pinTab === option.type && <Pin className="h-3 w-3" />}
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Chart Section */}
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {
                    trackingOptions.find((opt) => opt.type === selectedIndex)
                      ?.label
                  }
                </h3>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  30 ngày gần nhất
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="small">
                  <Clock className="mr-2 h-4 w-4" />
                  Lọc thời gian
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setInstructionOpen(true)}
                >
                  <Info className="mr-2 h-4 w-4" />
                  Hướng dẫn
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() =>
                    setPinTab(pinTab === selectedIndex ? null : selectedIndex)
                  }
                >
                  <Pin
                    className={`h-4 w-4 ${pinTab === selectedIndex ? "text-blue-600" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {/* BMI Tabs for children */}
            {selectedIndex === HealthIndex.BMI &&
              currentAccount &&
              currentAccount.age < 19 && (
                <div className="mb-6">
                  <TabsList>
                    {bmiTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        active={activeTab === tab.value}
                        borderRadius={true}
                        onClick={() => setActiveTab(tab.value)}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              )}

            {/* Blood Pressure sub-tabs: Home vs Facility */}
            {selectedIndex === HealthIndex.BloodPressure && (
              <div className="mb-4">
                <TabsList>
                  <TabsTrigger
                    value={BloodPressureTabs.Home}
                    active={bpVariant === BloodPressureTabs.Home}
                    borderRadius={true}
                    onClick={() => setBpVariant(BloodPressureTabs.Home)}
                  >
                    Đo tại nhà
                  </TabsTrigger>
                  <TabsTrigger
                    value={BloodPressureTabs.Hospital}
                    active={bpVariant === BloodPressureTabs.Hospital}
                    borderRadius={true}
                    onClick={() => setBpVariant(BloodPressureTabs.Hospital)}
                  >
                    Cơ sở y tế
                  </TabsTrigger>
                </TabsList>
              </div>
            )}

            {/* Blood Sugar sub-tabs: Fasting vs 2-hour vs HbA1c */}
            {selectedIndex === HealthIndex.BloodSugar && (
              <div className="mb-4">
                <TabsList>
                  <TabsTrigger
                    value={BloodSugarTabs.Hungry}
                    active={sugarVariant === BloodSugarTabs.Hungry}
                    borderRadius={true}
                    onClick={() => setSugarVariant(BloodSugarTabs.Hungry)}
                  >
                    Lúc đói
                  </TabsTrigger>
                  <TabsTrigger
                    value={BloodSugarTabs.TwoHours}
                    active={sugarVariant === BloodSugarTabs.TwoHours}
                    borderRadius={true}
                    onClick={() => setSugarVariant(BloodSugarTabs.TwoHours)}
                  >
                    Sau 2 giờ uống
                  </TabsTrigger>
                  <TabsTrigger
                    value={BloodSugarTabs.HbA1c}
                    active={sugarVariant === BloodSugarTabs.HbA1c}
                    borderRadius={true}
                    onClick={() => setSugarVariant(BloodSugarTabs.HbA1c)}
                  >
                    HbA1c
                  </TabsTrigger>
                </TabsList>
              </div>
            )}

            {/* Blood Lipid sub-tabs */}
            {selectedIndex === HealthIndex.BloodLipid && (
              <div className="mb-4">
                <TabsList>
                  <TabsTrigger
                    value={BloodLipidTabs.Cholesterol}
                    active={lipidVariant === BloodLipidTabs.Cholesterol}
                    borderRadius={true}
                    onClick={() => setLipidVariant(BloodLipidTabs.Cholesterol)}
                  >
                    Cholesterol
                  </TabsTrigger>
                  <TabsTrigger
                    value={BloodLipidTabs.LDL}
                    active={lipidVariant === BloodLipidTabs.LDL}
                    borderRadius={true}
                    onClick={() => setLipidVariant(BloodLipidTabs.LDL)}
                  >
                    LDL
                  </TabsTrigger>
                  <TabsTrigger
                    value={BloodLipidTabs.HDL}
                    active={lipidVariant === BloodLipidTabs.HDL}
                    borderRadius={true}
                    onClick={() => setLipidVariant(BloodLipidTabs.HDL)}
                  >
                    HDL
                  </TabsTrigger>
                  <TabsTrigger
                    value={BloodLipidTabs.Triglyceride}
                    active={lipidVariant === BloodLipidTabs.Triglyceride}
                    borderRadius={true}
                    onClick={() => setLipidVariant(BloodLipidTabs.Triglyceride)}
                  >
                    Triglyceride
                  </TabsTrigger>
                </TabsList>
              </div>
            )}

            {/* Liver function sub-tabs */}
            {selectedIndex === HealthIndex.LiverFunction && (
              <div className="mb-4">
                <TabsList>
                  <TabsTrigger
                    value={LiverFunctionTabs.SGPT}
                    active={liverVariant === LiverFunctionTabs.SGPT}
                    borderRadius={true}
                    onClick={() => setLiverVariant(LiverFunctionTabs.SGPT)}
                  >
                    ALT
                  </TabsTrigger>
                  <TabsTrigger
                    value={LiverFunctionTabs.SGOT}
                    active={liverVariant === LiverFunctionTabs.SGOT}
                    borderRadius={true}
                    onClick={() => setLiverVariant(LiverFunctionTabs.SGOT)}
                  >
                    AST
                  </TabsTrigger>
                </TabsList>
              </div>
            )}

            {/* Kidney function sub-tabs */}
            {selectedIndex === HealthIndex.KidneyFunction && (
              <div className="mb-4">
                <TabsList>
                  <TabsTrigger
                    value={KidneyFunctionTabs.Creatinine}
                    active={kidneyVariant === KidneyFunctionTabs.Creatinine}
                    borderRadius={true}
                    onClick={() =>
                      setKidneyVariant(KidneyFunctionTabs.Creatinine)
                    }
                  >
                    Creatinine
                  </TabsTrigger>
                  <TabsTrigger
                    value={KidneyFunctionTabs.Ure}
                    active={kidneyVariant === KidneyFunctionTabs.Ure}
                    borderRadius={true}
                    onClick={() => setKidneyVariant(KidneyFunctionTabs.Ure)}
                  >
                    Urea
                  </TabsTrigger>
                </TabsList>
              </div>
            )}

            {/* Chart Container */}
            <div className="w-full">{renderChart()}</div>


            {/* Footer actions under chart */}
            <div className="mt-4 py-6 flex items-center justify-center">
              <Button
                onClick={handleAddClick}
                style={{ height: '48px' }}
                className="!px-16 !font-bold !text-white hover:!bg-[hsl(158,64%,45%)]"
              >
                Cập nhật chỉ số
              </Button>
            </div>


            {/* Specific update modals per tab */}
            {selectedIndex === HealthIndex.BMI && (
              <BMIUpdateModal
                isOpen={isUpdateOpen}
                onClose={() => { setUpdateOpen(false); setEditingItem(null); }}
                onSubmit={async (payload) => {
                  console.log("BMI update", payload)
                  handleUpdateSuccess()
                  setEditingItem(null)
                }}
                ageType={ageRange}
                healthDocumentId={Number(selectedAccount)}
                initialData={editingItem}
              />
            )}
            {selectedIndex === HealthIndex.BloodPressure && (
              <BloodPressureUpdateModal
                isOpen={isUpdateOpen}
                onClose={() => { setUpdateOpen(false); setEditingItem(null); }}
                onSubmit={async (payload) => {
                  console.log("BP update", payload)
                  handleUpdateSuccess()
                  setEditingItem(null)
                }}
                healthDocumentId={Number(selectedAccount)}
                ageType={ageRange}
                activeTab={bpVariant}
                initialData={editingItem}
              />
            )}
            {selectedIndex === HealthIndex.BloodSugar && (
              <BloodSugarUpdateModal
                ageType={ageRange}
                healthDocumentId={Number(selectedAccount)}
                isOpen={isUpdateOpen}
                onClose={() => { setUpdateOpen(false); setEditingItem(null); }}
                onSubmit={async (payload) => {
                  console.log("Sugar update", payload)
                  handleUpdateSuccess()
                  setEditingItem(null)
                }}
                activeTab={sugarVariant}
                initialData={editingItem}
              />
            )}
            {selectedIndex === HealthIndex.AcidUric && (
              <UricUpdateModal
                ageType={ageRange}
                healthDocumentId={Number(selectedAccount)}
                isOpen={isUpdateOpen}
                onClose={() => { setUpdateOpen(false); setEditingItem(null); }}
                onSubmit={async (payload) => {
                  console.log("Uric update", payload)
                  handleUpdateSuccess()
                  setEditingItem(null)
                }}
                initialData={editingItem}
              />
            )}
            {selectedIndex === HealthIndex.LiverFunction && (
              <LiverUpdateModal
                ageType={ageRange}
                healthDocumentId={Number(selectedAccount)}
                isOpen={isUpdateOpen}
                onClose={() => { setUpdateOpen(false); setEditingItem(null); }}
                onSubmit={async (payload) => {
                  console.log("Liver update", payload)
                  handleUpdateSuccess()
                  setEditingItem(null)
                }}
                activeTab={liverVariant}
                initialData={editingItem}
              />
            )}
            {selectedIndex === HealthIndex.KidneyFunction && (
              <KidneyUpdateModal
                ageType={ageRange}
                healthDocumentId={Number(selectedAccount)}
                isOpen={isUpdateOpen}
                onClose={() => { setUpdateOpen(false); setEditingItem(null); }}
                onSubmit={async (payload) => {
                  console.log("Kidney update", payload)
                  handleUpdateSuccess()
                  setEditingItem(null)
                }}
                activeTab={kidneyVariant}
                initialData={editingItem}
              />
            )}
            {selectedIndex === HealthIndex.BloodLipid && (
              <LipidUpdateModal
                ageType={ageRange}
                healthDocumentId={Number(selectedAccount)}
                isOpen={isUpdateOpen}
                onClose={() => { setUpdateOpen(false); setEditingItem(null); }}
                onSubmit={async (payload) => {
                  console.log("Lipid update", payload)
                  handleUpdateSuccess()
                  setEditingItem(null)
                }}
                activeTab={lipidVariant}
                initialData={editingItem}
              />
            )}

            {/* Chart Instruction Modal */}
            <ChartInstructionModal
              isOpen={isInstructionOpen}
              onClose={() => setInstructionOpen(false)}
              chartType={selectedIndex}
              variant={
                selectedIndex === HealthIndex.BloodSugar
                  ? sugarVariant === BloodSugarTabs.Hungry
                    ? "fasting"
                    : sugarVariant === BloodSugarTabs.TwoHours
                      ? "twoHours"
                      : "hba1c"
                  : selectedIndex === HealthIndex.BloodLipid
                    ? lipidVariant === BloodLipidTabs.Cholesterol
                      ? "total"
                      : lipidVariant === BloodLipidTabs.LDL
                        ? "ldl"
                        : lipidVariant === BloodLipidTabs.HDL
                          ? "hdl"
                          : "triglyceride"
                    : selectedIndex === HealthIndex.LiverFunction
                      ? liverVariant === LiverFunctionTabs.SGPT
                        ? "ALT"
                        : "AST"
                      : selectedIndex === HealthIndex.KidneyFunction
                        ? kidneyVariant === KidneyFunctionTabs.Creatinine
                          ? "creatinine"
                          : "urea"
                        : selectedIndex === HealthIndex.BloodPressure
                          ? bpVariant === BloodPressureTabs.Home
                            ? "home"
                            : "facility"
                          : undefined
              }
            />
          </Card>

          {/* Summary and Recommendations */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h4 className="mb-4 font-semibold text-gray-900">Tóm tắt</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá trị mới nhất:</span>
                  <span className="font-medium">
                    {conclusions && conclusions.length > 0
                      ? selectedIndex === HealthIndex.BMI &&
                        activeTab === BMIChildrenTabsEnum.Weight
                        ? `${conclusions[0].VALUE_WEIGHT} kg`
                        : selectedIndex === HealthIndex.BMI &&
                          activeTab === BMIChildrenTabsEnum.Height
                          ? `${conclusions[0].VALUE_HEIGHT} cm`
                          : conclusions[0].VALUE || "22.5"
                      : "22.5"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor:
                        conclusions && conclusions.length > 0
                          ? conclusions[0].COLOR || "#e5e7eb"
                          : "#e5e7eb",
                      color: "#fff",
                    }}
                  >
                    {conclusions && conclusions.length > 0
                      ? conclusions[0].TYPE || "Bình thường"
                      : "Bình thường"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Xu hướng:</span>
                  <span className="text-green-600">↗ Tăng nhẹ</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="mb-4 font-semibold text-gray-900">Khuyến nghị</h4>
              <div className="space-y-2">
                {conclusions &&
                  conclusions.length > 0 &&
                  conclusions[0].RECOMMEND ? (
                  <div
                    className="text-sm text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: conclusions[0].RECOMMEND,
                    }}
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


          {/* History List Section - Always visible with 2 columns */}
          <HistoryList
            items={paginatedConclusions}
            loading={isPaginationLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            onEdit={handleEditHistoryItem}
            onDelete={handleDeleteHistoryItem}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
