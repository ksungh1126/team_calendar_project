const db = require('../models');
console.log('subjectController.js: 1. 모델 로드 완료');

// 과목(시간표) 등록
exports.createSubject = async (req, res) => {
  console.log('subjectController.js: createSubject 함수 호출됨');
  try {
    const { name, dayOfWeek, startTime, endTime, location, professor, color } = req.body;
    console.log('subjectController.js: 요청 데이터:', req.body);
    const subject = await db.Subject.create({
      userId: req.user.id,
      name,
      dayOfWeek,
      startTime,
      endTime,
      location,
      professor,
      color
    });
    console.log('subjectController.js: 과목 생성 성공');
    res.status(201).json({ subject });
  } catch (error) {
    console.error('subjectController.js: 과목 생성 실패:', error);
    res.status(400).json({ error: error.message });
  }
};

// 내 시간표 전체 조회
exports.getSubjects = async (req, res) => {
  console.log('subjectController.js: getSubjects 함수 호출됨');
  try {
    const subjects = await db.Subject.findAll({ where: { userId: req.user.id } });
    console.log('subjectController.js: 과목 조회 성공');
    res.json({ subjects });
  } catch (error) {
    console.error('subjectController.js: 과목 조회 실패:', error);
    res.status(400).json({ error: error.message });
  }
};

// 과목(시간표) 수정
exports.updateSubject = async (req, res) => {
  console.log('subjectController.js: updateSubject 함수 호출됨');
  try {
    const { subjectId } = req.params;
    console.log('subjectController.js: 수정할 과목 ID:', subjectId);
    const subject = await db.Subject.findOne({ where: { id: subjectId, userId: req.user.id } });
    if (!subject) {
      console.log('subjectController.js: 과목을 찾을 수 없음');
      return res.status(404).json({ error: '과목을 찾을 수 없습니다.' });
    }
    await subject.update(req.body);
    console.log('subjectController.js: 과목 수정 성공');
    res.json({ subject });
  } catch (error) {
    console.error('subjectController.js: 과목 수정 실패:', error);
    res.status(400).json({ error: error.message });
  }
};

// 과목(시간표) 삭제
exports.deleteSubject = async (req, res) => {
  console.log('subjectController.js: deleteSubject 함수 호출됨');
  try {
    const { subjectId } = req.params;
    console.log('subjectController.js: 삭제할 과목 ID:', subjectId);
    const subject = await db.Subject.findOne({ where: { id: subjectId, userId: req.user.id } });
    if (!subject) {
      console.log('subjectController.js: 과목을 찾을 수 없음');
      return res.status(404).json({ error: '과목을 찾을 수 없습니다.' });
    }
    await subject.destroy();
    console.log('subjectController.js: 과목 삭제 성공');
    res.json({ message: '과목이 삭제되었습니다.' });
  } catch (error) {
    console.error('subjectController.js: 과목 삭제 실패:', error);
    res.status(400).json({ error: error.message });
  }
}; 