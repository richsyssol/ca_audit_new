const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateFormTwoPDF = (data, callback) => {
  try {
    const doc = new PDFDocument({
      margins: { top: 80, bottom: 70, left: 100, right: 100 },
    });

    const pdfPath = path.join(__dirname, "../templates/Form2_Declaration.pdf");
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    const contentWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // FORM 2 HEADER
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("FORM 2", { align: "center", width: contentWidth });
    doc.moveDown(1);

    doc
      .fontSize(12)
      .text("Acceptance cum Declaration of Confidentiality", {
        align: "center",
        width: contentWidth,
      })
      .text("(To be Submitted to The Practice Unit)", {
        align: "center",
        width: contentWidth,
      })
      .text("[As per Clause 6(7) of the Peer Review Guidelines 2022]", {
        align: "center",
        width: contentWidth,
      });

    doc.moveDown(1);

    // ADDRESSING TO PRACTICE UNIT
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`To`, { align: "left", width: contentWidth })
      .moveDown(0.5)
      .text(`M/s/CA. ${data.firmName},`, { align: "left", width: contentWidth })
      .moveDown(0.5)
      .text(`FRN/ Mem. No. : ${data.frn}`, {
        align: "left",
        width: contentWidth,
      });

    doc.moveDown(1);

    // INTRODUCTORY STATEMENT
    doc
      .font("Helvetica")
      .text("Sir,", { align: "left", width: contentWidth })
      .moveDown(1);

      doc
  .font("Helvetica-Bold")
  .text("(A)   ", { continued: true }) // Adds tab spaces after "(A)"
  .font("Helvetica")
  .text(
    "With reference to selection of my name for conducting peer review of           M/s/CA. " +
      `${data.firmName}, FRN/Mem.No.: ${data.frn}, I hereby convey my acceptance for the same.`,
    { align: "justify", width: contentWidth }
  );

    

    doc.moveDown(1);

    doc
  .font("Helvetica-Bold")
  .text("(B)   ", { continued: true }) // Adds spaces after "(B)"
  .font("Helvetica")
  .text(
    "I also hereby declare that I am aware of the need for confidentiality in the conduct of peer reviews. I undertake and promise that in so far as any or all of the following relate to me or are brought to my knowledge/attention, in any manner whatsoever and when so ever, I shall ensure that:",
    { align: "justify", width: contentWidth }
  );


     doc.moveDown(1);

    // LIST OF CONFIDENTIALITY CONDITIONS
    const conditions = [
      "Full Confidentiality of the Working papers shall always be maintained at all times so that unauthorized access by any means (including electronic means) is not gained by anyone.",
      "The practice unit’s assurance services procedures shall not be disclosed to third party except as provided under the Peer Review Guidelines 2022.",
      "Any information with regard to any matter coming to my knowledge in the performance or in assisting in the performance of any function during the conduct of peer reviews shall not be disclosed to any person except as provided under the Peer Review Guidelines 2022.",
      "Access shall not be given to any person other than as required under the Peer Review Guidelines 2022, to any record, document or any other material, in any form which is in my possession, or under my control, by virtue of my being or having been so appointed or my having performed or having assisted any other person in the performance of such a function.",
      "I or any of my partners have no obligation and no direct or indirect conflict of interest with the Practice Unit.",
      "I shall not accept any professional assignment from the Practice Unit for a period of two years from the date of appointment. Further, I have not accepted any professional assignment from the Practice Unit for a period of two years before the date of appointment as reviewer of the Practice Unit.",
      "No Disciplinary action / proceeding are pending against me.",
      "I have not been found guilty of professional or other misconduct by the Council or the Board of Discipline or the Disciplinary Committee at any time.",
      "I have not been convicted by a Competent Court whether within or outside India, of an offence involving moral turpitude and punishable with imprisonment.",
      "I have not undergone training/articleship under any of the partner of Practice Unit.",
      "I was not a Partner of the said Practice Unit.",
    ];

    const leftMargin = doc.page.margins.left + 10;
    const bulletSymbol = "•"; // Unicode bullet character
    

    conditions.forEach((item) => {
      doc.text(`${bulletSymbol}`, leftMargin, doc.y, { continued: true });
      doc.text(item, leftMargin + 10, doc.y, {
        width: contentWidth - 20,
        align: "left",
      });
      doc.moveDown(0.5);
    });

    doc.moveDown(1);

    doc.text(
      `I understand that any breach of these confidentiality provisions will be considered as gross negligence and may make me liable for disciplinary action.`,
      { align: "justify", width: contentWidth }
    );

    doc.moveDown(1);

    // APPOINTMENT CONFIRMATION
    doc
      .text("(C) If appointed,", { align: "left", width: contentWidth })
      .moveDown()
      .text(
        "I confirm that I will not use any qualified assistant for carrying out the peer review",
        { align: "justify", width: contentWidth }
      )
      .moveDown()
      .text("Or", { align: "center", width: contentWidth })
      .moveDown()
      .text(
        "The declaration of Confidentiality of Qualified Assistant used for the peer review shall be submitted before the start of peer review.",
        { align: "justify", width: contentWidth }
      );

    doc.moveDown(1);

    // SIGNATURE SECTION
doc
.font("Helvetica-Bold")
.text("Regards,", { align: "left", width: contentWidth });

doc.moveDown(1);

doc
.text("Signature:", { align: "left", width: contentWidth, continued: true })
.font("Helvetica")
.text(" ______________________");


doc.moveDown(1);
doc.text(`Name : ${data.partnerName}`, {
align: "left",
width: contentWidth,
});

doc.moveDown(0.5);
doc.text(`Membership No.: ${data.memberShipNo}`, {
align: "left",
width: contentWidth,
});

doc.moveDown(1);
doc.text(`Email ID: ${data.email}`, {
align: "left",
width: contentWidth,
});


doc.moveDown(0.5);
doc.text(`Mobile No.: ${data.mobile}`, {
align: "left",
width: contentWidth,
});

doc.moveUp[0.5];
doc.moveDown(0.5);
doc.text(`Period of Review: ${data.periodOfReview}`, {
align: "left",
width: contentWidth,
});


doc.moveDown(0.5);
doc.text(`Date: ${data.date}`, {
align: "left",
width: contentWidth,
});


doc.moveDown(0.5);
doc.text(`Place: ${data.place}`, {
align: "left",
width: contentWidth,
});

// Add only 1 line space before the Note section
doc.moveDown(1);

doc
.font("Helvetica-Bold")
.text("Note:", { align: "left", width: contentWidth, continued: true })
.font("Helvetica")
.text("To be submitted on Mail ID : …… (Email ID of PU)");


    doc.end();

    writeStream.on("finish", () => {
      callback(null, pdfPath);
    });
  } catch (error) {
    callback(error, null);
  }
};

module.exports = generateFormTwoPDF;
