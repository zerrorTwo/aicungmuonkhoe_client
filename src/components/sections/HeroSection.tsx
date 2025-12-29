import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Users } from 'lucide-react';
import { Carousel } from 'antd';
import type { CarouselRef } from 'antd/lib/carousel';
import heroBanner1 from '@/assets/hero-banner.png';
import heroBanner2 from '@/assets/hero-banner-2.png';
import heroBanner3 from '@/assets/hero-banner-3.png';

const HeroSection: React.FC = () => {
  const carouselRef = React.useRef<CarouselRef>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const banners = [
    { image: heroBanner1, gradient: 'from-white/90 via-white/80 to-white/70' },
    { image: heroBanner2, gradient: 'from-blue-50/90 via-blue-50/80 to-transparent' },
    { image: heroBanner3, gradient: 'from-orange-50/90 via-orange-50/80 to-transparent' }
  ];

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

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.next();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <Carousel
          ref={carouselRef}
          effect="fade"
          speed={800}
          dots={false}
          afterChange={(current) => setActiveSlide(current)}
          className="h-full"
        >
          {banners.map((banner, index) => (
            <div key={index} className="h-full">
              <div
                className="h-[70vh] lg:h-[80vh] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
              </div>
            </div>
          ))}
        </Carousel>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => carouselRef.current?.goTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${activeSlide === index
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div
                className="inline-flex items-center px-4 py-2 rounded-full text-emerald-600 font-medium text-sm"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
              >
                <Heart className="w-4 h-4 mr-2" />
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
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8 py-6 h-auto shadow-card group transition-all duration-300"
              >
                Bắt đầu ngay
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                className="border-primary/20 hover:bg-primary/5 px-8 py-6 h-auto font-semibold transition-all duration-300"
              >
                Tìm hiểu thêm
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="p-3 bg-gradient-primary rounded-full transition-transform duration-300 hover:scale-110">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
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