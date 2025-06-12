const express = require('express');
const cors = require('cors');
console.log('1. 기본 모듈 로드 완료');

const { sequelize } = require('./models');
console.log('2. Sequelize 모델 로드 완료');

const authRoutes = require('./routes/auth');
const friendRoutes = require('./routes/friend');
const teamRoutes = require('./routes/team');
const subjectRoutes = require('./routes/subject');
const eventRoutes = require('./routes/event');
console.log('3. 라우터 모듈 로드 완료');

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 미들웨어 추가
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

console.log('4. 미들웨어 설정 완료');

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Team Calendar API Server' });
});

// API 라우트 설정
console.log('5. API 라우트 설정 시작');
app.use('/api/auth', authRoutes);
console.log('5-1. auth 라우트 설정 완료');
app.use('/api/friend', friendRoutes);
console.log('5-2. friend 라우트 설정 완료');
app.use('/api/team', teamRoutes);
console.log('5-3. team 라우트 설정 완료');
app.use('/api/subject', subjectRoutes);
console.log('5-4. subject 라우트 설정 완료');
app.use('/api/event', eventRoutes);
console.log('5-5. event 라우트 설정 완료');

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error('에러 발생:', err);
  console.error('에러 스택:', err.stack);
  res.status(500).json({ error: '서버 에러가 발생했습니다.' });
});

// 서버 시작
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
    console.error('에러 스택:', error.stack);
  }
};

startServer(); 