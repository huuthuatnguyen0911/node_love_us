const locationVietNamModel = require("../../models/LocationVietNam");

class LocationController {
  // [GET] /base/location-viet-nam
  getListLocation(req, res) {
    locationVietNamModel
      .find({})
      .sort({ name: "asc" })
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
module.exports = new LocationController();
