// routes/events.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createEvent,
  getEvents,
  deleteEvent,
  getSharedEvents,
  calculateSharedFreeTime,
} = require('../controllers/eventController');

// 기존 라우트
router.post('/', protect, createEvent);
router.get('/', protect, getEvents);
router.delete('/:id', protect, deleteEvent);

// ✅ 공유된 이벤트 조회
router.get('/shared', protect, getSharedEvents);

// ✅ 공강 시간 계산
router.post('/shared/free', protect, calculateSharedFreeTime);

module.exports = router;