const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const subjectController = require('../controllers/subjectController');
console.log('subject.js: 1. 기본 설정 완료');

// 테스트용 라우트 (인증 없이)
router.get('/test', (req, res) => {
  res.json({ message: 'Subject router is working' });
});

// 과목(시간표) 등록
router.post('/', auth, subjectController.createSubject);

// 내 시간표 전체 조회
router.get('/', auth, subjectController.getSubjects);

// 과목(시간표) 수정
router.put('/:subjectId', auth, subjectController.updateSubject);

// 과목(시간표) 삭제
router.delete('/:subjectId', auth, subjectController.deleteSubject);

module.exports = router; 