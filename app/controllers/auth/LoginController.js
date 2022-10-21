const userModel = require("../../models/User");
const md5 = require("md5");

const {
  getToken,
  generateToken,
  verifyToken,
} = require("../../../utils/handleToken");

class LoginController {
  // [POST] /api/login
  index(req, res) {
    const formData = req.body;

    userModel
      .findOne({ email: formData.email })
      .then(async (user) => {
        if (!user) {
          res.status(401).json({
            code: "user_not_found",
            success: false,
            message: "Authentication failed. User not found",
          });
        } else {
          if (user.password == md5(formData.password)) {
            const token = await generateToken(
              {
                id: user._id,
              },
              {
                expiresIn: "30 days",
              }
            );

            if (token !== null) {
              res.status(200).json({
                token: token,
                code: "login_success",
                message: "Authentication successfully.",
                success: true,
              });
            } else {
              res.status(500).json({
                code: "no_generate_token",
                message: "Not generate token,  error server",
                success: false,
              });
            }
          } else {
            return res.json({
              code: "password_not_correct",
              message: "Password is not correct",
              success: false,
            });
          }
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server",
          success: false,
        });
      });
  }

  async giatoken(req, res) {
    const token = getToken(req.headers);

    if (token) {
      let dataVerify = await verifyToken(token);

      if (dataVerify !== null) {
        res.json({
          data: dataVerify,
          token,
        });
      } else {
        return res.json({
          error: "loi roi kia",
        });
      }
    }
  }
}

module.exports = new LoginController();
