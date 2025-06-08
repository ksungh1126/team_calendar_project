const Event = require('../models/Event');
const User = require('../models/User');

// 이벤트 생성
exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      owner: req.user.userId,  // auth 미들웨어에서 설정한 userId 사용
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: '이벤트 생성 실패', error: err.message });
  }
};

// 본인 이벤트 전체 조회
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user.userId });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: '이벤트 조회 실패', error: err.message });
  }
};

// 이벤트 삭제
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!event) {
      return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '이벤트가 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '이벤트 삭제 실패', error: err.message });
  }
};

// 공유된 이벤트 조회
exports.getSharedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const friends = user.friends || [];
    const allOwners = [user.email, ...friends];
    const events = await Event.find({ owner: { $in: allOwners } });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: '일정 조회 실패', error: err.message });
  }
};

// 공강 시간 계산
exports.calculateSharedFreeTime = async (req, res) => {
  try {
    const { friends } = req.body;
    const user = await User.findById(req.user.userId);
    const allOwners = [user.email, ...friends];
    const events = await Event.find({ owner: { $in: allOwners } });
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
      return allOwners.every((person) => {
        const key = `${day}_${start}_${person}`;
        return !occupied.has(key);
      });
    });

    res.status(200).json(sharedFree);
  } catch (err) {
    res.status(500).json({ message: '공강 시간 계산 실패', error: err.message });
  }
};

function generateWeeklyTimeBlocks() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const blocks = [];
  for (const day of days) {
    for (let hour = 8; hour < 21; hour++) {
      blocks.push({ day, start: hour, end: hour + 1 });
    }
  }
  return blocks;
}