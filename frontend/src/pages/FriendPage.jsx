import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CommonAppBar from '../components/CommonAppBar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const FriendPage = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false);
  const [email, setEmail] = useState('');

  // 친구 목록 조회
  const fetchFriends = async () => {
    try {
      const response = await axios.get('/api/friend', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('친구 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // 친구 삭제
  const handleDeleteFriend = async (friendId) => {
    try {
      await axios.delete(`/api/friend/${friendId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchFriends(); // 친구 목록 새로고침
    } catch (error) {
      console.error('친구 삭제 실패:', error);
    }
  };

  // 친구 추가 다이얼로그 열기
  const handleOpenAddFriendDialog = () => {
    setIsAddFriendDialogOpen(true);
  };

  // 친구 추가 다이얼로그 닫기
  const handleCloseAddFriendDialog = () => {
    setIsAddFriendDialogOpen(false);
    setEmail('');
  };

  // 친구 추가
  const handleAddFriend = async () => {
    try {
      await axios.post('/api/friend/request', 
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      handleCloseAddFriendDialog();
      // TODO: 친구 요청 성공 메시지 표시
    } catch (error) {
      console.error('친구 요청 실패:', error);
      // TODO: 에러 메시지 표시
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CommonAppBar userName={user?.name || '사용자'} pageName="친구 페이지" />
      <Box sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">내 친구</Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenAddFriendDialog}
          >
            친구 추가
          </Button>
        </Box>

        <List>
          {Array.isArray(friends) && friends.map((friend) => (
            <ListItem
              key={friend.id}
              sx={{
                mb: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <ListItemAvatar>
                <Avatar src={friend.avatar}>
                  {friend.name?.[0] || '?'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={friend.name}
                secondary={friend.email}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteFriend(friend.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        {/* 친구 추가 다이얼로그 */}
        <Dialog open={isAddFriendDialogOpen} onClose={handleCloseAddFriendDialog}>
          <DialogTitle>친구 추가</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="이메일 주소"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddFriendDialog}>취소</Button>
            <Button onClick={handleAddFriend} variant="contained">
              친구 요청 보내기
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default FriendPage; 