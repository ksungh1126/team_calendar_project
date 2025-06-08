const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;

const initializeDatabase = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ 데이터베이스 연결 성공');
    
    // 개발 환경에서만 테이블 동기화
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true });
      console.log('✅ 데이터베이스 테이블 동기화 완료');
    }
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    process.exit(1);
  }
};

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다!`);
});

// 데이터베이스 초기화
initializeDatabase(); 