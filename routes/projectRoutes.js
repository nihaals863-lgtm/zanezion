const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getProjects)
    .post(protect, authorize('super_admin', 'operations'), createProject);

router.route('/:id')
    .put(protect, authorize('super_admin', 'operations'), updateProject)
    .delete(protect, authorize('super_admin'), deleteProject);

module.exports = router;
