import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import WeatherTipSection from '@/components/sections/WeatherTipSection';
import HealthTrackingSection from '@/components/sections/HealthTrackingSection';
import HealthConsultationSection from '@/components/sections/HealthConsultationSection';
import MealPlanningSection from '@/components/sections/MealPlanningSection';
import Footer from '@/components/layout/Footer';
import StartedTour from '@/components/tour/StartedTour';
import { useGetUserProfileQuery } from '@/store/api/userApi';
import { useAuth } from '@/hooks/useAuth';

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [runTour, setRunTour] = useState(false);
    const TOUR_COMPLETED_KEY = 'tour_completed';

    // Get user profile to check if health document exists
    const { data: profileData, isSuccess } = useGetUserProfileQuery(undefined, {
        skip: !isAuthenticated(),
    });

    useEffect(() => {
        // Only run tour for authenticated users
        if (!isAuthenticated()) {
            return;
        }

        // Check if tour has been completed before
        const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
        if (tourCompleted) {
            return;
        }

        // If profile data loaded and health document doesn't exist, start tour immediately
        if (isSuccess && profileData?.data) {
            const hasHealthDocument = profileData.data.HEALTH_DOCUMENT &&
                profileData.data.HEALTH_DOCUMENT.ID;

            if (!hasHealthDocument) {
                setRunTour(true);
            }
        }
    }, [isAuthenticated, isSuccess, profileData]);

    const handleTourFinish = () => {
        setRunTour(false);
        localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header data-tour="profile" />
            <main>
                <HeroSection />
                <WeatherTipSection />
                <HealthTrackingSection data-tour="bmi-calculator" />
                <HealthConsultationSection data-tour="recommendations" />
                <MealPlanningSection />
            </main>
            <Footer />

            {/* Started Tour for new users */}
            {isAuthenticated() && <StartedTour run={runTour} onFinish={handleTourFinish} />}
        </div>
    );
};

export default Home;
