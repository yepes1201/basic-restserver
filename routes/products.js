const { Router } = require("express");
const { check } = require("express-validator");

const { validateForm, validateJWT, isAdminRole } = require("../middlewares");

const {
  categoryExist,
  productExist,
  productNameExist,
} = require("../helpers/db-validation");

const {
  productPost,
  productsGet,
  productGet,
  productPut,
  productDelete,
} = require("../controllers/products");

const router = Router();

// Get all products - public
router.get("/", productsGet);

// Get product from ID - public
router.get(
  "/:id",
  [
    check("id", "Id is not Mongo id").isMongoId(),
    check("id").custom(productExist),
    validateForm,
  ],
  productGet
);

// Create a product - user with valid token
router.post(
  "/",
  [
    validateJWT,
    check("category", "Category is required").isMongoId(),
    check("category").custom(categoryExist),
    check("name", "Name is required").notEmpty(),
    validateForm,
  ],
  productPost
);

// Update a product - user with valid token
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "Id is not MongoID").isMongoId(),
    check("id").custom(productExist),
    check("id").custom(productNameExist),
    validateForm,
  ],
  productPut
);

// Delete a product - admin user
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "Id is not MongoID").isMongoId(),
    check("id").custom(productExist),
    validateForm,
  ],
  productDelete
);

module.exports = router;
