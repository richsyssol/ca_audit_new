const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const generateFormTwoPDF = require("../utils/generateForm2");

exports.createFormTwo = async (req, res) => {
  try {
    const data = req.body;

    generateFormTwoPDF(data, (err, pdfPath) => {
      if (err) {
        console.error("Error generating PDF:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error generating PDF" });
      }

      res.download(pdfPath, "Form6_PeerReviewReport.pdf", (err) => {
        if (err) {
          console.error("Error sending PDF:", err);
          res
            .status(500)
            .json({ success: false, message: "Error sending PDF" });
        }
        fs.unlinkSync(pdfPath); // Delete the PDF after sending
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
