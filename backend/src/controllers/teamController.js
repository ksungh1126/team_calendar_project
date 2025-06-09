const { Team, TeamMember, User } = require('../models');
const { Op } = require('sequelize');

// 팀 생성
exports.createTeam = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    
    // 팀 생성
    const team = await Team.create({
      name,
      description,
      isPublic: isPublic || false
    });

    // 생성자를 팀장(admin)으로 추가
    await TeamMember.create({
      teamId: team.id,
      userId: req.user.id,
      role: 'admin'
    });

    res.status(201).json({ team });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 팀원 초대
exports.inviteMember = async (req, res) => {
  try {
    const { teamId, userId } = req.body;

    // 팀 존재 확인
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: '팀을 찾을 수 없습니다.' });
    }

    // 초대하는 사람이 팀의 admin인지 확인
    const isAdmin = await TeamMember.findOne({
      where: {
        teamId,
        userId: req.user.id,
        role: 'admin'
      }
    });
    if (!isAdmin) {
      return res.status(403).json({ error: '팀원을 초대할 권한이 없습니다.' });
    }

    // 이미 팀원인지 확인
    const existingMember = await TeamMember.findOne({
      where: { teamId, userId }
    });
    if (existingMember) {
      return res.status(400).json({ error: '이미 팀원입니다.' });
    }

    // 팀원 추가
    await TeamMember.create({
      teamId,
      userId,
      role: 'member'
    });

    res.json({ message: '팀원을 초대했습니다.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 팀 목록 조회
exports.getTeams = async (req, res) => {
  try {
    const teams = await TeamMember.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Team,
        include: [{
          model: User,
          through: { attributes: ['role'] },
          attributes: { exclude: ['password'] }
        }]
      }]
    });

    res.json({ teams: teams.map(t => t.Team) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 팀 상세 정보 조회
exports.getTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    // 팀 존재 확인
    const team = await Team.findByPk(teamId, {
      include: [{
        model: User,
        through: { attributes: ['role'] },
        attributes: { exclude: ['password'] }
      }]
    });

    if (!team) {
      return res.status(404).json({ error: '팀을 찾을 수 없습니다.' });
    }

    // 팀원인지 확인
    const isMember = await TeamMember.findOne({
      where: { teamId, userId: req.user.id }
    });
    if (!isMember && !team.isPublic) {
      return res.status(403).json({ error: '팀에 접근할 권한이 없습니다.' });
    }

    res.json({ team });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 팀원 역할 변경
exports.updateMemberRole = async (req, res) => {
  try {
    const { teamId, userId, role } = req.body;

    // 팀 존재 확인
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: '팀을 찾을 수 없습니다.' });
    }

    // 변경하는 사람이 팀의 admin인지 확인
    const isAdmin = await TeamMember.findOne({
      where: {
        teamId,
        userId: req.user.id,
        role: 'admin'
      }
    });
    if (!isAdmin) {
      return res.status(403).json({ error: '팀원 역할을 변경할 권한이 없습니다.' });
    }

    // 변경할 팀원이 존재하는지 확인
    const member = await TeamMember.findOne({
      where: { teamId, userId }
    });
    if (!member) {
      return res.status(404).json({ error: '팀원을 찾을 수 없습니다.' });
    }

    // 역할 변경
    member.role = role;
    await member.save();

    res.json({ message: '팀원 역할이 변경되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 팀원 추방
exports.removeMember = async (req, res) => {
  try {
    const { teamId, userId } = req.body;

    // 팀 존재 확인
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: '팀을 찾을 수 없습니다.' });
    }

    // 추방하는 사람이 팀의 admin인지 확인
    const isAdmin = await TeamMember.findOne({
      where: {
        teamId,
        userId: req.user.id,
        role: 'admin'
      }
    });
    if (!isAdmin) {
      return res.status(403).json({ error: '팀원을 추방할 권한이 없습니다.' });
    }

    // 추방할 팀원이 존재하는지 확인
    const member = await TeamMember.findOne({
      where: { teamId, userId }
    });
    if (!member) {
      return res.status(404).json({ error: '팀원을 찾을 수 없습니다.' });
    }

    // 마지막 admin인지 확인
    if (member.role === 'admin') {
      const adminCount = await TeamMember.count({
        where: { teamId, role: 'admin' }
      });
      if (adminCount <= 1) {
        return res.status(400).json({ error: '마지막 팀장은 추방할 수 없습니다.' });
      }
    }

    // 팀원 추방
    await member.destroy();

    res.json({ message: '팀원이 추방되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 