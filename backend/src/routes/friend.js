const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const friendController = require('../controllers/friendController');

// 친구 요청 보내기
router.post('/request', auth, friendController.sendRequest);
// 친구 요청 수락
router.post('/accept', auth, friendController.acceptRequest);
// 친구 요청 거절
router.post('/reject', auth, friendController.rejectRequest);
// 친구 삭제
router.delete('/', auth, friendController.deleteFriend);
// 친구 목록 조회
router.get('/', auth, friendController.getFriends);
// 받은 친구 요청 목록
router.get('/received', auth, friendController.getReceivedRequests);
// 보낸 친구 요청 목록
router.get('/sent', auth, friendController.getSentRequests);

module.exports = router; 