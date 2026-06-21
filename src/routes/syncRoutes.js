const express = require('express');
const router = express.Router();
const { backup, restore } = require('../controllers/syncController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/backup', protect, backup);
router.post('/restore', protect, restore);

module.exports = router;
