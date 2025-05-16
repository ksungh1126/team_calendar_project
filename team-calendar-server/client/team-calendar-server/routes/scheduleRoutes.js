const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { createSchedule, getSchedules, updateSchedule, deleteSchedule, getRecommendations } = require('../controllers/scheduleController');

router.post('/schedules', verifyToken, createSchedule);
router.get('/schedules', verifyToken, getSchedules);
router.put('/schedules/:id', verifyToken, updateSchedule);
router.delete('/schedules/:id', verifyToken, deleteSchedule);
router.get('/recommendations', verifyToken, getRecommendations);

module.exports = router;
