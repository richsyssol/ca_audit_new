const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// Define the directory for temporary storage
const TEMP_PDF_STORAGE_PATH = path.join(__dirname, "../uploads/temp");
if (!fs.existsSync(TEMP_PDF_STORAGE_PATH)) {
  fs.mkdirSync(TEMP_PDF_STORAGE_PATH, { recursive: true });
}
const generateFormEightPDF = (data, outputFilePath, callback) => {
  try {
    const doc = new PDFDocument({
      margins: { top: 70, bottom: 70, left: 100, right: 100 },
    });

    const writeStream = fs.createWriteStream(outputFilePath);
    doc.pipe(writeStream);

    const contentWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // FORM 8 HEADER
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("FORM 8", { align: "center", width: contentWidth });
    doc.moveDown(1);

    doc
      .fontSize(12)
      .text(
        "[To be submitted by the Practice Unit to the Board for seeking extension to the validity of Peer Review Certificate]",
        {
          align: "center",
          width: contentWidth,
        }
      )
      .text("[As per Clause 15(4) of the Peer Review Guidelines 2022]", {
        align: "center",
        width: contentWidth,
      });

    doc.moveDown(5);

    // DATE & ADDRESS
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("To,", { align: "left", width: contentWidth })
      .text("Dated: " + data.applicationDate, {
        align: "right",
        width: contentWidth,
      });

    doc.moveDown();
    doc.text("The Secretary,", { align: "left", width: contentWidth });
    doc.text("Peer Review Board", { align: "left", width: contentWidth });
    doc.moveDown(2);

    // SUBJECT LINE
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(
        "Sub: Letter for seeking extension to the validity of Peer Review Certificate",
        {
          align: "left",
          width: contentWidth,
        }
      );

    doc.moveDown(3);

    // BODY CONTENT
    doc
      .font("Helvetica")
      .text("Dear Sir,", { align: "left", width: contentWidth });
    doc.moveDown(2);

    doc.text(
      `Our Firm ${data.firmName}, FRN ${data.frn}, Applied for Peer Review vide Application No. ${data.applicationNo} on ${data.reviewerAppointedDate}. The Peer Reviewer was appointed by the Board on ${data.reviewerAppointedDate}. However, the Peer Review process has been initiated but is yet to be completed due to the following reason:`,
      { align: "justify", width: contentWidth }
    );

    doc.moveDown(2);
    doc.text(
      `A pandemic announced by the Central Government: ${
        data.pandemic ? "✓" : "☐"
      }`
    );
    doc.moveDown(1);
    doc.text(
      `Serious illness of any partner/ member: ${
        data.seriousIllness ? "✓" : "☐"
      }`
    );
    doc.moveDown(2);

    if (data.seriousIllness) {
      doc.text(
        "*I am attaching the medical certificate issued by the Doctor.",
        {
          align: "justify",
          width: contentWidth,
        }
      );
      doc.moveDown(2);
    }

    doc.text(
      `The last issued Peer Review Certificate of our Firm was valid till ${data.lastIssuedCertificateDate}.  
      We request you to kindly extend the validity of the Certificate from ${data.extensionFromDate} to ${data.extensionToDate}.`,
      { align: "justify", width: contentWidth }
    );

    doc.moveDown(4);
    doc.text("Thanking You,", { align: "left", width: contentWidth });
    doc.moveDown(1);

    // SIGNATURE
    doc.text("Yours faithfully,", { align: "left", width: contentWidth });
    doc.moveDown(0.5);
    doc.text("Signature: ______________________", {
      align: "left",
      width: contentWidth,
    });
    doc.moveDown(0.5);
    doc.text(`Name of Partner of the Practice Unit: ${data.partnerName}`, {
      align: "left",
      width: contentWidth,
    });
    doc.moveDown(0.5);
    doc.text(`Membership No.: ${data.membershipNo}`, {
      align: "left",
      width: contentWidth,
    });
    doc.moveDown(0.5);

    doc.text(
      "[Note: As decided by the Council, extension cannot be granted beyond 6 months from the expiry of the last issued certificate]",
      {
        align: "justify",
        width: contentWidth,
        fontSize: 10,
      }
    );
    doc.moveDown(2);

    doc.text("Enclosure: Medical Certificate", {
      align: "left",
      width: contentWidth,
    });

    doc.end();

    writeStream.on("finish", () => {
      if (callback) callback(null, outputFilePath);
    });

    writeStream.on("error", (err) => {
      if (callback) callback(err, null);
    });
  } catch (error) {
    if (callback) callback(error, null);
  }
};

module.exports = generateFormEightPDF;
