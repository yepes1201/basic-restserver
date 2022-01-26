const { Router } = require("express");
const { check } = require("express-validator");

const {
  uploadFile,
  updateImage,
  getImage,
  updateImageCloudinary,
} = require("../controllers/uploads");

const { validateFileExist, validateForm } = require("../middlewares");
const { validCollections } = require("../helpers");

const router = Router();

router.post("/", validateFileExist, uploadFile);

router.put(
  "/:collection/:id",
  [
    validateFileExist,
    check("id", "Id must be a MongoID").isMongoId(),
    check("collection").custom((c) =>
      validCollections(c, ["users", "products"])
    ),
    validateForm,
  ],
  updateImageCloudinary
  // updateImage
);

router.get(
  "/:collection/:id",
  [
    check("id", "Id must be a MongoID").isMongoId(),
    check("collection").custom((c) =>
      validCollections(c, ["users", "products"])
    ),
    validateForm,
  ],
  getImage
);

module.exports = router;
