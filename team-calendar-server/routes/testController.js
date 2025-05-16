const db = require('../config/db');

exports.testDBConnection = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.status(200).json({ success: true, result: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'DB 연결 실패' });
  }
};
