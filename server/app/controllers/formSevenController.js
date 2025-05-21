const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const generateFormSevenPDF = require("../utils/generateForm7");

const FormSeven = require("../models/formSevenModel");

exports.createFormSeven = async (req, res) => {
  try {
    let data = req.body;
    console.log("Received Data:", data);

    // Convert reasonsForDelay from string to array if necessary
    if (typeof data.reasonsForDelay === "string") {
      data.reasonsForDelay = data.reasonsForDelay
        .split(",")
        .map((item) => item.trim());
    }

    // Step 1: Store the data in the database
    const newForm = await FormSeven.create(data);
    console.log("Stored in DB:", newForm);

    // Step 2: Generate the PDF
    generateFormSevenPDF(data, (err, pdfPath) => {
      if (err) {
        console.error("Error generating PDF:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error generating PDF" });
      }

      // Step 3: Send the generated PDF as a response
      res.download(pdfPath, "Form7_PeerReviewReport.pdf", (err) => {
        if (err) {
          console.error("Error sending PDF:", err);
          return res
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
