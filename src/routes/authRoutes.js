const express = require('express');
const router = express.Router();
const { login, createEmployee, setupOwner } = require('../controllers/authController');
const { protect, ownerOnly } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/setup-owner', setupOwner); // Should be called once
router.post('/create-employee', protect, ownerOnly, createEmployee);

module.exports = router;
