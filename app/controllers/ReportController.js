const reportModel = require("../models/Report");

class ReportController {
  // [POST] /report/send
  sendReport(req, res) {
    const formData = req.body;
    const dataListProof = req.files;
    // const hostname = `${req.protocol}://${req.headers.host}`;

    let listProofLink = [];

    dataListProof.forEach((proof) => {
      const filename = proof.filename;

      if (proof.mimetype == "video/mp4") {
        listProofLink.push(`videos/${filename}`);
      } else if (
        proof.mimetype == "image/jpeg" ||
        proof.mimetype == "image/jpg" ||
        proof.mimetype == "image/png"
      ) {
        listProofLink.push(`images/${filename}`);
      } else {
        listProofLink.push(`sounds/${filename}`);
      }
    });

    formData.fileProof = listProofLink;
    const reportData = new reportModel(formData);

    reportData
      .save()
      .then(() => {
        res.status(200).json({
          mess: "Report successfully",
          code: "report_send_success",
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

module.exports = new ReportController();
