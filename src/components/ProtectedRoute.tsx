import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuthStore } from '../lib/store/authStore';

type ProtectedRouteProps = {
    children: ReactNode;
    requireAuthentication?: boolean;
    role?: 'patient' | 'staff' | 'admin';
    redirectTo?: string;
};

export const ProtectedRoute = ({
    children,
    requireAuthentication = true,
    role='patient',
    redirectTo = '/',
}: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore();
    
    if (requireAuthentication && !isAuthenticated()) {
        return <Navigate to={redirectTo} replace />;
    }

    if(user.role !== role) {
        return <Navigate to={redirectTo} replace/>
    }
    
    return <>{children}</>;
};