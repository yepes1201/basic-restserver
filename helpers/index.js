const dbValidation = require("./db-validation");
const generateJWT = require("./generate-jwt");
const uploadFile = require("./upload-file");
const googleVerify = require("./google-verify");

module.exports = {
  ...dbValidation,
  ...generateJWT,
  ...uploadFile,
};
