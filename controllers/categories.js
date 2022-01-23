const { request, response } = require("express");
const { Category } = require("../models");

const categoryPost = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });
  if (categoryDB) {
    return res.status(400).json({
      msg: `The category ${categoryDB.name} already exists`,
    });
  }

  // Generate data
  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);

  // Save data in DB
  await category.save();

  res.json(category);
};

const categoriesGet = async (req = request, res = response) => {
  const query = { status: true };
  const { limit = 5, skip = 0 } = req.query;

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate("user", "name")
      .skip(Number(skip))
      .limit(Number(limit)),
  ]);
  res.json({
    total,
    categories,
  });
};

const categoryGet = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name");
  res.json(category);
};

const categoryPut = async (req = request, res = response) => {
  const id = req.params.id;
  const { status, user, ...data } = req.body;
  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  res.json({
    category,
  });
};

const categoryDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  res.json(category);
};

module.exports = {
  categoryPost,
  categoriesGet,
  categoryGet,
  categoryPut,
  categoryDelete,
};
