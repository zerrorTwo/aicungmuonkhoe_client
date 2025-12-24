import React, { useState } from 'react';
import { useGetFoodRecommendationsQuery } from '@/store/api/consultingApi';
import { Card, Input, List, Tabs, Typography, Spin, Alert, Pagination } from 'antd';
import { ArrowLeft } from 'lucide-react';

const { Title } = Typography;

interface FoodRecommendationsViewProps {
  healthDocumentId: number;
  onBack: () => void;
}

export const FoodRecommendationsView: React.FC<FoodRecommendationsViewProps> = ({ healthDocumentId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'NENAN' | 'HANCHEAN'>('NENAN');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetFoodRecommendationsQuery({
    HEALTH_DOCUMENT_ID: healthDocumentId,
    TYPE_ADVICE: activeTab,
    SEARCH: searchText,
    PAGE: page,
    LIMIT: 10
  });

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'NENAN' | 'HANCHEAN');
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <Title level={3} className="!m-0">Tra cứu thực phẩm</Title>
      </div>

      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={handleTabChange} items={[
          { key: 'NENAN', label: 'Thực phẩm nên ăn' },
          { key: 'HANCHEAN', label: 'Thực phẩm hạn chế' }
        ]} />
        
        <div className="mb-6 mt-4">
          <Input.Search 
            placeholder="Tìm kiếm thực phẩm..." 
            onSearch={handleSearch}
            enterButton 
            size="large"
            allowClear
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12"><Spin size="large" /></div>
        ) : error ? (
          <Alert message="Lỗi tải dữ liệu" type="error" showIcon />
        ) : (
          <>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
              dataSource={data?.listData || []}
              renderItem={(item) => (
                <List.Item>
                  <Card 
                    hoverable
                    cover={
                      <div className="h-40 overflow-hidden flex items-center justify-center bg-gray-50">
                         {item.IMAGE_URL ? (
                           <img alt={item.FOOD_NAME} src={item.IMAGE_URL} className="w-full h-full object-cover" />
                         ) : (
                           <div className="text-gray-400">No Image</div>
                         )}
                      </div>
                    }
                  >
                    <Card.Meta 
                      title={item.FOOD_NAME} 
                      description={
                        <div className="text-xs space-y-1">
                          <div>Calo: {item.ENERGY} Kcal</div>
                          <div>Đạm: {item.PROTID}g | Béo: {item.LIPID}g</div>
                        </div>
                      } 
                    />
                  </Card>
                </List.Item>
              )}
            />
            <div className="flex justify-center mt-6">
              <Pagination 
                current={page} 
                total={data?.paging?.totalRows || 0} 
                pageSize={10}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
