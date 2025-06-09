import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // 회원가입
  register: async (userData) => {
    console.log('회원가입 시도:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('회원가입 응답:', response.data);
    return response.data;
  },

  // 로그인
  login: async (credentials) => {
    console.log('로그인 시도:', credentials);
    const response = await api.post('/auth/login', credentials);
    console.log('로그인 응답:', response.data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
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