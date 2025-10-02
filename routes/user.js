const express = require('express');
const userController = require('../controller/user');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and profile APIs
 */

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current logged-in user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64c2f2a5d9a0c123456789ab"
 *                 name:
 *                   type: string
 *                   example: "Ahmed"
 *                 email:
 *                   type: string
 *                   example: "ahmed@example.com"
 */

router.get('/me', verifyToken, userController.getUser);

module.exports = router;