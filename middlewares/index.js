const validateForm = require("../middlewares/validate-form");
const validateJWT = require("../middlewares/validate-jwt");
const validateRoles = require("../middlewares/validate-roles");
const validateFiles = require("../middlewares/validate-file");

module.exports = {
  ...validateForm,
  ...validateJWT,
  ...validateRoles,
  ...validateFiles,
};
