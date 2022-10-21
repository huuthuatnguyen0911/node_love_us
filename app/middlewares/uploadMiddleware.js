const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype == "video/mp4") {
      cb(null, "public/videos");
    } else if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png"
    ) {
      cb(null, "public/images");
    } else if (file.mimetype == "audio/mpeg") {
      cb(null, "public/sounds");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
  fileFilter(req, res) {},
});

const upload = multer({ storage: storage });

module.exports = upload;
