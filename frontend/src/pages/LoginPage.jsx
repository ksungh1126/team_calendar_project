// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`로그인 실패: ${err.message || '오류 발생'}`);
        return;
      }

      const data = await res.json();
      localStorage.setItem('user', data.email);
      localStorage.setItem(`userInfo_${data.email}`, JSON.stringify({
        nickname: data.nickname,
        profileImg: data.profileImg || null,
      }));

      alert('로그인 성공!');
      navigate('/calendar');
    } catch (error) {
      console.error('로그인 에러:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="input-box"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input-box"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="add-button">로그인</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        아직 회원이 아니신가요? <Link to="/register">회원가입</Link>
      </p>
    </div>
  );
}

export default LoginPage;
