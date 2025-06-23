import { Routes, Route, Navigate } from 'react-router-dom';
import UserLogin from './pages/user/userLogin';
import UserHome from './pages/user/userHome';
import ProtectedRoute from '../src/components/ProtectRoute';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';


import { AdminLayout } from './pages/admin/AdminLayout';
import AdminResponses from './pages/admin/AdminResponses';
import LandingPage from './pages/LandingPage';



function App() {
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
      {/* User Routes */}
      <Route path="/user/login" element={<UserLogin />} />
      <Route
        path="/user/home"
        element={
          <ProtectedRoute>
            <UserHome />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="responses" element={<AdminResponses />} />
        
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/user/login" />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
