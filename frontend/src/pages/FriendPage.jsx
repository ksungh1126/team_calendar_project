import { Box, Typography, Card, Avatar, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CommonAppBar from '../components/CommonAppBar';

// 임시 친구 데이터
const friends = [
  {
    id: 1,
    name: '박지민',
    email: 'jimin@friend.com',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
  {
    id: 2,
    name: '최유리',
    email: 'yuri@friend.com',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
  {
    id: 3,
    name: '이준호',
    email: 'junho@friend.com',
    avatar: 'https://randomuser.me/api/portraits/men/13.jpg',
  },
  {
    id: 4,
    name: '김민지',
    email: 'minji@friend.com',
    avatar: 'https://randomuser.me/api/portraits/women/14.jpg',
  },
  {
    id: 5,
    name: '정우성',
    email: 'woosung@friend.com',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
  },
  {
    id: 6,
    name: '한지수',
    email: 'jisu@friend.com',
    avatar: 'https://randomuser.me/api/portraits/women/16.jpg',
  },
];

const FriendPage = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CommonAppBar userName={user?.name || 'user'} pageName="친구페이지" />
      <Box sx={{ flex: 1, py: 5, px: 5, bgcolor: '#fff', overflowY: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          나의 친구 목록
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
          }}
        >
          {friends.map((friend) => (
            <Card key={friend.id} sx={{ width: '100%', display: 'flex', alignItems: 'center', p: 2, boxSizing: 'border-sizing' }}>
              {/* 좌측: 프로필 사진 */}
              <Box
                sx={{
                  width: '20%',
                  aspectRatio: '7 / 9',
                  mr: 2,
                  borderRadius: 0,
                  backgroundImage: `url(${friend.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                }}
              />
              {/* 우측: 정보 및 버튼 */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* 친구 정보 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{friend.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>{friend.email}</Typography>
                </Box>
                {/* 버튼 영역 */}
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <Button variant="outlined" color="primary" size="small" fullWidth>친구 일정보기</Button>
                  <Button variant="contained" color="error" size="small" fullWidth>친구 삭제</Button>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FriendPage; 