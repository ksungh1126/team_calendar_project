// routes/auth.js
const express = require("express");
const router = express.Router();
const users = require("../users");

// ✅ 회원가입
// POST /api/register
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // 필수 값 확인
  if (!username || !password) {
    return res.status(400).json({ message: "아이디와 비밀번호를 입력하세요." });
  }

  // 중복 확인
  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
  }

  // 유저 추가
  users.push({ username, password });
  return res.json({ message: "회원가입 성공", username });
});

// ✅ 로그인
// POST /api/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 필수 값 확인
  if (!username || !password) {
    return res.status(400).json({ message: "아이디와 비밀번호를 입력하세요." });
  }

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
  }

  return res.json({ message: "로그인 성공", username });
});

// ✅ 비밀번호 변경
// PUT /api/change-password
router.put("/change-password", (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  }

  const user = users.find((u) => u.username === username);
  if (!user || user.password !== oldPassword) {
    return res.status(401).json({ message: "사용자 확인 실패 또는 기존 비밀번호가 틀렸습니다." });
  }

  user.password = newPassword;
  return res.json({ message: "비밀번호 변경 성공" });
});

// ✅ 비밀번호 찾기 (간단 구현: username만 입력하면 “초기화 토큰” 반환)
// POST /api/find-password
router.post("/find-password", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "아이디를 입력하세요." });
  }

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
  }

  // 실제론 이메일 인증 등 과정을 거치지만, 여기선 간단히 토큰 반환
  const resetToken = Math.random().toString(36).substr(2, 8);
  return res.json({ message: "비밀번호 찾기 토큰 발급", resetToken });
});

module.exports = router;