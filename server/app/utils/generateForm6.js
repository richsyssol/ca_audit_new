const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateFormSixPDF = (data, callback) => {
  try {
    const doc = new PDFDocument({
      margins: { top: 90, bottom: 70, left: 50, right: 50 }, // Ensuring proper margins
    });

    const pdfPath = path.join(
      __dirname,
      `../templates/Form6_${Date.now()}.pdf`
    );
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    const contentWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // **FORM HEADER**
    doc.fontSize(16).font("Helvetica-Bold").text("FORM 6", { align: "center" });
    doc.moveDown(1.5);
    doc
      .fontSize(12)
      .text("Format for seeking additional information from the", {
        align: "center",
      });
    doc.text("Practice Unit by the Reviewer", { align: "center" });
    doc.text("[As per Clause 7(3) of the Peer Review Guidelines 2022]", {
      align: "center",
    });

    doc.moveDown(3);

    // **ADDRESSING THE PRACTICE UNIT**
    doc.fontSize(12).font("Helvetica").text("To,", { align: "left" });
    doc.moveDown();
    doc.text(
      `Name of Partner of PU: ${data.partnerName || "____________________"}`,
      { align: "left" }
    );

    doc.moveDown(2);

    // **INTRODUCTORY STATEMENT**
    doc.text(
      `This is regarding the Peer Review of the Firm ${
        data.firmName || "_______________"
      } for the period ${data.reviewPeriod || "______________"}.`,
      { align: "justify" }
    );

    doc.moveDown(2);
    doc.text(
      "I would like to inform you that the responses submitted by you to the following clauses of the Questionnaire are incomplete/ not clear. Accordingly, you are requested to provide clarifications on the following points:",
      { align: "justify" }
    );

    doc.moveDown(2);

    // **TABLE HEADER (Aligned & Fixed)**
    const tableTop = doc.y;
    const tableLeft = doc.x;
    const rowHeight = 30;
    const colWidths = [50, 180, 220, 170];

    doc.lineWidth(1);
    doc.font("Helvetica-Bold");

    // Draw table borders
    for (let i = 0; i <= data.questions.length + 1; i++) {
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
        .lineTo(x, tableTop + rowHeight * (data.questions.length + 1))
        .stroke();
    }
    doc.font("Helvetica-Bold");
    // **TABLE HEADER TEXT**
    const headers = [
      "S. No.",
      "Reference no. of the Questionnaire",
      "Further Information required",
      "Reason for asking the information [Not clear/ incomplete/ left blank etc.]",
    ];
    headers.forEach((header, i) => {
      doc.text(
        header,
        tableLeft +
          (i === 0
            ? 5
            : colWidths.slice(0, i).reduce((a, b) => a + b, 5) +
              (i === 2 ? 10 : 0)), // Move "F.Y." right by 10px
        tableTop + 2,
        { width: colWidths[i], align: "left", height: 40 }
      );
    });

    doc.moveDown(1);

    // **TABLE CONTENT**
    doc.font("Helvetica");
    let yPosition = tableTop + rowHeight;
    data.questions.forEach((question, index) => {
      if (yPosition + rowHeight > doc.page.height - 100) {
        doc.addPage();
        yPosition = doc.y;
      }

      doc.text(`${index + 1}`, tableLeft + 5, yPosition + 10, {
        width: colWidths[0],
        align: "left",
      });
      doc.text(
        question.referenceNo || "",
        tableLeft + colWidths[0] + 5,
        yPosition + 10,
        { width: colWidths[1], align: "left" }
      );
      doc.text(
        question.informationRequired || "",
        tableLeft + colWidths[0] + colWidths[1] + 10,
        yPosition + 10,
        { width: colWidths[2], align: "left" }
      );
      doc.text(
        question.reason || "",
        tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 15,
        yPosition + 10,
        { width: colWidths[3], align: "left" }
      );

      yPosition += rowHeight;
    });

    // **Ensure enough space before the next section**
    doc.moveDown(2);

    // **FOLLOW-UP SECTION (Now aligned to first column)**
    doc.text(
      `On receipt of the above information by ${
        data.informationDueDate || "__________"
      }, I will intimate you the date of my visit to your office.`,
      tableLeft, // Align with first column (S. No.)
      doc.y
    );

    doc.moveDown(2);

    // **CLOSING SECTION (Aligned Left, Same as Table Start)**
    doc.text("Thanking you,", tableLeft); // Aligning to first column
    doc.moveDown(2);
    doc.text("Signature :", tableLeft);
    doc.moveDown(1);
    doc.text(`Name : ${data.reviewerName || "________________"}`, tableLeft);
    doc.moveDown(0.5);
    doc.text(`Date : ${data.declarationDate || "________________"}`, tableLeft);
 

    doc.end();

    // Wait for the file to be written before calling callback
    writeStream.on("finish", () => {
      callback(null, pdfPath);
    });
  } catch (error) {
    callback(error, null);
  }
};

module.exports = generateFormSixPDF;
