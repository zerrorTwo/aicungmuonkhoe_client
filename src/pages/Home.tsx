import React from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import WeatherTipSection from '@/components/sections/WeatherTipSection';
import HealthTrackingSection from '@/components/sections/HealthTrackingSection';
import HealthConsultationSection from '@/components/sections/HealthConsultationSection';
import MealPlanningSection from '@/components/sections/MealPlanningSection';
import Footer from '@/components/layout/Footer';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <HeroSection />
                <WeatherTipSection />
                <HealthTrackingSection />
                <HealthConsultationSection />
                <MealPlanningSection />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
