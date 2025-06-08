const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/auth');

// 모든 친구 라우트에 인증 미들웨어 적용
router.use(authMiddleware);

// 친구 목록 조회
router.get('/', friendController.getFriends);

// 친구 검색
router.get('/search', friendController.searchFriends);

// 친구 추가 요청
router.post('/request', friendController.sendFriendRequest);

// 친구 요청 수락
router.post('/request/:requestId/accept', friendController.acceptFriendRequest);

// 친구 요청 거절
router.post('/request/:requestId/reject', friendController.rejectFriendRequest);

// 친구 삭제
router.delete('/:friendId', friendController.removeFriend);

module.exports = router; 