const mongoose = require ('mongoose');
const userRole = require('../utils/userRoles');

const Schema = mongoose.Schema;

const userSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        token: {
            type: String,
        },
        userRole: {
            type: String,
            enum: [userRole.ADMIN, userRole.MANAGER, userRole.USER],
            default: userRole.USER
        },
        avatar: { type: String }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema);