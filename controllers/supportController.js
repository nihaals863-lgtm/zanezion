const { SupportTicket, Event, GuestRequest, Audit } = require('../models/supportModel');

const getTickets = async (req, res) => {
    try {
        const userRole = req.user.role?.toLowerCase() || '';
        const userId = (userRole === 'super_admin' || userRole === 'operations') ? null : req.user.id;
        const tickets = await SupportTicket.getAll(userId);
        res.json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createTicket = async (req, res) => {
    try {
        const ticketId = await SupportTicket.create({ ...req.body, user_id: req.user.id });
        const newTicket = await SupportTicket.getById(ticketId);
        res.status(201).json({ success: true, data: newTicket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const success = await SupportTicket.updateStatus(req.params.id, status);
        if (!success) return res.status(404).json({ success: false, message: 'Ticket not found' });
        res.json({ success: true, message: `Ticket status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getEvents = async (req, res) => {
    try {
        const companyId = req.user.role === 'super_admin' ? null : req.user.companyId;
        const events = await Event.getAll(companyId);
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getGuestRequests = async (req, res) => {
    try {
        const companyId = req.user.role === 'super_admin' ? null : req.user.companyId;
        const requests = await GuestRequest.getAll(companyId);
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const eventId = await Event.create(req.body);
        const newEvent = await Event.getById(eventId);
        res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const success = await Event.update(req.params.id, req.body);
        if (!success) return res.status(404).json({ success: false, message: 'Event not found' });
        const updatedEvent = await Event.getById(req.params.id);
        res.json({ success: true, data: updatedEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const success = await Event.delete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createGuestRequest = async (req, res) => {
    try {
        const requestId = await GuestRequest.create(req.body);
        const newRequest = await GuestRequest.getById(requestId);
        res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateGuestRequest = async (req, res) => {
    try {
        const success = await GuestRequest.update(req.params.id, req.body);
        if (!success) return res.status(404).json({ success: false, message: 'Request not found' });
        const updatedRequest = await GuestRequest.getById(req.params.id);
        res.json({ success: true, data: updatedRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteGuestRequest = async (req, res) => {
    try {
        const success = await GuestRequest.delete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Request not found' });
        res.json({ success: true, message: 'Request deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getChauffeurRequests = async (req, res) => {
    try {
        const [rows] = await require('../config/db').execute(
            `SELECT 
                d.*, 
                u.name as clientName, 
                dr.name as driverName 
            FROM deliveries d 
            LEFT JOIN orders o ON d.order_id = o.id 
            LEFT JOIN users u ON o.client_id = u.id 
            LEFT JOIN users dr ON d.driver_id = dr.id 
            WHERE d.mission_type = 'Chauffeur'`
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAudits = async (req, res) => {
    try {
        const audits = await Audit.getAll();
        res.json({ success: true, data: audits });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createAudit = async (req, res) => {
    try {
        const auditId = await Audit.create(req.body);
        const newAudit = await Audit.getById(auditId);
        res.status(201).json({ success: true, data: newAudit });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAudit = async (req, res) => {
    try {
        const success = await Audit.update(req.params.id, req.body);
        if (!success) return res.status(404).json({ success: false, message: 'Audit not found' });
        const updatedAudit = await Audit.getById(req.params.id);
        res.json({ success: true, data: updatedAudit });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAudit = async (req, res) => {
    try {
        const success = await Audit.delete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Audit not found' });
        res.json({ success: true, message: 'Audit deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getTickets,
    createTicket,
    updateTicketStatus,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getGuestRequests,
    createGuestRequest,
    updateGuestRequest,
    deleteGuestRequest,
    getChauffeurRequests,
    getAudits,
    createAudit,
    updateAudit,
    deleteAudit
};
