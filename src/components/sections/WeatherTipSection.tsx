import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sun,
  CloudRain,
  Cloud,
  Snowflake,
  Wind,
  Clock,
  Lightbulb,
  RefreshCw,
  MapPin,
  Thermometer
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'windy';
  humidity: number;
  location: string;
}

const WeatherTipSection: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTip, setCurrentTip] = useState(0);
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    condition: 'sunny',
    humidity: 65,
    location: 'Hồ Chí Minh'
  });

  const healthTips = [
    "Hãy duy trì thói quen uống đủ nước mỗi ngày, khoảng 2 lít, vì nước không chỉ giúp cơ thể loại bỏ độc tố mà còn giữ cho làn da tươi trẻ, tinh thần tỉnh táo và các cơ quan hoạt động nhịp nhàng.",
    "Tập thể dục 30 phút mỗi ngày giúp tăng cường hệ miễn dịch, cải thiện sức khỏe tim mạch và giảm nguy cơ mắc các bệnh mãn tính.",
    "Ăn đa dạng 5 màu sắc trái cây và rau củ mỗi ngày để cung cấp đầy đủ vitamin, khoáng chất và chất chống oxy hóa cho cơ thể.",
    "Ngủ đủ 7-8 tiếng mỗi đêm giúp cơ thể phục hồi, tăng cường trí nhớ và duy trì cân nặng khỏe mạnh.",
    "Thực hành thiền định hoặc yoga 10-15 phút mỗi ngày để giảm stress, cải thiện sự tập trung và nâng cao chất lượng cuộc sống.",
    "Hạn chế thực phẩm chế biến sẵn và đường tinh luyện, thay vào đó chọn thực phẩm tự nhiên để bảo vệ sức khỏe tim mạch và kiểm soát cân nặng.",
    "Rửa tay thường xuyên với xà phòng trong ít nhất 20 giây để ngăn ngừa vi khuẩn và virus gây bệnh.",
    "Duy trì mối quan hệ xã hội tích cực và dành thời gian cho gia đình, bạn bè để cải thiện sức khỏe tinh thần."
  ];

  const weatherIcons = {
    sunny: Sun,
    rainy: CloudRain,
    cloudy: Cloud,
    snowy: Snowflake,
    windy: Wind
  };

  const weatherColors = {
    sunny: 'text-orange-500',
    rainy: 'text-blue-500',
    cloudy: 'text-gray-500',
    snowy: 'text-gray-300',
    windy: 'text-green-500'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate weather changes
    const weatherTimer = setInterval(() => {
      const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      setWeather(prev => ({
        ...prev,
        condition: randomCondition,
        temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
        humidity: Math.floor(Math.random() * 30) + 50 // 50-80%
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(weatherTimer);
  }, []);

  const refreshTip = () => {
    setCurrentTip((prev) => (prev + 1) % healthTips.length);
  };

  const WeatherIcon = weatherIcons[weather.condition];
  const formatTime = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <section className="py-16 lg:py-15 bg-gradient-to-br from-muted/30 to-secondary/20" style={{ background: 'linear-gradient(135deg, hsl(195 100% 98%), hsl(210 100% 98%))' }}>
      <div className="container mx-auto px-4 lg:px-6" >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weather & Time Card */}
          <Card
            className="p-6 lg:p-8 border-0 shadow-weather backdrop-blur-sm animate-slide-in-up"
            style={{ background: 'linear-gradient(135deg, hsl(195 100% 96%), hsl(210 100% 97%))' }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-3 rounded-full"
                    style={{ background: 'linear-gradient(135deg, hsl(195 100% 85%), hsl(210 100% 90%))' }}
                  >
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                    Thời gian & Thời tiết
                  </h2>
                </div>
                <div className={`p-2 rounded-full bg-background/50 ${weatherColors[weather.condition]}`}>
                  <WeatherIcon className="w-8 h-8 animate-pulse-gentle" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-background/30 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Hiện tại</p>
                  <p className="text-lg font-medium text-foreground">
                    {formatTime(currentTime)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-background/30 rounded-xl">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-muted-foreground">Nhiệt độ</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{weather.temperature}°C</p>
                  </div>

                  <div className="text-center p-4 bg-background/30 rounded-xl">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Vị trí</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{weather.location}</p>
                  </div>
                </div>

                <div className="text-center p-3 bg-background/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Độ ẩm: <span className="font-medium text-foreground">{weather.humidity}%</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Health Tip Card */}
          <Card
            className="p-6 lg:p-8 border-0 shadow-tip backdrop-blur-sm animate-slide-in-up"
            style={{ background: 'linear-gradient(135deg, hsl(158 64% 96%), hsl(134 61% 97%))' }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-3 rounded-full"
                    style={{ background: 'linear-gradient(135deg, hsl(134 61% 65%), hsl(158 64% 70%))' }}
                  >
                    <Lightbulb className="w-6 h-6 text-white animate-pulse-gentle" />
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                    Tip sức khỏe hôm nay
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshTip}
                  className="p-2 h-auto border-primary/20 hover:bg-primary/5"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-background/30 rounded-xl border border-primary/10">
                  <p className="text-base lg:text-lg leading-relaxed text-foreground">
                    {healthTips[currentTip]}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Tip #{currentTip + 1} / {healthTips.length}</span>
                  <span>Cập nhật mỗi lần tải lại trang</span>
                </div>

                <div className="text-center">
                  <Button
                    onClick={refreshTip}
                    className="hover:opacity-90 text-white px-6 py-2 h-auto shadow-card"
                    style={{ background: 'linear-gradient(135deg, hsl(134 61% 65%), hsl(158 64% 70%))' }}
                  >
                    Xem tip khác
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WeatherTipSection;