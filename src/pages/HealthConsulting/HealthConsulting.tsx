import React, { useState, useMemo, useEffect } from 'react';
import { useGetAllHealthDocumentsOfUserQuery, useUpdateHealthDocumentMutation } from '@/store/api/healthDocumentApi';
import { Layout, Select, Button, Card, Typography, message } from 'antd';
import { HealthProfileModal } from './components/HealthProfileModal';
import { UpdateHealthProfileModal } from './components/UpdateHealthProfileModal';
import dayjs from 'dayjs';
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
  ChefHat,
  BookOpen,
  Apple,
  AlertCircle
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toastPromise } from '@/utils/toast';

const { Title, Text } = Typography;
const {  Content } = Layout;

// --- Dữ liệu giả lập (Mock Data) ---
const CATEGORIES = [
  { id: 'eating', label: 'Ăn uống', icon: <Utensils size={20} />, activeColor: 'bg-emerald-500' },
  { id: 'sleep', label: 'Giấc ngủ', icon: <Moon size={20} />, activeColor: 'bg-indigo-500' },
  { id: 'mood', label: 'Cảm xúc', icon: <Smile size={20} />, activeColor: 'bg-yellow-500' },
  { id: 'water', label: 'Nước uống', icon: <Droplets size={20} />, activeColor: 'bg-blue-500' },
  { id: 'activity', label: 'Vận động', icon: <Dumbbell size={20} />, activeColor: 'bg-orange-500' },
];

const RECOMMENDATIONS = [
  { 
    id: 1, 
    title: 'Thực đơn cá nhân', 
    subtitle: 'Thiết kế riêng cho bạn',
    icon: <ChefHat size={32} className="text-white" />,
    bgImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500',
    color: 'from-emerald-500 to-teal-700'
  },
  { 
    id: 2, 
    title: 'Tiêu chuẩn dinh dưỡng', 
    subtitle: 'Tháp dinh dưỡng chuẩn',
    icon: <BookOpen size={32} className="text-white" />,
    bgImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=500',
    color: 'from-blue-500 to-indigo-700'
  },
  { 
    id: 3, 
    title: 'Tra cứu thực phẩm', 
    subtitle: 'Calo & Thành phần',
    icon: <Apple size={32} className="text-white" />,
    bgImage: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=500',
    color: 'from-orange-400 to-red-600'
  },
  { 
    id: 4, 
    title: 'Kiểm soát Muối/Đường', 
    subtitle: 'Cảnh báo sức khỏe',
    icon: <AlertCircle size={32} className="text-white" />,
    bgImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500',
    color: 'from-rose-500 to-pink-700'
  },
];

const HealthConsultingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('eating');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); // State cho modal update

  const { data: accountsData, isLoading } = useGetAllHealthDocumentsOfUserQuery();
  const [updateHealthDocument, { isLoading: isUpdating }] = useUpdateHealthDocumentMutation();

  const accounts = useMemo(() => {
    if (!accountsData?.data) return [];
    return accountsData.data.map((doc: any) => ({
      value: String(doc.ID),
      label: doc.IS_MYSELF ? `Bản thân (${doc.FULL_NAME})` : doc.FULL_NAME,
      original: doc
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
    if (!currentAccount?.DOB) return 'N/A';
    const birthDate = new Date(currentAccount.DOB);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }, [currentAccount]);

  const bmi = useMemo(() => {
    if (!currentAccount?.HEIGHT || !currentAccount?.WEIGHT) return 'N/A';
    const h = parseFloat(currentAccount.HEIGHT) / 100;
    const w = parseFloat(currentAccount.WEIGHT);
    if (isNaN(h) || isNaN(w) || h === 0) return 'N/A';
    return (w / (h * h)).toFixed(1);
  }, [currentAccount]);

  // Hàm xử lý khi user nhấn nút Cập nhật trong modal Xem chi tiết (HealthProfileModal)
  const handleOpenUpdateFromDetail = () => {
     setProfileModalOpen(false); // Đóng modal xem chi tiết
     setUpdateModalOpen(true);   // Mở modal update
  }

  // Hàm xử lý submit update
  const handleUpdateProfile = async (values: any) => {
     // 1. Find the account being updated (it might be different from selectedAccountId if user changed it in modal)
     const targetAccount = accounts.find((a: any) => a.value === values.healthId)?.original;

     if (!targetAccount) {
        message.error('Không tìm thấy hồ sơ cần cập nhật');
        return;
     }

     // 2. Prepare data for comparison
     const formattedDOB = values.DOB ? values.DOB.format('YYYY-MM-DD') : null;
     const currentDOB = targetAccount.DOB ? new Date(targetAccount.DOB).toISOString().split('T')[0] : null;

     // Helper to get gender ID from name or code
     const getGenderId = (name?: string) => {
        if (!name) return 3; // Default to Other
        const upper = name.toUpperCase();
        if (upper === 'NAM' || upper === 'MALE') return 1;
        if (upper === 'NỮ' || upper === 'FEMALE') return 2;
        return 3;
     };
     const currentGenderId = getGenderId(targetAccount.GENDER?.NAME);

     // Check for changes
     const isChanged = 
        values.fullName !== targetAccount.FULL_NAME ||
        formattedDOB !== currentDOB ||
        Number(values.gender) !== currentGenderId ||
        String(values.height) !== String(targetAccount.HEIGHT || '') ||
        String(values.weight) !== String(targetAccount.WEIGHT || '') ||
        values.job !== targetAccount.JOB ||
        values.exerciseFreq !== targetAccount.EXERCISE_FREQUENCY ||
        values.durationWorkday !== targetAccount.DATE_WORKDAY ||
        values.durationRestday !== targetAccount.DATE_OFF;

     if (!isChanged) {
        message.info('Thông tin không có thay đổi');
        return;
     }

     // 3. Call API
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
          updateHealthDocument({ id: Number(values.healthId), data: payload }).unwrap(),
          { loading: 'Đang cập nhật...', success: 'Cập nhật hồ sơ thành công', error: 'Cập nhật hồ sơ thất bại' }
        );
        setUpdateModalOpen(false);
        
     } catch (error) {
        console.error('Update failed:', error);
        message.error('Cập nhật thất bại, vui lòng thử lại');
     }
  }

  return (
    <div>
      {/* --- 1. Modern Header --- */}
      <Header />

      <Content className="max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8">
        
        {/* --- 2. Page Title & Breadcrumb --- */}
        <div className="text-center md:text-left space-y-2">
          <div className="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
            <span>Trang chủ</span> <ChevronRight size={14} /> <span className="text-emerald-600 font-medium">Tư vấn sức khỏe</span>
          </div>
          <div className='bg-white rounded-lg shadow-sm border p-6 mb-6'>
           <Title level={2} className="!mb-0 !text-slate-800">
            Trung tâm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Tư vấn Sức khỏe</span>
          </Title>
          <Text className="text-slate-500 text-lg">Lắng nghe cơ thể và nhận lộ trình tối ưu nhất cho bạn.</Text>
          </div>
        </div>

        {/* --- 3. Modern Category Tabs (Pill Shape) --- */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-wrap gap-3 justify-center md:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 border  cursor-pointer
                ${activeTab === cat.id 
                  ? `${cat.activeColor} text-white border-transparent shadow-lg shadow-emerald-500/20 transform -translate-y-1` 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-emerald-200'
                }
              `}
            >
              {cat.icon}
              <span className="font-semibold">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* --- 4. Health Profile Summary Card (Redesigned) --- */}
        <Card 
            className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white"
            bodyStyle={{ padding: 0 }}
        >
            <div className="flex flex-col md:flex-row">
                {/* Left Side: Selector & Label */}
                <div className="bg-emerald-50 p-6 md:w-1/4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-emerald-100">
                    <Text className="text-emerald-800 font-medium mb-2 block">Hồ sơ đang xem</Text>
                    <Select 
                        value={selectedAccountId}
                        onChange={setSelectedAccountId}
                        size="large"
                        className="w-full font-medium"
                        loading={isLoading}
                        options={accounts}
                    />
                     <Button 
                        type="link" 
                        className="mt-2 p-0 text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start"
                        onClick={() => setProfileModalOpen(true)}
                     >
                        Xem chi tiết hồ sơ <ChevronRight size={16}/>
                    </Button>
                </div>

                {/* Right Side: Stats Grid */}
                <div className="p-6 md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                    <StatItem 
                        icon={<Calendar size={20} />} 
                        label="Ngày sinh" 
                        value={currentAccount?.DOB ? new Date(currentAccount.DOB).toLocaleDateString('vi-VN') : 'N/A'} 
                        sub={`${age} tuổi`} 
                    />
                    <StatItem 
                        icon={<User size={20} />} 
                        label="Giới tính" 
                        value={currentAccount?.GENDER?.NAME || 'N/A'} 
                        sub="-" 
                    />
                    <StatItem 
                        icon={<Ruler size={20} />} 
                        label="Chiều cao" 
                        value={currentAccount?.HEIGHT ? `${currentAccount.HEIGHT} cm` : 'N/A'} 
                        sub="-" 
                    />
                    <StatItem 
                        icon={<Weight size={20} />} 
                        label="Cân nặng" 
                        value={currentAccount?.WEIGHT ? `${currentAccount.WEIGHT} kg` : 'N/A'} 
                        sub={`BMI: ${bmi}`} 
                        highlight 
                    />
                </div>
            </div>
        </Card>

        {/* --- 5. Recommendations Grid (Hero Cards) --- */}
        <div className="space-y-4 mt-10">
            <div className="flex items-center justify-between">
                <Title level={4} className="!m-0 !text-slate-700">Khuyến nghị dành cho bạn</Title>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {RECOMMENDATIONS.map((item) => (
                    <div 
                        key={item.id}
                        className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {/* Background Image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${item.bgImage})` }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-80 group-hover:opacity-90 transition-opacity`} />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1 leading-tight">{item.title}</h3>
                                <p className="text-white/80 text-sm font-medium">{item.subtitle}</p>
                            </div>
                        </div>

                        {/* Decoration Circle */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />
                    </div>
                ))}
            </div>
        </div>

      </Content>
      {/* 6. Footer */}
      <Footer />

      {/* Modal Xem chi tiết hồ sơ */}
      <HealthProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        account={currentAccount}
        bmi={bmi}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onAccountChange={setSelectedAccountId}
        onUpdate={handleOpenUpdateFromDetail} // Chuyển hướng sang modal update
      />

      {/* Modal Cập nhật mới */}
        <UpdateHealthProfileModal 
            isOpen={isUpdateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            onUpdate={handleUpdateProfile}
            accounts={accounts} // Truyền list accounts vào để select dropdown
            initialData={{
                healthId: selectedAccountId,
                fullName: currentAccount?.FULL_NAME,
                DOB: currentAccount?.DOB,
                gender: currentAccount?.GENDER?.NAME === 'NAM' ? '1' : (currentAccount?.GENDER?.NAME === 'NỮ' ? '2' : '3'),
                height: currentAccount?.HEIGHT,
                weight: currentAccount?.WEIGHT,
                job: currentAccount?.JOB,
                exerciseFreq: currentAccount?.EXERCISE_FREQUENCY,
                durationWorkday: currentAccount?.DATE_WORKDAY,
                durationRestday: currentAccount?.DATE_OFF
            }}
        />
    </div>
  );
};

// Sub-component for Stats to keep code clean
const StatItem = ({ icon, label, value, sub, highlight = false }: any) => (
    <div className="flex items-start gap-3">
        <div className={`mt-1 p-2 rounded-lg ${highlight ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
            {icon}
        </div>
        <div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</div>
            <div className="text-lg font-bold text-slate-800">{value}</div>
            {sub && <div className={`text-xs ${highlight ? 'text-orange-600 font-semibold' : 'text-slate-400'}`}>{sub}</div>}
        </div>
    </div>
);

export default HealthConsultingPage;