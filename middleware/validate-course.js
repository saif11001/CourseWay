const { body } = require('express-validator');

const formCourse = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 2 }).withMessage('Title must be at least 2 characters long')
        .trim(),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number')
        .custom(value => value > 0).withMessage('Price must be greater than 0'),
    body('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20 and 1000 characters.')
        .trim()
];

module.exports = { formCourse };