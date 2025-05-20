// CalendarPage.jsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { mergeEventsWithOverlapColor } from '../utils/calendarUtils';
import { useFriend } from '../contexts/FriendContext';
import './CalendarPage.css';

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { friends, addFriend } = useFriend();

  const [userEmail, setUserEmail] = useState('me@example.com');

  useEffect(() => {
    const sampleData = [
      { id: '1', title: '친구랑 밥약', start: '2025-05-22', end: '2025-05-22', owner: 'me@example.com' },
      { id: '2', title: '시험 공부', start: '2025-05-22', end: '2025-05-22', owner: 'friend@example.com' },
      { id: '3', title: '운동', start: '2025-05-23', end: '2025-05-23', owner: 'me@example.com' },
      { id: '4', title: '연속 일정 테스트', start: '2025-05-24', end: '2025-05-26', owner: 'me@example.com' },
    ];
    const merged = mergeEventsWithOverlapColor(sampleData);
    setEvents(merged);
  }, [friends]);

  const handleAddEvent = () => {
    if (!title || !startDate || !endDate || !userEmail) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    const newEvent = {
      id: Date.now().toString(),
      title,
      start: startDate,
      end: endDate,
      owner: userEmail,
    };
    const merged = mergeEventsWithOverlapColor([...events, newEvent]);
    setEvents(merged);
    setTitle('');
    setStartDate('');
    setEndDate('');
  };

  const handleEventClick = (info) => {
    const confirmed = window.confirm('이 일정을 삭제하시겠습니까?');
    if (confirmed) {
      setEvents((prev) => prev.filter((e) => e.id !== info.event.id));
    }
  };

  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
    window.location.href = '/login';
  };

  return (
    <div className="calendar-container">
      <div className="task-panel">
        <h3>📝 내 일정</h3>
        <ul className="task-list">
          {events.filter(e => e.owner === userEmail).map((event) => (
            <li key={event.id}>{event.title} ({event.start} ~ {event.end})</li>
          ))}
        </ul>

        <h4>일정 추가</h4>
        <input
          type="text"
          placeholder="일정 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-box"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input-box"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="input-box"
        />
        <button onClick={handleAddEvent} className="add-button">추가</button>

        <h4 style={{ marginTop: '20px' }}>친구 추가</h4>
        <input
          type="email"
          placeholder="친구 이메일"
          onKeyDown={(e) => {
            if (e.key === 'Enter') addFriend(e.target.value);
          }}
          className="input-box"
        />

        <button onClick={handleLogout} className="add-button" style={{ marginTop: '30px', backgroundColor: '#ff9999' }}>
          로그아웃
        </button>
      </div>

      <div className="calendar-panel">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height="100%"
        />
      </div>
    </div>
  );
}

export default CalendarPage;