const { v4: uuidv4 } = require("uuid");
const path = require("path");

const defaultExtension = ["png", "jpg", "jpeg", "gif"];

const uploadFileHelper = (
  files,
  validExtensions = defaultExtension,
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const fileName = file.name.split(".");
    const fileExtension = fileName[fileName.length - 1].toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return reject(
        `The extension ${fileExtension} is forbidden. Valid extensions: ${validExtensions}`
      );
    }

    const newName = uuidv4() + "." + fileExtension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, newName);
    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(newName);
    });
  });
};

module.exports = {
  uploadFileHelper,
};
