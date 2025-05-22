// ClassSchedulePage.jsx
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import './CalendarPage.css';

function ClassSchedulePage() {
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('Mon');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const weekDate = {
    Mon: '2025-05-19',
    Tue: '2025-05-20',
    Wed: '2025-05-21',
    Thu: '2025-05-22',
    Fri: '2025-05-23',
  };

  const handleAddClass = () => {
    if (!title || !startTime || !endTime || !day) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const start = `${weekDate[day]}T${startTime}`;
    const end = `${weekDate[day]}T${endTime}`;

    setEvents([...events, {
      id: Date.now().toString(),
      title,
      start,
      end,
      backgroundColor: '#a2c4f9',
    }]);

    setTitle('');
    setStartTime('');
    setEndTime('');
  };

  const handleDelete = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const timeOptions = Array.from({ length: 14 * 6 }, (_, i) => {
    const hour = Math.floor(i / 6) + 8;
    const minute = (i % 6) * 10;
    const hStr = String(hour).padStart(2, '0');
    const mStr = String(minute).padStart(2, '0');
    return `${hStr}:${mStr}`;
  });

  return (
    <div className="calendar-container">
      <div className="task-panel">
        <h3>📘 수업 시간표 등록</h3>
        <input
          type="text"
          placeholder="과목명"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-box"
        />
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="input-box"
        >
          <option value="Mon">Mon</option>
          <option value="Tue">Tue</option>
          <option value="Wed">Wed</option>
          <option value="Thu">Thu</option>
          <option value="Fri">Fri</option>
        </select>
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="input-box"
        >
          <option value="">시작 시간</option>
          {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
        </select>
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="input-box"
        >
          <option value="">종료 시간</option>
          {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
        </select>
        <button onClick={handleAddClass} className="add-button">추가</button>

        <h4 style={{ marginTop: '20px' }}>📋 등록된 수업</h4>
        <ul className="task-list">
          {events.map((event) => (
            <li key={event.id}>
              {event.title} ({event.start.slice(11, 16)} ~ {event.end.slice(11, 16)})
              <button
                onClick={() => handleDelete(event.id)}
                style={{ float: 'right', background: 'transparent', border: 'none', color: 'red', cursor: 'pointer' }}
              >
                🗑
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate('/calendar')}
          className="add-button"
          style={{ marginTop: '20px', backgroundColor: '#eee' }}
        >
          📅 내 캘린더로 돌아가기
        </button>
      </div>

      <div className="calendar-panel">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          events={events}
          dayHeaderFormat={{ weekday: 'short' }}
          height="100%"
        />
      </div>
    </div>
  );
}

export default ClassSchedulePage;
