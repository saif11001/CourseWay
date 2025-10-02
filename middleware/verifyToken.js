const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const User = require('../model/user');

const verifyToken = async (req, res, next) => {
    const authHeader = req.get('Authorization') || req.get('authorization');
    if(!authHeader) {
        return res.status(401).json({ status: httpStatusText.FAIL, data: { user: 'Authorization header is missing' } });
    }
    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({ status: httpStatusText.FAIL, data: { user: 'Token is missing from Authorization header'} });
    }
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(currentUser.id).select("-password");
        req.user = user;
        next();

    } catch (error) {
        next(error);
    }
}

module.exports = verifyToken;