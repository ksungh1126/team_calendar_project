// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CalendarPage from './pages/CalendarPage';
import TaskPage from './pages/TaskPage';
import ClassSchedulePage from './pages/ClassSchedulePage'; // 새로 추가
import { TaskProvider } from './contexts/TaskContext';
import { FriendProvider } from './contexts/FriendContext';

function App() {
  return (
    <TaskProvider>
      <FriendProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/tasks" element={<TaskPage />} />
            <Route path="/schedule" element={<ClassSchedulePage />} /> {/* 수업 시간표 경로 */}
          </Routes>
        </Router>
      </FriendProvider>
    </TaskProvider>
  );
}

export default App;
