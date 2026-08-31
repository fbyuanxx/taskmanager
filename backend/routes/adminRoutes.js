const express = require('express');
const { getUsers } = require('../controllers/adminController');
const {
    protect,
    admin,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', protect, admin, getUsers);

module.exports = router;