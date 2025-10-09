import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Users } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.png';

const HeroSection: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: 'Chăm sóc toàn diện',
      description: 'Theo dõi sức khỏe 24/7'
    },
    {
      icon: Shield,
      title: 'An toàn tuyệt đối',
      description: 'Bảo mật thông tin cá nhân'
    },
    {
      icon: Users,
      title: 'Cho cả gia đình',
      description: 'Quản lý sức khỏe mọi thành viên'
    }
  ];

  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="absolute inset-0 bg-white/75" />
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-slide-in-up">
            <div className="space-y-2">
              <div 
                className="inline-flex items-center px-4 py-2 rounded-full text-emerald-600 font-medium text-sm"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
              >
                <Heart className="w-4 h-4 mr-2 animate-pulse-gentle" />
                Nền tảng sức khỏe hàng đầu Việt Nam
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Chăm sóc{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  sức khỏe
                </span>{' '}
                gia đình Việt
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Theo dõi, tư vấn và chăm sóc sức khỏe toàn diện cho gia đình bạn với công nghệ hiện đại và đội ngũ chuyên gia hàng đầu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 hover:scale-105 text-primary-foreground font-semibold px-8 py-4 h-auto shadow-card group transform transition-all duration-300"
              >
                Bắt đầu ngay
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 group-hover:animate-bounce-gentle" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary/20 hover:bg-primary/5 px-8 py-4 h-auto font-semibold"
              >
                Tìm hiểu thêm
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="feature-float flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-card hover:shadow-weather transition-all duration-300 hover:scale-110 group"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: `${0.8 + index * 0.2}s`
                  }}
                >
                  <div className="p-3 bg-gradient-primary rounded-full group-hover:scale-125 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary-foreground animate-pulse-gentle" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors duration-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - can be used for additional graphics or left empty for breathing room */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;