import React, { useState, useMemo, useEffect } from "react";
import {
  useGetAllHealthDocumentsOfUserQuery,
  useUpdateHealthDocumentMutation,
} from "@/store/api/healthDocumentApi";
import { Layout, Select, Button, message, ConfigProvider } from "antd"; // Bỏ Card của AntD để dùng div thuần cho đẹp
import { HealthProfileModal } from "./components/HealthProfileModal";
import { UpdateHealthProfileModal } from "./components/UpdateHealthProfileModal";
import { NutritionalStandardsView } from "./components/eating/NutritionalStandardsView";
import { FoodRecommendationsView } from "./components/eating/FoodRecommendationsView";
import { SaltSugarAdviceView } from "./components/eating/SaltSugarAdviceView";
import DishDetailView from "./components/eating/DishDetailView";
import DishList from "@/components/health/DishList";
import {
  useGetDishesByAgeQuery,
  useGetDishDetailQuery,
} from "@/store/api/dishApi";
import type { DishBasic } from "@/types/dish.type";
import {
  Utensils,
  Moon,
  Smile,
  Droplets,
  Dumbbell,
  User,
  Calendar,
  Ruler,
  Weight,
  ChevronRight,
  ChevronDown,
  ChefHat,
  BookOpen,
  Apple,
  Popcorn,
  Activity,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toastPromise } from "@/utils/toast";

const { Content } = Layout;

// --- CONFIG & MOCK DATA ---
const CATEGORIES = [
  {
    id: "eating",
    label: "Ăn uống",
    icon: Utensils,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    id: "sleep",
    label: "Giấc ngủ",
    icon: Moon,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    id: "mood",
    label: "Cảm xúc",
    icon: Smile,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    id: "water",
    label: "Nước uống",
    icon: Droplets,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: "activity",
    label: "Vận động",
    icon: Dumbbell,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

const RECOMMENDATIONS = [
  {
    id: 1,
    title: "Thực đơn cá nhân",
    subtitle: "Thiết kế riêng cho bạn",
    icon: <ChefHat size={28} className="text-white" />,
    bgImage:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500",
    gradient: "from-emerald-500/90 to-teal-700/90",
  },
  {
    id: 2,
    title: "Tiêu chuẩn dinh dưỡng",
    subtitle: "Tháp dinh dưỡng chuẩn",
    icon: <BookOpen size={28} className="text-white" />,
    bgImage:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=500",
    gradient: "from-blue-500/90 to-indigo-700/90",
  },
  {
    id: 3,
    title: "Tra cứu thực phẩm",
    subtitle: "Calo & Thành phần",
    icon: <Apple size={28} className="text-white" />,
    bgImage:
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=500",
    gradient: "from-orange-400/90 to-red-600/90",
  },
  {
    id: 4,
    title: "Kiểm soát Muối/Đường",
    subtitle: "Cảnh báo sức khỏe",
    icon: <Popcorn size={28} className="text-white" />,
    bgImage:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500",
    gradient: "from-rose-500/90 to-pink-700/90",
  },
];

// --- MAIN COMPONENT ---
const HealthConsultingPage: React.FC = () => {
  // --- STATE & LOGIC (GIỮ NGUYÊN) ---
  const [activeTab, setActiveTab] = useState("eating");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<DishBasic | null>(null);

  const { data: accountsData, isLoading } =
    useGetAllHealthDocumentsOfUserQuery();
  const [updateHealthDocument] = useUpdateHealthDocumentMutation();

  const accounts = useMemo(() => {
    if (!accountsData?.data) return [];
    return accountsData.data.map((doc: any) => ({
      value: String(doc.ID),
      label: doc.IS_MYSELF ? `Tôi (${doc.FULL_NAME})` : doc.FULL_NAME, // Rút gọn label cho đẹp
      original: doc,
    }));
  }, [accountsData]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      const self = accounts.find((a: any) => a.original.IS_MYSELF);
      setSelectedAccountId(self ? self.value : accounts[0].value);
    }
  }, [accounts, selectedAccountId]);

  const currentAccount = useMemo(() => {
    return accounts.find((a: any) => a.value === selectedAccountId)?.original;
  }, [accounts, selectedAccountId]);

  const age = useMemo(() => {
    if (!currentAccount?.DOB) return "N/A";
    const birthDate = new Date(currentAccount.DOB);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }, [currentAccount]);

  const bmi = useMemo(() => {
    if (!currentAccount?.HEIGHT || !currentAccount?.WEIGHT) return "N/A";
    const h = parseFloat(currentAccount.HEIGHT) / 100;
    const w = parseFloat(currentAccount.WEIGHT);
    if (isNaN(h) || isNaN(w) || h === 0) return "N/A";
    return (w / (h * h)).toFixed(1);
  }, [currentAccount]);

  // Fetch dishes by age
  const { data: dishesData, isLoading: dishesLoading } = useGetDishesByAgeQuery(
    age !== "N/A" ? Number(age) : 0,
    { skip: age === "N/A" || activeView !== "dishes" }
  );

  // Fetch dish detail
  const { data: dishDetailData, isLoading: dishDetailLoading } =
    useGetDishDetailQuery(
      {
        id: selectedDish?.ID || "",
        ageGroupId: selectedDish?.AGE_GROUP_ID || "",
      },
      { skip: !selectedDish || activeView !== "dishDetail" }
    );

  const handleOpenUpdateFromDetail = () => {
    setProfileModalOpen(false);
    setUpdateModalOpen(true);
  };

  const handleUpdateProfile = async (values: any) => {
    // (Logic giữ nguyên như code cũ của bạn)
    const targetAccount = accounts.find(
      (a: any) => a.value === values.healthId
    )?.original;
    if (!targetAccount) {
      message.error("Không tìm thấy hồ sơ");
      return;
    }

    const formattedDOB = values.DOB ? values.DOB.format("YYYY-MM-DD") : null;
    const currentDOB = targetAccount.DOB
      ? new Date(targetAccount.DOB).toISOString().split("T")[0]
      : null;

    const getGenderId = (name?: string) => {
      if (!name) return 3;
      const upper = name.toUpperCase();
      if (upper === "NAM" || upper === "MALE") return 1;
      if (upper === "NỮ" || upper === "FEMALE") return 2;
      return 3;
    };
    const currentGenderId = getGenderId(targetAccount.GENDER?.NAME);

    const isChanged =
      values.fullName !== targetAccount.FULL_NAME ||
      formattedDOB !== currentDOB ||
      Number(values.gender) !== currentGenderId ||
      String(values.height) !== String(targetAccount.HEIGHT || "") ||
      String(values.weight) !== String(targetAccount.WEIGHT || "") ||
      values.job !== targetAccount.JOB ||
      values.exerciseFreq !== targetAccount.EXERCISE_FREQUENCY ||
      values.durationWorkday !== targetAccount.DATE_WORKDAY ||
      values.durationRestday !== targetAccount.DATE_OFF;

    if (!isChanged) {
      message.info("Thông tin không có thay đổi");
      return;
    }

    try {
      const payload = {
        FULL_NAME: values.fullName,
        DOB: formattedDOB,
        GENDER_ID: Number(values.gender),
        HEIGHT: String(values.height),
        WEIGHT: String(values.weight),
        JOB: values.job,
        EXERCISE_FREQUENCY: values.exerciseFreq,
        DATE_WORKDAY: values.durationWorkday,
        DATE_OFF: values.durationRestday,
      };
      await toastPromise(
        updateHealthDocument({
          id: Number(values.healthId),
          data: payload,
        }).unwrap(),
        {
          loading: "Đang cập nhật...",
          success: "Cập nhật thành công",
          error: "Cập nhật thất bại",
        }
      );
      setUpdateModalOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
      message.error("Cập nhật thất bại");
    }
  };

  const handleCardClick = (id: number) => {
    if (id === 1) {
      if (age === "N/A") {
        message.warning("Vui lòng cập nhật ngày sinh để xem thực đơn phù hợp");
        return;
      }
      setActiveView("dishes");
    }
    if (id === 2) setActiveView("standards");
    if (id === 3) setActiveView("recommendations");
    if (id === 4) setActiveView("salt");
  };

  const handleDishClick = (dish: DishBasic) => {
    setSelectedDish(dish);
    setActiveView("dishDetail");
  };

  const handleBackToDishList = () => {
    setActiveView("dishes");
    setSelectedDish(null);
  };

  const renderActiveView = () => {
    if (activeView === "dishDetail") {
      return (
        <DishDetailView
          dish={dishDetailData?.data || null}
          isLoading={dishDetailLoading}
          onBack={handleBackToDishList}
        />
      );
    }

    if (activeView === "dishes") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Thực đơn cá nhân
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Các món ăn phù hợp với độ tuổi{" "}
                  {age !== "N/A" ? `${age} tuổi` : "của bạn"}
                </p>
              </div>
            </div>
          </div>
          <DishList
            dishes={dishesData?.data || []}
            isLoading={dishesLoading}
            onDishClick={handleDishClick}
          />
        </div>
      );
    }
    if (activeView === "standards")
      return (
        <NutritionalStandardsView
          healthDocumentId={Number(selectedAccountId)}
          onBack={() => setActiveView(null)}
          currentUser={currentAccount}
        />
      );
    if (activeView === "recommendations")
      return (
        <FoodRecommendationsView
          healthDocumentId={Number(selectedAccountId)}
          onBack={() => setActiveView(null)}
        />
      );
    if (activeView === "salt")
      return (
        <SaltSugarAdviceView
          healthDocumentId={Number(selectedAccountId)}
          onBack={() => setActiveView(null)}
        />
      );
    return null;
  };

  // --- UI RENDER ---
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header />

      <Content className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* --- SECTION 1: HEADER & GREETING --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
              <span>Trang chủ</span> <ChevronRight size={14} />{" "}
              <span className="text-emerald-600">Health Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
              Trung tâm{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                Tư vấn Sức khỏe
              </span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg font-light">
              Lắng nghe cơ thể và nhận lộ trình tối ưu nhất.
            </p>
          </div>

          {/* Decorative Date or Weather could go here */}
        </div>

        {/* --- SECTION 2: CATEGORY TABS (Floating Style) --- */}
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar md:justify-start">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  setActiveView(null);
                }}
                className={`
                  relative flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 translate-y-[-2px]"
                      : "bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 border border-transparent hover:border-emerald-100"
                  }
                `}
              >
                <Icon size={20} className={isActive ? "animate-pulse" : ""} />
                <span className="font-semibold">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* --- SECTION 3: HEALTH PASSPORT (Redesigned Profile Card) --- */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-100/50 border border-gray-100 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            {/* 3.1: Profile Selector (Left) */}
            <div className="lg:w-1/3 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg shadow-emerald-200">
                  {/* Avatar Generator based on name */}
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${currentAccount?.FULL_NAME || "User"}&backgroundColor=b6e3f4`}
                    alt="avatar"
                    className="w-full h-full rounded-2xl bg-white"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    Hồ sơ đang xem
                  </p>

                  {/* Custom Styled Select */}
                  <ConfigProvider
                    theme={{
                      components: {
                        Select: {
                          selectorBg: "transparent",
                          colorBorder: "transparent",
                          colorPrimaryHover: "transparent",
                          controlOutline: "transparent",
                          colorText: "#1f2937", // gray-800
                          fontSize: 18,
                          fontWeightStrong: 700,
                        },
                      },
                    }}
                  >
                    <Select
                      value={selectedAccountId}
                      onChange={setSelectedAccountId}
                      options={accounts}
                      loading={isLoading}
                      suffixIcon={<ChevronDown className="text-emerald-500" />}
                      className="w-full -ml-3 font-bold text-lg hover:bg-gray-50 rounded-lg transition-colors"
                      popupMatchSelectWidth={false}
                      bordered={false}
                    />
                  </ConfigProvider>
                </div>
              </div>

              <Button
                onClick={() => setProfileModalOpen(true)}
                className="w-full h-12 rounded-xl bg-gray-50 border-none text-gray-600 font-semibold hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-between px-4 group transition-all"
              >
                <span>Xem chi tiết & Chỉnh sửa</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChevronRight size={16} />
                </div>
              </Button>
            </div>

            {/* 3.2: Stats Grid (Right) */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox
                icon={Calendar}
                label="Tuổi"
                value={age !== "N/A" ? `${age}` : "--"}
                unit="tuổi"
                color="text-blue-600"
                bg="bg-blue-50"
              />
              <StatBox
                icon={User}
                label="Giới tính"
                value={currentAccount?.GENDER?.NAME || "--"}
                unit=""
                color="text-purple-600"
                bg="bg-purple-50"
              />
              <StatBox
                icon={Ruler}
                label="Chiều cao"
                value={currentAccount?.HEIGHT || "--"}
                unit="cm"
                color="text-teal-600"
                bg="bg-teal-50"
              />
              <div className="bg-orange-50 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                  <Activity size={40} className="text-orange-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    <Weight size={16} className="text-orange-500" />
                  </div>
                  <span className="text-xs font-bold text-orange-400 uppercase">
                    Cân nặng
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {currentAccount?.WEIGHT || "--"}{" "}
                    <span className="text-sm font-medium text-gray-500">
                      kg
                    </span>
                  </div>
                  <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md bg-white/60 text-xs font-semibold text-orange-600">
                    BMI: {bmi}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 4: CONTENT AREA --- */}
        <div className="min-h-[400px]">
          {activeTab === "eating" ? (
            activeView ? (
              <div className="animate-fade-in-up">{renderActiveView()}</div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Khám phá sức khỏe
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {RECOMMENDATIONS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item.id)}
                      className="group relative h-70 rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-500"
                    >
                      {/* Background Image with Zoom Effect */}
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${item.bgImage})` }}
                      />

                      {/* Modern Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
                      />

                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 group-hover:bg-white group-hover:text-emerald-600 transition-colors duration-300">
                          {item.icon}
                        </div>
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-2xl font-bold mb-2 leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-white/80 text-sm font-medium flex items-center gap-2">
                            {item.subtitle}{" "}
                            <ChevronRight
                              size={14}
                              className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            // Empty State Modern
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="bg-gray-50 p-6 rounded-full mb-4 animate-bounce-slow">
                <Utensils size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-400">
                Tính năng đang phát triển
              </h3>
              <p className="text-gray-400 mt-2">
                Đội ngũ kỹ thuật đang làm việc chăm chỉ!
              </p>
            </div>
          )}
        </div>
      </Content>
      <Footer />

      {/* --- MODALS (Giữ nguyên logic truyền props) --- */}
      <HealthProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        account={currentAccount}
        bmi={bmi}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onAccountChange={setSelectedAccountId}
        onUpdate={handleOpenUpdateFromDetail}
      />

      <UpdateHealthProfileModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onUpdate={handleUpdateProfile}
        accounts={accounts}
        initialData={{
          healthId: selectedAccountId,
          fullName: currentAccount?.FULL_NAME,
          DOB: currentAccount?.DOB,
          gender:
            currentAccount?.GENDER?.NAME === "NAM"
              ? "1"
              : currentAccount?.GENDER?.NAME === "NỮ"
                ? "2"
                : "3",
          height: currentAccount?.HEIGHT,
          weight: currentAccount?.WEIGHT,
          job: currentAccount?.JOB,
          exerciseFreq: currentAccount?.EXERCISE_FREQUENCY,
          durationWorkday: currentAccount?.DATE_WORKDAY,
          durationRestday: currentAccount?.DATE_OFF,
        }}
      />
    </div>
  );
};

// --- SUB COMPONENTS (Styled) ---
const StatBox = ({ icon: Icon, label, value, unit, color, bg }: any) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-emerald-100 hover:shadow-md transition-all group">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-xl ${bg}`}>
        <Icon size={18} className={color} />
      </div>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        {label}
      </span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      {unit && (
        <span className="text-sm font-medium text-gray-500">{unit}</span>
      )}
    </div>
  </div>
);

export default HealthConsultingPage;
