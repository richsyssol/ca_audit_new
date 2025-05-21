const fs = require("fs");
const generateFormFivePDF = require("../utils/generateForm5");
const FormFive = require("../models/formFiveModel");
const { console } = require("inspector");

exports.createFormFive = async (req, res) => {
  try {
    console.log("HERE");
    const data = req.body;

    // Validate input
    if (!Array.isArray(data.clients) || data.clients.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Clients list is required" });
    }

    // Save form data to the database
    // const form = await FormFive.create(data);

    // Generate PDF with dynamic table data
    generateFormFivePDF(data, (err, pdfPath) => {
      if (err) {
        console.error("Error generating PDF:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error generating PDF" });
      }

      res.download(pdfPath, "Form5_PeerReviewNotice.pdf", (err) => {
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
