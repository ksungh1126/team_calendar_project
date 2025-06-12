import { Box, Typography, Card, Button, Chip, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CommonAppBar from '../components/CommonAppBar';

// 임시 팀 데이터
const teams = [
  {
    id: 1,
    name: 'A팀',
    members: 8,
    hasNewEvent: true,
    leader: {
      name: '홍길동',
      email: 'hong@a.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    events: [
      { id: 1, title: 'A팀 회의', date: '2024-06-12' },
      { id: 2, title: 'A팀 워크샵', date: '2024-06-10' },
      { id: 3, title: 'A팀 회식', date: '2024-06-08' },
    ],
  },
  {
    id: 2,
    name: 'B팀',
    members: 5,
    hasNewEvent: false,
    leader: {
      name: '김철수',
      email: 'kim@b.com',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    events: [
      { id: 1, title: 'B팀 킥오프', date: '2024-06-11' },
      { id: 2, title: 'B팀 회의', date: '2024-06-09' },
    ],
  },
  {
    id: 3,
    name: 'C팀',
    members: 7,
    hasNewEvent: true,
    leader: {
      name: '이영희',
      email: 'lee@c.com',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    events: [
      { id: 1, title: 'C팀 세미나', date: '2024-06-10' },
    ],
  },
];

const TeamPage = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CommonAppBar userName={user?.name || 'user'} pageName="팀페이지" />
      <Box sx={{ flex: 1, py: 5, px: 5, bgcolor: '#fff', overflowY: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          나의 팀 목록
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}
        >
          {teams.map((team) => (
            <Card key={team.id} sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', p: 2, boxSizing: 'border-box' }}>
              {/* 1. 팀 이름 + 새일정 + 인원수 */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{team.name}</Typography>
                  {team.hasNewEvent && <Chip label="새 일정" color="primary" size="small" />}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>인원 {team.members}명</Typography>
              </Box>
              {/* 2. 팀장 정보 */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, mt: 1 }}>
                <Box
                  sx={{
                    width: '20%',
                    aspectRatio: '7 / 9',
                    mr: 2,
                    borderRadius: 0,
                    backgroundImage: `url(${team.leader.avatar})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>팀장 </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{team.leader.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>{team.leader.email}</Typography>
                </Box>
              </Box>
              {/* 3. 최근 일정 2개 */}
              <Box sx={{ flex: 1, mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>최근 일정</Typography>
                <List dense disablePadding sx={{ mt: 0, mb: 0 }}>
                  {team.events.slice(0, 2).map((event) => (
                    <ListItem key={event.id} sx={{ pl: 0, py: 0.2, minHeight: '28px' }}>
                      <ListItemText primary={event.title} secondary={event.date} primaryTypographyProps={{ fontSize: '0.98rem' }} secondaryTypographyProps={{ fontSize: '0.85rem' }} />
                    </ListItem>
                  ))}
                  {team.events.length === 0 && (
                    <ListItem sx={{ pl: 0, py: 0.2, minHeight: '28px' }}>
                      <ListItemText primary="등록된 일정이 없습니다." />
                    </ListItem>
                  )}
                </List>
              </Box>
              {/* 4. 팀스페이스 접속 버튼 */}
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 'auto' }}>
                팀스페이스 접속
              </Button>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TeamPage; 