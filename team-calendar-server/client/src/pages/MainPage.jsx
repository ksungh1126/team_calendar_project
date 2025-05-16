// import
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './Mainpage.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMemo } from 'react';

const localizer = momentLocalizer(moment);

function MainPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');
  const [schedules, setSchedules] = useState([]);

  const [id, setId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showForm, setShowForm] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailPopupPosition, setDetailPopupPosition] = useState({ x: 0, y: 0 });

  const [isTeam, setIsTeam] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleOpenForm = () => {
    setSelectedEvent(null); // ensure detail popup is hidden
    setShowForm(true);
    setTimeout(() => setAnimateForm(true), 10);
  };

  const handleCloseForm = () => {
    setAnimateForm(false);
    setTimeout(() => {
      setShowForm(false);
      setId(null); // reset edit mode
    }, 300);
  };

  useEffect(() => {
    console.log('🔥 useEffect 실행됨');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }
      fetchRecommendation();
      fetchSchedules();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const filteredSchedules = schedules.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getFullYear() === selectedDate.getFullYear() &&
      itemDate.getMonth() === selectedDate.getMonth()
    );
  });
  // 🧪 Debug log for filtered schedules
  filteredSchedules.forEach(item => {
    console.log(`🧪 일정 id:${item.schedule_id}, title:${item.title}, team_id:`, item.team_id, typeof item.team_id);
  });
  const teamSchedules = filteredSchedules.filter(item => item.team_id && Number(item.team_id) !== 0);
  const personalSchedules = filteredSchedules.filter(item => !item.team_id || Number(item.team_id) === 0);
  console.log("🧪 teamSchedules:", teamSchedules);
  console.log("🧪 personalSchedules:", personalSchedules);
  
  const fetchSchedules = async () => {
  try {
    const res = await axios.get('/schedules', {
      headers: { Authorization: `Bearer ${token}` },
    });

      console.log('✅ 일정 응답:', res.data);  // 응답 구조 확인용
      setSchedules(res.data.schedules);        // ✅ 여기! 핵심 수정 포인트
    } catch (err) {
      console.error('❌ 일정 불러오기 실패:', err);
    }
  };

  // 일정 추가
  const handleAddSchedule = async (e) => {
    e.preventDefault();

    const localDateTime = new Date(`${date}T${time}`);
    const combinedDateTime = localDateTime.toISOString();

    // 로그 추가
    console.log('📝 등록 요청 데이터:', {
      title,
      description,
      date: combinedDateTime,
      team_id: isTeam ? 1 : null
    });

    try {
      const combinedDateTime = `${date}T${time}`;
      await axios.post(
        '/schedules',
        { title, description, date: combinedDateTime, team_id: isTeam ? 1 : null, },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ 일정 추가 성공');
      setTitle('');
      setDescription('');
      setDate('');
      setShowForm(false);
      fetchSchedules(); // 추가 후 목록 다시 불러오기
    } catch (err) {
      console.error('❌ 일정 추가 실패:', err);
    }
  };

  // 일정 삭제  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedEvent(null);
      fetchSchedules();  // 삭제 후 목록 다시 불러오기
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
    }
  };
 
  // 일정 수정
  const handleUpdate = async (scheduleId) => {
    try {
      const localDateTime = new Date(`${date}T${time}`);
      const formattedDateTime = `${date} ${time}:00`;

      // 로그 추가
      console.log('✏️ 수정 요청 데이터:', {
        scheduleId,
        title,
        description,
        date: formattedDateTime,
        team_id: isTeam ? 1 : null
      });

      await axios.put(`/schedules/${scheduleId}`, {
        title,
        description,
        date: formattedDateTime,
        team_id: isTeam ? 1 : null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setId(null);
      setShowForm(false); // ✅ close the form after update
      fetchSchedules();
    } catch (err) {
      console.error('❌ 수정 실패:', err);
    }
  };

  const startEdit = (item) => {
    setId(item.schedule_id);
    setTitle(item.title);
    setDescription(item.description);

    const dateObj = new Date(item.date);
    setDate(dateObj.toISOString().slice(0, 10));       // 날짜: "YYYY-MM-DD"
    setTime(dateObj.toTimeString().slice(0, 5));       // 시간: "HH:mm"
    setIsTeam(item.team_id !== null);
    setSelectedEvent(null);
  };

  const fetchRecommendation = async () => {
    try {
      const res = await axios.get('/recommendations', {
        headers: { Authorization: `Bearer ${token}` },
      });
	console.log('✅ 추천 응답:', res.data);
	const weekdayMap = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
	const dayIndex = res.data.recommended_weekday;

	if (dayIndex !== undefined) {
  	setRecommendation(`📌 당신은 주로 ${weekdayMap[dayIndex]}에 일정을 등록합니다.`);
	} else {
 	 setRecommendation('📌 아직 추천할 일정이 부족합니다.');
	}
    } catch (err) {
      console.error('❌ 추천 분석 실패:', err);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      });
    };

  const calendarEvents = useMemo(() => (
    schedules.map((item) => {
      const start = new Date(item.date);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1시간짜리 일정
      return {
        title: item.title,
        start,
        end,
        allDay: false,
        color: item.team_id ? '#0057CC' : '#DCEBFF', // 팀일정: 주황, 개인일정: 기본 파랑
        ...item // include original fields like description, schedule_id, is_team
      };
    })
  ), [schedules]);


  console.log("📅 calendarEvents:", calendarEvents);
  const isEditing = id !== null;

    return (
  <>
  <div className="page-layout">
    {/* 왼쪽: 일정 목록 */}
    <div className="sidebar">
      <div className="sidebar-header">{selectedDate.getMonth() + 1}월의 내 일정 목록</div>
      <div className="schedule-section">
      <hr style={{ border: 'none', borderTop: '2px solid #ffffff', margin: '8px 0' }} />
        <div className="schedule-section-title" style={{ fontSize: '1.12rem' }}>▫️팀 일정</div>
        {teamSchedules.map((item) => (
          <div key={item.schedule_id} className="schedule-item">
            <p>{item.title}</p>
            <span>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
      </div>
      <div className="schedule-section">
      <hr style={{ border: 'none', borderTop: '2px solid #ffffff', margin: '8px 0' }} />
        <div className="schedule-section-title" style={{ fontSize: '1.12rem' }}>▫️ 개인 일정</div>
        {personalSchedules.map((item) => (
          <div key={item.schedule_id} className="schedule-item">
            <p>{item.title}</p>
            <span>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
      </div>
    </div>

    {/* 오른쪽: 캘린더 + 일정 추가 */}
    <div className="calendar-column" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {recommendation && (
          <div className="recommendation-banner">
            {recommendation}
          </div>
        )}
        <div style={{ position: 'relative' }}>
          <button className="floating-add-btn" onClick={handleOpenForm}>＋</button>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              marginLeft: '8px',
              backgroundColor: '#0d47a1',
              color:  'white',
              border: 'none',
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '36px',
                right: 0,
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                zIndex: 1000
              }}
            >
              <button style={{ display: 'block', marginBottom: '8px' }}>초대</button>
              <button onClick={handleLogout} style={{ display: 'block' }}>로그아웃</button>
            </div>
          )}
        </div>
      </div>
      <div style={{ height: '20px' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div className="calendar-area" style={{ flex: 1, overflowY: 'auto' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            date={selectedDate} // 👈 added to sync calendar view with selectedDate
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week', 'day']}
            view={view}
            onView={setView}
            onNavigate={(date) => setSelectedDate(date)}
            onSelectEvent={(event, e) => {
              setSelectedEvent(event);
              setDetailPopupPosition({ x: e.clientX, y: e.clientY });
              setAnimateForm(false);
              setTimeout(() => setAnimateForm(true), 10);
            }}
            selectable
            onSelectSlot={(slotInfo) => {
              setDate(moment(slotInfo.start).format('YYYY-MM-DD'));
              setTime(moment(slotInfo.start).format('HH:mm'));
              setSelectedEvent(null);
              setShowForm(true);
              setTimeout(() => setAnimateForm(true), 10);
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.color,
                color: event.team_id ? 'white' : '#0057CC'  // 팀일정은 흰색 글자, 개인일정은 진한 파랑
              }
            })}
            titleAccessor="title"
            components={{
              event: ({ event }) => (
                <div style={{ fontSize: '0.85rem', padding: '2px 4px' }}>
                  {event.title}
                </div>
              ),
              agenda: {
                event: ({ event }) => <span>{event.title}</span>
              }
            }}
          />
        </div>

        {(showForm || isEditing) && (
          <div className={`popup-form ${animateForm ? 'show' : ''}`}>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (isEditing) {
                handleUpdate(id);
              } else {
                handleAddSchedule(e);
              }
            }}>
              <h4>{isEditing ? '✏️ 일정 수정' : '➕ 일정 추가'}</h4>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="설명" />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              <input type="time" value={time} onChange={e => setTime(e.target.value)} />
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="radio"
                    value={false}
                    checked={!isTeam}
                    onChange={() => setIsTeam(false)}
                  />
                  개인 일정
                </label>
                <label style={{ marginLeft: '10px' }}>
                  <input
                    type="radio"
                    value={true}
                    checked={isTeam}
                    onChange={() => setIsTeam(true)}
                  />
                  팀 일정
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit">저장</button>
                <button type="button" onClick={handleCloseForm}>취소</button>
              </div>
            </form>
          </div>
        )}

        {selectedEvent && !isEditing && (
          <div
            className={`popup-form ${animateForm ? 'show' : ''}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 999,
            }}
          >
            <h4>{selectedEvent.title}</h4>
            <p>{formatDate(selectedEvent.start)}</p>
            <p>{selectedEvent.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => { startEdit(selectedEvent); handleOpenForm(); }}>수정</button>
              <button onClick={() => handleDelete(selectedEvent.schedule_id)}>삭제</button>
              <button onClick={() => setSelectedEvent(null)}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</>
  );
}

export default MainPage;
