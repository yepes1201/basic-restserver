const { Router } = require("express");
const { check } = require("express-validator");

const { validateForm, validateJWT, isAdminRole } = require("../middlewares");

const {
  categoriesGet,
  categoryGet,
  categoryPost,
  categoryPut,
  categoryDelete,
} = require("../controllers/categories");

const {
  categoryExist,
  categoryNameExist,
} = require("../helpers/db-validation");

const router = Router();

// Get all categories - public
router.get("/", categoriesGet);

// Get category from ID - public
router.get(
  "/:id",
  [
    check("id", "Id is not a MongoID").isMongoId(),
    check("id").custom(categoryExist),
    validateForm,
  ],
  categoryGet
);

// Create a category - user with valid token
router.post(
  "/",
  [validateJWT, check("name", "Name is required").notEmpty(), validateForm],
  categoryPost
);

// Update a category - user with valid token
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "Id is not a MongoID").isMongoId(),
    check("id").custom(categoryExist),
    check("name", "Name is required").notEmpty(),
    check("name").custom(categoryNameExist),
    validateForm,
  ],
  categoryPut
);

// Delete a category - admin user
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "Id is not a MongoID").isMongoId(),
    check("id").custom(categoryExist),
    validateForm,
  ],
  categoryDelete
);

module.exports = router;
