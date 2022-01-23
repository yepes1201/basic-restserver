const { request, response } = require("express");
const { Product } = require("../models");

const productPost = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const { status, user, ...body } = req.body;

  const productDB = await Product.findOne({ name });
  if (productDB) {
    return res.status(400).json({
      msg: `The product ${name} already exists in database`,
    });
  }

  // Create product
  const data = {
    ...body,
    name,
    user: req.user._id,
  };

  const product = new Product(data);

  // Save product in DB
  await product.save();

  res.status(201).json(product);
};

const productsGet = async (req = request, res = response) => {
  const query = { status: true };
  const { limit = 5, skip = 0 } = req.query;

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("user", "name")
      .populate("category", "name")
      .skip(Number(skip))
      .limit(Number(limit)),
  ]);
  res.json({
    total,
    products,
  });
};

const productGet = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");
  res.json(product);
};

const productPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }

  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.json(product);
};

const productDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(product);
};

module.exports = {
  productPost,
  productsGet,
  productGet,
  productPut,
  productDelete,
};
