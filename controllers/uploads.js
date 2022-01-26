const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");

const { User, Product } = require("../models");

const { uploadFileHelper } = require("../helpers/upload-file");

const uploadFile = async (req = request, res = response) => {
  try {
    const name = await uploadFileHelper(req.files, undefined, "img");
    res.json({ name });
  } catch (msg) {
    res.json({ msg });
  }
};

const updateImage = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `User with id ${id} doesn't exist` });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `Product with id ${id} doesn't exist` });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Something went wrong in server side.",
      });
  }

  // Delete previous image
  if (model.img) {
    const pathImg = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  // Save new image
  const name = await uploadFileHelper(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model);
};

// Cloudinary
const updateImageCloudinary = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `User with id ${id} doesn't exist` });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `Product with id ${id} doesn't exist` });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Something went wrong in server side.",
      });
  }

  // Delete previous image
  if (model.img) {
    const arrPath = model.img.split("/");
    const file = arrPath[arrPath.length - 1];
    const [name] = file.split(".");
    cloudinary.uploader.destroy(name);
  }

  // Save new image
  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;
  await model.save();

  res.json(model);
};

const getImage = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `User with id ${id} doesn't exist` });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `Product with id ${id} doesn't exist` });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Something went wrong in server side.",
      });
  }

  // Get image
  if (model.img) {
    return res.json({ img: model.img });
  }
  const pathNoImg = path.join(__dirname, "../assets/no-image.jpg");
  if (fs.existsSync(pathNoImg)) {
    return res.sendFile(pathNoImg);
  }

  res.json({
    msg: `${model.name} doesn't have image`,
  });
};

module.exports = {
  uploadFile,
  updateImage,
  getImage,
  updateImageCloudinary,
};
