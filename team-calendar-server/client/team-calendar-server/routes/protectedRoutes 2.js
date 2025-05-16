const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: '보호된 정보입니다.',
    user: req.user
  });
});

module.exports = router;
