import {
  Box,
  Typography,
  TextField,
  Button,
  Paper
} from '@mui/material';
import { useState } from 'react';
import CommonAppBar from '../components/CommonAppBar';
import { useAuth } from '../context/AuthContext';

const TeamspacePage = () => {
  const { user } = useAuth();
  const [notice, setNotice] = useState('');
  const [noticeSubmitted, setNoticeSubmitted] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventList, setEventList] = useState([]);

  const handleAddEvent = () => {
    if (eventTitle && eventDate) {
      setEventList([...eventList, { title: eventTitle, date: eventDate }]);
      setEventTitle('');
      setEventDate('');
    }
  };

  const handleNoticeSubmit = () => {
    setNoticeSubmitted(notice);
    setNotice('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CommonAppBar userName={user?.name || 'user'} pageName="팀스페이스" />

      <Box sx={{ px: 5, py: 3, flex: 1, bgcolor: '#fff', overflowY: 'auto' }}>
        {/* 팀 일정 등록 */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>팀 일정 등록</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="일정 제목"
              variant="outlined"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              fullWidth
            />
            <TextField
              type="date"
              variant="outlined"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              sx={{ minWidth: 160 }}
            />
            <Button variant="contained" onClick={handleAddEvent}>추가</Button>
          </Box>
          {eventList.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {eventList.map((e, idx) => (
                <Typography key={idx} sx={{ mb: 1 }}>{e.date} - {e.title}</Typography>
              ))}
            </Box>
          )}
        </Paper>

        {/* 공지 입력 */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>공지 작성</Typography>
          <TextField
            label="공지 내용"
            multiline
            rows={4}
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleNoticeSubmit}>
            등록
          </Button>

          {noticeSubmitted && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>등록된 공지</Typography>
              <Typography>{noticeSubmitted}</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default TeamspacePage; 