import React from 'react';
import { Modal, Button, Select, Divider } from 'antd';
import { 
  Calendar, 
  User, 
  Ruler, 
  Weight, 
  Briefcase, 
  Heart, 
  Activity, 
  Clock,
  ChevronDown
} from 'lucide-react';

interface HealthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: any;
  bmi: string | number;
  accounts: any[];
  selectedAccountId: string;
  onAccountChange: (value: string) => void;
  onUpdate: () => void;
}

export const HealthProfileModal: React.FC<HealthProfileModalProps> = ({
  isOpen,
  onClose,
  account,
  bmi,
  accounts,
  selectedAccountId,
  onAccountChange,
  onUpdate
}) => {
  if (!account) return null;

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Helper to get BMI status and color
  const getBMIStatus = (bmiValue: number) => {
    if (bmiValue < 18.5) return { label: 'Thiếu cân', color: '#3b82f6', bg: '#eff6ff' };
    if (bmiValue < 25) return { label: 'Bình thường', color: '#10b981', bg: '#ecfdf5' };
    if (bmiValue < 30) return { label: 'Tiền béo phì', color: '#f97316', bg: '#fff7ed' };
    return { label: 'Béo phì', color: '#ef4444', bg: '#fef2f2' };
  };

  const bmiValue = parseFloat(bmi as string);
  const bmiStatus = !isNaN(bmiValue) ? getBMIStatus(bmiValue) : { label: 'N/A', color: '#9ca3af', bg: '#f3f4f6' };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1050}
      closeIcon={null}
      centered
      className="health-profile-modal"
      styles={{ 
        content: { 
            padding: 0, 
            borderRadius: '24px', 
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        } 
      }}
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="p-2 bg-blue-50 rounded-lg">
             <Activity className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 m-0 leading-tight">Hồ sơ sức khoẻ</h2>
            <p className="text-slate-500 text-sm m-0">Theo dõi chỉ số cơ thể & thói quen</p>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-slate-200 mx-2"></div>

          <Select
            value={selectedAccountId}
            onChange={onAccountChange}
            options={accounts}
            className="w-56"
            size="large"
            variant="borderless"
            suffixIcon={<ChevronDown size={16} className="text-slate-400" />}
            style={{ fontWeight: 600 }}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button 
            type="text" 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium rounded-full px-5 h-10"
          >
            Đóng
          </Button>
          <Button 
            type="primary" 
            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 h-10 px-6 rounded-full font-medium border-none flex items-center gap-2"
            onClick={onUpdate}
          >
            <span>Cập nhật thông tin</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row bg-[#FAFAFA]">
        
        {/* Left Column: Visual Representation */}
        <div className="lg:w-[320px] bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-8 border-r border-slate-100 relative overflow-hidden">
           {/* Decorative circles */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2"></div>

           <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 z-10">Mô phỏng cơ thể</h3>
           
           <div className="relative h-[420px] w-full flex justify-center z-10">
              <svg viewBox="0 0 100 200" className="h-full drop-shadow-2xl">
                <path 
                  d="M50 20 C60 20 65 25 65 35 C65 45 60 50 50 50 C40 50 35 45 35 35 C35 25 40 20 50 20 Z 
                     M35 55 C20 60 15 80 15 100 C15 140 30 190 35 195 L45 195 L45 140 L55 140 L55 195 L65 195 C70 190 85 140 85 100 C85 80 80 60 65 55 Z" 
                  fill={bmiStatus.color} 
                  className="transition-colors duration-500"
                  opacity={0.9}
                />
              </svg>
              
              {/* Floating stats around body */}
              <div className="absolute top-10 right-0 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-slate-600 border border-white">
                {account.HEIGHT || 0} cm
              </div>
              <div className="absolute top-1/2 left-0 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-slate-600 border border-white">
                {account.WEIGHT || 0} kg
              </div>
           </div>
        </div>

        {/* Right Column: Data Details */}
        <div className="flex-1 p-8 lg:p-10 space-y-8 overflow-y-auto max-h-[80vh]">
          
          {/* Section 1: Key Vitals - Cards Grid */}
          <section>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Thông tin cơ bản</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                    icon={<Calendar size={18} />} 
                    label="Ngày sinh" 
                    value={formatDate(account.DOB)} 
                    color="text-indigo-600" 
                    bg="bg-indigo-50"
                />
                <StatCard 
                    icon={<User size={18} />} 
                    label="Giới tính" 
                    value={account.GENDER?.NAME || 'N/A'} 
                    color="text-pink-600" 
                    bg="bg-pink-50"
                />
                <StatCard 
                    icon={<Ruler size={18} />} 
                    label="Chiều cao" 
                    value={`${account.HEIGHT || 0} cm`} 
                    color="text-blue-600" 
                    bg="bg-blue-50"
                />
                <StatCard 
                    icon={<Weight size={18} />} 
                    label="Cân nặng" 
                    value={`${account.WEIGHT || 0} kg`} 
                    color="text-emerald-600" 
                    bg="bg-emerald-50"
                />
            </div>
          </section>

          <Divider className="my-6 border-slate-200" />

          {/* Section 2: Detailed Analysis & BMI */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
             
             {/* Text Details */}
             <div className="md:col-span-7 space-y-6">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Chi tiết lối sống</h4>
                
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <DetailItem 
                        icon={<Briefcase size={20} />}
                        label="Nghề nghiệp công việc"
                        value={account.JOB || 'Chưa cập nhật'}
                        bgColor="bg-slate-100"
                        iconColor="text-slate-600"
                    />
                    <DetailItem 
                        icon={<Activity size={20} />}
                        label="Tần suất vận động"
                        value={account.EXERCISE_FREQUENCY || 'Chưa cập nhật'}
                        bgColor="bg-orange-100"
                        iconColor="text-orange-600"
                    />
                    <DetailItem 
                        icon={<Clock size={20} />}
                        label="Thời lượng tập luyện"
                        bgColor="bg-violet-100"
                        iconColor="text-violet-600"
                        value={
                            <div className="flex gap-4 mt-1">
                                <div className="bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                                    <span className="text-xs text-slate-400 block">Ngày thường</span>
                                    <span className="font-semibold text-slate-800">{account.DATE_WORKDAY || 0} phút</span>
                                </div>
                                <div className="bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                                    <span className="text-xs text-slate-400 block">Cuối tuần</span>
                                    <span className="font-semibold text-slate-800">{account.DATE_OFF || 0} phút</span>
                                </div>
                            </div>
                        }
                    />
                </div>
             </div>

             {/* BMI Visualization */}
             <div className="md:col-span-5 mb-6">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Phân tích BMI</h4>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center h-full justify-between relative overflow-hidden">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                        <span 
                            className="px-3 py-1 rounded-full text-xs font-bold border"
                            style={{ 
                                backgroundColor: bmiStatus.bg, 
                                color: bmiStatus.color,
                                borderColor: bmiStatus.color 
                            }}
                        >
                            {bmiStatus.label}
                        </span>
                    </div>

                    <div className="mt-4">
                        <BMIGauge value={bmiValue} color={bmiStatus.color} />
                    </div>

                    <div className="text-center mt-2 z-10">
                        <p className="text-slate-400 text-xs mb-1">Chỉ số khối cơ thể (BMI)</p>
                        <p className="text-4xl font-extrabold" style={{ color: bmiStatus.color }}>
                            {bmiValue}
                        </p>
                    </div>

                    <div className="w-full mt-4 bg-slate-50 rounded-lg p-3 text-xs text-slate-500 text-center">
                        Tình trạng: <span className="font-bold text-slate-700">{bmiStatus.label}</span>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </Modal>
  );
};

// --- Sub Components ---

const StatCard = ({ icon, label, value, color, bg }: any) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-2">
        <div className={`p-2.5 rounded-full ${bg} ${color}`}>
            {icon}
        </div>
        <div>
            <div className="text-xs text-slate-400 font-medium mb-0.5">{label}</div>
            <div className="text-base font-bold text-slate-800 truncate px-1">{value}</div>
        </div>
    </div>
);

