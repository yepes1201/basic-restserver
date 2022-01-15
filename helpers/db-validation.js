const Role = require("../models/role");
const User = require("../models/user");

const isRoleValid = async (role = "") => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist) throw new Error(`Role ${role} not valid`);
};

const emailExist = async (email = "") => {
  const emailExist = await User.findOne({ email });
  if (emailExist) throw new Error(`Email \"${email}\" already exists.`);
};

const userExist = async (id) => {
  const userExist = await User.findById(id);
  if (!userExist) throw new Error(`User with id ${id} doesn't exist`);
};

const userAlreadyInactive = async (id) => {
  const userAlreadyInactive = await User.findById(id);
  if (!userAlreadyInactive.status)
    throw new Error(`User with id ${id} already inactive`);
};

module.exports = {
  isRoleValid,
  emailExist,
  userExist,
  userAlreadyInactive,
};
