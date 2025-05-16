import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', { email, password });
      const { token, user } = res.data;

      // JWT 저장
      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.name);

      // 메인 페이지로 이동
      navigate('/main');
    } catch (err) {
      console.error(err);
      setMessage('❌ 로그인 실패: 이메일 또는 비밀번호를 확인하세요');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#ffffff',
      fontFamily: "'Pretendard', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '360px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#0d47a1', marginBottom: '24px' }}>팀 캘린더 로그인</h2>
        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="email"
              value={email}
              placeholder="이메일"
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '80%',
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="password"
              value={password}
              placeholder="비밀번호"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '80%',
                padding: '12px',
                marginBottom: '24px',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}
            />
            <button type="submit" style={{
              width: '80%',
              padding: '12px',
              backgroundColor: '#0d47a1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              로그인
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              style={{
                marginTop: '12px',
                width: '80%',
                padding: '12px',
                backgroundColor: '#e0e0e0',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              회원가입
            </button>
            <button
              type="button"
              onClick={() => navigate('/reset-password')}
              style={{
                marginTop: '8px',
                background: 'none',
                border: 'none',
                color: '#0d47a1',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              비밀번호 찾기
            </button>
          </div>
        </form>
        {message && <p style={{ color: 'red', marginTop: '1rem' }}>{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
