const Shift = require('../models/shiftModel');
const Assignment = require('../models/assignmentModel');
const LeaveRequest = require('../models/leaveModel');
const User = require('../models/userModel');

// @desc    Get all staff (Admin)
// @route   GET /api/staff
// @access  Private (Admin)
const getAllStaff = async (req, res) => {
    try {
        const staff = await User.findAll();
        res.json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private (Admin)
const updateStaff = async (req, res) => {
    try {
        const success = await User.update(req.params.id, req.body);
        if (success) {
            res.json({ success: true, message: 'Staff member updated' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};

// @desc    Delete staff (soft delete)
// @route   DELETE /api/staff/:id
// @access  Private (Admin)
const deleteStaff = async (req, res) => {
    try {
        const success = await User.softDelete(req.params.id);
        if (success) {
            res.json({ success: true, message: 'Staff member removed' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Clock in
// @route   POST /api/staff/clock-in
// @access  Private
const clockIn = async (req, res) => {
    try {
        const { location } = req.body;
        const shiftId = await Shift.clockIn(req.user.id, location);
        res.status(201).json({ success: true, shiftId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Clock out
// @route   POST /api/staff/clock-out
// @access  Private
const clockOut = async (req, res) => {
    try {
        const result = await Shift.clockOut(req.user.id);
        if (!result) return res.status(400).json({ message: 'No active shift found' });
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user shifts
// @route   GET /api/staff/shifts
// @access  Private
const getMyShifts = async (req, res) => {
    try {
        const shifts = await Shift.getByUserId(req.user.id);
        res.json({ success: true, data: shifts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all active shifts (Admin)
// @route   GET /api/staff/active-shifts
// @access  Private (Admin)
const getActiveShifts = async (req, res) => {
    try {
        const shifts = await Shift.getActiveShifts();
        res.json({ success: true, data: shifts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Assignments
const createAssignment = async (req, res) => {
    try {
        const id = await Assignment.create(req.body);
        const newAssignment = { id, ...req.body };
        res.status(201).json({ success: true, data: newAssignment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.getAll();
        res.json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAssignment = async (req, res) => {
    try {
        await Assignment.update(req.params.id, req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Leave Requests
const createLeaveRequest = async (req, res) => {
    try {
        const id = await LeaveRequest.create({ ...req.body, userId: req.user.id });
        const newLeaveRequest = { id, ...req.body, userId: req.user.id, status: 'pending' };
        res.status(201).json({ success: true, data: newLeaveRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getLeaveRequests = async (req, res) => {
    try {
        const requests = await LeaveRequest.getAll();
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateLeaveRequest = async (req, res) => {
    try {
        await LeaveRequest.update(req.params.id, req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get public admins (Operations)
// @route   GET /api/staff/public/admins
// @access  Public
const getPublicAdmins = async (req, res) => {
    try {
        const admins = await User.getOperationsAdmins();
        res.json({ success: true, data: admins });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllStaff,
    updateStaff,
    deleteStaff,
    clockIn,
    clockOut,
    getMyShifts,
    getActiveShifts,
    createAssignment,
    getAssignments,
    updateAssignment,
    createLeaveRequest,
    getLeaveRequests,
    updateLeaveRequest,
    getPublicAdmins
};
