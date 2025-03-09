const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: "Access denied. Insufficient permissions." });
        }
        next();
    };
};

module.exports = roleMiddleware;
