const { User } = require('../models');

// 친구 목록 조회
exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 친구 목록 조회 (실제 구현시에는 친구 관계 테이블을 통해 조회)
    const friends = await User.findAll({
      attributes: ['id', 'nickname', 'profileImg'],
      where: {
        id: {
          [Op.ne]: userId // 자기 자신 제외
        }
      }
    });

    return res.json({
      success: true,
      friends
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '친구 목록 조회에 실패했습니다.'
    });
  }
};

// 친구 검색
exports.searchFriends = async (req, res) => {
  try {
    const { keyword } = req.query;
    const userId = req.user.userId;

    const friends = await User.findAll({
      attributes: ['id', 'nickname', 'profileImg'],
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { nickname: { [Op.like]: `%${keyword}%` } },
              { email: { [Op.like]: `%${keyword}%` } }
            ]
          },
          {
            id: {
              [Op.ne]: userId
            }
          }
        ]
      }
    });

    return res.json({
      success: true,
      friends
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '친구 검색에 실패했습니다.'
    });
  }
};

// 친구 추가 요청
exports.sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.userId;

    // 자기 자신에게 요청할 수 없음
    if (friendId === userId) {
      return res.status(400).json({
        success: false,
        message: '자기 자신에게 친구 요청을 할 수 없습니다.'
      });
    }

    // 이미 친구인지 확인
    const existingFriend = await Friend.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId }
        ]
      }
    });

    if (existingFriend) {
      return res.status(400).json({
        success: false,
        message: '이미 친구 관계입니다.'
      });
    }

    // 친구 요청 생성
    await Friend.create({
      userId,
      friendId,
      status: 'pending'
    });

    return res.status(201).json({
      success: true,
      message: '친구 요청이 전송되었습니다.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '친구 요청 전송에 실패했습니다.'
    });
  }
};

// 친구 요청 수락
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;

    const friendRequest = await Friend.findOne({
      where: {
        id: requestId,
        friendId: userId,
        status: 'pending'
      }
    });

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: '친구 요청을 찾을 수 없습니다.'
      });
    }

    await friendRequest.update({ status: 'accepted' });

    return res.json({
      success: true,
      message: '친구 요청이 수락되었습니다.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '친구 요청 수락에 실패했습니다.'
    });
  }
};

// 친구 요청 거절
exports.rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;

    const friendRequest = await Friend.findOne({
      where: {
        id: requestId,
        friendId: userId,
        status: 'pending'
      }
    });

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: '친구 요청을 찾을 수 없습니다.'
      });
    }

    await friendRequest.destroy();

    return res.json({
      success: true,
      message: '친구 요청이 거절되었습니다.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '친구 요청 거절에 실패했습니다.'
    });
  }
};

// 친구 삭제
exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.userId;

    const friend = await Friend.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId }
        ],
        status: 'accepted'
      }
    });

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: '친구 관계를 찾을 수 없습니다.'
      });
    }

    await friend.destroy();

    return res.json({
      success: true,
      message: '친구가 삭제되었습니다.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '친구 삭제에 실패했습니다.'
    });
  }
}; 