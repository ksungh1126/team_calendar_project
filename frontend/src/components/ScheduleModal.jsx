import React, { useState, useEffect } from 'react';
import styles from './ScheduleModal.module.css';
import moment from 'moment';

const ScheduleModal = ({ isOpen, onClose, onSave, onDelete, selectedCell, existingSchedule, periodTime, periods }) => {
  const [subject, setSubject] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    if (existingSchedule) {
      setSubject(existingSchedule.title);
      setStartTime(existingSchedule.start);
      setEndTime(existingSchedule.end);
    } else if (periodTime) {
      setSubject('');
      setStartTime(periodTime); // periodTime will be a Date object from BigCalendar
      setEndTime(periodTime); // Default end time to start time
    }
  }, [existingSchedule, periodTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      subject,
      startTime: startTime, // Pass Date objects
      endTime: endTime,     // Pass Date objects
      cellId: selectedCell, // Pass cellId for consistency in schedules state
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(selectedCell);
    onClose();
  };

  // Filter available end times based on start time and ensure on the same day
  const availableEndTimes = periods.filter(timeStr => {
    if (!startTime) return false;
    const selectedStartTime = moment(startTime);
    const [hour, minute] = timeStr.split(':').map(Number);
    const potentialEndMoment = selectedStartTime.clone().hour(hour).minute(minute);

    // Check if the potential end time is on or after the selected start time
    return potentialEndMoment.isSameOrAfter(selectedStartTime, 'hour');
  });

  if (!isOpen) return null;

  // Convert Date objects to HH:mm for display
  const displayStartTime = startTime ? moment(startTime).format('HH:mm') : '';

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>일정 {existingSchedule ? '수정' : '추가'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="subject">과목명</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className={styles.timeGroup}>
            <div className={styles.timeInfo}>
              <span>시작 시간: {displayStartTime}</span>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="endTime">종료 시간</label>
              <select
                id="endTime"
                value={endTime ? moment(endTime).format('HH:mm') : ''}
                onChange={(e) => {
                  if (!startTime) return;
                  const selectedHour = parseInt(e.target.value.substring(0,2));
                  const selectedMinute = parseInt(e.target.value.substring(3,5));
                  const newEndTime = moment(startTime).hour(selectedHour).minute(selectedMinute).toDate();
                  setEndTime(newEndTime);
                }}
                required
                className={styles.timeSelect}
              >
                {availableEndTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            {existingSchedule && (
              <button type="button" onClick={handleDelete} className={styles.deleteButton}>
                삭제
              </button>
            )}
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              취소
            </button>
            <button type="submit" className={styles.saveButton}>
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal; 