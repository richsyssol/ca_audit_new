// const fs = require("fs");
// const path = require("path");
// const PDFDocument = require("pdfkit");

// const generateFormThreePDF = (data, callback) => {
//   try {
//     const doc = new PDFDocument({
//       margins: { top: 70, bottom: 70, left: 100, right: 100 },
//     });

//     const pdfPath = path.join(
//       __dirname,
//       "../templates/Form3_PeerReviewerApplication.pdf"
//     );
//     const writeStream = fs.createWriteStream(pdfPath);
//     doc.pipe(writeStream);

//     const contentWidth =
//       doc.page.width - doc.page.margins.left - doc.page.margins.right;

//     // FORM HEADER
//     doc
//       .fontSize(14)
//       .font("Helvetica-Bold")
//       .text("FORM 3", { align: "center", width: contentWidth });
//     doc.moveDown(1);

//     doc
//       .fontSize(12)
//       .text(
//         "APPLICATION CUM DECLARATION FORM FOR EMPANELMENT AS A PEER REVIEWER",
//         {
//           align: "center",
//           width: contentWidth,
//         }
//       );
//     doc.moveDown(2);

//     // ADDRESS BLOCK
//     doc.fontSize(12).font("Helvetica").text("To,", { align: "left" });
//     doc.text("The Secretary, Peer Review Board,");
//     doc.text("The Institute of Chartered Accountants of India,");
//     doc.text("ICAI Bhawan,");
//     doc.text("Post Box No. 7100,");
//     doc.text("Indraprastha Marg, New Delhi – 110002");
//     doc.moveDown(2);

//     // GREETING
//     doc.text("Dear Sir,");
//     doc.moveDown(1);

//     doc.text(
//       `I, ${data.name}, M. No. ${data.membershipNo}, would like to apply for Empanelment as a Peer Reviewer.`
//     );
//     doc.moveDown(1);
//     doc.text(
//       `I have attended the training Programme organized by the Board physically/through VCM on ${data.trainingDate}.`
//     );
//     doc.moveDown(1);
//     doc.text("I have gone through the Peer Review Guidelines 2022 hosted at:");
//     doc
//       .fillColor("blue")
//       .text(
//         "https://resource.cdn.icai.org/72010prb57960-peer-review-guidelines-2022.pdf",
//         { underline: true }
//       );
//     doc.fillColor("black");
//     doc.text("And undertake to abide by the same.");
//     doc.moveDown(2);

//     // CONTACT DETAILS TABLE
//     const tableX = doc.x;
//     const tableY = doc.y;
//     const cellWidth = 25;
//     const cellHeight = 20;

//     doc.text("Mobile No.:", tableX, tableY);
//     for (let i = 0; i < 10; i++) {
//       doc
//         .rect(tableX + 80 + i * cellWidth, tableY - 5, cellWidth, cellHeight)
//         .stroke();
//       if (data.mobileNo && data.mobileNo[i]) {
//         doc.text(data.mobileNo[i], tableX + 88 + i * cellWidth, tableY, {
//           width: cellWidth,
//           align: "center",
//         });
//       }
//     }
//     doc.moveDown(2);

//     // ADDRESS FIELD
//     doc.text("Present Communication Address:");
//     doc.rect(tableX, doc.y, contentWidth, 60).stroke();
//     doc.text(data.address, tableX + 5, doc.y + 5, { width: contentWidth - 10 });
//     doc.moveDown(5);
//     // CONTACT DETAILS TABLE
//     const tableEX = doc.x;
//     const tableEY = doc.y;
//     const cellEWidth = 25;
//     const cellEHeight = 20;
//     doc.text("E-mail Address:", tableEX, tableEY);
//     for (let i = 0; i < 12; i++) {
//       doc
//         .rect(
//           tableEX + 100 + i * cellEWidth,
//           tableEY - 5,
//           cellEWidth,
//           cellEHeight
//         )
//         .stroke();
//       if (data.email && data.email[i]) {
//         doc.text(data.email[i], tableEX + 108 + i * cellEWidth, tableEY, {
//           width: cellEWidth,
//           align: "center",
//         });
//       }
//     }
//     doc.moveDown(3);

