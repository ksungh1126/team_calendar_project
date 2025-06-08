// middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET 환경 변수가 설정되어 있지 않습니다.');
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId }; // 구조 명확히 지정
    next();
  } catch (err) {
    console.error('JWT 인증 실패:', err.message);
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

module.exports = { protect };