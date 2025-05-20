// RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImg(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !nickname) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    localStorage.setItem('user', email);
    localStorage.setItem(`userInfo_${email}`, JSON.stringify({ nickname, profileImg }));
    alert('회원가입 성공! 자동 로그인되었습니다.');
    navigate('/calendar');
  };

  return (
    <div className="login-container">
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
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
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
        <input type="file" accept="image/*" onChange={handleImageChange} className="input-box" />
        {profileImg && <img src={profileImg} alt="미리보기" style={{ width: '80px', borderRadius: '50%', marginBottom: '10px' }} />}
        <button type="submit" className="add-button">회원가입</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        이미 계정이 있으신가요? <a href="/login">로그인</a>
      </p>
    </div>
  );
}

export default RegisterPage;