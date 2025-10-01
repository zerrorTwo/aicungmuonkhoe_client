import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Moon, Heart, Droplets, Dumbbell, ArrowRight, MessageCircle } from 'lucide-react';

const HealthConsultationSection: React.FC = () => {
  const consultationAreas = [
    {
      icon: Utensils,
      title: 'Ăn uống',
      description: 'Tư vấn dinh dưỡng',
      color: 'text-orange-500',
      gradient: 'from-orange-400 to-orange-600',
      hoverBg: 'rgba(249, 115, 22, 0.08)',
      hoverBorder: 'rgb(254, 215, 170)'
    },
    {
      icon: Moon,
      title: 'Giấc ngủ',
      description: 'Cải thiện chất lượng ngủ',
      color: 'text-indigo-500',
      gradient: 'from-indigo-400 to-indigo-600',
      hoverBg: 'rgba(99, 102, 241, 0.08)',
      hoverBorder: 'rgb(165, 180, 252)'
    },
    {
      icon: Heart,
      title: 'Cảm xúc',
      description: 'Chăm sóc tinh thần',
      color: 'text-pink-500',
      gradient: 'from-pink-400 to-pink-600',
      hoverBg: 'rgba(236, 72, 153, 0.08)',
      hoverBorder: 'rgb(251, 182, 206)'
    },
    {
      icon: Droplets,
      title: 'Nước',
      description: 'Cân bằng nước trong cơ thể',
      color: 'text-cyan-500',
      gradient: 'from-cyan-400 to-cyan-600',
      hoverBg: 'rgba(6, 182, 212, 0.08)',
      hoverBorder: 'rgb(165, 243, 252)'
    },
    {
      icon: Dumbbell,
      title: 'Hoạt động thể chất',
      description: 'Luyện tập và vận động',
      color: 'text-red-500',
      gradient: 'from-red-400 to-red-600',
      hoverBg: 'rgba(239, 68, 68, 0.08)',
      hoverBorder: 'rgb(252, 165, 165)'
    }
  ];

  return (
    <section className="py-16 lg:py-15 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            <MessageCircle className="w-4 h-4 mr-2" />
            Tư vấn sức khỏe
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Tư vấn <span className="bg-gradient-primary bg-clip-text text-transparent">sức khỏe</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Bạn sẽ nhận được những tư vấn hữu ích để chăm sóc dinh dưỡng & sức khỏe cho gia đình tốt hơn tại đây
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {consultationAreas.map((area, index) => (
            <Card 
              key={index}
              className="p-6 text-center hover:shadow-weather transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 group cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = area.hoverBg;
                e.currentTarget.style.borderColor = area.hoverBorder;
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.transform = '';
              }}
            >
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${area.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {React.createElement(area.icon, { className: "w-6 h-6 text-white" })}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{area.title}</h3>
              <p className="text-xs text-muted-foreground">{area.description}</p>
            </Card>
          ))}
        </div>

        <div 
          className="rounded-2xl p-8"
          style={{ background: 'linear-gradient(135deg, hsl(158 64% 96%), hsl(134 61% 97%))' }}
        >
          <div className="text-center">
            <div 
              className="inline-flex p-4 rounded-full mb-6"
              style={{ background: 'linear-gradient(135deg, hsl(134 61% 51%), hsl(158 64% 58%))' }}
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Nhận tư vấn từ chuyên gia
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Đội ngũ chuyên gia dinh dưỡng và sức khỏe sẽ hỗ trợ bạn 24/7 với những lời khuyên phù hợp 
              cho từng thành viên trong gia đình
            </p>
            <Button 
              size="lg" 
              className="hover:opacity-90 hover:scale-105 text-white font-semibold px-8 py-4 h-auto shadow-card group transform transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, hsl(134 61% 51%), hsl(158 64% 58%))' }}
            >
              Xem chi tiết
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthConsultationSection;