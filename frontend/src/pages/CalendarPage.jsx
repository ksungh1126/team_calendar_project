// CalendarPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { mergeEventsWithOverlapColor, calculateSharedFreeTime, convertFreeBlocksToEvents } from '../utils/calendarUtils';
import { useFriend } from '../contexts/FriendContext';
import { eventService, teamService } from '../services/api';
import './CalendarPage.css';

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { friends, addFriend } = useFriend();
  const [visibleFriends, setVisibleFriends] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [teamInfo, setTeamInfo] = useState(null);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('user');
  const userInfo = userEmail ? JSON.parse(localStorage.getItem(`userInfo_${userEmail}`)) : null;

  useEffect(() => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const fetchUserInfo = () => {
      const info = localStorage.getItem(`userInfo_${userEmail}`);
      if (info) {
        try {
          const parsed = JSON.parse(info);
          console.log('사용자 정보:', parsed);
        } catch (err) {
          console.error('사용자 정보 파싱 실패:', err);
        }
      }
    };

    const fetchSchedules = async () => {
      try {
        const data = await eventService.getEvents();
        const merged = mergeEventsWithOverlapColor(data);
        setEvents(merged);
      } catch (err) {
        console.error('일정 불러오기 실패:', err);
      }
    };

    const fetchTeamInfo = async () => {
      const teamId = localStorage.getItem('teamId');
      if (!teamId) return;
      try {
        const data = await teamService.getTeam(teamId);
        setTeamInfo(data);
      } catch (err) {
        console.error('팀 정보 불러오기 실패:', err);
      }
    };

    fetchUserInfo();
    fetchSchedules();
    fetchTeamInfo();
  }, [navigate]);

  const colorMap = {
    [userEmail]: '#91c4f2',
    'friend@example.com': '#ffd4a3',
    'another@example.com': '#c8f2c2',
  };

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

  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleEventClick = (info) => {
    const clickedEvent = info.event;
    if (clickedEvent.title === '공강 추천') {
      const confirmTeam = window.confirm(`${clickedEvent.startStr.slice(0, 10)} ${clickedEvent.startStr.slice(11, 16)}에 팀플 일정으로 등록할까요?`);
      if (confirmTeam) {
        const newEvent = {
          id: Date.now().toString(),
          title: '팀플 일정',
          start: clickedEvent.startStr,
          end: clickedEvent.endStr,
          owner: userEmail,
          backgroundColor: '#c6a5f8',
          borderColor: 'transparent'
        };
        setEvents((prev) => mergeEventsWithOverlapColor([...prev, newEvent]));
      }
    } else {
      const confirmed = window.confirm('이 일정을 삭제하시겠습니까?');
      if (confirmed) {
        setEvents((prev) => prev.filter((e) => e.id !== clickedEvent.id));
      }
    }
  };

  const handleSuggestMeeting = () => {
    const freeBlocks = calculateSharedFreeTime(events, friends, userEmail);
    if (freeBlocks.length === 0) {
      alert('공강이 겹치는 시간이 없어요 😢');
      return;
    }
    const lines = freeBlocks.map(
      ({ day, start, end }) => `- ${day} ${String(start).padStart(2, '0')}:00 ~ ${end}:00`
    );
    alert(`🧑‍🤝‍🧑 팀플 추천 시간\n\n${lines.join('\n')}`);

    const suggestionEvents = convertFreeBlocksToEvents(freeBlocks);
    setEvents((prev) => mergeEventsWithOverlapColor([...prev, ...suggestionEvents]));
  };

  const handleClearSuggestions = () => {
    setEvents((prev) => prev.filter((e) => e.title !== '공강 추천'));
  };

  const toggleFriend = (email) => {
    setVisibleFriends((prev) =>
      prev.includes(email) ? prev.filter(f => f !== email) : [...prev, email]
    );
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;
    try {
      const team = await teamService.createTeam({ name: teamName });
      localStorage.setItem('teamId', team.id);
      alert(`팀 \"${team.name}\" 생성 완료!`);
      window.location.reload();
    } catch (err) {
      alert(`팀 생성 실패: ${err.message || '오류 발생'}`);
    }
  };

  const handleDeleteTeam = async () => {
    const teamId = localStorage.getItem('teamId');
    if (!teamId) {
      alert('삭제할 팀이 없습니다.');
      return;
    }
    const confirmDelete = window.confirm('정말 이 팀을 삭제하시겠습니까? 모든 팀원 정보가 사라질 수 있습니다!');
    if (!confirmDelete) return;
    try {
      await teamService.deleteTeam(teamId);
      localStorage.removeItem('teamId');
      alert('팀이 삭제되었습니다.');
      window.location.reload();
    } catch (err) {
      alert(`팀 삭제 실패: ${err.message || '오류 발생'}`);
    }
  };

  const allVisibleOwners = [userEmail, ...visibleFriends];

  const displayedEvents = events.filter(e => allVisibleOwners.includes(e.owner)).map((e) => ({
    ...e,
    backgroundColor: colorMap[e.owner] || '#dddddd',
  }));

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingRight: '1rem' }}>
          {userInfo?.profileImg && <img src={userInfo.profileImg} alt="프로필" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />}
          <span>👤 {userInfo?.nickname || userEmail}</span>
          {teamInfo && (
            <div style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#555' }}>
              🏷 팀: <strong>{teamInfo.name}</strong> | 👥 인원: {teamInfo.memberCount}
            </div>
          )}
        </div>
      </div>

      <div className="calendar-content">
        <div className="task-panel">
          <h3>📝 내 일정</h3>
          <ul className="task-list">
            {events.filter(e => e.owner === userEmail).map((event) => (
              <li key={event.id}>{event.title} ({event.start} ~ {event.end})</li>
            ))}
          </ul>

          <h4>일정 추가</h4>
          <input type="text" placeholder="일정 제목" value={title} onChange={(e) => setTitle(e.target.value)} className="input-box" />
          <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-box" />
          <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-box" />
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

          <h4 style={{ marginTop: '20px' }}>👥 친구 목록</h4>
          <ul className="task-list">
            {friends.map((f) => (
              <li key={f}>
                <label>
                  <input
                    type="checkbox"
                    checked={visibleFriends.includes(f)}
                    onChange={() => toggleFriend(f)}
                  /> {f}
                </label>
              </li>
            ))}
          </ul>

          <h4 style={{ marginTop: '20px' }}>🛠 팀 생성</h4>
          <input type="text" placeholder="팀 이름" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="input-box" />
          <button onClick={handleCreateTeam} className="add-button" style={{ marginTop: '10px', backgroundColor: '#f9dda4' }}>팀 만들기</button>
          <button onClick={handleDeleteTeam} className="add-button" style={{ marginTop: '10px', backgroundColor: '#ffcccc' }}>❌ 팀 삭제</button>

          <button onClick={handleLogout} className="add-button" style={{ marginTop: '20px', backgroundColor: '#ff9999' }}>로그아웃</button>
          <button onClick={() => navigate('/schedule')} className="add-button" style={{ marginTop: '10px', backgroundColor: '#b3d9ff' }}>📘 수업 시간표 보러가기</button>
          <button onClick={handleSuggestMeeting} className="add-button" style={{ marginTop: '10px', backgroundColor: '#c2f0c2' }}>🧑‍🤝‍🧑 팀플 공강 시간 추천</button>
          <button onClick={handleClearSuggestions} className="add-button" style={{ marginTop: '10px', backgroundColor: '#eee' }}>🧽 공강 추천 지우기</button>
        </div>

        <div className="calendar-panel">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={displayedEvents}
            eventClick={handleEventClick}
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;