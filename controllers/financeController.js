const { Invoice, Transaction, Payroll } = require('../models/financeModel');

const getInvoices = async (req, res) => {
    try {
        const companyId = req.user.role === 'super_admin' ? null : req.user.companyId;
        let invoices = await Invoice.getAll(companyId);
        
        // Additional filter for end-user clients
        if (req.user.role.toLowerCase().replace(/\s/g, '') === 'client' && companyId !== null) {
            const Client = require('../models/clientModel');
            const clientDetails = await Client.getByUserId(req.user.id);
            if (clientDetails) {
                invoices = invoices.filter(inv => inv.client_id === clientDetails.id);
            } else {
                invoices = [];
            }
        }
        res.json({ success: true, count: invoices.length, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createInvoice = async (req, res) => {
    try {
        const payload = { ...req.body, company_id: req.user.companyId };
        const invoiceId = await Invoice.create(payload);
        const newInvoice = await Invoice.getById(invoiceId, req.user.companyId);
        res.status(201).json({ success: true, data: newInvoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const payInvoice = async (req, res) => {
    try {
        const transactionId = await Transaction.create({ ...req.body, invoice_id: req.params.id });
        res.status(201).json({ success: true, message: 'Payment recorded', transaction_id: transactionId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createPayrollRecord = async (req, res) => {
    try {
        const payload = { ...req.body, company_id: req.user.companyId };
        const payrollId = await Payroll.create(payload);
        res.status(201).json({ success: true, data: { id: payrollId, ...payload } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllPayroll = async (req, res) => {
    try {
        const companyId = req.user.role === 'super_admin' ? null : req.user.companyId;
        const payrolls = await Payroll.getAll(companyId);
        res.json({ success: true, count: payrolls.length, data: payrolls });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyPayroll = async (req, res) => {
    try {
        const payrolls = await Payroll.getByUserId(req.user.id);
        res.json({ success: true, count: payrolls.length, data: payrolls });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deletePayroll = async (req, res) => {
    try {
        await Payroll.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateInvoice = async (req, res) => {
    try {
        await Invoice.update(req.params.id, req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updatePayroll = async (req, res) => {
    try {
        await Payroll.update(req.params.id, req.body);
        res.json({ success: true, message: 'Payroll record updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteInvoice = async (req, res) => {
    try {
        await Invoice.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getInvoices,
    createInvoice,
    payInvoice,
    createPayrollRecord,
    getAllPayroll,
    getMyPayroll,
    deletePayroll,
    updateInvoice,
    deleteInvoice,
    updatePayroll
};
