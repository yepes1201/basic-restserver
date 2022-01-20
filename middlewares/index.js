const validateForm = require("../middlewares/validate-form");
const validateJWT = require("../middlewares/validate-jwt");
const validateRoles = require("../middlewares/validate-roles");

module.exports = {
  ...validateForm,
  ...validateJWT,
  ...validateRoles,
};
