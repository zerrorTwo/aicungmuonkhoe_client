import React from 'react';
import { useGetSaltAdviceQuery } from '@/store/api/consultingApi';
import { Card, Spin, Typography, Row, Col, Alert } from 'antd';
import { ArrowLeft, Droplets, Candy, ChefHat } from 'lucide-react';

const { Title, Text } = Typography;

interface SaltSugarAdviceViewProps {
  healthDocumentId: number;
  onBack: () => void;
}

const AdviceCard = ({ id, type, title, icon, unit, color }: any) => {
  const { data, isLoading, error } = useGetSaltAdviceQuery({ id, type });

  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-full ${color} bg-opacity-10`}>
          {icon}
        </div>
        <Title level={4}>{title}</Title>
        {isLoading ? (
          <Spin />
        ) : error ? (
          <Text type="danger">Lỗi tải dữ liệu</Text>
        ) : (
          <div>
            <Title level={2} className="!m-0 !text-emerald-600">
              {data}
            </Title>
            <Text type="secondary">{unit}</Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export const SaltSugarAdviceView: React.FC<SaltSugarAdviceViewProps> = ({ healthDocumentId, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <Title level={3} className="!m-0">Kiểm soát Muối & Đường</Title>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <AdviceCard 
            id={healthDocumentId} 
            type="SALT" 
            title="Lượng Muối tối đa" 
            unit="g / ngày"
            icon={<ChefHat size={32} className="text-blue-500" />}
            color="bg-blue-500"
          />
        </Col>
        <Col xs={24} md={8}>
          <AdviceCard 
            id={healthDocumentId} 
            type="SUGAR" 
            title="Lượng Đường tối đa" 
            unit="g / ngày"
            icon={<Candy size={32} className="text-pink-500" />}
            color="bg-pink-500"
          />
        </Col>
        <Col xs={24} md={8}>
          <AdviceCard 
            id={healthDocumentId} 
            type="WATER" 
            title="Lượng Nước khuyến nghị" 
            unit="lít / ngày"
            icon={<Droplets size={32} className="text-cyan-500" />}
            color="bg-cyan-500"
          />
        </Col>
      </Row>
      
      <Alert 
        message="Lưu ý quan trọng"
        description="Các chỉ số trên là mức khuyến nghị tối đa dựa trên tình trạng sức khỏe của bạn. Việc tuân thủ giúp giảm nguy cơ các bệnh tim mạch, tiểu đường và huyết áp."
        type="info"
        showIcon
        className="mt-6"
      />
    </div>
  );
};
