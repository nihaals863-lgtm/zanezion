const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createPO,
    getAllPOs,
    getPOById,
    updatePO,
    receiveGoods,
    createRequest,
    getRequests,
    updateRequest,
    createQuote,
    getQuotes
} = require('../controllers/procurementController');
router.post('/po', protect, createPO);
router.get('/po', protect, getAllPOs);
router.get('/po/:id', protect, getPOById);
router.put('/po/:id', protect, updatePO);
router.put('/po/:id/receive', protect, receiveGoods);

// Purchase Requests
router.post('/requests', protect, createRequest);
router.get('/requests', protect, getRequests);
router.put('/requests/:id', protect, updateRequest);

// Quotes
router.post('/quotes', protect, createQuote);
router.get('/quotes', protect, getQuotes);

module.exports = router;
