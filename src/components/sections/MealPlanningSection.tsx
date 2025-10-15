import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, Search, Calendar, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const MealPlanningSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const mealFeatures = [
    {
      icon: Search,
      title: 'Kiểm tra bữa ăn',
      description: 'Phân tích dinh dưỡng bữa ăn của bạn',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop',
      details: [
        'Tính toán calories chính xác',
        'Phân tích thành phần dinh dưỡng',
        'Đánh giá cân bằng dinh dưỡng'
      ]
    },
    {
      icon: Calendar,
      title: 'Lên kế hoạch bữa ăn',
      description: 'Tạo thực đơn phù hợp với sức khỏe',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
      details: [
        'Thực đơn cá nhân hóa',
        'Phù hợp với tình trạng sức khỏe',
        'Dễ dàng thực hiện tại nhà'
      ]
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Món ăn trong database' },
    { number: '95%', label: 'Độ chính xác dinh dưỡng' },
    { number: '50,000+', label: 'Người dùng tin tưởng' },
    { number: '24/7', label: 'Hỗ trợ tư vấn' }
  ];

  return (
    <section className="py-16 lg:py-15 bg-gradient-to-br from-muted/20 via-background to-muted/20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            <ChefHat className="w-4 h-4 mr-2" />
            Kiểm tra & lên bữa ăn
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Kiểm tra & <span className="bg-gradient-primary bg-clip-text text-transparent">lên bữa ăn</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Bạn sẽ kiểm tra được năng lượng của các bữa đã ăn hoặc dự định ăn, đồng thời nhận được gợi ý
            bữa ăn còn lại phù hợp tình trạng sức khỏe của bạn
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-card/50 backdrop-blur-sm rounded-full p-1 border border-border/50">
            {mealFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === index
                    ? 'bg-gradient-primary text-primary-foreground shadow-card'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {React.createElement(feature.icon, { className: "w-4 h-4" })}
                <span className="hidden sm:inline">{feature.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-weather group">
              <img
                src={mealFeatures[activeTab].image}
                alt={mealFeatures[activeTab].title}
                className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-2 text-white mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium">Được chuyên gia khuyến nghị</span>
                </div>
                <h4 className="text-white text-lg font-semibold">
                  {mealFeatures[activeTab].title}
                </h4>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <div className="inline-flex p-3 bg-gradient-primary rounded-full mb-4">
                {React.createElement(mealFeatures[activeTab].icon, { className: "w-6 h-6 text-white" })}
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {mealFeatures[activeTab].title}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {mealFeatures[activeTab].description}
              </p>
            </div>

            <div className="space-y-4">
              {mealFeatures[activeTab].details.map((detail, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium">{detail}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              <span>Chỉ mất 2-3 phút để hoàn thành</span>
            </div>

            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 hover:scale-105 text-primary-foreground font-semibold px-8 py-4 h-auto shadow-card group transform transition-all duration-300"
            >
              Bắt đầu ngay
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MealPlanningSection;