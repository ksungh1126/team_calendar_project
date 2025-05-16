const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. 이메일 중복 검사
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: '이미 존재하는 이메일입니다.' });
    }

    // 2. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. DB에 사용자 정보 저장
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // 4. 성공 응답
    res.status(201).json({ success: true, message: '회원가입 완료!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '회원가입 실패' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. 이메일로 사용자 조회
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const user = users[0];

    // 2. 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 3. JWT 토큰 발급
    const token = jwt.sign(
      { user_id: user.user_id, name: user.name }, // 👈 user_id 포함!
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // 4. 성공 응답
    res.json({
      success: true,
      message: '로그인 성공!',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '로그인 실패' });
  }
};
