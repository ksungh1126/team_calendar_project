const { Friend } = require('../models');

// 친구 요청 보내기
exports.sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;  // 로그인한 사용자
    const { friend_id } = req.body;

    // 이미 친구 요청 보냈는지 확인
    const existing = await Friend.findOne({
      where: { user_id: userId, friend_id },
    });

    if (existing) {
      return res.status(400).json({ message: '이미 친구 요청을 보냈습니다.' });
    }

    await Friend.create({
      user_id: userId,
      friend_id,
      status: 'pending',
    });

    res.json({ message: '친구 요청을 보냈습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러' });
  }
};

// 친구 목록 조회
exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await Friend.findAll({
      where: {
        user_id: userId,
        status: 'accepted',
      },
    });

    res.json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러' });
  }
};

// 친구 요청 목록 조회
exports.getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Friend.findAll({
      where: {
        friend_id: userId,
        status: 'pending',
      },
    });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러' });
  }
};

// 친구 요청 수락/거절
exports.respondFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;
    const { status } = req.body;

    const request = await Friend.findOne({
      where: {
        id: requestId,
        friend_id: userId,
        status: 'pending',
      },
    });

    if (!request) {
      return res.status(404).json({ message: '요청을 찾을 수 없습니다.' });
    }

    await request.update({ status });

    res.json({ message: `친구 요청을 ${status} 처리했습니다.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러' });
  }
};

// 친구 삭제
exports.deleteFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;

    await Friend.destroy({
      where: {
        user_id: userId,
        friend_id: friendId,
        status: 'accepted',
      },
    });

    await Friend.destroy({
      where: {
        user_id: friendId,
        friend_id: userId,
        status: 'accepted',
      },
    });

    res.json({ message: '친구를 삭제했습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러' });
  }
};