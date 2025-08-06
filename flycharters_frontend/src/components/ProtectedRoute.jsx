import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const ProtectedRoute = ({ allowedRoles,children }) => {
    const { user, loading } = useAuth();
    // console.log('user is:',user);
    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/unauthorized" />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

    return children;
};


export default ProtectedRoute;