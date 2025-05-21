const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateFormFivePDF = (data, callback) => {
  try {
    const doc = new PDFDocument({
      margins: { top: 70, bottom: 70, left: 100, right: 100 },
    });

    const pdfPath = path.join(
      __dirname,
      `../templates/Form5_${Date.now()}.pdf`
    );
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    const contentWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // FORM HEADER
    doc.fontSize(14).font("Helvetica-Bold").text("FORM 5", { align: "center" });
    doc.moveDown(1);
    doc
      .fontSize(12)
      .text(
        "Notice by Peer Reviewer for visiting office of the Practice Unit",
        { align: "center" }
      );
    doc.text("[As per Clause 7(2) of the Peer Review Guidelines 2022]", {
      align: "center",
    });

    doc.moveDown(3);

    // ADDRESSING THE PRACTICE UNIT
    doc.fontSize(12).font("Helvetica").text("To,", { align: "left" });
    doc.moveDown();
    doc.text(
      `Name of Partner of PU: ${data.partnerName || "____________________"}`,
      { align: "left" }
    );

    doc.moveDown(2);

    // INTRODUCTORY STATEMENT
    doc.text(
      `This is regarding the Peer Review of the Firm ${
        data.firmName || "_______________"
      } for the period ${data.reviewPeriod || "______________"}.`,
      { align: "justify" }
    );

    doc.moveDown(2);
    doc.text(
      `This is to inform you that I plan to visit your office on ${
        data.proposedVisitDate || "______________"
      }.`,
      { align: "justify" }
    );

    doc.moveDown(2);
    doc.text(
      "Further on going through the questionnaire submitted by you, you are requested to keep ready the files pertaining to the Following Clients so that I may review them on visiting your office:",
      { align: "justify" }
    );

    doc.moveDown(2);

    // **TABLE (3 Columns, Aligned & Styled)**
    const tableTop = doc.y;
    const tableLeft = doc.x;
    const rowHeight = 25;
    const colWidths = [50, 250, 100];

    // Draw Table Borders
    doc.lineWidth(1);
    doc.font("Helvetica-Bold");
    for (let i = 0; i <= data.clients.length + 1; i++) {
      doc
        .moveTo(tableLeft, tableTop + i * rowHeight)
        .lineTo(
          tableLeft + colWidths.reduce((a, b) => a + b, 0),
          tableTop + i * rowHeight
        )
        .stroke();
    }
    for (let i = 0; i <= colWidths.length; i++) {
      let x = tableLeft + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc
        .moveTo(x, tableTop)
        .lineTo(x, tableTop + rowHeight * (data.clients.length + 1))
        .stroke();
    }
    // Adjusted column widths (increased width of "F.Y.")
    const colWidthss = [50, 220, 130]; // Increased "F.Y." column width
    // **TABLE HEADER**
    doc.font("Helvetica-Bold");
    const headers = ["S. No.", "Name of Client", "F.Y."];
    headers.forEach((header, i) => {
      doc.text(
        header,
        tableLeft +
          (i === 0
            ? 5
            : colWidths.slice(0, i).reduce((a, b) => a + b, 5) +
              (i === 2 ? 10 : 0)), // Move "F.Y." right by 10px
        tableTop + 8,
        { width: colWidths[i], align: "left" }
      );
    });
    // **TABLE CONTENT (Dynamic Rows)**
    doc.font("Helvetica");
    data.clients.forEach((client, index) => {
      doc.text(
        `${index + 1}`,
        tableLeft + 5,
        tableTop + (index + 1) * rowHeight + 8,
        { width: colWidths[0], align: "left" }
      );
      doc.text(
        client.name || "",
        tableLeft + colWidths[0] + 5,
        tableTop + (index + 1) * rowHeight + 8,
        { width: colWidths[1], align: "left" }
      );
      doc.text(
        client.financialYear || "",
        tableLeft + colWidths[0] + colWidths[1] + 10,
        tableTop + (index + 1) * rowHeight + 8,
        { width: colWidths[2], align: "left" }
      );
    });

    doc.moveDown(4);

    // **CLOSING SECTION (Aligned to Left)**
    doc.text("Thanking you,", tableLeft);
    doc.moveDown(2);
    doc.text("Signature :", tableLeft);
    doc.moveDown(1);
    doc.text(
      `Name : ${data.reviewerName || "____________________"}`,
      tableLeft
    );
    doc.moveDown(1);
    doc.text(`Date : ${data.declarationDate || "______________"}`, tableLeft);

    doc.moveDown(1);

    // **NEW SECTION (Font Size 10, Placed at Bottom)**
    doc
      .fontSize(10)
      .text(
        "Alternate dates may be given to the Practice Unit, if the PU is not ready with the required records or for any other reason.",
        tableLeft,
        doc.y,
        { align: "justify", width: contentWidth }
      );

    doc.end();

    // Wait for the file to be written before calling callback
    writeStream.on("finish", () => {
      callback(null, pdfPath);
    });
  } catch (error) {
    callback(error, null);
  }
};

module.exports = generateFormFivePDF;
