const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
// 나중에 authMiddleware 넣어야 함

// 친구 요청 보내기
router.post('/request', friendController.sendFriendRequest);

// 친구 목록 조회
router.get('/', friendController.getFriends);

// 친구 요청 목록 조회
router.get('/requests', friendController.getFriendRequests);

// 친구 요청 수락/거절
router.put('/request/:id', friendController.respondFriendRequest);

// 친구 삭제
router.delete('/:id', friendController.deleteFriend);

module.exports = router;