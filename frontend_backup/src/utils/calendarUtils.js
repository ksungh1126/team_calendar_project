// calendarUtils.js
export function mergeEventsWithOverlapColor(events) {
  const eventMap = {};

  events.forEach((e) => {
    const key = `${e.start}_${e.end}`;
    eventMap[key] = eventMap[key] ? eventMap[key] + 1 : 1;
  });

  return events.map((e) => {
    const key = `${e.start}_${e.end}`;
    const overlap = eventMap[key];
    const colorValue = Math.min(255, 100 + overlap * 30);
    return {
      ...e,
      backgroundColor: `rgb(${colorValue}, 120, 200)`,
      borderColor: 'transparent',
    };
  });
}

export function generateWeeklyTimeBlocks() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const blocks = [];

  for (const day of days) {
    for (let hour = 8; hour < 21; hour++) {
      blocks.push({ day, start: hour, end: hour + 1 });
    }
  }
  return blocks;
}

export function calculateSharedFreeTime(events, friends, userEmail) {
  const allMembers = [userEmail, ...friends];
  const blocks = generateWeeklyTimeBlocks();

  const occupied = new Set();
  for (const event of events) {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const day = start.toLocaleDateString('en-US', { weekday: 'short' });

    const startHour = start.getHours();
    const endHour = end.getHours();

    for (let h = startHour; h < endHour; h++) {
      const key = `${day}_${h}_${event.owner}`;
      occupied.add(key);
    }
  }

  const sharedFree = blocks.filter(({ day, start }) => {
    return allMembers.every((person) => {
      const key = `${day}_${start}_${person}`;
      return !occupied.has(key);
    });
  });

  return sharedFree;
}

export function convertFreeBlocksToEvents(freeBlocks) {
  const dayMap = {
    Mon: '2025-05-19',
    Tue: '2025-05-20',
    Wed: '2025-05-21',
    Thu: '2025-05-22',
    Fri: '2025-05-23',
  };
  return freeBlocks.map(({ day, start, end }) => ({
    title: '공강 추천',
    start: `${dayMap[day]}T${String(start).padStart(2, '0')}:00:00`,
    end: `${dayMap[day]}T${String(end).padStart(2, '0')}:00:00`,
    backgroundColor: '#cdeeff',
    borderColor: 'transparent',
    textColor: '#3a3a3a'
  }));
}
