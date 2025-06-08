// app.js
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

app.use(express.json());

// ✅ 라우터 모듈 불러오기
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

// ✅ 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// 기본 루트 라우터
app.get('/', (req, res) => {
  res.send('📅 공유 캘린더 API 서버가 실행 중입니다!');
});

// ✅ 포트 설정 및 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});