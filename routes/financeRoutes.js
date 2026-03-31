const express = require('express');
const router = express.Router();
const { getInvoices, createInvoice, payInvoice, createPayrollRecord, getAllPayroll, getMyPayroll, deletePayroll, updateInvoice, deleteInvoice, updatePayroll } = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { tenantIsolation } = require('../middleware/tenantMiddleware');

// Invoice routes
router.route('/invoices')
    .get(protect, tenantIsolation, getInvoices)
    .post(protect, authorize('super_admin', 'operations'), createInvoice);

router.route('/invoices/:id')
    .put(protect, authorize('super_admin', 'operations'), updateInvoice)
    .delete(protect, authorize('super_admin'), deleteInvoice);

router.route('/invoices/:id/pay').post(protect, payInvoice);

// Payroll routes
router.route('/payroll')
    .post(protect, authorize('super_admin'), createPayrollRecord)
    .get(protect, authorize('super_admin'), getAllPayroll);

router.get('/my-payroll', protect, getMyPayroll);

router.route('/payroll/:id')
    .put(protect, authorize('super_admin'), updatePayroll)
    .delete(protect, authorize('super_admin'), deletePayroll);

module.exports = router;
