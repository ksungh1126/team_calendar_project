// App.js
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClassSchedulePage from './pages/ClassSchedulePage';
import TaskPage from './pages/TaskPage';
import { FriendProvider } from './contexts/FriendContext';

function App() {
  return (
    <FriendProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/schedule" element={<ClassSchedulePage />} />
          <Route path="/tasks" element={<TaskPage />} />
        </Routes>
      </Router>
    </FriendProvider>
  );
}

export default App;
