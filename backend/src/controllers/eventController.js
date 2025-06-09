const db = require('../models');
const { Op } = require('sequelize');
console.log('eventController.js: 1. 모델 로드 완료');

// 일정 등록
const createEvent = async (req, res) => {
  console.log('eventController.js: createEvent 함수 호출됨');
  try {
    const { title, description, startDate, endDate, location, color, isAllDay, isTeamEvent, teamId } = req.body;
    console.log('eventController.js: 요청 데이터:', req.body);

    // 팀 일정인 경우 팀 멤버인지 확인
    if (isTeamEvent && teamId) {
      const teamMember = await db.TeamMember.findOne({
        where: { teamId, userId: req.user.id }
      });
      if (!teamMember) {
        return res.status(403).json({ error: '팀 멤버만 팀 일정을 생성할 수 있습니다.' });
      }
    }

    const event = await db.Event.create({
      userId: req.user.id,
      title,
      description,
      startDate,
      endDate,
      location,
      color,
      isAllDay,
      isTeamEvent,
      teamId
    });
    console.log('eventController.js: 일정 생성 성공');
    res.status(201).json({ event });
  } catch (error) {
    console.error('eventController.js: 일정 생성 실패:', error);
    res.status(400).json({ error: error.message });
  }
};

// 일정 목록 조회
const getEvents = async (req, res) => {
  console.log('eventController.js: getEvents 함수 호출됨');
  try {
    const { startDate, endDate } = req.query;
    const where = {};

    // 날짜 범위 필터링
    if (startDate && endDate) {
      where.startDate = {
        [db.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    // 개인 일정과 팀 일정 조회
    const [personalEvents, teamEvents] = await Promise.all([
      // 개인 일정
      db.Event.findAll({
        where: {
          ...where,
          userId: req.user.id,
          isTeamEvent: false
        }
      }),
      // 팀 일정 (사용자가 속한 팀의 일정)
      db.Event.findAll({
        where: {
          ...where,
          isTeamEvent: true
        },
        include: [{
          model: db.Team,
          include: [{
            model: db.User,
            where: { id: req.user.id }
          }]
        }]
      })
    ]);

    console.log('eventController.js: 일정 조회 성공');
    res.json({
      events: [...personalEvents, ...teamEvents]
    });
  } catch (error) {
    console.error('eventController.js: 일정 조회 실패:', error);
    res.status(400).json({ error: error.message });
  }
};

// 일정 수정
const updateEvent = async (req, res) => {
  console.log('eventController.js: updateEvent 함수 호출됨');
  try {
    const { eventId } = req.params;
    console.log('eventController.js: 수정할 일정 ID:', eventId);

    const event = await db.Event.findOne({
      where: { id: eventId },
      include: [{
        model: db.Team,
        include: [{
          model: db.User,
          where: { id: req.user.id }
        }]
      }]
    });

    if (!event) {
      console.log('eventController.js: 일정을 찾을 수 없음');
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }

    // 권한 확인
    if (event.userId !== req.user.id && !event.Team) {
      return res.status(403).json({ error: '일정을 수정할 권한이 없습니다.' });
    }

    await event.update(req.body);
    console.log('eventController.js: 일정 수정 성공');
    res.json({ event });
  } catch (error) {
    console.error('eventController.js: 일정 수정 실패:', error);
    res.status(400).json({ error: error.message });
  }
};

// 일정 삭제
const deleteEvent = async (req, res) => {
  console.log('eventController.js: deleteEvent 함수 호출됨');
  try {
    const { eventId } = req.params;
    console.log('eventController.js: 삭제할 일정 ID:', eventId);

    const event = await db.Event.findOne({
      where: { id: eventId },
      include: [{
        model: db.Team,
        include: [{
          model: db.User,
          where: { id: req.user.id }
        }]
      }]
    });

    if (!event) {
      console.log('eventController.js: 일정을 찾을 수 없음');
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }

    // 권한 확인
    if (event.userId !== req.user.id && !event.Team) {
      return res.status(403).json({ error: '일정을 삭제할 권한이 없습니다.' });
    }

    await event.destroy();
    console.log('eventController.js: 일정 삭제 성공');
    res.json({ message: '일정이 삭제되었습니다.' });
  } catch (error) {
    console.error('eventController.js: 일정 삭제 실패:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
}; 