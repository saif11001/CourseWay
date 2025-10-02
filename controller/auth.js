const User = require ('../model/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const httpStatusText = require('../utils/httpStatusText');
const userRole = require('../utils/userRoles');

const register = async (req, res, next) => {
    const { name, email, password , role} = req.body;
    try{
        const olduser = await User.findOne({ email });
        if(olduser) {
            const error = new Error ('E-mail exists already, please pick a different one.');
            error.statusCode = 422;
            error.status = httpStatusText.FAIL;
            error.data = 'E-mail exists already';
            throw error;
        }
        const hashPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name: name,
            email: email,
            password: hashPassword,
            userRole: role || userRole.USER,
            avatar: req.file ? `/uploads/avatars/${req.file.filename}` : null
        })
        const token = jwt.sign({ email: user.email, id: user._id, role: user.userRole }, process.env.JWT_SECRET_KEY, {expiresIn: '30m'});
        user.token = token;
        
        await user.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { id: user._id, name: user.name, email: user.email, userRole: user.userRole, token: user.token, avatar: user.avatar } });
    }catch(error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            const error = new Error ('A user with this email could not be found.');
            error.statusCode = 404;
            error.status = httpStatusText.FAIL;
            error.data = 'Email not found.';
            throw error
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            const error = new Error ('Incorrect password.');
            error.statusCode = 401;
            error.status = httpStatusText.FAIL;
            throw error;
        }
        const token = jwt.sign({ email: user.email, id: user._id, role: user.userRole }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' });
        user.token = token;
        await user.save();
        res.status(200).json({status: httpStatusText.SUCCESS, data: { id: user._id, name: user.name, email: user.email, userRole: user.userRole, token: user.token } });
    }catch(error){
        next(error);
    }
}

module.exports = {
    register,
    login
}