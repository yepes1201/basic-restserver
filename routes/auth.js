const { Router } = require("express");
const { check } = require("express-validator");

const { validateForm } = require("../middlewares/validate-form");

const { login } = require("../controllers/auth");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").notEmpty(),
    validateForm,
  ],
  login
);

module.exports = router;
