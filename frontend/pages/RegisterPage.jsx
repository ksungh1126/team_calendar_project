// RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalendarPage.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    alert(`회원가입 완료: ${email}`);
    navigate('/login');
  };

  return (
    <div className="calendar-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="task-panel" style={{ width: '350px', textAlign: 'center' }}>
        <h2>회원가입</h2>
        <form onSubmit={handleRegister}>
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
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-box"
          />
          <button type="submit" className="add-button">회원가입</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          이미 계정이 있으신가요?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#8855cc', cursor: 'pointer', textDecoration: 'underline' }}>
            로그인
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;