const SubscriptionRequest = require('../models/saasModel');
const Client = require('../models/clientModel');
const crypto = require('crypto');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

const saasController = {
    submitRequest: async (req, res, next) => {
        try {
            const requestId = await SubscriptionRequest.create(req.body);
            res.status(201).json({ 
                success: true, 
                id: requestId, 
                message: 'Subscription protocol registry received. Our HQ will audit your application shortly.' 
            });
        } catch (error) {
            next(error);
        }
    },

    getRequests: async (req, res, next) => {
        try {
            const { page, limit, offset } = getPaginationParams(req.query);
            const { search } = req.query;
            const role = req.user.role.toLowerCase().replace(/\s/g, '');
            let filterId = undefined; // Default: No filtering

            if (role === 'operations') {
                filterId = req.user.id;
            }

            const { rows, total } = await SubscriptionRequest.getAll(filterId, { limit, offset, search });
            res.json(formatPaginatedResponse(rows, total, page, limit));
        } catch (error) {
            next(error);
        }
    },

    updateRequestStatus: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const success = await SubscriptionRequest.updateStatus(id, status);
            if (!success) return res.status(404).json({ message: 'Request not found' });
            
            res.json({ success: true, message: `Request ${status.toLowerCase()} successfully` });
        } catch (error) {
            next(error);
        }
    },

    // Provision a SaaS client: creates user + client records with generated password
    provisionClient: async (req, res, next) => {
        try {
            const { id } = req.params;

            // 1. Get the subscription request
            const request = await SubscriptionRequest.getById(id);
            if (!request) {
                return res.status(404).json({ success: false, message: 'Subscription request not found' });
            }

            if (request.status === 'Approved') {
                return res.status(400).json({
                    success: false,
                    message: 'This subscription protocol has already been activated or provisioned.'
                });
            }

            // 2. Generate a random password
            const generatedPassword = crypto.randomBytes(4).toString('hex'); // 8-char hex password

            // 3. Create user + client via Client.create() (handles users + clients tables with hashed password)
            const clientId = await Client.create({
                name: request.client_name,
                email: request.email,
                phone: request.contact || null,
                password: generatedPassword,
                location: request.country || 'Bahamas',
                client_type: 'SaaS',
                plan: (request.plan || 'Standard').replace(' Protocol', ''),
                billing_cycle: 'Monthly',
                payment_method: 'Credit Card',
                contact_person: request.contact,
                business_name: request.client_name,
                source: 'Subscriber',
                status: 'active',
                assigned_admin_id: request.assigned_admin_id
            });

            // 4. Update subscription request status to Approved (provisioned)
            await SubscriptionRequest.updateStatus(id, 'Approved');

            // 5. Return credentials (plain text password) so admin can share with client
            res.json({
                success: true,
                message: 'Strategic Account Provisioned. Credentials ready for transmission to client.',
                data: {
                    clientId,
                    clientName: request.client_name,
                    email: request.email,
                    password: generatedPassword,
                    plan: request.plan
                }
            });
        } catch (error) {
            // Handle duplicate email gracefully
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'A user with this email already exists. Client may have already been provisioned.' 
                });
            }
            next(error);
        }
    },

    deleteRequest: async (req, res, next) => {
        try {
            const { id } = req.params;
            const success = await SubscriptionRequest.delete(id);
            if (!success) return res.status(404).json({ message: 'Request not found' });
            res.json({ success: true, message: 'Request deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = saasController;
