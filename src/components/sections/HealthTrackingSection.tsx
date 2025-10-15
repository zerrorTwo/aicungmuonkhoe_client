import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Baby, User, Users2, ArrowRight } from 'lucide-react';

const HealthTrackingSection: React.FC = () => {
  const trackingCategories = [
    {
      icon: Baby,
      title: 'Con cái',
      description: 'Theo dõi sức khỏe trẻ em',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-500 to-blue-600',
      hoverBg: 'rgba(59, 130, 246, 0.08)',
      hoverBorder: 'rgb(147, 197, 253)'
    },
    {
      icon: User,
      title: 'Bản thân',
      description: 'Chăm sóc sức khỏe cá nhân',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      gradient: 'from-green-500 to-green-600',
      hoverBg: 'rgba(34, 197, 94, 0.08)',
      hoverBorder: 'rgb(134, 239, 172)'
    },
    {
      icon: Users2,
      title: 'Bố mẹ',
      description: 'Theo dõi sức khỏe người cao tuổi',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600',
      hoverBg: 'rgba(168, 85, 247, 0.08)',
      hoverBorder: 'rgb(196, 181, 253)'
    }
  ];

  return (
    <section className="py-16 lg:py-15 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            <User className="w-4 h-4 mr-2" />
            Theo dõi sức khỏe
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Theo dõi <span className="bg-gradient-primary bg-clip-text text-transparent">sức khỏe</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Theo dõi chỉ số sức khỏe quan trọng trong suốt cuộc đời cho tất cả thành viên trong gia đình
            để hỗ trợ chăm sóc sức khỏe tốt hơn
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {trackingCategories.map((category, index) => (
            <Card
              key={index}
              className="p-8 text-center hover:shadow-weather transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 group cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = category.hoverBg;
                e.currentTarget.style.borderColor = category.hoverBorder;
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.transform = '';
              }}
            >
              <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${category.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {React.createElement(category.icon, { className: "w-8 h-8 text-white" })}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{category.title}</h3>
              <p className="text-muted-foreground mb-6">{category.description}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Chỉ số cơ bản</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Lịch sử sức khỏe</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Cảnh báo sớm</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 hover:scale-105 text-primary-foreground font-semibold px-8 py-4 h-auto shadow-card group transform transition-all duration-300"
          >
            Xem chi tiết
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HealthTrackingSection;