import { useRef } from 'react';
import { Box } from '@mui/material';
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
      {/* 공통 상단바 */}
      <CommonAppBar userName={user?.name || 'user'} pageName="메인페이지" />

      {/* 풀스크린 캘린더 */}
      <Box sx={{ flex: 1, minHeight: 0, backgroundColor: '#fff', p: 5 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height="100%"
          contentHeight="100%"
          expandRows={true}
          locale="ko"
          selectable={true}
          editable={false}
          dayMaxEvents={3}
          eventClick={(info) => {
            // 추후 이벤트 클릭 핸들러 구현 가능
            info.jsEvent.preventDefault();
          }}
        />
      </Box>
    </Box>
  );
};

export default MainPage; 