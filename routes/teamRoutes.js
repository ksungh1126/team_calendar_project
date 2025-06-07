const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const teamController = require('../controllers/teamController');

router.post('/', protect, teamController.createTeam);
router.get('/:id', protect, teamController.getTeam);
router.delete('/:id', protect, teamController.deleteTeam);
router.get('/:id/members', protect, teamController.getTeamMembers);
router.post('/:id/members', protect, teamController.addMember);
router.delete('/:id/members/:userEmail', protect, teamController.removeMember);

module.exports = router;
