const Course = require('../model/course');
const httpStatusText = require('../utils/httpStatusText');

const getCourses = async (req, res, next) => {
    const { page = 1, limit = 6, sort = 'createdAt', title } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (title) {
        query.title = { $regex: title, $options: 'i' };
    }
    try {
        const courses = await Course.find({}, { __v: 0 }).sort(sort).limit(limit).skip(skip);
        const totalCourses = await Course.countDocuments();
        const totalPages = Math.ceil(totalCourses / limit);

        res.status(200).json({ status: httpStatusText.SUCCESS, data: { courses, pagination: { totalCourses, totalPages, currentPage: page } } });
    } catch (error) {
        next(error);
    }
};

const getCourse = async (req, res, next) => {
    const courseId = req.params.courseId;
    try {
        const course = await Course.findById( courseId ).populate('creator');
        if(!course){
            const error = new Error ('Course not found');
            error.statusCode = 404;
            error.status = httpStatusText.FAIL;
            error.data = 'Course not found.';
            throw error;
        }
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } }); 
    } catch (error) {
        next(error);
    }
};

const addCourse = async (req, res, next) => {
    const { title, price, description } = req.body;
    try {
        const newCourse = new Course ({
            title: title,
            price: price,
            description: description,
            image: req.file ? `/uploads/courses/${req.file.filename}` : null,
            creator: req.user._id
        })
        await newCourse.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: {newCourse} });
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    const courseId = req.params.courseId;
    const { title, price, description } = req.body;
    try {
        const course = await Course.findById(courseId);
        if(!course){
            const error = new Error ('Course not found');
            error.statusCode = 404;
            error.status = httpStatusText.FAIL;
            error.data = 'Course not found.';
            throw error;
        }
        if(req.user.userRole !== "ADMIN"){
            if(req.user._id.toString() !== course.creator.toString()){
                const error = new Error('You are not authorized to modify this course.');
                error.statusCode = 403;
                error.status = httpStatusText.FAIL;
                throw error;
            }
        }
        if (req.file) {
            if (course.image) {
                fs.unlinkSync(`.${course.image}`);
            }
            course.image = `/uploads/courses/${req.file.filename}`;
        }
        course.title = title;
        course.price = price;
        course.description = description;
        
        await course.save();
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } });

    } catch (error) {
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    const courseId = req.params.courseId;
    try {
        const course = await Course.findById(courseId);
        if(req.user.userRole !== "ADMIN"){
            if(req.user._id.toString() !== course.creator.toString()){
                const error = new Error('You are not authorized to modify this course.');
                error.statusCode = 403;
                error.status = httpStatusText.FAIL;
                throw error;
            }
        }
        if (course.image) {
            fs.unlink(`.${course.image}`);
        }
        await course.deleteOne();
        res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCourse,
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse
}