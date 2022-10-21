const bankVietNamModel = require("../../models/BankVietNam");

class BankController {
  // [GET] /base/bank-viet-nam
  getListBank(req, res) {
    bankVietNamModel
      .find({})
      .sort({ vn_name: "asc" })
      .then((locations) => {
        return res.status(200).json({
          data: locations,
          success: true,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server",
          success: false,
        });
      });
  }
}
module.exports = new BankController();
