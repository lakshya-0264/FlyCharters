// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/AdminView/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminLayout = () => {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
        <AdminHeader />
        <Outlet />
        </ProtectedRoute>
    );
};

export default AdminLayout;