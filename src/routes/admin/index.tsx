import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AuthGuard from '@/components/admin/AuthGuard';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes; 