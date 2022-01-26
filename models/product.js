const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, "Name of category is required"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: { type: String, default: "" },
  available: { type: Boolean, default: true },
  img: { type: String },
});

ProductSchema.methods.toJSON = function () {
  const { __v, status, ...category } = this.toObject();
  return {
    ...category,
  };
};

module.exports = model("Product", ProductSchema);