//     doc.moveDown(3);
//     doc.text("Signature: ______________________");
//     doc.moveDown(1);
//     doc.text(`Name: ${data.name}`);
//     doc.moveDown(1);
//     doc.text(`Membership No.: ${data.membershipNo}`);

//     doc.end();
//     writeStream.on("finish", () => {
//       callback(null, pdfPath);
//     });
//   } catch (error) {
//     callback(error, null);
//   }
// };

// module.exports = generateFormThreePDF;

//NEW FORM CREATED BY PRAVIN

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateFormThreePDF = (data, callback) => {
  try {
    const doc = new PDFDocument({
      margins: { top: 70, bottom: 70, left: 100, right: 100 },
    });

    const pdfPath = path.join(
      __dirname,
      `../templates/Form3_${Date.now()}.pdf`
    );
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    const contentWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // FORM HEADER
    doc.fontSize(14).font("Helvetica-Bold").text("FORM 3", { align: "center" });
    doc.moveDown(1);
    doc
      .fontSize(12)
      .text(
        "APPLICATION CUM DECLARATION FORM FOR EMPANELMENT AS A PEER REVIEWER",
        {
          align: "center",
        }
      );
    doc.text("[As per Clause 27(3) of the Peer Review Guidelines 2022]", {
      align: "center",
    });

    doc.moveDown(3);

    // ADDRESS
    doc.fontSize(12).font("Helvetica").text("To,", { align: "left" });
    doc.moveDown();
    doc.text("The Secretary, Peer Review Board,", { align: "left" });
    doc.text("The Institute of Chartered Accountants of India,", {
      align: "left",
    });
    doc.text("ICAI Bhawan,", { align: "left" });
    doc.text("Post Box No. 7100,", { align: "left" });
    doc.text("Indraprastha Marg, New Delhi – 110002", { align: "left" });
    doc.moveDown(2);

    // APPLICATION BODY
    doc.text("Dear Sir,", { align: "left" });
    doc.moveDown(1);
    doc.text(
      `1. I ${data.memberName || "____________________"}, M. No. ${
        data.memberNo || "________"
      } would like to apply for Empanelment as a Peer Reviewer.`,
      { align: "justify" }
    );
    doc.moveDown(1);
    doc.text(
      `2. I have attended the training Programme organized by the Board physically/ through VCM on ${
        data.trainingDate || "______________"
      }.`,
      { align: "justify" }
    );
    doc.moveDown(1);
    doc.text(
      "3. I have gone through the Peer Review Guidelines 2022 hosted at:"
    );
    doc
      .fillColor("blue")
      .text(
        "https://resource.cdn.icai.org/72010prb57960-peer-review-guidelines-2022.pdf",
        { underline: true }
      );
    doc.fillColor("black");
    doc.text("And undertake to abide by the same.");
    doc.moveDown(2);

    //
    doc.moveDown(1);
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Other information is as follows:", { align: "center" });
    doc.moveDown(1);

    // Reset the font back to normal
    doc.font("Helvetica").fontSize(12);

    // Contact Details
    const labelX = doc.x; // Start position for text
    const labelY = doc.y; // Store Y position before moving

    doc.text(`4. Mobile No.: (as per ICAI records)`, labelX, labelY, {
      align: "left",
    });

    const mobileX = labelX + 200; // Adjust position for boxes to fit properly
    const mobileY = labelY - 2; // Small adjustment for alignment

    const mobileBoxSize = 18; // Box width & height
    const mobileSpacing = 4; // Space between boxes

    // Draw the Mobile Number Boxes
    for (let i = 0; i < 10; i++) {
      doc
        .rect(
          mobileX + i * (mobileBoxSize + mobileSpacing),
          mobileY,
          mobileBoxSize,
          mobileBoxSize
        )
        .stroke();

      // Fill boxes with mobile number characters if provided
      if (data.mobile && data.mobile[i]) {
        doc.text(
          data.mobile[i],
          mobileX + i * (mobileBoxSize + mobileSpacing) + mobileBoxSize / 3,
          mobileY + mobileBoxSize / 4
        );
      }
    }

    doc.moveDown(2);

    // Address Field with Box
    doc.text("5. Present Communication Address:", doc.page.margins.left, doc.y);

    // Adjust position to ensure text appears **above** the box
    doc.moveDown(0.5); // Move slightly down to avoid overlapping

    const addressX = doc.page.margins.left; // Fix starting position to left margin
    const addressY = doc.y;

    const addressWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right; // Correct width
    const addressHeight = 60; // Height for the box

    // Draw Address Box **after** the label
    doc.rect(addressX, addressY, addressWidth, addressHeight).stroke();

    doc.moveDown(4); // Move inside the box for text input
    doc.text(data.address || "", addressX + 6, addressY + 5, {
      width: addressWidth - 15,
    });

    // Other Fields
    // Move down before adding the email field
    doc.moveDown(4);
    doc.text(`6. E-mail Address:`, { align: "left" });

    // Define starting position for boxes (aligned properly to left)
    const emailX = doc.page.margins.left; // Position boxes right after label
    doc.moveDown(1);
    const emailY = doc.y - 5; // Align properly with label

    const emailBoxSize = 15; // Box width & height
    const emailSpacing = 3; // Space between boxes

    // Draw 18 boxes for email input (proper left alignment)
    for (let i = 0; i < 18; i++) {
      doc
        .rect(
          emailX + i * (emailBoxSize + emailSpacing),
          emailY,
          emailBoxSize,
          emailBoxSize
        )
        .stroke();

      // Fill boxes with email characters if provided
      if (data.email && data.email[i]) {
        doc.text(
          data.email[i],
          emailX + i * (emailBoxSize + emailSpacing) + emailBoxSize / 3,
          emailY + emailBoxSize / 4
        );
      }
    }

    // ADD A NEW PAGE FOR THE NEXT SECTION
    doc.addPage();
    // Move down for next content
    doc.moveDown(1);

    // Move down before adding the landline field

    doc.text(
      "7. Telephone (Landline) Number (optional):",
      doc.page.margins.left,
      doc.y
    );
    doc.moveDown(1);

    // Define starting position for boxes (aligned properly to left)
    const landlineX = doc.page.margins.left - [-5]; // Keep boxes aligned to left side
    const landlineY = doc.y - 5; // Align properly with label

    const landlineBoxSize = 18; // Box width & height
    const landlineSpacing = 4; // Space between boxes

    // Draw 10 boxes for landline input
    for (let i = 0; i < 10; i++) {
      doc
        .rect(
          landlineX + i * (landlineBoxSize + landlineSpacing),
          landlineY,
          landlineBoxSize,
          landlineBoxSize
        )
        .stroke();

      // Fill boxes with landline number if provided
      if (data.landline && data.landline[i]) {
        doc.text(
          data.landline[i],
          landlineX +
            i * (landlineBoxSize + landlineSpacing) +
            landlineBoxSize / 3,
          landlineY + landlineBoxSize / 4
        );
      }
    }

    // Move down for next content
    doc.moveDown(1);

    // Move down before adding the Date of COP field
    doc.moveDown(2);
    doc.text("8. Date of COP:", doc.page.margins.left, doc.y);

    // Define starting position for boxes (aligned properly to left)
    doc.moveDown(1);
    const dateCopX = doc.page.margins.left + 10; // Position boxes after label
    const dateCopY = doc.y - 5; // Align properly with label

    const dateBoxSize = 18; // Box width & height
    const dateSpacing = 4; // Space between boxes

    // Format: DD / MM / YYYY → 10 boxes with 2 slashes in between
    const dateFormat = ["D", "D", "M", "M", "Y", "Y", "Y", "Y"];

    for (let i = 0; i < dateFormat.length; i++) {
      // Draw box for numbers only (skip slashes)
      if (dateFormat[i] !== "/") {
        doc
          .rect(
            dateCopX + i * (dateBoxSize + dateSpacing),
            dateCopY,
            dateBoxSize,
            dateBoxSize
          )
          .stroke();

        // Fill box with date characters if provided
        if (data.dateOfCop && data.dateOfCop[i]) {
          doc.text(
            data.dateOfCop[i],
            dateCopX + i * (dateBoxSize + dateSpacing) + dateBoxSize / 3,
            dateCopY + dateBoxSize / 4
          );
        }
      } else {
        // Add slashes between boxes
        doc.text(
          "/",
          dateCopX + i * (dateBoxSize + dateSpacing) + dateBoxSize / 3,
          dateCopY + dateBoxSize / 4
        );
      }
    }

    // Move down for next content
    // doc.moveDown(2);

    // Move down before adding the Audit Experience field
    doc.moveDown(2);
    doc.text(
      "9. No. of years Audit and Assurance service experience in Practice:",
      doc.page.margins.left,
      doc.y
    );

    // Define starting position for boxes (aligned properly to the left)
    const auditExpX = doc.page.margins.left + 300; // Position boxes after the label
    const auditExpY = doc.y - 2; // Align properly with label

    const auditBoxSize = 18; // Box width & height
    const auditSpacing = 4; // Space between boxes

    // Draw 4 boxes for audit experience input
    for (let i = 0; i < 4; i++) {
      doc
        .rect(
          auditExpX + i * (auditBoxSize + auditSpacing),
          auditExpY,
          auditBoxSize,
          auditBoxSize
        )
        .stroke();

      // Fill boxes with audit experience if provided
      if (data.auditExperience && data.auditExperience[i]) {
        doc.text(
          data.auditExperience[i],
          auditExpX + i * (auditBoxSize + auditSpacing) + auditBoxSize / 3,
          auditExpY + auditBoxSize / 4
        );
      }
    }

    // Move down for next content
    doc.moveDown(2);

    doc.moveDown(1);

    // Experience Table Header
    // Move down before adding the table
    doc.moveDown(2);
    doc.font("Helvetica");
    doc.text("10. Details of Practicing Experience:", doc.page.margins.left);
    doc.moveDown(1);

    // Define table properties
    const tableX = doc.page.margins.left; // Start position from left margin
    const tableY = doc.y; // Current Y position

    const colWidths = [30, 80, 60, 120, 100, 80]; // Width for each column
    const rowHeight = 30; // Height for each row
    const numRows = 6; // Number of rows
    const numCols = 6; // Number of columns

    // Column headers
    const headers = [
      "Sr No.",
      "Firm Name",
      "FRN",
      "Nature of Industry (Banking/Insurance/Others)",
      "Type of Assurance Service",
      "For the Year",
    ];

    // Draw header row with background
    // doc.font("Helvetica-Bold").fillColor("black");

    // Draw headers
    let colX = tableX;
    headers.forEach((header, index) => {
      doc.text(header, colX + 5, tableY + 5, {
        width: colWidths[index],
        align: "center",
      });
      colX += colWidths[index];
    });

    // Draw table borders
    // doc.strokeColor("black");

    // Draw header row box
    doc
      .rect(
        tableX,
        tableY,
        colWidths.reduce((a, b) => a + b, 4),
        rowHeight
      )
      .stroke();

    // Draw table rows
    for (let i = 0; i < numRows; i++) {
      let rowY = tableY + (i + 1) * rowHeight;

      // Draw row boxes
      let colX = tableX;
      for (let j = 0; j < numCols; j++) {
        doc.rect(colX, rowY, colWidths[j], rowHeight).stroke();
        colX += colWidths[j];
      }

      // Fill table with data if available
      if (data.firms && data.firms[i]) {
        let colX = tableX;
        const firm = data.firms[i];
        const rowData = [
          i + 1,
          firm.name || "",
          firm.frn || "",
          firm.industry || "",
          firm.assuranceType || "",
          firm.year || "",
        ];

        doc.font("Helvetica").fillColor("black");
        rowData.forEach((text, index) => {
          doc.text(text.toString(), colX + 5, rowY + 7, {
            width: colWidths[index],
            align: "center",
          });
          colX += colWidths[index];
        });
      }
    }

    // Move down after table
    doc.moveDown(6);

    // Move down before adding the experience line
    doc.moveDown(8);
    doc.font("Helvetica");
    doc.text(
      "11. (I) Have you experience of statutory audit of:",
      doc.page.margins.left
    );

    // Add checkbox-like columns for "A Listed Entity" experience (YY MM format)
    doc.text("A Listed Entity", doc.page.margins.left + 20, doc.y + 5);

    doc.moveDown(1);
    const yearBoxX = doc.page.margins.left + 120; // Position for 'YY' box
    const monthBoxX = yearBoxX + 40; // Position for 'MM' box
    const boxY = doc.y; // Align properly with label

    const boxSize = 22; // Box width & height

    // Draw boxes for YY and MM
    doc.rect(yearBoxX, boxY, boxSize, boxSize).stroke();
    doc.text("YY", yearBoxX + 3, boxY + 3);

    doc.rect(monthBoxX, boxY, boxSize, boxSize).stroke();
    doc.text("MM", monthBoxX + 3, boxY + 3);

    // Move down before the next section
    doc.moveDown([-1]);
    doc.text(
      "(II) If Yes, provide the following details:",
      doc.page.margins.left
    );
    doc.moveDown([-1]);

    // Define table properties
    const tableStartX = doc.page.margins.left; // Start position from left margin
    const tableStartY = doc.y; // Current Y position

    const columnWidths = [50, 200, 150]; // Width for each column (3 columns)
    const tableRowHeight = 25; // Renamed to `tableRowHeight` to avoid conflict
    const totalRows = 3; // Number of rows
    const totalColumns = 3; // Number of columns

    // Column headers
    const tableHeaders = [
      "Sr No.",
      "Name of listed Entity",
      "Financial Year(s) for which the statutory audit of listed entity has been conducted?",
    ];

    // Draw header row with background
    doc.font("Helvetica").fillColor("black");

    // Draw table borders
    doc.strokeColor("black");

    // Draw header row box
    // doc.rect(tableStartX, tableStartY, columnWidths.reduce((a, b) => a + b, 0), tableRowHeight).stroke();

    // Draw table rows
    for (let i = 0; i < totalRows; i++) {
      let rowYPosition = tableStartY + (i + 1) * tableRowHeight;

      // Draw row boxes
      let currentX = tableStartX;
      for (let j = 0; j < totalColumns; j++) {
        doc
          .rect(currentX, rowYPosition, columnWidths[j], tableRowHeight)
          .stroke();
        currentX += columnWidths[j];
      }

      // Fill table with data if available
      if (data.statAuditRecords && data.statAuditRecords[i]) {
        let currentX = tableStartX;
        const record = data.statAuditRecords[i];
        const rowValues = [
          i + 1,
          record.companyName || "",
          record.auditYears || "",
        ];

        doc.font("Helvetica").fillColor("black");
        rowValues.forEach((text, index) => {
          doc.text(text.toString(), currentX + 5, rowYPosition + 7, {
            width: columnWidths[index],
            align: "center",
          });
          currentX += columnWidths[index];
        });
      }
    }
    // Move down after table
    doc.moveDown(6);

    // Move down before adding the experience line

    doc.font("Helvetica");
    doc.text(
      "12. Number of years of experience for Audit & Assurance services as a member of the team, while working in employment:",
      doc.page.margins.left
    );

    // Define starting position for 'YY MM' columns
    const expYearBoxX = doc.page.margins.left + 300; // Position for 'YY' box
    const expMonthBoxX = expYearBoxX + 50; // Position for 'MM' box
    const expBoxY = doc.y; // Align properly with text

    const expBoxSize = 20; // Box width & height

    // Draw boxes for YY and MM
    doc.rect(expYearBoxX, expBoxY, expBoxSize, expBoxSize).stroke();
    doc.text("Y", expYearBoxX + 5, expBoxY + 5);

    doc
      .rect(expYearBoxX + expBoxSize, expBoxY, expBoxSize, expBoxSize)
      .stroke();
    doc.text("Y", expYearBoxX + expBoxSize + 5, expBoxY + 5);

    doc.rect(expMonthBoxX, expBoxY, expBoxSize, expBoxSize).stroke();
    doc.text("M", expMonthBoxX + 5, expBoxY + 5);

    doc
      .rect(expMonthBoxX + expBoxSize, expBoxY, expBoxSize, expBoxSize)
      .stroke();
    doc.text("M", expMonthBoxX + expBoxSize + 5, expBoxY + 5);

    // Move down for the next content
    doc.moveDown(2);

    // Move down before adding the experience section
    doc.moveDown(2);
    doc.font("Helvetica");
    doc.text("13. Details of experience in employment:", doc.page.margins.left);
    doc.moveDown(1);

    // Define table properties
    const startX = doc.page.margins.left; // Start from left margin
    const startY = doc.y; // Current Y position

    const colSizes = [40, 100, 120, 80, 80, 80]; // Column widths for 6 columns
    const rowCount = 7; // Number of rows
    const colCount = colSizes.length; // Number of columns
    const cellHeight = 30; // Adjusted row height

    // Column headers
    const columnTitles = [
      "S. No.",
      "Job Title/ Designation",
      "Name of the Company",
      "Worked from (Date)",
      "Worked Till (Date)",
      "Listed on any Stock Exchange(Yes/No)",
      "Nature of Industry",
    ];

    // Draw header row with background
    doc.font("Helvetica-Bold").fillColor("black");

    // Draw headers
    // let positionX = startX;
    // columnTitles.forEach((header, index) => {
    //   doc.text(header, positionX + 5, startY + 8, { width: colSizes[index], align: "center" });
    //   positionX += colSizes[index];
    // });

    // Draw header row box
    doc.strokeColor("black");
    doc
      .rect(
        startX,
        startY,
        colSizes.reduce((a, b) => a + b, 0),
        cellHeight
      )
      .stroke();

    // Draw table rows
    for (let i = 0; i < rowCount; i++) {
      let positionY = startY + (i + 1) * cellHeight;

      // Draw row boxes
      let positionX = startX;
      for (let j = 0; j < colCount; j++) {
        doc.rect(positionX, positionY, colSizes[j], cellHeight).stroke();
        positionX += colSizes[j];
      }

      // Fill table with data if available
      if (data.employmentData && data.employmentData[i]) {
        let positionX = startX;
        const record = data.employmentData[i];
        const rowValues = [
          i + 1,
          record.position || "",
          record.companyTitle || "",
          record.startDate || "",
          record.endDate || "",
          record.stockListed || "",
          record.sectorType || "",
        ];

        doc.font("Helvetica").fillColor("black");
        rowValues.forEach((text, index) => {
          doc.text(text.toString(), positionX + 5, positionY + 8, {
            width: colSizes[index],
            align: "center",
          });
          positionX += colSizes[index];
        });
      }
    }

    // Move down after table
    doc.moveDown(18);

    // Declaration Section
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Annexure: Declaration", { align: "left" });
    doc.moveDown(1);
    doc.fontSize(12).font("Helvetica");
    // const declarationText = `I hereby declare that:
    // 1. I am a practicing member of the Institute.
    // 2. I possess minimum Seven Years’ cumulative experience of audit & assurance services.
    // 3. I have not been convicted of any professional misconduct.
    // 4. I have no objection if my profile is shared with Practice Units for Peer Review.
    // 5. I shall maintain full confidentiality of all working papers and client records.`;

    // doc.text(declarationText, { align: "justify", width: contentWidth });

    doc.moveDown(4);

    // Signature Section
    doc.text("Signature:", { align: "left" });

    doc.moveDown(4);
    doc.text(`Name: ${data.memberName || "____________________"}`, {
      align: "left",
    });

    doc.moveDown(4);
    doc.text(`Date: ${data.declarationDate || "__/__/____"}`, {
      align: "left",
    });

    // ADD A NEW PAGE FOR THE NEXT SECTION
    doc.addPage();

    // Annexure Title
    doc.fontSize(14).font("Helvetica-Bold").text("Annexure", {
      align: "right",
      width: contentWidth,
    });
    doc.moveDown(2);

    // Declaration Heading
    doc.fontSize(12).font("Helvetica-Bold").text("DECLARATION", {
      align: "center",
      width: contentWidth,
    });
    doc.moveDown(1);

    // Declaration Content
    const declarationText =
      `I hereby declare that:\n\n` +
      `1. I am a practicing member of the Institute.\n` +
      `2. (i) I possess minimum Seven Years’ cumulative experience of audit & assurance services and am currently active in the practice of accounting and auditing or;\n` +
      `   (ii) I have moved from employment to Practice and I have more than Ten years’ of audit experience in employment.\n` +
      `3. I have not been convicted by a competent court whether within or outside India, of an offence involving moral turpitude and punishable with imprisonment or of an offence, not of a technical nature, committed by me in professional capacity.\n` +
      `4. I have no objection if my profile is provided to the practice unit which selects my name for conducting Peer Review, if asked for it.\n` +
      `5. I have not been found guilty of professional or other misconduct by the Council or the Board of Discipline or the Disciplinary Committee at any time.\n` +
      `6. That no disciplinary action/proceeding is pending against me at present and I will immediately intimate to the Board at peerreviewboard@icai.in, if any Disciplinary Action is initiated against me or against Qualified Assistant (if used during a particular Peer Review), in the future.\n` +
      `7. In case of removal of my name from the register of members or withdrawal of certificate of Practice by me, I shall immediately inform the same to the Board.\n` +
      `8. Full Confidentiality of the Working papers shall always be maintained at all times so that unauthorized access by any means (including electronic means) is not gained by anyone.\n` +
      `9. The practice unit’s assurance services procedures shall not be disclosed to third parties except as provided under the Peer Review Guidelines 2022.\n` +
      `10. Any information with regard to any matter coming to my knowledge in the performance or in assisting in the performance of any function during the conduct of peer reviews shall not be disclosed to any person except as provided under the Peer Review Guidelines 2022.\n` +
      `11. Access shall not be given to any person other than as required under the Peer Review Guidelines 2022, to any record, document or any other material, in any form which is in my possession, or under my control, by virtue of my being or having been so appointed or my having performed or having assisted any other person in the performance of such a function.\n\n` +
      `I understand that any breach of the provisions regarding confidentiality as contained in the Peer Review Guidelines 2022 will be considered as gross negligence and make me liable for appropriate disciplinary action.`;

    doc.font("Helvetica").fontSize(11).text(declarationText, {
      align: "justify",
      width: contentWidth,
    });

    doc.moveDown(1);
    doc.text("Signature: ______________________", { align: "left" });
    doc.moveDown(2);
    doc.text("Name: ______________________", { align: "left" });
    doc.moveDown(2);
    doc.text("Date: ______________________", { align: "left" });
    doc.moveDown(1);

    doc.end();

    // Wait for the file to be written before calling callback
    writeStream.on("finish", () => {
      callback(null, pdfPath);
    });
  } catch (error) {
    callback(error, null);
  }
};

module.exports = generateFormThreePDF;
