import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SettingPopup = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 처리 로직 (예: localStorage 제거)
    localStorage.removeItem('user'); 
    onClose();  // 모달 닫기
    navigate('/login');  // 로그인 페이지로 이동
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 300,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>설정</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          로그아웃
        </Button>
      </Box>
    </Modal>
  );
};

export default SettingPopup;