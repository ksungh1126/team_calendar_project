// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // db 연결 파일 import
require('dotenv').config();

// 회원가입 API
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 정보 DB에 저장
    await db.execute(
      'INSERT INTO users (email, password, nickname, profileImg) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, username, null]
    );

    return res.json({
      success: true,
      message: '회원가입 성공',
      userInfo: {
        nickname: username,
        profileImg: null
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '회원가입 실패'
    });
  }
});

// 로그인 API
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자 조회
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    const user = rows[0];

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      success: true,
      message: '로그인 성공',
      token,
      userInfo: {
        nickname: user.nickname,
        profileImg: user.profileImg || null // 프론트 요구사항에 맞춰 null fallback 추가
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '로그인 실패'
    });
  }
});

module.exports = router;
