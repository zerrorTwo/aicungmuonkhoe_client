import { useState, useEffect } from 'react';

export const useTour = () => {
    const [runTour, setRunTour] = useState(false);
    const TOUR_COMPLETED_KEY = 'tour_completed';

    useEffect(() => {
        // Check if tour has been completed before
        const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
        if (!tourCompleted) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                setRunTour(true);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleTourFinish = () => {
        setRunTour(false);
        localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    };

    const startTour = () => {
        setRunTour(true);
    };

    const resetTour = () => {
        localStorage.removeItem(TOUR_COMPLETED_KEY);
        setRunTour(true);
    };

    return {
        runTour,
        handleTourFinish,
        startTour,
        resetTour,
    };
};
