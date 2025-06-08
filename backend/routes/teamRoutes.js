const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middleware/auth');

// 모든 팀 라우트에 인증 미들웨어 적용
router.use(authMiddleware);

// 팀 생성
router.post('/', teamController.createTeam);

// 팀 목록 조회
router.get('/', teamController.getTeams);

// 팀 상세 정보 조회
router.get('/:id', teamController.getTeam);

// 팀 수정
router.put('/:id', teamController.updateTeam);

// 팀 삭제
router.delete('/:id', teamController.deleteTeam);

// 팀 멤버 추가
router.post('/:teamId/members', teamController.addTeamMember);

// 팀 멤버 삭제
router.delete('/:teamId/members/:userId', teamController.removeTeamMember);

module.exports = router; 