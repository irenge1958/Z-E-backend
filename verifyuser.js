const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const createError = require('./createError');
dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.accesstoken; // Add missing semicolon
    
    if (!token) return next(createError(401, 'you are not authenticated')); // Fix error message
    jwt.verify(token, process.env.JWT, (err, user) => { // Use process.env.JWT
        if (err) return next(createError(401, 'you are not authorized'));
        req.user = user;
     
        next();
    });
};

module.exports = verifyToken;
