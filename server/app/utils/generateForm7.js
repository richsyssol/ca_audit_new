const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateFormSevenPDF = (data, callback) => {
  try {
    const doc = new PDFDocument({
      margins: { top: 70, bottom: 70, left: 100, right: 100 },
    });

    const pdfPath = path.join(
      __dirname,
      "../templates/Form7_ExtensionRequest.pdf"
    );
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    const contentWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // FORM HEADER
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("FORM 7", { align: "center", width: contentWidth });
    doc.moveDown(1);

    doc
      .fontSize(12)
      .text("Joint Intimation to be made by PU and RE for extension of time for", {
        align: "center",
        width: contentWidth,
      })
      .text("completion of Peer Review process", {
        align: "center",
        width: contentWidth,
      })
      .text("[As per Clause 11 of the Peer Review Guidelines 2022]", {
        align: "center",
        width: contentWidth,
      });

    doc.moveDown(5);

    // DATE & ADDRESS
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("To,", { align: "left", continued: true, width: contentWidth })
      .text(`Dated: ${data.date}`, { align: "right", width: contentWidth });

    doc.moveDown();
    doc.text("The Secretary,", { align: "left", width: contentWidth });
    doc.text("Peer Review Board", { align: "left", width: contentWidth });
    doc.moveDown(2);

    // SUBJECT LINE
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(
        `Sub: Letter for seeking additional time for completion of Peer Review Process`,
        { align: "left", width: contentWidth }
      );

    doc.moveDown(3);

    // BODY CONTENT
    doc
      .font("Helvetica")
      .text("Dear Sir,", { align: "left", width: contentWidth });
    doc.moveDown(2);

    doc.text(
      `Our Firm ${data.firmName}, FRN ${data.frn}, Applied for Peer Review vide Application No. ${data.applicationNo} on ${data.applicationDate}.`,
      { align: "justify", width: contentWidth }
    );

    doc.moveDown(2);

    doc.text(
      `The Peer Reviewer was appointed by the Board on ${data.reviewerAppointedDate}. However, the Peer Review process has been initiated but is yet to be completed due to the following reasons:`,
      { align: "justify", width: contentWidth }
    );

    doc.moveDown();

    // LIST OF REASONS
    const leftMargin = doc.page.margins.left + 20;
    const listNumberWidth = 20;
    const textStartX = leftMargin + listNumberWidth;

    data.reasonsForDelay.forEach((reason, index) => {
      doc.text(`${index + 1}.`, leftMargin, doc.y, { continued: true });
      doc.text(reason, textStartX, doc.y, {
        width: contentWidth - (textStartX - doc.page.margins.left),
        align: "left",
      });
      doc.moveDown(0.5);
    });

    doc.moveDown(2);

    doc.text(
      `As the process is not yet completed, we request the Board to kindly grant us ${data.additionalDaysRequested} more days for completion of Peer Review and submit the report to the Board.`,
      { align: "justify", width: contentWidth }
    );

    doc.moveDown(0.5);

    doc.text(
      `We assure that the Peer Review will be completed by ${data.peerReviewCompletionDate} and the report will be submitted to the Board by ${data.reportSubmissionDate}.`,
      { align: "justify", width: contentWidth }
    );

    doc.moveDown(2);

    doc.text("Thanking You,", { align: "left", width: contentWidth });
    doc.moveDown(2);

    // SIGNATURES
    doc.text("Yours faithfully,", { align: "left", width: contentWidth });
    doc.moveDown(2);

    doc.text("Signature: ______________________", {
      align: "left",
      width: contentWidth,
    });
    doc.moveDown(0.5);
    doc.text(`Name of Partner of PU: ${data.partnerName}`, {
      align: "left",
      width: contentWidth,
    });
    doc.moveDown(0.5);
    doc.text(`Membership No.: ${data.partnerMembershipNo}`, {
      align: "left",
      width: contentWidth,
    });

    doc.moveDown(2);

    doc.text("Signature: ______________________", {
      align: "left",
      width: contentWidth,
    });
    doc.moveDown(0.5);
    doc.text(`Name of Peer Reviewer: ${data.reviewerName}`, {
      align: "left",
      width: contentWidth,
    });
    doc.moveDown(0.5);
    doc.text(`Membership No.: ${data.reviewerMembershipNo}`, {
      align: "left",
      width: contentWidth,
    });

    doc.end();

    writeStream.on("finish", () => {
      callback(null, pdfPath);
    });
  } catch (error) {
    callback(error, null);
  }
};

module.exports = generateFormSevenPDF;
