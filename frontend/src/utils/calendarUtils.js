// utils/calendarUtils.js
export function mergeEventsWithOverlapColor(events) {
  const eventMap = {};

  events.forEach((e) => {
    const key = `${e.start}_${e.end}`;
    eventMap[key] = eventMap[key] ? eventMap[key] + 1 : 1;
  });

  return events.map((e) => {
    const key = `${e.start}_${e.end}`;
    const overlap = eventMap[key];
    const colorValue = Math.min(255, 100 + overlap * 30); // 최대 255 제한
    return {
      ...e,
      backgroundColor: `rgb(${colorValue}, 120, 200)`,
      borderColor: 'transparent',
    };
  });
}
