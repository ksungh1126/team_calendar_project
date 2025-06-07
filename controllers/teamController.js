const Team = require('../models/Team');
const User = require('../models/User');

exports.createTeam = async (req, res) => {
  try {
    const team = new Team({ name: req.body.name, members: [req.user.userId] });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: '팀 생성 실패', detail: err.message });
  }
};

exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', '-password');
    if (!team) return res.status(404).json({ message: '팀 없음' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: '팀 조회 실패' });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: '팀 삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: '삭제 실패' });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', '-password');
    res.json(team.members);
  } catch (err) {
    res.status(500).json({ error: '팀원 조회 실패' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: '사용자 없음' });
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: user._id } },
      { new: true }
    );
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: '팀원 추가 실패' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.userEmail });
    if (!user) return res.status(404).json({ message: '사용자 없음' });
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: user._id } },
      { new: true }
    );
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: '팀원 제거 실패' });
  }
};
