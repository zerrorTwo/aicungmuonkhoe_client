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
import {
    useGetStartedTourByFeatureQuery,
    useCreateStartedTourMutation,
} from '@/store/api/startedTourApi';
import { StartTourModule } from '@/enum/start-tour';

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [runTour, setRunTour] = useState(false);

    // Get user profile to check if health document exists
    const { data: profileData, isSuccess } = useGetUserProfileQuery(undefined, {
        skip: !isAuthenticated(),
    });

    // Check if tour has been completed via API
    const { data: tourData } = useGetStartedTourByFeatureQuery(
        { FEATURE: StartTourModule.HOME },
        { skip: !isAuthenticated() }
    );

    // Mutation to mark tour as completed
    const [createStartedTour] = useCreateStartedTourMutation();

    useEffect(() => {
        // Only run tour for authenticated users
        if (!isAuthenticated()) {
            return;
        }

        // Check if tour has been completed before via API
        if (tourData?.data) {
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
    }, [isAuthenticated, isSuccess, profileData, tourData]);

    const handleTourFinish = async () => {
        setRunTour(false);
        // Save tour completion via API
        try {
            await createStartedTour({ FEATURE: StartTourModule.HOME }).unwrap();
        } catch (error) {
            console.error('Failed to save tour completion:', error);
        }
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
