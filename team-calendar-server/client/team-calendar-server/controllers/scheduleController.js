const db = require('../config/db');

exports.createSchedule = async (req, res) => {
  const { title, description, date, team_id } = req.body;
  const userId = req.user.user_id;

  try {
    await db.query(
      'INSERT INTO schedule (user_id, title, description, date, team_id) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description, date, team_id || null]
    );
	
	console.log('📩 일정 등록 요청 바디:', req.body);
	console.log('🙍 사용자:', req.user);
    res.status(201).json({ success: true, message: '일정이 등록되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '일정 등록 실패' });
  }
};

exports.getSchedules = async (req, res) => {
  const userId = req.user.user_id; // JWT에서 추출한 사용자 ID

  try {
    const [rows] = await db.query(
      `SELECT schedule_id, title, description, date, created_at, team_id
       FROM schedule
       WHERE team_id IS NOT NULL OR user_id = ?
       ORDER BY date ASC`,
      [userId]
    );

    res.json({
      success: true,
      schedules: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '일정 조회 실패' });
  }
};

exports.updateSchedule = async (req, res) => {
  const scheduleId = req.params.id;
  const { title, description, date, team_id } = req.body;
  const userId = req.user.user_id;

  try {
    // 소유자 검증 포함한 업데이트
    const [result] = await db.query(
      `UPDATE schedule 
       SET title = ?, description = ?, date = ?, team_id = ?
       WHERE schedule_id = ? AND user_id = ?`,
      [title, description, date, team_id || null, scheduleId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '해당 일정이 없거나 권한이 없습니다.' });
    }

    res.json({ success: true, message: '일정이 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '일정 수정 실패' });
  }
};

exports.deleteSchedule = async (req, res) => {
  const scheduleId = req.params.id;
  const userId = req.user.user_id;

  try {
   console.log('🔥 삭제 요청 도착:', scheduleId, userId);
     const [result] = await db.query(
      'DELETE FROM schedule WHERE schedule_id = ? AND user_id = ?',
      [scheduleId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '해당 일정이 없거나 권한이 없습니다.' });
    }

    return res.status(200).json({
      success: true,
      message: '일정이 삭제되었습니다.'
    });
  } catch (err) {
    console.error('❌ 삭제 실패:', err);
    return res.status(500).json({
      success: false,
      message: '일정 삭제 중 서버 오류 발생'
    });
  }
};

exports.getRecommendations = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [rows] = await db.query(
      `SELECT WEEKDAY(date) AS weekday, COUNT(*) AS count
       FROM schedule
       WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
       GROUP BY weekday
       ORDER BY count DESC
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        message: '추천할 일정이 없습니다.',
        recommended_weekday: null
      });
    }

    res.json({
      success: true,
      recommended_weekday: rows[0].weekday, // 0=월, 1=화, ..., 6=일
      count: rows[0].count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '추천 일정 분석 실패' });
  }
};
