// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/db-pool'); // 바뀐 부분! db 대신 sequelize 사용
require('dotenv').config();

// 회원가입 API
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await sequelize.query(
      'INSERT INTO users (email, password, nickname, profileImg) VALUES (?, ?, ?, ?)',
      {
        replacements: [email, hashedPassword, username, null],
        type: sequelize.QueryTypes.INSERT
      }
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
    const [users] = await sequelize.query(
      'SELECT * FROM users WHERE email = ?',
      {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!users) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    const isMatch = await bcrypt.compare(password, users.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    const token = jwt.sign(
      { userId: users.id, email: users.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      success: true,
      message: '로그인 성공',
      token,
      userInfo: {
        nickname: users.nickname,
        profileImg: users.profileImg || null
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
