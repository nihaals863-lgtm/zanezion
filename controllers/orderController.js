const { Order, Project } = require('../models/orderModel');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const { page, limit, offset } = getPaginationParams(req.query);
        const { status } = req.query;
        const role = (req.user.role || '').toLowerCase().replace(/[\s_]+/g, '');
        const isGlobalRole = ['superadmin', 'operations', 'procurement', 'concierge', 'conciergemanager'].includes(role);
        const companyId = isGlobalRole ? null : req.user.companyId;
        let { rows: orders, total } = await Order.getAll(companyId, { limit, offset, status });

        // Client role fallback: if companyId missing, filter by user.id
        if (['client', 'saasclient'].includes(role) && !req.user.companyId) {
             orders = orders.filter(o => o.client_id === req.user.id);
             total = orders.length;
        }

        res.json(formatPaginatedResponse(orders, total, page, limit));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Client, Super Admin)
const createOrder = async (req, res) => {
    try {
        const body = req.body;
        const items = body.items || [];

        // Calculate total from items if not provided
        const total = body.total || body.total_amount ||
            items.reduce((acc, item) => acc + ((item.quantity || item.qty || 0) * (item.unit_price || item.price || 0)), 0);

        const orderData = {
            clientId: body.clientId || body.client_id || (req.user.role === 'Client' ? req.user.id : null),
            companyId: body.companyId || body.company_id || req.user.companyId || null,
            vendorId: body.vendorId || body.vendor_id,
            type: body.type || 'Custom Order',
            notes: body.notes,
            total_amount: total,
            status: body.status || 'pending_review',
            dueDate: body.dueDate || body.due_date,
            requestDate: body.requestDate || body.orderDate || body.order_date || new Date().toISOString().split('T')[0]
        };

        const orderId = await Order.create(orderData, items);
        const newOrder = await Order.getById(orderId);
        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Super Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const success = await Order.updateStatus(req.params.id, status);
        if (!success) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, message: `Order status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Super Admin)
const deleteOrder = async (req, res) => {
    try {
        const success = await Order.delete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Project Controllers ---

const getProjects = async (req, res) => {
    try {
        const { page, limit, offset } = getPaginationParams(req.query);
        const companyId = req.user.role === 'super_admin' ? null : req.user.companyId;
        const { rows: projects, total } = await Project.getAllProjects(companyId, { limit, offset });

        res.json(formatPaginatedResponse(projects, total, page, limit));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const body = req.body;
        const projectData = {
            name: body.name || body.projectName,
            description: body.description,
            manager_id: body.managerId || body.manager_id || req.user.id,
            start_date: body.startDate || body.start,
            end_date: body.endDate || body.end,
            status: (body.status || 'planned').toLowerCase(),
            company_id: body.companyId || body.company_id || body.clientId || body.client_id,
            order_id: body.orderId || body.order_id
        };

        const projectId = await Project.create(projectData);
        const newProject = await Project.getById(projectId);
        res.status(201).json({ success: true, data: newProject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createProjectFromOrder = async (req, res) => {
    try {
        const projectId = await Project.createFromOrder(req.params.orderId, req.body);
        const newProject = await Project.getById(projectId);
        res.status(201).json({ success: true, data: newProject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProjectStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const success = await Project.updateStatus(req.params.id, status);
        if (!success) return res.status(404).json({ success: false, message: 'Project not found' });
        res.json({ success: true, message: `Project status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getProjects,
    createProject,
    createProjectFromOrder,
    updateProjectStatus
};
