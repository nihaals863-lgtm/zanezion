/**
 * Tenant Isolation Middleware
 * Ensures client/saas_client roles always have a valid companyId.
 * Blocks data access if tenant context is missing.
 */
const tenantIsolation = (req, res, next) => {
    const role = (req.user?.role || '').toLowerCase().replace(/[\s_]+/g, '');
    const isClientRole = ['client', 'saasclient'].includes(role);

    if (isClientRole && !req.user.companyId) {
        return res.status(403).json({
            success: false,
            message: 'Tenant context missing. Your account is not linked to a company.'
        });
    }

    // Attach tenant context for easy access in controllers
    if (isClientRole) {
        req.tenantId = req.user.companyId;
    }

    next();
};

module.exports = { tenantIsolation };
