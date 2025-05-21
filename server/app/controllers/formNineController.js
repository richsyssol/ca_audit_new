const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const FormNine = require("../models/formNineModel");
const generateFormNinePDF = require("../utils/generateForm9");

// Define storage path for PDFs
const PDF_STORAGE_PATH = path.join(__dirname, "../uploads/temp");
if (!fs.existsSync(PDF_STORAGE_PATH)) {
  fs.mkdirSync(PDF_STORAGE_PATH, { recursive: true });
}

// Step 1: Generate PDF for Preview (No DB entry yet)
exports.previewPDF = async (req, res) => {
  try {
    console.log("Received Form Data:", req.body);
    const data = req.body;
    const uniqueId = uuidv4(); // Generate unique file name
    const pdfFileName = `Form9_${uniqueId}.pdf`;
    const pdfFilePath = path.join(PDF_STORAGE_PATH, pdfFileName);

    generateFormNinePDF(data, pdfFilePath, (err, generatedPath) => {
      if (err) {
        console.error("Error generating PDF:", err);
        return res
          .status(500)
          .json({ success: false, message: "PDF Generation Failed" });
      }

      res.json({
        success: true,
        message: "PDF Generated Successfully",
        pdfUrl: `${req.protocol}://${req.get(
          "host"
        )}/api/v1/formNine/temp-preview/${pdfFileName}`, // Absolute URL
        pdfPath: generatedPath, // Return path for approval step
        formData: data, // Send form data for approval
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

// Step 2: Serve the PDF for preview
exports.serveTempPDF = (req, res) => {
  const { filename } = req.params;
  const pdfPath = path.join(PDF_STORAGE_PATH, filename);

  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({ success: false, message: "PDF Not Found" });
  }

  res.sendFile(pdfPath);
};

// Step 3: Approve or Reject Form (Save in DB)
exports.handleApproval = async (req, res) => {
  try {
    const { pdfPath, formData, status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Status" });
    }

    if (!fs.existsSync(pdfPath)) {
      return res
        .status(404)
        .json({ success: false, message: "PDF File Not Found" });
    }

    // If rejected, delete the PDF file
    if (status === "Rejected") {
      fs.unlinkSync(pdfPath);
      return res.json({
        success: true,
        message: "Form Rejected & PDF Deleted",
      });
    }
    console.log(req.body);

    // Save form data in database for Approved forms
    const newForm = await FormNine.create({
      firmName: formData.firmName,
      frn: formData.frn,
      date: formData.date,
      partnerName: formData.partnerName,
      memberShipNo: formData.memberShipNo,
      isReceivedByIndividual: formData.isReceivedByIndividual || false,
      isReceivedByFirm: formData.isReceivedByFirm || false,
      declarationDate: formData.declarationDate,
      pdfPath: pdfPath, // Store the approved PDF path
      status: "Approved",
    });

    res.json({
      success: true,
      message: "Form Approved & Stored",
      formId: newForm.id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
