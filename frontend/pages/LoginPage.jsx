// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalendarPage.css'; // 캘린더 CSS 스타일 재활용

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      alert(`로그인 완료: ${email}`);
      navigate('/calendar');
    } else {
      alert('이메일과 비밀번호를 입력해주세요.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="calendar-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="task-panel" style={{ width: '350px', textAlign: 'center' }}>
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-box"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-box"
          />
          <button type="submit" className="add-button">로그인</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          계정이 없으신가요?{' '}
          <span
            onClick={handleRegister}
            style={{ color: '#8855cc', cursor: 'pointer', textDecoration: 'underline' }}>
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;