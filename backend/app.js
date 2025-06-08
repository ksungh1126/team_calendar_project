// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 라우터 연결
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/friends', require('./routes/friendRoutes'));

// 기본 루트 라우터
app.get('/', (req, res) => {
  res.send('📅 공유 캘린더 API 서버가 실행 중입니다!');
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '서버 에러가 발생했습니다.'
  });
});

module.exports = app;