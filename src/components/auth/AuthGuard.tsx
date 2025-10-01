// Authentication Guard Component
import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

interface AuthGuardProps {
    children: ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    requireAuth = true,
    redirectTo = '/login'
}) => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isLoading && requireAuth && !isAuthenticated) {
            navigate(redirectTo);
        }
    }, [isAuthenticated, isLoading, requireAuth, navigate, redirectTo]);

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If auth is required but user is not authenticated, return null (redirect will happen)
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default AuthGuard;