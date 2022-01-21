const { Router } = require("express");
const { check } = require("express-validator");

const { validateForm } = require("../middlewares/validate-form");

const { login, googleSignIn } = require("../controllers/auth");

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

router.post(
  "/google",
  [check("id_token", "id_toke is required").notEmpty(), validateForm],
  googleSignIn
);

module.exports = router;
