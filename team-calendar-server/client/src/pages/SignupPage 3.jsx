import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/register', { name, email, password });
      navigate('/');
    } catch (err) {
      console.error(err);
      setMessage('❌ 회원가입 실패: 입력 정보를 확인해주세요.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
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
        <h2 style={{ color: '#0d47a1', marginBottom: '24px' }}>회원가입</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={name}
            placeholder="이름"
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          />
          <input
            type="email"
            value={email}
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
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
              width: '100%',
              padding: '12px',
              marginBottom: '24px',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          />
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#0d47a1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            회원가입
          </button>
        </form>
        {message && <p style={{ color: 'red', marginTop: '1rem' }}>{message}</p>}
      </div>
    </div>
  );
}

export default SignupPage;