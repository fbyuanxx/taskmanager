const express = require('express');
const { getUsers, updateUserStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', protect, admin, getUsers);
router.patch('/users/:id/status', protect, admin, updateUserStatus);

module.exports = router;