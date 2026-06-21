const express = require('express');
const router = express.Router();
const { sendMessage, pair, getStatus, disconnect } = require('../controllers/whatsappController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // All routes require authentication

router.post('/send', sendMessage);
router.post('/pair', pair);
router.get('/status', getStatus);
router.post('/disconnect', disconnect);

module.exports = router;
