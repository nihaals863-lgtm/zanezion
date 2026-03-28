/**
 * Pagination Utility
 * Parses page and limit from query parameters and formats the response.
 */

const getPaginationParams = (query, defaultLimit = 10) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || defaultLimit;
    const offset = (page - 1) * limit;

    return { page, limit, offset };
};

const formatPaginatedResponse = (data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        success: true,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};

module.exports = {
    getPaginationParams,
    formatPaginatedResponse
};
