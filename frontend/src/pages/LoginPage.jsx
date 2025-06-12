import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      console.log('로그인 성공!');
      navigate('/main');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
      console.error('로그인 실패:', errorMessage);
      setError(errorMessage);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    loginMutation.mutate({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          mx: 'auto',
        }}
      >
      <Box sx={{ mb: 2 }}>
    <img
      src="/team_calendar_logo.jpg"
      alt="Team Calendar"
      style={{ width: '200px', objectFit: 'contain' }}
    />
  </Box>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          로그인
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
          required
            fullWidth
            id="email"
            label="이메일"
            name="email"
            autoComplete="email"
            autoFocus
        />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
          type="password"
            id="password"
            autoComplete="current-password"
        />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
              계정이 없으신가요? 회원가입
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;