const DetailItem = ({ icon, label, value, bgColor, iconColor }: any) => (
    <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgColor} ${iconColor}`}>
            {icon}
        </div>
        <div className="flex-1">
            <div className="text-sm text-slate-500 font-medium mb-1">{label}</div>
            <div className="text-base font-semibold text-slate-800 leading-snug">{value}</div>
        </div>
    </div>
);

const BMIGauge = ({ value, color }: { value: number, color: string }) => {
    // Math logic kept intact
    const min = 16;
    const max = 40;
    const range = max - min;
    const normalizedValue = Math.min(Math.max(value, min), max);
    const percentage = (normalizedValue - min) / range;
    const angle = -90 + (percentage * 180);

    return (
        <div className="relative w-48 h-28 flex flex-col items-center">
            <div className="relative w-48 h-24 overflow-hidden">
                 {/* Track */}
                 <svg viewBox="0 0 200 100" className="w-full h-full">
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeWidth="16" strokeLinecap="round" />
                    
                    {/* Active Gradient Arc */}
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={color} />
                        </linearGradient>
                    </defs>

                    <path 
                        d="M 20 100 A 80 80 0 0 1 180 100" 
                        fill="none" 
                        stroke="url(#gaugeGradient)" 
                        strokeWidth="16" 
                        strokeLinecap="round" 
                        strokeDasharray="251"
                        strokeDashoffset={251 - (percentage * 251)}
                        className="transition-all duration-1000 ease-out"
                    />
                 </svg>

                 {/* Needle */}
                 <div 
                    className="absolute bottom-0 left-1/2 w-1.5 h-20 bg-slate-700 origin-bottom rounded-t-full transition-transform duration-1000 ease-out z-10 shadow-lg"
                    style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                 ></div>
                 <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-white border-4 border-slate-700 rounded-full -translate-x-1/2 translate-y-1/2 z-20 shadow-md"></div>
            </div>
            
            <div className="w-full flex justify-between px-2 text-[10px] font-bold text-slate-300 mt-1">
                <span>16</span>
                <span>40</span>
            </div>
        </div>
    );
}