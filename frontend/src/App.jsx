import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeamPage from './pages/TeamPage';
import TeamspacePage from './pages/TeamspacePage';
import FriendPage from './pages/FriendPage';
import SchooltimePage from './pages/SchooltimePage';
import TeamspacePage from './pages/TeamspacePage';

import { UserProvider } from './context/UserContext';
import { CalendarProvider } from './context/CalendarContext';
import { FriendProvider } from './context/FriendContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <UserProvider>
      <CalendarProvider>
        <FriendProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <MainPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/main" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <TeamPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teamspace"
                element={
                  <ProtectedRoute>
                    <TeamspacePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/friends"
                element={
                  <ProtectedRoute>
                    <FriendPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schooltime"
                element={
                  <ProtectedRoute>
                    <SchooltimePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </FriendProvider>
      </CalendarProvider>
    </UserProvider>
  );
}

export default App; 