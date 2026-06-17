import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import './index.css';

const ProtectedRoute = ({ children, isAuthenticated, isAdmin }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some(route => window.location.pathname.startsWith(route));

  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={false}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to={isAuthenticated ? (isAdmin ? "/admin/dashboard" : "/user/dashboard") : "/login"} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
