require('dotenv').config();

const express = require('express');
const cors = require('cors');
console.log('1. 기본 모듈 로드 완료');

const { sequelize } = require('./models');
console.log('2. Sequelize 모델 로드 완료');

const authRoutes = require('./routes/auth');
const friendsRoutes = require('./routes/friends');  // ✅ 여기 이름은 friendsRoutes가 맞음
const teamRoutes = require('./routes/team');
const subjectRoutes = require('./routes/subject');
const eventRoutes = require('./routes/event');
console.log('3. 라우터 모듈 로드 완료');

const app = express();
const port = process.env.PORT || 3000;

// CORS 설정
const corsOptions = {
  origin: ['http://localhost:5173', 'https://team-calendar-frontend.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 미들웨어 추가
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
console.log('4. 미들웨어 설정 완료');

// 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/events', eventRoutes);
console.log('5. API 라우트 설정 완료');

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결 성공');
    await sequelize.sync();
    console.log('데이터베이스 동기화 완료');
    app.listen(port, () => {
      console.log(`✅서버가 http://localhost:${port} 에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
  }
};

startServer();
