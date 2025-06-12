import { useRef } from 'react';
import { Box, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CommonAppBar from '../components/CommonAppBar';

const MainPage = () => {
  const { user } = useAuth();
  const calendarRef = useRef(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 상단 바 */}
      <CommonAppBar userName={user?.name || 'user'} pageName="메인페이지"/>

      {/* 로고 */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <img
          src="/team_calendar_logo.jpg"
          alt="Team Calendar Logo"
          style={{ height: '80px', marginBottom: '1rem' }}
        />
      </Box>

      {/* 캘린더 */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          backgroundColor: '#fff',
          p: 5,
          mx: 4,
          borderRadius: '20px',
          border: '4px solid black',
        }}
      >
        {/* 일정 추가 버튼과 뷰 전환 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFD8B1',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#FFB88C' },
              borderRadius: '12px',
              px: 3,
              py: 1.5
            }}
            onClick={() => alert('일정 추가 기능 연결 예정')}
          >
            + 일정 추가
          </Button>
        </Box>

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
          contentHeight="100%"
          expandRows={true}
          locale="ko"
          selectable={true}
          editable={false}
          dayMaxEvents={3}
          eventClick={(info) => {
            info.jsEvent.preventDefault();
          }}
          dayHeaderClassNames={() => 'fc-day-header'}
          dayCellClassNames={() => 'fc-day-cell'}
        />
      </Box>
    </Box>
  );
};

export default MainPage;