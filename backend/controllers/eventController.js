const { Event, User } = require('../models');

// 이벤트 생성
exports.createEvent = async (req, res) => {
  try {
    const { title, start, end, description, color } = req.body;
    const userId = req.user.userId; // JWT에서 추출한 사용자 ID

    const event = await Event.create({
      title,
      start,
      end,
      description,
      color,
      userId
    });

    return res.status(201).json({
      success: true,
      message: '이벤트가 생성되었습니다.',
      event
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '이벤트 생성에 실패했습니다.'
    });
  }
};

// 이벤트 목록 조회
exports.getEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const events = await Event.findAll({
      where: { userId },
      include: [{
        model: User,
        attributes: ['nickname', 'profileImg']
      }]
    });

    return res.json({
      success: true,
      events
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '이벤트 조회에 실패했습니다.'
    });
  }
};

// 이벤트 수정
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, start, end, description, color } = req.body;
    const userId = req.user.userId;

    const event = await Event.findOne({
      where: { id, userId }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: '이벤트를 찾을 수 없습니다.'
      });
    }

    await event.update({
      title,
      start,
      end,
      description,
      color
    });

    return res.json({
      success: true,
      message: '이벤트가 수정되었습니다.',
      event
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '이벤트 수정에 실패했습니다.'
    });
  }
};

// 이벤트 삭제
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const event = await Event.findOne({
      where: { id, userId }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: '이벤트를 찾을 수 없습니다.'
      });
    }

    await event.destroy();

    return res.json({
      success: true,
      message: '이벤트가 삭제되었습니다.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '이벤트 삭제에 실패했습니다.'
    });
  }
};
