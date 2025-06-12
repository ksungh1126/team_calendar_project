import { useRef, useState, useEffect } from 'react';
import { TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch, Typography, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CommonAppBar from '../components/CommonAppBar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { api } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const MainPage = () => {
  const { user } = useAuth();
  const calendarRef = useRef(null);

  // ⭐ 추가: 이벤트 상태 변수
  const [events, setEvents] = useState([]);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [isEventDetailDialogOpen, setIsEventDetailDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    color: '#3788d8',
    isAllDay: false,
    isTeamEvent: false,
    teamId: null
  });

  // ⭐ API 호출: 일정 목록 가져오기
  const fetchEvents = async () => {
    try {
      const response = await api.get('/event');
      
      // FullCalendar 형식으로 변환
      const formattedEvents = response.data.events.map(event => ({
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        color: event.color,
        allDay: event.isAllDay,
        description: event.description,
        location: event.location
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('이벤트 목록 가져오기 실패:', error);
    }
  };

  // ⭐ 초기 로드 시 한번 이벤트 가져오기
  useEffect(() => {
    fetchEvents();
  }, []);

  // ⭐ 일정 추가 다이얼로그 열기
  const handleOpenAddEventDialog = () => {
    setNewEvent({
      title: '',
      description: '',
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(new Date().getTime() + 3600000).toISOString().slice(0, 16),
      location: '',
      color: '#3788d8',
      isAllDay: false,
      isTeamEvent: false,
      teamId: null
    });
    setIsAddEventDialogOpen(true);
  };

  // ⭐ 일정 추가 다이얼로그 닫기
  const handleCloseAddEventDialog = () => {
    setIsAddEventDialogOpen(false);
  };

  // ⭐ 일정 상세 다이얼로그 열기
  const handleOpenEventDetailDialog = (eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setIsEventDetailDialogOpen(true);
    setIsEditMode(false);
  };

  // ⭐ 일정 상세 다이얼로그 닫기
  const handleCloseEventDetailDialog = () => {
    setIsEventDetailDialogOpen(false);
    setSelectedEvent(null);
    setIsEditMode(false);
  };

  // ⭐ 일정 수정 모드로 전환
  const handleEditMode = () => {
    setIsEditMode(true);
    setNewEvent({
      title: selectedEvent.title,
      description: selectedEvent.extendedProps.description || '',
      startDate: selectedEvent.start.toISOString().slice(0, 16),
      endDate: selectedEvent.end.toISOString().slice(0, 16),
      location: selectedEvent.extendedProps.location || '',
      color: selectedEvent.backgroundColor || '#3788d8',
      isAllDay: selectedEvent.allDay,
      isTeamEvent: selectedEvent.extendedProps.isTeamEvent || false,
      teamId: selectedEvent.extendedProps.teamId || null
    });
  };

  // ⭐ 일정 수정
  const handleUpdateEvent = async () => {
    try {
      if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
        alert('제목, 시작일시, 종료일시는 필수 입력 항목입니다.');
        return;
      }

      if (new Date(newEvent.startDate) > new Date(newEvent.endDate)) {
        alert('시작일시는 종료일시보다 빨라야 합니다.');
        return;
      }

      await api.put(`/event/${selectedEvent.id}`, newEvent);
      handleCloseEventDetailDialog();
      fetchEvents();
    } catch (error) {
      console.error('일정 수정 실패:', error.response?.data || error.message);
      alert(error.response?.data?.error || '일정 수정에 실패했습니다.');
    }
  };

  // ⭐ 일정 삭제
  const handleDeleteEvent = async () => {
    if (!window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await api.delete(`/event/${selectedEvent.id}`);
      handleCloseEventDetailDialog();
      fetchEvents();
    } catch (error) {
      console.error('일정 삭제 실패:', error.response?.data || error.message);
      alert(error.response?.data?.error || '일정 삭제에 실패했습니다.');
    }
  };

  // ⭐ 일정 추가 버튼 클릭 핸들러
  const handleAddEvent = async () => {
    try {
      // 필수 필드 검증
      if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
        alert('제목, 시작일시, 종료일시는 필수 입력 항목입니다.');
        return;
      }

      // 시작일시가 종료일시보다 늦은 경우
      if (new Date(newEvent.startDate) > new Date(newEvent.endDate)) {
        alert('시작일시는 종료일시보다 빨라야 합니다.');
        return;
      }

      await api.post('/event', newEvent);
   
      // 성공 시 다이얼로그 닫고 목록 새로고침
      setIsAddEventDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('일정 추가 실패:', error.response?.data || error.message);
      alert(error.response?.data?.error || '일정 추가에 실패했습니다.');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CommonAppBar />
      <Box
        sx={{
          flex: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddEventDialog}
            sx={{
              px: 3,
              py: 1.5
            }}
          >
            + 일정 추가
          </Button>
        </Box>

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            height="100%"
            locale="ko"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={3}
            events={events}
            eventClick={handleOpenEventDetailDialog}
          />
        </Box>
      </Box>

      {/* 일정 추가 다이얼로그 */}
      <Dialog open={isAddEventDialogOpen} onClose={handleCloseAddEventDialog} maxWidth="sm" fullWidth>
        <DialogTitle>새 일정 추가</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="제목"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="설명"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="시작일시"
              type="datetime-local"
              value={newEvent.startDate}
              onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="종료일시"
              type="datetime-local"
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="장소"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              fullWidth
            />
            <TextField
              label="색상"
              type="color"
              value={newEvent.color}
              onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newEvent.isAllDay}
                  onChange={(e) => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
                />
              }
              label="종일 일정"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEventDialog}>취소</Button>
          <Button onClick={handleAddEvent} variant="contained" color="primary">
            추가
          </Button>
        </DialogActions>
      </Dialog>

      {/* 일정 상세/수정 다이얼로그 */}
      <Dialog open={isEventDetailDialogOpen} onClose={handleCloseEventDetailDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditMode ? '일정 수정' : '일정 상세'}
          {!isEditMode && (
            <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
              <IconButton onClick={handleEditMode} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDeleteEvent} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          {isEditMode ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="제목"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="설명"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                multiline
                rows={2}
                fullWidth
              />
              <TextField
                label="시작일시"
                type="datetime-local"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="종료일시"
                type="datetime-local"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="장소"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                fullWidth
              />
              <TextField
                label="색상"
                type="color"
                value={newEvent.color}
                onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newEvent.isAllDay}
                    onChange={(e) => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
                  />
                }
                label="종일 일정"
              />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedEvent?.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {selectedEvent?.extendedProps.description}
              </Typography>
              <Typography variant="body2" gutterBottom>
                시작: {selectedEvent?.start.toLocaleString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                종료: {selectedEvent?.end.toLocaleString()}
              </Typography>
              {selectedEvent?.extendedProps.location && (
                <Typography variant="body2" gutterBottom>
                  장소: {selectedEvent.extendedProps.location}
                </Typography>
              )}
              <Typography variant="body2" gutterBottom>
                종일 일정: {selectedEvent?.allDay ? '예' : '아니오'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {isEditMode ? (
            <>
              <Button onClick={() => setIsEditMode(false)}>취소</Button>
              <Button onClick={handleUpdateEvent} variant="contained" color="primary">
                저장
              </Button>
            </>
          ) : (
            <Button onClick={handleCloseEventDetailDialog}>닫기</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainPage;