import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLogin from '@/components/admin/AdminLogin';
import AuthGuard from '@/components/admin/AuthGuard';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AuthGuard />}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
      <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes; 