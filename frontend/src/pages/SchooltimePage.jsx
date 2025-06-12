import React, { useState, useMemo, useEffect } from 'react';
import styles from './SchooltimePage.module.css';
import CommonAppBar from '../components/CommonAppBar';
import ScheduleModal from '../components/ScheduleModal';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// 한국어 설정 추가
import 'moment/locale/ko';
moment.locale('ko');
const localizer = momentLocalizer(moment);

const SchooltimePage = () => {
  const [schedules, setSchedules] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Edit existing event
  const [selectedSlot, setSelectedSlot] = useState(null); // Add new event

  // 시간표에 표시될 시간대 (09:00 ~ 18:00)
  const periods = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => `${(9 + i).toString().padStart(2, '0')}:00`);
  }, []);

  // Convert schedules to react-big-calendar events format
  const events = useMemo(() => {
    return Object.keys(schedules).map(cellId => {
      const schedule = schedules[cellId];
      const [day, startTimeStr] = cellId.split('-');

      const dayIndex = ['월', '화', '수', '목', '금'].indexOf(day);
      const baseDate = moment().startOf('week').add(dayIndex + 1, 'days'); // Monday is index 1 for moment().startOf('week')

      const startHour = parseInt(schedule.startTime.substring(0, 2));
      const endHour = parseInt(schedule.endTime.substring(0, 2));

      const start = baseDate.clone().hour(startHour).minute(0).toDate();
      const end = baseDate.clone().hour(endHour).minute(0).toDate();

      return {
        id: cellId, // Use cellId as event ID
        title: schedule.subject,
        start,
        end,
      };
    });
  }, [schedules]);

  // Handle click on existing event
  const handleSelectEvent = (event) => {
    const schedule = schedules[event.id]; // Retrieve original schedule data
    if (schedule) {
      setSelectedEvent(schedule);
      setSelectedSlot(null);
      setIsModalOpen(true);
    }
  };

  // Handle click on empty slot
  const handleSelectSlot = (slotInfo) => {
    // Ensure only week view slots are selectable
    if (slotInfo.action === 'click' || slotInfo.action === 'select') {
      // For react-big-calendar, slotInfo.start and slotInfo.end are already Date objects
      // No need to convert to pseudo-cellId here for the modal, just pass the Date objects
      setSelectedEvent(null);
      setSelectedSlot({
        cellId: `${moment(slotInfo.start).format('ddd')}-${moment(slotInfo.start).format('HH:mm')}`,
        startTime: slotInfo.start,
        endTime: slotInfo.end, // Use end time from slot for new schedule
      });
      setIsModalOpen(true);
    }
  };

  const handleSaveSchedule = (newScheduleData) => {
    setSchedules(prevSchedules => {
      const updatedSchedules = { ...prevSchedules };

      // For existing event, remove old entry and add new one
      if (selectedEvent) {
        delete updatedSchedules[selectedEvent.id];
      }

      // For new event, use selected slot's cellId
      const targetCellId = selectedEvent ? selectedEvent.id : selectedSlot.cellId;

      updatedSchedules[targetCellId] = {
        subject: newScheduleData.subject,
        startTime: moment(newScheduleData.startTime).format('HH:mm'),
        endTime: moment(newScheduleData.endTime).format('HH:mm'),
        cellId: targetCellId,
      };
      return updatedSchedules;
    });
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  const handleDeleteSchedule = (cellIdToDelete) => {
    setSchedules(prevSchedules => {
      const updatedSchedules = { ...prevSchedules };
      delete updatedSchedules[cellIdToDelete];
      return updatedSchedules;
    });
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  return (
    <div className={styles.container}>
      <CommonAppBar />
      <div className={styles.content}>
        <div className={styles.calendarContainer}>
          <h1 className={styles.title}>학교 시간표</h1>
          <Calendar
            localizer={localizer}
            events={events}
            defaultView="week"
            views={['week']}
            step={60} // 1시간 단위
            timeslots={1} // 1시간당 1슬롯
            min={moment().hour(9).minute(0).toDate()} // 09:00
            max={moment().hour(18).minute(0).toDate()} // 18:00
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            style={{ height: '100%' }}
            messages={{
              week: '주',
              day: '일',
              month: '월',
              today: '오늘',
              previous: '이전',
              next: '다음',
              date: '날짜',
              time: '시간',
              event: '이벤트',
              allDay: '종일',
              noEventsInRange: '이벤트 없음',
              showMore: total => `+ ${total} 더 보기`
            }}
            formats={{
              dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'ddd', culture),
            }}
          />
        </div>
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
            setSelectedSlot(null);
          }}
          onSave={handleSaveSchedule}
          onDelete={handleDeleteSchedule}
          selectedCell={selectedEvent ? selectedEvent.id : (selectedSlot ? selectedSlot.cellId : null)}
          existingSchedule={selectedEvent ? selectedEvent : (selectedSlot ? selectedSlot : null)}
          periodTime={selectedSlot ? selectedSlot.startTime : (selectedEvent ? selectedEvent.start : null)} // Pass Date object
          periods={periods} // Pass the periods array
        />
      </div>
    </div>
  );
};

export default SchooltimePage;