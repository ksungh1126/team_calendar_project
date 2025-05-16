// app.js
console.log('🌐 DATABASE_URL:', process.env.DATABASE_URL);
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

require('dotenv').config();
console.log('✅ DB 연결 정보 확인:', process.env.DB_HOST, process.env.DB_NAME);

const testRoutes = require('./routes/testRoutes');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(testRoutes);
app.use(authRoutes);
app.use(protectedRoutes);
app.use('/', scheduleRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('✅ 서버가 정상 작동 중입니다!');
});

// 포트 설정
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
