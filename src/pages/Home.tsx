
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Users, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import WeatherTipSection from '@/components/sections/WeatherTipSection';
import HealthTrackingSection from '@/components/sections/HealthTrackingSection';
import HealthConsultationSection from '@/components/sections/HealthConsultationSection';
import MealPlanningSection from '@/components/sections/MealPlanningSection';
import Footer from '@/components/layout/Footer';

const Home: React.FC = () => {

    const features = [
        {
            icon: Heart,
            title: 'Theo dõi sức khỏe',
            description: 'Ghi lại và theo dõi các chỉ số sức khỏe quan trọng của bạn',
            color: 'text-emerald-600'
        },
        {
            icon: Activity,
            title: 'Tư vấn trực tuyến',
            description: 'Tư vấn với các chuyên gia y tế qua video call',
            color: 'text-blue-600'
        },
        {
            icon: Users,
            title: 'Cộng đồng sức khỏe',
            description: 'Kết nối với cộng đồng và chia sẻ kinh nghiệm',
            color: 'text-orange-600'
        },
        {
            icon: Shield,
            title: 'An toàn & bảo mật',
            description: 'Dữ liệu của bạn được bảo vệ an toàn tuyệt đối',
            color: 'text-purple-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 lg:py-24">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
                            Chăm sóc sức khỏe{' '}
                            <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                                toàn diện
                            </span>
                        </h1>
                        <p className="text-lg lg:text-xl text-slate-600 mb-8">
                            Nền tảng chăm sóc sức khỏe hàng đầu Việt Nam, mang đến các giải pháp y tế
                            hiện đại và toàn diện cho mọi gia đình.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
                            <Link to="/register">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                                    Bắt đầu ngay
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="outline" size="lg" className="text-lg px-8">
                                    Tìm hiểu thêm
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Tính năng nổi bật
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Khám phá các tính năng giúp bạn chăm sóc sức khỏe một cách hiệu quả và khoa học
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                                <CardHeader className="text-center">
                                    <div className={`mx-auto w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4`}>
                                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-16">
                    <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xl">
                        <CardContent className="text-center py-12">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Sẵn sàng bắt đầu hành trình chăm sóc sức khỏe?
                            </h2>
                            <p className="text-lg mb-8 opacity-90">
                                Tham gia cùng hàng nghìn người dùng đã tin tướng và sử dụng dịch vụ của chúng tôi
                            </p>
                            <Link to="/login">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="bg-white text-emerald-600 hover:bg-white/90 text-lg px-8"
                                >
                                    Đăng ký miễn phí
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;