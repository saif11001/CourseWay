const httpStatusText = require('../utils/httpStatusText');

const getUser = (req, res, next) => {
    res
        .status(200)
        .json({
            status: httpStatusText.SUCCESS,
            data: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                userRole: req.user.userRole
            }
        })
}

module.exports = {
    getUser
}