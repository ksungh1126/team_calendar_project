// index.js

console.log("▶ index.js가 로드되었습니다!");

const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");

console.log("▶ authRouter:", authRouter);
console.log("▶ typeof authRouter:", typeof authRouter);

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 요청 body 파싱

// 라우터 연결
console.log("▶ authRouter is:", authRouter);
console.log("▶ typeof authRouter:", typeof authRouter);
app.use("/api", authRouter); // → /api/register, /api/login 등

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});