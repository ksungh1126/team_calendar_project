// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CalendarPage from './pages/CalendarPage';
import TaskPage from './pages/TaskPage';
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
          </Routes>
        </Router>
      </FriendProvider>
    </TaskProvider>
  );
}

export default App;
