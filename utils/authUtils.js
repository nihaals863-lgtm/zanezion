/**
 * Normalizes a role string to a canonical shorthand key used by the application.
 * This mirrors the frontend logic in v_zanezion/src/utils/authUtils.js
 * @param {string} role - The raw role string from the database (e.g., "Concierge Manager").
 * @returns {string} - The normalized canonical role key (e.g., "concierge").
 */
const normalizeRole = (role) => {
    if (!role) return 'staff'; // Default fallback

    const r = role.toLowerCase().trim();

    if (r.includes('superadmin') || r.includes('super admin') || r.includes('super_admin')) return 'super_admin';
    if (r.includes('procurement')) return 'procurement';
    if (r.includes('operations')) return 'operations';
    if (r.includes('logistics')) return 'logistics';
    if (r.includes('inventory') || r.includes('stock')) return 'inventory';
    if (r.includes('concierge')) return 'concierge';
    if (r.includes('saas_client') || r.includes('saas client') || r.includes('saas')) return 'saas_client';
    if (r.includes('client')) return 'client';
    if (r.includes('vendor')) return 'vendor';
    if (r.includes('staff')) return 'staff';

    return 'staff'; // Final fallback for unknown roles
};

module.exports = { normalizeRole };
