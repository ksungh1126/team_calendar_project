const { User, Friend } = require('../models');
const { Op } = require('sequelize');

// 친구 요청 보내기
exports.sendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    if (req.user.id === friendId) {
      return res.status(400).json({ error: '자기 자신에게 친구 요청을 보낼 수 없습니다.' });
    }
    // 이미 친구이거나 요청이 있는지 확인
    const exists = await Friend.findOne({
      where: {
        [Op.or]: [
          { userId: req.user.id, friendId },
          { userId: friendId, friendId: req.user.id }
        ]
      }
    });
    if (exists) {
      return res.status(400).json({ error: '이미 친구이거나 요청이 존재합니다.' });
    }
    // 요청 생성
    await Friend.create({ userId: req.user.id, friendId, status: 'pending' });
    res.json({ message: '친구 요청을 보냈습니다.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 친구 요청 수락
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Friend.findOne({ where: { id: requestId, friendId: req.user.id, status: 'pending' } });
    if (!request) {
      return res.status(404).json({ error: '요청을 찾을 수 없습니다.' });
    }
    request.status = 'accepted';
    await request.save();
    res.json({ message: '친구 요청을 수락했습니다.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 친구 요청 거절
exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Friend.findOne({ where: { id: requestId, friendId: req.user.id, status: 'pending' } });
    if (!request) {
      return res.status(404).json({ error: '요청을 찾을 수 없습니다.' });
    }
    request.status = 'rejected';
    await request.save();
    res.json({ message: '친구 요청을 거절했습니다.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 친구 삭제
exports.deleteFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const deleted = await Friend.destroy({
      where: {
        status: 'accepted',
        [Op.or]: [
          { userId: req.user.id, friendId },
          { userId: friendId, friendId: req.user.id }
        ]
      }
    });
    if (!deleted) {
      return res.status(404).json({ error: '친구 관계를 찾을 수 없습니다.' });
    }
    res.json({ message: '친구를 삭제했습니다.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 친구 목록 조회
exports.getFriends = async (req, res) => {
  try {
    // accepted 상태의 친구만 조회
    const friends = await Friend.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [
          { userId: req.user.id },
          { friendId: req.user.id }
        ]
      }
    });
    // 친구 정보 가져오기
    const friendIds = friends.map(f => (f.userId === req.user.id ? f.friendId : f.userId));
    const users = await User.findAll({ 
      where: { id: friendIds },
      attributes: { exclude: ['password'] }  // password 필드 제외
    });
    res.json({ friends: users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 받은 친구 요청 목록
exports.getReceivedRequests = async (req, res) => {
  try {
    const requests = await Friend.findAll({
      where: { friendId: req.user.id, status: 'pending' },
      include: [{ model: User, as: 'requester', attributes: ['id', 'email', 'name'] }]
    });
    res.json({ requests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 보낸 친구 요청 목록
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await Friend.findAll({
      where: { userId: req.user.id, status: 'pending' },
      include: [{ model: User, as: 'receiver', attributes: ['id', 'email', 'name'] }]
    });
    res.json({ requests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 