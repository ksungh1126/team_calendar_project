import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ko } from "date-fns/locale";

import theme from "./theme";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import TeamPage from "./pages/TeamPage";
import TeamspacePage from "./pages/TeamspacePage";
import FriendPage from "./pages/FriendPage";

import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import { TeamProvider } from "./context/TeamContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
          <AuthProvider>
            <TeamProvider>
              <EventProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
  
                    <Route
                      path="/main"
                      element={
                        <ProtectedRoute>
                          <MainPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/register" element={<RegisterPage />} />
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
                    {/* 🔥 SchooltimePage 관련 경로 및 import 제거됨 */}
                  </Routes>
                </BrowserRouter>
              </EventProvider>
            </TeamProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
