const { Router } = require("express");
const { check } = require("express-validator");

const { search, searchProductsFromCategory } = require("../controllers/search");

const { validateForm } = require("../middlewares");
const { categoryExist } = require("../helpers/db-validation");

const router = Router();

router.get("/:collection/:term", search);

router.get(
  "/products",
  [
    check("category", "The id of category is not valid").isMongoId(),
    check("category").custom(categoryExist),
    validateForm,
  ],
  searchProductsFromCategory
);

module.exports = router;
