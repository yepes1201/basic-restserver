const { Role, User, Category, Product } = require("../models");

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

const categoryExist = async (id) => {
  const categoryIdExist = await Category.findById(id);
  if (!categoryIdExist || !categoryIdExist.status) {
    throw new Error(`Category with id ${id} doesn't exist`);
  }
};

const categoryNameExist = async (name = "") => {
  const nameToSearch = name.toUpperCase();
  const categoryNameExist = await Category.findOne({ name: nameToSearch });
  if (categoryNameExist) {
    throw new Error(
      `The category name you are trying to set "${name}", already exists. Please try a new name`
    );
  }
};

const productExist = async (id) => {
  const productExist = await Product.findById(id);
  if (!productExist || !productExist.status) {
    throw new Error(`Product with id ${id} doesn't exist`);
  }
};

const productNameExist = async (name = "") => {
  const nameToSearch = name.toUpperCase();
  const productNameExist = await Product.findOne({ name: nameToSearch });
  if (productNameExist) {
    throw new Error(
      `The product name you are trying to set "${name}", already exists. Please try a new name`
    );
  }
};

const validCollections = (collection = "", collections = []) => {
  if (!collections.includes(collection)) {
    throw new Error(
      `The collection ${collection} is forbidden. Valid collections: ${collections}`
    );
  }
  return true;
};

module.exports = {
  isRoleValid,
  emailExist,
  userExist,
  userAlreadyInactive,
  categoryExist,
  categoryNameExist,
  productExist,
  productNameExist,
  validCollections,
};
