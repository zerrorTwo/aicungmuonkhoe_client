/**
 * Example: How to use Started Tour with API
 * 
 * This file demonstrates how to integrate the started tour functionality
 * using the new API-based approach instead of localStorage.
 */

import React from 'react';
import { useTour } from '@/hooks/useTour';
import { StartTourModule } from '@/enum/start-tour';
import StartedTour from '@/components/tour/StartedTour';

/**
 * Example 1: Using the useTour hook (Recommended)
 * This is the simplest way to integrate tour functionality
 */
export const ExampleWithHook: React.FC = () => {
    const {
        runTour,
        handleTourFinish,
        startTour,
        isCompleted,
        isLoading,
    } = useTour(StartTourModule.HEALTH_TRACKING);

    return (
        <div>
            <h1>Health Tracking Page</h1>

            {/* Your page content here */}
            <div className="content">
                {/* ... */}
            </div>

            {/* Tour will automatically start if not completed */}
            <StartedTour run={runTour} onFinish={handleTourFinish} />

            {/* Optional: Show tour status */}
            {isLoading && <p>Loading tour status...</p>}
            {isCompleted && (
                <button onClick={startTour}>
                    Restart Tour
                </button>
            )}
        </div>
    );
};

/**
 * Example 2: Using RTK Query hooks directly
 * Use this if you need more control over the tour behavior
 */
import { useState, useEffect } from 'react';
import {
    useGetStartedTourByFeatureQuery,
    useCreateStartedTourMutation,
} from '@/store/api/startedTourApi';

export const ExampleWithDirectAPI: React.FC = () => {
    const [runTour, setRunTour] = useState(false);

    // Query to check if tour is completed
    const { data: tourData, isLoading } = useGetStartedTourByFeatureQuery({
        FEATURE: StartTourModule.MEAL_PLANNER,
    });

    // Mutation to save tour completion
    const [createStartedTour, { isLoading: isSaving }] = useCreateStartedTourMutation();

    useEffect(() => {
        // Start tour if not completed and not loading
        if (!isLoading && !tourData?.data) {
            // Add delay to ensure DOM is ready
            const timer = setTimeout(() => {
                setRunTour(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [tourData, isLoading]);

    const handleTourFinish = async () => {
        setRunTour(false);

        try {
            await createStartedTour({
                FEATURE: StartTourModule.MEAL_PLANNER,
            }).unwrap();

            console.log('Tour completion saved successfully!');
        } catch (error) {
            console.error('Failed to save tour completion:', error);
            // Handle error - maybe show a notification
        }
    };

    const handleRestartTour = () => {
        setRunTour(true);
    };

    return (
        <div>
            <h1>Meal Planner Page</h1>

            {/* Loading state */}
            {isLoading && <div>Loading...</div>}

            {/* Your page content */}
            <div className="content">
                {/* ... */}
            </div>

            {/* Tour component */}
            <StartedTour run={runTour} onFinish={handleTourFinish} />

            {/* Show restart button if tour is completed */}
            {tourData?.data && (
                <button
                    onClick={handleRestartTour}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Restart Tour'}
                </button>
            )}
        </div>
    );
};

/**
 * Example 3: Conditional tour based on user state
 * Start tour only for new users or specific conditions
 */
import { useGetUserProfileQuery } from '@/store/api/userApi';
import { useAuth } from '@/hooks/useAuth';

export const ExampleConditionalTour: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [runTour, setRunTour] = useState(false);

    // Get user profile
    const { data: profileData, isSuccess } = useGetUserProfileQuery(undefined, {
        skip: !isAuthenticated(),
    });

    // Check tour status
    const { data: tourData } = useGetStartedTourByFeatureQuery(
        { FEATURE: StartTourModule.HOME },
        { skip: !isAuthenticated() }
    );

    const [createStartedTour] = useCreateStartedTourMutation();

    useEffect(() => {
        if (!isAuthenticated()) return;

        // Only start tour if:
        // 1. Tour not completed
        // 2. User has no health document (new user)
        if (!tourData?.data && isSuccess && profileData?.data) {
            const hasHealthDocument =
                profileData.data.HEALTH_DOCUMENT?.ID;

            if (!hasHealthDocument) {
                setRunTour(true);
            }
        }
    }, [isAuthenticated, tourData, isSuccess, profileData]);

    const handleTourFinish = async () => {
        setRunTour(false);
        try {
            await createStartedTour({
                FEATURE: StartTourModule.HOME
            }).unwrap();
        } catch (error) {
            console.error('Failed to save tour:', error);
        }
    };

    return (
        <div>
            <h1>Home Page</h1>

            {/* Only show tour for authenticated users */}
            {isAuthenticated() && (
                <StartedTour run={runTour} onFinish={handleTourFinish} />
            )}
        </div>
    );
};

/**
 * Example 4: Multiple tours on the same page
 * Handle different tour sections separately
 */
export const ExampleMultipleTours: React.FC = () => {
    // Tour for main feature
    const mainTour = useTour(StartTourModule.HEALTH_TRACKING);

    // Tour for secondary feature
    const secondaryTour = useTour(StartTourModule.YOUR_GOAL);

    return (
        <div>
            <h1>Complex Page with Multiple Tours</h1>

            {/* Main section */}
            <section data-tour="main">
                {/* ... */}
            </section>

            {/* Secondary section */}
            <section data-tour="secondary">
                {/* ... */}
            </section>

            {/* Main tour - runs first */}
            {!mainTour.isCompleted && (
                <StartedTour
                    run={mainTour.runTour}
                    onFinish={mainTour.handleTourFinish}
                />
            )}

            {/* Secondary tour - runs after main tour is completed */}
            {mainTour.isCompleted && !secondaryTour.isCompleted && (
                <StartedTour
                    run={secondaryTour.runTour}
                    onFinish={secondaryTour.handleTourFinish}
                />
            )}

            {/* Manual controls */}
            <div className="tour-controls">
                <button onClick={mainTour.startTour}>
                    Restart Main Tour
                </button>
                <button onClick={secondaryTour.startTour}>
                    Restart Secondary Tour
                </button>
            </div>
        </div>
    );
};
