import React, { useMemo, useState } from 'react';
import Lottie from 'lottie-react';
import { Baby, User, Users2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useGetUserProfileQuery } from '@/store/api/userApi';
import { useNavigate } from 'react-router-dom';
import childrenLottie from '@/assets/lotties/children.json';
import selfLottie from '@/assets/lotties/self.json';
import parentLottie from '@/assets/lotties/parent.json';

const Segment = {
  Children: 0,
  Self: 1,
  Parent: 2
} as const;

type SegmentType = typeof Segment[keyof typeof Segment];

const HealthTrackingSection: React.FC<{ 'data-tour'?: string }> = ({ 'data-tour': dataTour }) => {
  const [activeSegment, setActiveSegment] = useState<SegmentType>(Segment.Self);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated(),
  });

  const lottieFile = useMemo(() => {
    switch (activeSegment) {
      case Segment.Children:
        return childrenLottie;
      case Segment.Self:
        return selfLottie;
      case Segment.Parent:
        return parentLottie;
    }
  }, [activeSegment]);

  const handleShowDetail = () => {
    if (isAuthenticated()) {
      const healthDocumentId = profileData?.data?.HEALTH_DOCUMENT?.ID;
      if (healthDocumentId) {
        navigate(`/health-tracking/${healthDocumentId}`);
      } else {
        // If no health document, navigate to profile or create health document
        navigate('/profile');
      }
    } else {
      // Redirect to login
      navigate('/login');
    }
  };

  const segmentConfig = [
    {
      type: Segment.Children,
      icon: Baby,
      label: 'Con cái',
      color: '#1DCBB6'
    },
    {
      type: Segment.Self,
      icon: User,
      label: 'Bản thân',
      color: '#1DCBB6'
    },
    {
      type: Segment.Parent,
      icon: Users2,
      label: 'Bố mẹ',
      color: '#1DCBB6'
    }
  ];

  return (
    <section
      className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-background via-muted/20 to-background py-16"
      data-tour={dataTour}
    >
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="text-foreground">Theo dõi </span>
            <span className="bg-gradient-primary bg-clip-text text-transparent">sức khỏe</span>
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full">
          {/* Left Content */}
          <div className="flex flex-col w-full lg:w-auto lg:max-w-[544px]">
            {/* Segmented Control */}
            <div className="relative flex items-center justify-between w-full h-20 lg:h-24 rounded-2xl bg-white border-[3px] border-primary/30 overflow-hidden mb-6">
              {segmentConfig.map((segment) => (
                <div
                  key={segment.type}
                  className={`flex items-center justify-center gap-3 lg:gap-4 flex-1 cursor-pointer relative z-10 h-full transition-colors duration-400 ${activeSegment === segment.type
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground font-normal'
                    }`}
                  onClick={() => setActiveSegment(segment.type)}
                >
                  {React.createElement(segment.icon, {
                    className: "w-7 h-7 lg:w-9 lg:h-9"
                  })}
                  <span className="text-lg lg:text-xl">{segment.label}</span>
                </div>
              ))}
              {/* Active Indicator */}
              <div
                className="absolute bottom-0 left-0 h-full w-1/3 bg-primary/10 transition-transform duration-400 ease-in-out"
                style={{
                  transform: `translateX(${activeSegment * 100}%)`
                }}
              />
            </div>

            {/* Description */}
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-12 lg:mb-16">
              Theo dõi chỉ số sức khỏe quan trọng trong suốt cuộc đời cho tất cả
              thành viên trong gia đình để hỗ trợ chăm sóc sức khỏe tốt hơn
            </p>

            {/* View Detail Button */}
            <Button
              onClick={handleShowDetail}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8 py-6 h-auto text-xl lg:text-2xl rounded-full w-full lg:w-auto lg:max-w-[260px] shadow-card group transform transition-all duration-300 hover:scale-105"
            >
              Xem chi tiết
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Right Animation */}
          <div className="w-full lg:w-auto flex items-center justify-center">
            <Lottie
              animationData={lottieFile}
              loop={false}
              className="w-full max-w-md lg:max-w-lg h-auto"
              style={{ minHeight: '300px', maxHeight: '500px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthTrackingSection;