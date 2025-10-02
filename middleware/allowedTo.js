module.exports = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role?.toLowerCase();

    const allowedRoles = roles.map(role => role.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to access this resource.'
      });
    }

    next();
  };
};
