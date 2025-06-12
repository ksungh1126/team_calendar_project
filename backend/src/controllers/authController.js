const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 회원가입
const register = async (req, res) => {
  try {
    const { email, password, name, studentId, major, grade } = req.body;

    // 이메일 중복 체크
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
    }

    // 학생번호 중복 체크 (있는 경우)
    if (studentId) {
      const existingStudent = await User.findOne({ where: { studentId } });
      if (existingStudent) {
        return res.status(400).json({ error: '이미 사용 중인 학번입니다.' });
      }
    }

    // 사용자 생성
    const user = await User.create({
      email,
      password,
      name,
      studentId,
      major,
      grade
    });

    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        studentId: user.studentId,
        major: user.major,
        grade: user.grade
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 로그인
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        studentId: user.studentId,
        major: user.major,
        grade: user.grade
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 내 정보 조회
const getMe = async (req, res) => {
  try {
    const user = req.user;

    // ✅ 사용자 정보 객체만 바로 반환 (user: { ... } 감싸지 않음)
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      studentId: user.studentId,
      major: user.major,
      grade: user.grade
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe
}; 