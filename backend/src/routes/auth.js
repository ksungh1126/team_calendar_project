const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

// 회원가입
router.post('/register', register);

// 로그인
router.post('/login', login);

// 내 정보 조회
router.get('/me', auth, getMe);

module.exports = router; 