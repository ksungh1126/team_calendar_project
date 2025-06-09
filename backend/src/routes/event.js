const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');
console.log('event.js: 1. 기본 설정 완료');

// 테스트용 라우트 (인증 없이)
router.get('/test', (req, res) => {
  res.json({ message: 'Event router is working' });
});

// 일정 등록
router.post('/', auth, eventController.createEvent);

// 일정 목록 조회
router.get('/', auth, eventController.getEvents);

// 일정 수정
router.put('/:eventId', auth, eventController.updateEvent);

// 일정 삭제
router.delete('/:eventId', auth, eventController.deleteEvent);

module.exports = router; 