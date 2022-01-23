const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const { User } = require("../models");

const { generateJWT } = require("../helpers/generate-jwt");
const { validateGoogleSignIn } = require("../helpers/google-verify");

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
        msg: "User / Password doens't match - PASSWORD",
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

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;
  try {
    const { name, imgUrl, email } = await validateGoogleSignIn(id_token);
    let user = await User.findOne({ email });

    // Create user
    if (!user) {
      const data = { name, email, password: ":p", imgUrl, google: true };
      user = new User(data);
      await user.save();
    }

    // Check if user is inactive
    if (!user.status) {
      return res.status(401).json({
        msg: "User inactive",
      });
    }

    // Check if user already exists with the same email but not with google
    if (!user.google) {
      return res.status(401).json({
        msg: "User already exists with this email. Please sign in with your credentials",
      });
    }

    // Create JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({
      msg: "Invalid token",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
