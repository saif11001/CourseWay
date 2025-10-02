const { body } = require('express-validator');
const User = require('../model/user');

const register = [
    body('name')
        .trim()
        .notEmpty().withMessage('Your name is required')
        .isLength({ min: 2, max: 15 }).withMessage('Your name must be between 2 and 15 characters'),
    body('email')
        .trim()
        .isEmail().withMessage('Please enter a valid email.')
        .toLowerCase()
        .normalizeEmail()
        .custom(async (value) => {
            const userDOC = await User.findOne({email: value})
                if(userDOC) {
                    throw new Error('E-mail exists already, please pick a different one.')
                }
        }),
    body('password')
        .trim()
        .isLength({min: 6}).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['user', 'manager', 'admin']).withMessage('Invalid role. Must be one of: user, manager, admin')
        .trim()
];

const login = [
    body('email')
        .trim()
        .isEmail().withMessage('Please enter a valid email.')
        .normalizeEmail()
        .toLowerCase(),
    body('password')
        .isLength({min: 6}).withMessage('Password must be at least 6 characters')
        .trim(),
];

module.exports = {
    register,
    login
}