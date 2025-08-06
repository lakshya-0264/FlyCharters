// src/layouts/UserLayout.jsx
import { Outlet } from 'react-router-dom';
import User_dash from '../components/CustomerView/User_dash.jsx';
import Footer from '../components/LandingPage/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import NotificationIcon from '../components/common/Notification.jsx';
const userId = localStorage.getItem("id");

const UserLayout = () => {
    return (
        <ProtectedRoute allowedRoles={['user']}>
        <NotificationIcon userId={userId}/>
        <User_dash />
        </ProtectedRoute>
    );
};

export default UserLayout;