const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const teamController = require('../controllers/teamController');

// 팀 생성
router.post('/', auth, teamController.createTeam);

// 팀원 초대
router.post('/invite', auth, teamController.inviteMember);

// 팀 목록 조회
router.get('/', auth, teamController.getTeams);

// 팀 상세 정보 조회
router.get('/:teamId', auth, teamController.getTeam);

// 팀원 역할 변경
router.put('/member/role', auth, teamController.updateMemberRole);

// 팀원 추방
router.delete('/member', auth, teamController.removeMember);

module.exports = router; 