const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dd1yamek1",
  api_key: "822282415667879",
  api_secret: "Ve3r5GMN9a5GO2FoOxFMkAlWS7E",
});

module.exports = cloudinary;
