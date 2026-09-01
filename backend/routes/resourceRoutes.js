const express = require('express');
const { getResources, addResource, updateResource, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getResources).post(protect, addResource);
router.route('/:id').put(protect, updateResource).delete(protect, deleteResource);

module.exports = router;
