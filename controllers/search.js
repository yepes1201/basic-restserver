const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");

const { User, Category, Product } = require("../models");

const availableCollections = ["users", "products", "categories", "roles"];

const searchUser = async (term = "", res = response) => {
  const isMongoId = isValidObjectId(term);
  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }
  const regex = new RegExp(term, "i");
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });
  res.json({
    results: users,
  });
};

const searchCategories = async (term = "", res = response) => {
  const isMongoId = isValidObjectId(term);
  if (isMongoId) {
    const category = await Category.findById(term).populate("user", [
      "name",
      "email",
    ]);
    return res.json({
      results: category ? [category] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const categories = await Category.find({
    $or: [{ name: regex, status: true }],
  }).populate("user", ["name", "email"]);

  res.json({
    results: categories,
  });
};

const searchProducts = async (term = "", res = response) => {
  const isMongoId = isValidObjectId(term);
  if (isMongoId) {
    const product = await Product.findById(term)
      .populate("user", ["name", "email"])
      .populate("category", "name");
    return res.json({
      results: product ? [product] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const product = await Product.find({
    $or: [{ name: regex, status: true }],
  })
    .populate("user", ["name", "email"])
    .populate("category");

  res.json({
    results: product,
  });
};

const search = (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!availableCollections.includes(collection)) {
    return res.status(400).json({
      msg: `The existing collections are ${availableCollections}`,
    });
  }

  switch (collection) {
    case "users":
      searchUser(term, res);
      break;
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;

    default:
      res.status(500).json({
        msg: "Invalid search",
      });
      break;
  }
};

const searchProductsFromCategory = async (req = request, res = response) => {
  const { category } = req.query;

  const products = await Product.find({ category, status: true });
  res.json({
    results: products,
  });
};

module.exports = {
  search,
  searchProductsFromCategory,
};
