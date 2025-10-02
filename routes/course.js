const express = require('express');

const coursesController = require('../controller/courses');
const validate = require('../middleware/validate-course');
const handleValidationErrors = require('../middleware/handleValidationErrors');
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRole = require('../utils/userRoles');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Course
 *   description: Course management APIs
 */

/**
 * @swagger
 * /api/course:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get('/', coursesController.getCourses);

/**
 * @swagger
 * /api/course/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: A single course
 */

router.get('/:courseId', coursesController.getCourse);

/**
 * @swagger
 * /api/course:
 *   post:
 *     summary: Add a new course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created successfully
 */

router.post('/', verifyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), validate.formCourse, handleValidationErrors, upload.single('image'), coursesController.addCourse);

/**
 * @swagger
 * /api/course/{courseId}:
 *   put:
 *     summary: Update a course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course updated successfully
 */

router.put('/:courseId', verifyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), validate.formCourse, handleValidationErrors,  upload.single('image'), coursesController.updateCourse);

/**
 * @swagger
 * /api/course/{courseId}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 */

router.delete('/:courseId', verifyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), upload.single('image'), coursesController.deleteCourse);

module.exports = router;