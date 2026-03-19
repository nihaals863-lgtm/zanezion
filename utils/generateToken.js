const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id, role, companyId = null) => {
    return jwt.sign({ id, role, companyId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

module.exports = generateToken;
