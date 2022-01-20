const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User / Password doesnt exist - EMAIL",
      });
    }

    // Check if user is active
    if (!user.status) {
      return res.status(400).json({
        msg: "User / Password doesnt exist - STATUS: FALSE",
      });
    }

    // Check password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "User / Password doesnt exist - PASSWORD",
      });
    }

    // Create JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

module.exports = {
  login,
};
