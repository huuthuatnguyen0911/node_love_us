const cloudinary = require("../configs/cloudinary");

function uploadFile(file, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(file, options)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}

module.exports = uploadFile;
