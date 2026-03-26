const express = require('express');
const router = express.Router();
const { 
    getAllStaff, updateStaff, deleteStaff, clockIn, clockOut, getMyShifts, getActiveShifts,
    createAssignment, getAssignments, updateAssignment,
    createLeaveRequest, getLeaveRequests, updateLeaveRequest,
    getPublicAdmins
} = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/public/admins', getPublicAdmins);

router.get('/', protect, authorize('super_admin', 'hr', 'operations'), getAllStaff);
router.route('/:id')
    .put(protect, authorize('super_admin', 'hr', 'operations'), updateStaff)
    .delete(protect, authorize('super_admin', 'hr'), deleteStaff);

router.post('/clock-in', protect, clockIn);
router.post('/clock-out', protect, clockOut);
router.get('/shifts', protect, getMyShifts);
router.get('/active-shifts', protect, authorize('super_admin', 'operations'), getActiveShifts);

// Assignments
router.route('/assignments')
    .post(protect, authorize('super_admin', 'operations'), createAssignment)
    .get(protect, getAssignments);

router.route('/assignments/:id')
    .put(protect, authorize('super_admin', 'operations', 'staff'), updateAssignment);

// Leave Requests
router.route('/leave')
    .post(protect, createLeaveRequest)
    .get(protect, getLeaveRequests);

router.route('/leave/:id')
    .put(protect, authorize('super_admin', 'operations'), updateLeaveRequest);

module.exports = router;
