// NotificationPopup.jsx

import React from 'react';
import { Box, Typography, Modal, Button, Avatar, Paper } from '@mui/material';

const dummyNotifications = [
  {
    id: 1,
    type: 'friend',
    sender: 'user123',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    message: 'user123가 친구 요청을 보냈습니다.',
  },
  {
    id: 2,
    type: 'team',
    sender: 'Team - admin',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    message: 'Team-admin님이 새로운 공지를 등록했습니다.',
  },
];

const NotificationPopup = ({ open, onClose }) => {
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
          width: 400,
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>알림</Typography>
        {dummyNotifications.map((noti) => (
          <Paper
            key={noti.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              mb: 2,
              borderRadius: 2,
              border: '1px solid #ccc',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar src={noti.avatar} sx={{ mr: 2 }} />
              <Typography variant="body1">{noti.message}</Typography>
            </Box>
            {noti.type === 'friend' && (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="contained" size="small" color="primary">수락</Button>
                <Button variant="outlined" size="small" color="error">거절</Button>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Modal>
  );
};

export default NotificationPopup;