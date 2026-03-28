const express = require('express');
const router = express.Router();
const {
    getTickets, createTicket, updateTicketStatus,
    getEvents, getMyEvents, createEvent, updateEvent, deleteEvent,
    getGuestRequests, createGuestRequest, updateGuestRequest, deleteGuestRequest,
    getChauffeurRequests, getAudits, createAudit, updateAudit, deleteAudit
} = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Ticket routes
router.route('/tickets')
    .get(protect, authorize('super_admin', 'operations', 'client', 'saas_client'), getTickets)
    .post(protect, createTicket);

router.route('/tickets/:id/status').patch(protect, authorize('super_admin', 'operations', 'client', 'saas_client'), updateTicketStatus);

// Concierge routes
router.get('/events/my', protect, getMyEvents);  // NEW: dedicated user-specific events

router.route('/events')
    .get(protect, getEvents)
    .post(protect, createEvent);

router.route('/events/:id')
    .put(protect, updateEvent)
    .delete(protect, deleteEvent);

router.route('/guest-requests')
    .get(protect, getGuestRequests)
    .post(protect, createGuestRequest);

router.route('/guest-requests/:id')
    .put(protect, updateGuestRequest)
    .delete(protect, deleteGuestRequest);

router.get('/chauffeur-requests', protect, getChauffeurRequests);

router.route('/audits')
    .get(protect, getAudits)
    .post(protect, createAudit);

router.route('/audits/:id')
    .put(protect, updateAudit)
    .delete(protect, deleteAudit);

module.exports = router;
