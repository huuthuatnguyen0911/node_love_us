const userModel = require("../../models/User");
const md5 = require("md5");

class RegisterController {
  // [POST] /register
  create(req, res) {
    const formData = req.body;
    const image = req.file.filename;
    // const hostname = `${req.protocol}://${req.headers.host}`;

    userModel
      .findOne({ email: formData.email })
      .then((user) => {
        if (user != null) {
          return res.status(200).json({
            message: `User already exists`,
            code: "user_existing",
            success: false,
          });
        } else {
          formData.avatar = `images/${image}`;
          formData.password = md5(formData.password);
          const userAccount = new userModel(formData);

          userAccount
            .save()
            .then(() => {
              res.status(200).json({
                mess: "Register successfully",
                code: "registered_success",
                success: true,
              });
            })
            .catch((error) => {
              return res.status(500).json({
                message: `Error of server ${error.message}`,
                code: "errour_server trong",
                success: false,
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server ngoài",
          success: false,
        });
      });
  }
}

module.exports = new RegisterController();
