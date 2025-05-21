const generateFormThreePDF = require("../utils/generateForm3");
const fs = require("fs");

exports.createFormThree = async (req, res) => {
  try {
    const data = req.body;

    generateFormThreePDF(data, (err, pdfPath) => {
      if (err) {
        console.error("Error generating PDF:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error generating PDF" });
      }

      res.download(pdfPath, "Form3_PeerReviewerApplication.pdf", (err) => {
        if (err) {
          console.error("Error sending PDF:", err);
          return res
            .status(500)
            .json({ success: false, message: "Error sending PDF" });
        }
        fs.unlinkSync(pdfPath); // Delete the file after sending
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
