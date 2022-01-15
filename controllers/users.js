const { request, response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

const usersGet = async (req = request, res = response) => {
  const { limit = 5, skip = 0 } = req.query;
  const query = { status: true };
  const [totalUsers, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(skip)).limit(Number(limit)),
  ]);
  res.json({
    totalUsers,
    users,
  });
};

const usersPost = async (req = request, res = response) => {
  const { name, password, email, role } = req.body;
  const user = new User({
    name,
    password,
    email,
    role,
  });

  // Encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Save to database
  await user.save();

  res.json({
    user,
  });
};

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { status: false });
  res.json(user);
};

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, ...rest } = req.body;

  // TODO validar contra DB
  if (password) {
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const userDB = await User.findByIdAndUpdate(id, rest);

  res.json(userDB);
};

module.exports = {
  usersGet,
  usersPost,
  usersDelete,
  usersPut,
};
