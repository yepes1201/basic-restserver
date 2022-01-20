const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "Not authorized",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Get user from token
    const user = await User.findById(uid);

    // Check if user from token exists
    if (!user) {
      return res.status(401).json({
        msg: "Invalid token - USER NOT FOUND IN DB",
      });
    }

    // Check if user is active
    if (!user.status) {
      return res.status(401).json({
        msg: "Invalid token - STATUS: FALSE",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: "Invalid token",
    });
  }
};

module.exports = {
  validateJWT,
};
