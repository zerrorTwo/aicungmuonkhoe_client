import React, { useState, type FC } from 'react';
import { useGetNutritionalStandardQuery } from '@/store/api/consultingApi';
import { Card, Spin, Typography, Row, Col, Alert, Button, Collapse, Avatar, Progress } from 'antd';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, Flame, Utensils, Activity } from 'lucide-react';

const { Title, Text } = Typography;

interface NutritionalStandardsViewProps {
  healthDocumentId: number;
  onBack: () => void;
  currentUser: any;
}

export const NutritionalStandardsView: FC<NutritionalStandardsViewProps> = ({ healthDocumentId, onBack, currentUser }) => {
  const { data, isLoading, error } = useGetNutritionalStandardQuery({ healthDocumentId });
  const [activeTab, setActiveTab] = useState<'daily' | 'meal' | 'other'>('daily');

  if (isLoading) return <div className="flex justify-center p-8"><Spin size="large" /></div>;
  if (error) return <Alert message="Lỗi tải dữ liệu" type="error" showIcon />;
  if (!data) return <Alert message="Không có dữ liệu" type="warning" showIcon />;

  const renderDailyNutrition = () => (
    <div className="space-y-6">
      {/* Energy Card */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 transform skew-x-12 translate-x-12"></div>
        <div className="relative z-10 flex items-center justify-between p-2">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-100">
              <Flame size={20} />
              <span className="font-medium uppercase tracking-wider text-sm">Năng lượng mục tiêu</span>
            </div>
            <div className="text-4xl font-bold mb-1">
              {Math.round(data.ENERGY_MIN)} - {Math.round(data.ENERGY_MAX)}
            </div>
            <div className="text-emerald-100 text-sm">Kcal / ngày</div>
          </div>
          <div className="hidden sm:block">
             <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                <Activity size={40} />
             </div>
          </div>
        </div>
      </Card>

      {/* Macros Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Utensils size={18} className="text-slate-400" />
          <Text strong className="text-slate-600 uppercase text-xs tracking-wider">Phân bổ đa lượng chất (P:L:G)</Text>
        </div>
        <Row gutter={[16, 16]}>
          {[
            { label: 'Protein (Đạm)', min: data.PLG_DAY_P_PERCENT_MIN, max: data.PLG_DAY_P_PERCENT_MAX, color: '#3b82f6', bg: 'bg-blue-50' },
            { label: 'Lipid (Béo)', min: data.PLG_DAY_L_PERCENT_MIN, max: data.PLG_DAY_L_PERCENT_MAX, color: '#f59e0b', bg: 'bg-amber-50' },
            { label: 'Glucid (Đường bột)', min: data.PLG_DAY_G_PERCENT_MIN, max: data.PLG_DAY_G_PERCENT_MAX, color: '#10b981', bg: 'bg-emerald-50' },
          ].map((item, idx) => (
            <Col xs={24} md={8} key={idx}>
              <Card className={`border-0 shadow-sm ${item.bg} h-full rounded-xl`} bodyStyle={{ padding: '20px' }}>
                <div className="flex justify-between items-start mb-4">
                  <Text strong className="text-slate-700">{item.label}</Text>
                  <div className="px-2 py-1 bg-white rounded-md text-xs font-bold shadow-sm" style={{ color: item.color }}>
                    {item.min}-{item.max}%
                  </div>
                </div>
                <Progress 
                  percent={(item.min + item.max) / 2} 
                  strokeColor={item.color} 
                  trailColor="rgba(255,255,255,0.6)"
                  showInfo={false} 
                  strokeWidth={10}
                />
                <div className="mt-3 text-xs text-slate-500">
                  Khuyến nghị: {item.min}% đến {item.max}% tổng năng lượng
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );

  const renderMealStructure = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[2, 3, 4, 5].map((meals) => (
        <div 
          key={meals} 
          className="group bg-white border border-slate-100 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Utensils size={64} className="text-emerald-500" />
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              {meals}
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-1">Chế độ {meals} bữa/ngày</h4>
            <p className="text-slate-500 text-sm">Phân bổ năng lượng tối ưu cho {meals} bữa ăn chính và phụ.</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderOtherRecommendations = () => {
    const items = [
      { key: '1', label: 'Cấu trúc món ăn', children: <p className="text-slate-600">Chi tiết về cấu trúc món ăn...</p> },
      { key: '2', label: 'Số lượng bữa ăn', children: <p className="text-slate-600">Khuyến nghị số lượng bữa ăn...</p> },
      { key: '3', label: 'Số lượng loại thực phẩm', children: <p className="text-slate-600">Đa dạng hóa thực phẩm...</p> },
      { key: '4', label: 'Kết hợp đa dạng thực phẩm', children: <p className="text-slate-600">Cách kết hợp thực phẩm...</p> },
      { key: '5', label: 'Không nên', children: <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">Các thực phẩm cần tránh...</div> },
    ];

    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <Collapse 
          defaultActiveKey={['1']} 
          ghost 
          expandIconPosition="end"
          expandIcon={({ isActive }) => isActive ? <ChevronUp size={18} className="text-emerald-500" /> : <ChevronDown size={18} className="text-slate-400" />}
          items={items}
          className="bg-white"
        />
      </div>
    );
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl p-6 min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition-all shadow-sm">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <Title level={3} className="!m-0 !text-slate-800">Tiêu chuẩn dinh dưỡng</Title>
            <Text className="text-slate-500 text-sm">Theo dõi và cân bằng chế độ ăn uống</Text>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
              <Avatar size="small" src={currentUser?.AVATAR} icon={<UserIcon />} className="bg-emerald-100 text-emerald-600" />
              <span className="text-slate-700 font-medium text-sm">
                {currentUser?.IS_MYSELF ? 'Bản thân' : currentUser?.FULL_NAME || 'Thành viên'}
              </span>
           </div>
           <Button 
              type="primary"
              icon={<Plus size={16} />} 
              className="bg-emerald-600 hover:bg-emerald-700 border-none rounded-full shadow-md shadow-emerald-200"
            >
              Thêm
            </Button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        {[
          { id: 'daily', label: 'Dinh dưỡng 1 ngày' },
          { id: 'meal', label: 'Cơ cấu bữa ăn' },
          { id: 'other', label: 'Khuyến nghị khác' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'daily' | 'meal' | 'other')}
            className={`
              relative py-3 px-6 text-sm font-medium transition-all
              ${activeTab === tab.id 
                ? 'text-emerald-600' 
                : 'text-slate-500 hover:text-slate-700'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'daily' && renderDailyNutrition()}
        {activeTab === 'meal' && renderMealStructure()}
        {activeTab === 'other' && renderOtherRecommendations()}
      </div>
    </div>
  );
};

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
