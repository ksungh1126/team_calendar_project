import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      console.log('회원가입 성공!');
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
      console.error('회원가입 실패:', errorMessage);
      setError(errorMessage);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    registerMutation.mutate({ email, password, name });
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
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          회원가입
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
            id="name"
            label="이름"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="이메일"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? '회원가입 중...' : '회원가입'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
              이미 계정이 있으신가요? 로그인
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage; 