const { request, response } = require("express");
const User = require("../models/user");

const isAdminRole = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Wants to verify role before validating JWT",
    });
  }

  const { name, role } = req.user;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not admin`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "Wants to verify role before validating JWT",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `User must have one of these roles ${roles}`,
      });
    }
    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};
