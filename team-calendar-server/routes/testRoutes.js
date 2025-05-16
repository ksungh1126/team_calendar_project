const express = require('express');
const router = express.Router();
const { testDBConnection } = require('../controllers/testController');

router.get('/db-test', testDBConnection);

module.exports = router;
