const express = require("express");
const router = express.Router();
const apiCTL = require('../controllers/api');

router.post('/users', apiCTL.users);
router.get('/statuses', apiCTL.statuses);
router.get('/tasks', apiCTL.tasks);

module.exports = router;