const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateForm,
  validateJWT,
  isAdminRole,
  hasRole,
} = require("../middlewares");

const {
  isRoleValid,
  emailExist,
  userExist,
  userAlreadyInactive,
} = require("../helpers/db-validation");

const {
  usersGet,
  usersPost,
  usersDelete,
  usersPut,
} = require("../controllers/users");

const router = Router();

router.get("/", usersGet);

router.post(
  "/",
  // Middlewares
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password must have atleast 6 characters").isLength({
      min: 6,
    }),
    check("email", "Email not valid").isEmail(),
    check("email").custom(emailExist),
    check("role").custom(isRoleValid),
    validateForm,
  ],
  usersPost
);

router.put(
  "/:id",
  [
    check("id", "ID doesn't exists").isMongoId(),
    check("id").custom(userExist),
    check("role").custom(isRoleValid),
    validateForm,
  ],
  usersPut
);

router.delete(
  "/:id",
  [
    validateJWT,
    // isAdminRole, // User MUST have admin permissions
    hasRole("ADMIN_ROLE", "VENTAS_ROLE"), // User MUST have one of the roles sended
    check("id", "ID doesn't exists").isMongoId(),
    check("id").custom(userExist),
    check("id").custom(userAlreadyInactive),
    validateForm,
  ],
  usersDelete
);

module.exports = router;
