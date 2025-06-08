const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 회원가입
exports.register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      nickname: username,
      profileImg: null
    });

    return res.json({
      success: true,
      message: '회원가입 성공',
      userInfo: {
        nickname: user.nickname,
        profileImg: user.profileImg
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '회원가입 실패'
    });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

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
        profileImg: user.profileImg
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '로그인 실패'
    });
  }
};