import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const authService = {
  // 로그인
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // 회원가입
  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem('token');
  },

  // 내 정보 조회
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService; 