import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper } from '@mui/material';
import CommonAppBar from '../components/CommonAppBar';

const TeamSpacePage = () => {
  const [announcement, setAnnouncement] = useState('');
  const [submittedAnnouncement, setSubmittedAnnouncement] = useState('');

  const handleSubmit = () => {
    if (announcement.trim()) {
      setSubmittedAnnouncement(announcement.trim());
      setAnnouncement('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CommonAppBar userName="user" pageName="팀스페이스" />

      <Box sx={{ p: 4, flexGrow: 1 }}>
        {/* 팀 일정 표시 영역 */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, border: '3px solid #000' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            📅 팀 일정만 표시
          </Typography>
          {/* 실제 구현 시 필터링된 팀 일정이 들어갈 곳 */}
          <Typography>✔ A팀 회의 – 2024-06-12</Typography>
          <Typography>✔ A팀 워크숍 – 2024-06-10</Typography>
        </Paper>

        {/* 공지 작성 영역 */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, border: '3px solid #000' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            📌 공지사항
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="공지 내용을 입력하세요"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: '#b2e0db',
              color: '#000',
              '&:hover': { bgcolor: '#a0d3ce' },
            }}
            onClick={handleSubmit}
          >
            등록
          </Button>

          {submittedAnnouncement && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                📝 등록된 공지:
              </Typography>
              <Typography>{submittedAnnouncement}</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default TeamSpacePage;
