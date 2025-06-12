import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // ⬅️ useLocation 추가
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation(); // ⬅️ useLocation 사용

  // ✅ 1️⃣ 여기 추가: 로그인/회원가입 페이지는 Protected 적용 X
  if (location.pathname === '/login' || location.pathname === '/register') {
    return <>{children}</>;
  }

  if (isLoading) {
    return <div>로딩 중...</div>; // Or a loading spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
