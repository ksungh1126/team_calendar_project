import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/reset-password', { email });
      setMessage('📩 비밀번호 재설정 링크가 이메일로 전송되었습니다.');
    } catch (err) {
      console.error(err);
      setMessage('❌ 요청 실패: 이메일을 확인해주세요.');
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
        <h2 style={{ color: '#0d47a1', marginBottom: '24px' }}>비밀번호 재설정</h2>
        <form onSubmit={handleReset}>
          <input
            type="email"
            value={email}
            placeholder="이메일 입력"
            onChange={(e) => setEmail(e.target.value)}
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
            재설정 링크 보내기
          </button>
        </form>
        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
        <button onClick={() => navigate('/')} style={{
          marginTop: '16px',
          background: 'none',
          border: 'none',
          color: '#0d47a1',
          cursor: 'pointer',
          textDecoration: 'underline',
          fontSize: '0.9rem'
        }}>
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordPage;