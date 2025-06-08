const { Team, TeamMember, User } = require('../models');

// 팀 생성
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    // 팀 생성
    const team = await Team.create({
      name,
      description
    });

    // 팀 생성자를 관리자로 추가
    await TeamMember.create({
      teamId: team.id,
      userId,
      role: 'admin'
    });

    return res.status(201).json({
      success: true,
      message: '팀이 생성되었습니다.',
      team
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '팀 생성에 실패했습니다.'
    });
  }
};

// 팀 목록 조회
exports.getTeams = async (req, res) => {
  try {
    const userId = req.user.userId;

    const teams = await Team.findAll({
      include: [{
        model: TeamMember,
        where: { userId },
        include: [{
          model: User,
          attributes: ['nickname', 'profileImg']
        }]
      }]
    });

    return res.json({
      success: true,
      teams
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '팀 목록 조회에 실패했습니다.'
    });
  }
};

// 팀 상세 정보 조회
exports.getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const team = await Team.findOne({
      where: { id },
      include: [{
        model: TeamMember,
        include: [{
          model: User,
          attributes: ['nickname', 'profileImg']
        }]
      }]
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: '팀을 찾을 수 없습니다.'
      });
    }

    // 팀 멤버인지 확인
    const isMember = team.TeamMembers.some(member => member.userId === userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: '팀 멤버만 접근할 수 있습니다.'
      });
    }

    return res.json({
      success: true,
      team
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '팀 정보 조회에 실패했습니다.'
    });
  }
};

// 팀 수정
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.userId;

    // 팀과 멤버 정보 조회
    const teamMember = await TeamMember.findOne({
      where: { teamId: id, userId }
    });

    if (!teamMember || teamMember.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '팀 관리자만 수정할 수 있습니다.'
      });
    }

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: '팀을 찾을 수 없습니다.'
      });
    }

    await team.update({
      name,
      description
    });

    return res.json({
      success: true,
      message: '팀 정보가 수정되었습니다.',
      team
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '팀 수정에 실패했습니다.'
    });
  }
};

// 팀 삭제
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // 팀과 멤버 정보 조회
    const teamMember = await TeamMember.findOne({
      where: { teamId: id, userId }
    });

    if (!teamMember || teamMember.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '팀 관리자만 삭제할 수 있습니다.'
      });
    }

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: '팀을 찾을 수 없습니다.'
      });
    }

    await team.destroy();

    return res.json({
      success: true,
      message: '팀이 삭제되었습니다.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '팀 삭제에 실패했습니다.'
    });
  }
};

// 팀 멤버 추가
exports.addTeamMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;
    const adminId = req.user.userId;

    // 관리자 권한 확인
    const adminMember = await TeamMember.findOne({
      where: { teamId, userId: adminId, role: 'admin' }
    });

    if (!adminMember) {
      return res.status(403).json({
        success: false,
        message: '팀 관리자만 멤버를 추가할 수 있습니다.'
      });
    }

    // 이미 멤버인지 확인
    const existingMember = await TeamMember.findOne({
      where: { teamId, userId }
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: '이미 팀 멤버입니다.'
      });
    }

    // 새 멤버 추가
    const teamMember = await TeamMember.create({
      teamId,
      userId,
      role: 'member'
    });

    return res.status(201).json({
      success: true,
      message: '팀 멤버가 추가되었습니다.',
      teamMember
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '팀 멤버 추가에 실패했습니다.'
    });
  }
};

// 팀 멤버 삭제
exports.removeTeamMember = async (req, res) => {
  try {
    const { teamId, userId } = req.params;
    const adminId = req.user.userId;

    // 관리자 권한 확인
    const adminMember = await TeamMember.findOne({
      where: { teamId, userId: adminId, role: 'admin' }
    });

    if (!adminMember) {
      return res.status(403).json({
        success: false,
        message: '팀 관리자만 멤버를 삭제할 수 있습니다.'
      });
    }

    // 자기 자신은 삭제할 수 없음
    if (userId === adminId) {
      return res.status(400).json({
        success: false,
        message: '자기 자신은 삭제할 수 없습니다.'
      });
    }

    const result = await TeamMember.destroy({
      where: { teamId, userId }
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: '팀 멤버를 찾을 수 없습니다.'
      });
    }

    return res.json({
      success: true,
      message: '팀 멤버가 삭제되었습니다.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '팀 멤버 삭제에 실패했습니다.'
    });
  }
};
