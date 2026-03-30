/**
 * Pagination Utility
 * Parses page and limit from query parameters and formats the response.
 */

const getPaginationParams = (query, defaultLimit = 10000) => {
    // Return a huge limit to effectively disable pagination
    return { page: 1, limit: defaultLimit, offset: 0 };
};

const formatPaginatedResponse = (data, total) => {
    return {
        success: true,
        data,
        total // Keep total for metrics but omit pagination metadata
    };
};

module.exports = {
    getPaginationParams,
    formatPaginatedResponse
};
