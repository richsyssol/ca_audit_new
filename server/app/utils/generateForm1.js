const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateFormOnePDF = (data, callback) => {
  try {
    const doc = new PDFDocument({
      margins: { top: 70, bottom: 70, left: 100, right: 100 },
    });

    const pdfPath = path.join(__dirname, `Form1_${Date.now()}.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    const contentWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // FORM HEADER
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("FORM 1", { align: "center", width: contentWidth });
    doc.moveDown(1);

    doc
      .fontSize(12)
      .text("APPLICATION CUM QUESTIONNAIRE TO BE SUBMITTED BY PRACTICE UNIT", {
        align: "center",
        width: contentWidth,
      })
      .text("[As per Clause 6(1) & 6 (2) of the Peer Review Guidelines 2022]", {
        align: "center",
        width: contentWidth,
      });

    doc.moveDown(2);

    // ADDRESS
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("The Secretary, Peer Review Board,")
      .text("The Institute of Chartered Accountants of India,")
      .text("ICAI Bhawan,")
      .text("Post Box No. 7100,")
      .text("Indraprastha Marg, New Delhi – 110002");

    doc.moveDown(2);

    // APPLICATION
    doc.font("Helvetica-Bold").text("APPLICATION", { align: "center" });
    doc.moveDown(1);
    doc.font("Helvetica").text("Dear Sir,");
    doc.moveDown(1);

    doc.text(
      `1. Our Firm ${data?.firm_name} (Name of practice unit as per ICAI Records); FRN/ M. No. ${data.frn} ` +
        `/${data.reviewStartDate} (Firm Registration Number/ Mem. No. as per ICAI records) would like to apply for Peer Review for the period from ${data.reviewEndDate} `,
      { continued: true }
    );

    doc
      .fillColor("blue")
      .text(
        "https://resource.cdn.icai.org/72010prb57960-peer-review-guidelines2022.pdf",
        {
          link: "https://resource.cdn.icai.org/72010prb57960-peer-review-guidelines2022.pdf",
          continued: true,
        }
      );

    doc.fillColor("black").text(" and undertake to abide by the same.");
    doc.moveDown(1);

    doc.text(
      "2. I/We hereby declare that my/our firm is applying for Peer Review (Tick the applicable clause):"
    );
    doc.moveDown(1);

    // CHECKBOXES
    const checkboxSize = 18;

    doc
      .text("(i) As it is Mandatory by: ICAI", { continued: true })
      .moveDown(0.5);
    doc.rect(260, doc.y - 12, checkboxSize, checkboxSize).stroke();
    doc.moveDown(1);

    doc
      .text("Any other Regulator (please specify)", 130, doc.y - 22)
      .moveDown(1);
    doc.rect(120, doc.y - 14, checkboxSize, checkboxSize).stroke();
    doc.moveDown(1);

    doc.text("(ii) Voluntarily:", 100, doc.y);
    doc.rect(200, doc.y - 18, checkboxSize, checkboxSize).stroke();
    doc.moveDown(1);

    doc.text(
      "(iii) As a special case Review initiated by the Board:",
      100,
      doc.y
    );
    doc.rect(380, doc.y - 18, checkboxSize, checkboxSize).stroke();
    doc.moveDown(1);

    doc.text("(iv) New Unit:", 100, doc.y);
    doc.rect(200, doc.y - 18, checkboxSize, checkboxSize).stroke();
    doc.moveDown(1);

    doc.text("(v) As per decision of the Board:", 100, doc.y);
    doc.rect(300, doc.y - 18, checkboxSize, checkboxSize).stroke();
    doc.moveDown(2);

    doc.text(
      "3. I/We hereby declare that my/our firm has signed reports pertaining to the following assurance services during the period under review:"
    );

    // TABLE CONFIGURATION
    const drawTables = (headers, data, startY) => {
      const pageWidth = doc.page.width;
      const tableWidth = 500;
      const startX = (pageWidth - tableWidth) / 2;
      const colWidths = [50, 220, 150, 60, 60];
      let yPosition = startY;

      doc.lineWidth(1);

      // Draw Headers
      doc.font("Helvetica-Bold");
      let xPos = startX;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition, colWidths[index], 20).stroke();
        doc.text(header, xPos + 5, yPosition + 5, {
          width: colWidths[index] - 10,
        });
        xPos += colWidths[index];
      });
      yPosition += 20;

      // Draw Data Rows
      doc.font("Helvetica");
      data.forEach((row, rowIndex) => {
        let xPos = startX;
        doc.rect(xPos, yPosition, colWidths[0], 20).stroke();
        doc.text((rowIndex + 1).toString(), xPos + 5, yPosition + 5, {
          width: colWidths[0] - 10,
        });
        xPos += colWidths[0];

        row.forEach((text, index) => {
          doc.rect(xPos, yPosition, colWidths[index + 1], 20).stroke();
          doc.text(text, xPos + 5, yPosition + 5, {
            width: colWidths[index + 1] - 10,
          });
          xPos += colWidths[index + 1];
        });
        yPosition += 20;
      });
      return yPosition;
    };

    // New Page
    doc.addPage();

    // Table Headers
    const headers = [
      "S.No.",
      "Type of Assurance  Service Rendered",
      "Major Type of Client (Specify) (e.g.: Banks; Insurance Company; Manufacturing; Individuals; Trading ; any other )",
    ];
    const dataRows = [
      ["1", "Central Statutory Audit", ""],
      ["2", "Statutory Audit", ""],
      ["3", "Internal Audit", ""],
      ["4", "Tax Audit", ""],
      ["5", "Concurrent Audit", ""],
      ["6", "Certification work", ""],
      ["7", "Any other, please specify", ""],
    ];

    const tableWidth = 400;
    const colWidths = [40, 150, 180];
    const startX = (doc.page.width - tableWidth) / 2;
    let startY = doc.y;

    doc.font("Helvetica");
    let xPos = startX;
    headers.forEach((header, i) => {
      doc.rect(xPos, startY, colWidths[i], 100).stroke();
      doc.text(header, xPos + 5, startY + 5, { width: colWidths[i] - 10 });
      xPos += colWidths[i];
    });
    startY += 80;

    doc.font("Helvetica");
    dataRows.forEach((row) => {
      let xPos = startX;
      row.forEach((text, i) => {
        doc.rect(xPos, startY, colWidths[i], 20).stroke();
        doc.text(text, xPos + 5, startY + 5, { width: colWidths[i] - 10 });
        xPos += colWidths[i];
      });
      startY += 20;
    });

    doc.moveDown(4);
    doc
      .font("Helvetica-Bold")
      .text(
        "4. Declaration on Statutory Audit of Listed Enterprises",
        doc.page.margins.left,
        doc.y
      );
    doc.moveDown(1);
    doc
      .font("Helvetica")
      .text(
        "I / We hereby declare that my/ our firm has conducted/ has not conducted Statutory Audit of enterprises Listed in India or abroad as defined under SEBI LODR, 2015 during the Review Period."
      );
    doc.moveDown(2);

    // CHECKBOXES
    const boxSize = 18;

    doc
      .font("Helvetica")
      .text("5. Option for appointment of Reviewer:(Tick appropriate option)");
    doc.font("Helvetica");
    doc.moveDown(1);

    doc.text("(i) Same City");
    doc
      .rect(doc.page.margins.left + 100, doc.y - 12, boxSize, boxSize)
      .stroke();
    doc.moveDown(2);

    doc.text("(ii) From outside City");
    doc
      .rect(doc.page.margins.left + 130, doc.y - 12, boxSize, boxSize)
      .stroke();
    doc.moveDown(1);

    doc.text("(iii) Either option (i) or (ii)");
    doc
      .rect(doc.page.margins.left + 150, doc.y - 12, boxSize, boxSize)
      .stroke();
    doc.moveDown(1);

    doc.text("(iv) Preferred City in case of option (ii):");
    doc
      .rect(doc.page.margins.left, doc.y + 100, doc.y - 12, 150, boxSize)
      .stroke(); // Input field box

    doc.moveDown(2);

    doc
      .font("Helvetica-Bold")
      .text("6. Mail ID for communication with the Practice unit:");
    doc.text("____________________________________________");
    doc.moveDown(2);

    doc
      .font("Helvetica-Bold")
      .text("7. Address for sending the Peer Review Certificate:");
    doc.text;

    //doc.moveDown(2);

    doc.moveDown(6);
    doc
      .lineWidth(2)
      .strokeColor("black")
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .text("Further Information to be submitted by New Unit", {
        align: "center",
      });
    doc.moveDown(2);
    doc
      .font("Helvetica")
      .text(
        "8. Tick the applicable clause or mention N.A. as the case may be:"
      );
    doc.moveDown(2);
    // New Page
    doc.addPage();

    const content = [
      "(i) CA ……….., M.No. [………], partner of my firm is /was a partner/ proprietor of the firm ………………….. ",
      "(ii) I am / was a partner/ proprietor of the firm …………………..",
      "(iii) CA……………..(M. N………………………….), an employee of my firm who is a Chartered Accountant, is / was a partner...",
      "(iv) CA ……….., M.No. [………], partner of my firm ……………, is an Empanelled Peer Reviewer...",
      "(v) I, CA ……………….., M. No………………………. am an Empanelled Peer Reviewer...",
      "9. Policies, procedures, and infrastructure of my firm are in conformity with the Standards on Quality Control",
      "10. I wish to undertake audit of listed entity and further declare that: (Fill as applicable or mention N.A.)",
      "(i) CA ……….., M.No.: [………], partner of my firm has carried out audit of Listed company in last three years.",
      "(ii) I, CA…………., M. No.: ……………… (in case of proprietorship firm) have carried out audit of Listed company...",
      "11. The Practice Unit nominates its Partner CA……………….. for Peer Review process...",
      "12. Annexure: Questionnaire",
    ];

    content.forEach((line) => {
      doc.fontSize(12).font("Helvetica").text(line, { align: "justify" });
      doc.moveDown(1);
    });

    // New Page
    doc.addPage();

    // LIST OF CONFIDENTIALITY CONDITIONS
    const conditions = [
      "I hereby Declare that the details furnished above are true and correct as borne out by the facts to the best of my knowledge and belief.",
      "I understand that the Peer Review Certificate, issued on the basis of the report submitted by the reviewer does not provide immunity from Disciplinary/ legal proceedings or actions initiated against Practice Unit or its partners/ employees.",
      "I undertake to pay the fee to the Peer Reviewer within 7 days from the date of receipt of the invoice from the Peer Reviewer.",
      "I further undertake and agree that the certificate can be revoked for any of the reason stated in the Peer Review Guidelines",
    ];

    const leftMargin = doc.page.margins.left + 10;
    const bulletSymbol = "•"; // Unicode bullet character

    conditions.forEach((item) => {
      doc.text(`${bulletSymbol}`, leftMargin, doc.y, { continued: true });
      doc.text(item, leftMargin + 10, doc.y, {
        width: contentWidth - 20,
        align: "left",
      });
      doc.moveDown(1);
    });

    // SIGNATURE SECTION
    doc.fontSize(12).font("Helvetica").text("Signature:", { align: "left" });

    doc.moveDown(1);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("__________________________", { align: "left" });

    doc.moveDown(2);
    doc.fontSize(12).font("Helvetica").text("Name of Proprietor/Partner/");
    doc.moveDown(1);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("Individual Practicing in own name:");

    doc.moveDown(2);
    doc.fontSize(12).font("Helvetica").text("Membership No. of the Signatory:");
    doc.moveDown(1);
    // doc.fontSize(12).font("Helvetica").text("[Membership No.]");

    doc.moveDown(2);
    doc.fontSize(12).font("Helvetica").text("Date:");
    doc.moveDown(1);
    doc.fontSize(12).font("Helvetica").text(new Date().toLocaleDateString());

    //Add New Page
    doc.addPage();

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Annexure", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(14).text("QUESTIONNAIRE", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text("(PART A - PROFILE OF PRACTICE UNIT (PU))", { align: "center" });
    doc.moveDown(2);

    // Questions
    doc.fontSize(12).font("Helvetica").text("1. Name of the Practice Unit:");
    doc.moveDown(-1);

    const boxWidth = 18; // Width of each box
    const boxGap = 0; // Gap between boxes
    const initialX = 270; // Adjust X position for alignment
    const initialY = doc.y; // Current Y position

    // Draw 14 small boxes for input
    for (let i = 0; i < 14; i++) {
      doc
        .rect(initialX + i * (boxWidth + boxGap), initialY, boxWidth, boxWidth)
        .stroke();
    }

    doc.moveDown(2);

    doc.fontSize(12).text("2. Peer Review of");
    const hoBoxX = 230; // X position for HO box
    const hoBoxY = doc.y - 12; // Align with text
    const squareSize = 18; // New variable name for box size

    doc.text(" HO ", hoBoxX + squareSize + -50, doc.y); // Adjust spacing
    // Draw box for HO
    doc.rect(hoBoxX, hoBoxY, squareSize, squareSize).stroke();

    doc.text(" Branch ", hoBoxX + squareSize + 30, doc.y); // Adjust spacing

    // Draw box for Branch
    doc.rect(hoBoxX + squareSize + 80, hoBoxY, squareSize, squareSize).stroke();
    doc.moveDown(1.5);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text("3. Address (As per ICAI records);", 100);
    doc.moveDown(1);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text("4. Email Id of PU.________________", { continued: true })
      .text(" Website of PU:_______________________");
    doc.moveDown(1);

    doc.fontSize(12).text("5. Status");
    const hoBox = 230; // X position for HO box
    const hoBoxx = doc.y - 12; // Align with text
    const squareSizea = 18; // New variable name for box size

    doc.text(" HO ", hoBox + squareSize + -50, doc.y); // Adjust spacing
    // Draw box for HO
    doc.rect(hoBox, hoBoxx, squareSizea, squareSizea).stroke();

    doc.text(" Branch ", hoBoxX + squareSize + 30, doc.y); // Adjust spacing

    //date
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("6. Date of establishment of the PU:", 100);

    doc.moveDown(-1);

    const boxWidthb = 18; // Width of each box
    const boxGapb = 0; // Gap between boxes
    const initialXb = 300; // Adjust X position for alignment
    const initialYb = doc.y; // Current Y position

    // Draw 14 small boxes for input
    for (let i = 0; i < 8; i++) {
      doc
        .rect(
          initialXb + i * (boxWidthb + boxGapb),
          initialYb,
          boxWidth,
          boxWidth
        )
        .stroke();
    }

    doc.moveDown(2);

    //Firm Registration No
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("7. Firm Registration Number:", 100);

    doc.moveDown(-1);

    const boxWidthc = 18; // Width of each box
    const boxGapc = 0; // Gap between boxes
    const initialXc = 300; // Adjust X position for alignment
    const initialYc = doc.y; // Current Y position

    // Draw 14 small boxes for input
    for (let i = 0; i < 8; i++) {
      doc
        .rect(
          initialXc + i * (boxWidthc + boxGapc),
          initialYc,
          boxWidth,
          boxWidth
        )
        .stroke();
    }
    doc.moveDown(2);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        "  (Membership No. in case of an individual practicing in own name)",
        100
      );
    doc.moveDown(2);

    //8
    doc
      .font("Helvetica")
      .text("8. Is there any networking firm and if yes, please provide: ");
    doc.moveDown(2);

    const contenta = [
      "(i) Name of network: _____________________________________ ",
      "(ii) Since when the Networking is entered into: ________________",
      "(iii) 	Is there any exit from the Networking recently: _______. And if Yes, what is the reason or such exit:   _____________________",
    ];

    contenta.forEach((line) => {
      doc.fontSize(12).font("Helvetica").text(line, { align: "justify" });
      doc.moveDown(1);
    });

    //9
    doc.font("Helvetica").text("9. Period of assurance service under review");
    doc.moveDown(2);

    const boxWidthd = 18; // Width of each box
    const boxGapd = 0; // Gap between boxes
    const initialXd = 300; // Adjust X position for alignment
    const initialYd = doc.y; // Current Y position

    doc.font("Helvetica").text("From");
    doc.moveDown(2);

    // Draw 14 small boxes for input
    for (let i = 0; i < 8; i++) {
      doc
        .rect(
          initialXd + i * (boxWidthd + boxGapd),
          initialYd,
          boxWidth,
          boxWidth
        )
        .stroke();
    }

    doc.font("Helvetica").text("To");
    doc.moveDown(2);
    const boxWidthe = 18; // Width of each box
    const boxGape = 0; // Gap between boxes
    const initialXe = 300; // Adjust X position for alignment
    const initialYe = doc.y; // Current Y position

    // Draw 14 small boxes for input
    for (let i = 0; i < 8; i++) {
      doc
        .rect(
          initialXe + i * (boxWidthe + boxGape),
          initialYe,
          boxWidth,
          boxWidth
        )
        .stroke();
    }
    //10.
    doc
      .font("Helvetica")
      .text(
        "10. Contact Person of PU for Peer Reviw (along Mobile No. and Email id)__________________________________________________________________________  _____________________________________ "
      );
    doc.moveDown(2);

    //Add New Page
    doc.addPage();

    doc
      .font("Helvetica")
      .text(
        "11. Particulars about the constitution of the PU during the period under review (as per Form 18 filled with the ICAI). Is there assurance service like Statutory audit, tax audit, Taxation etc. headed by different partners, if yes details to be provided in the below table:"
      );
    doc.moveDown(2);

    // Table Headers
    const tableHeaders = [
      "Name of sole-practitioner/ sole-proprietor/ partner",
      "Membership no. of sole-practitioner/ sole-proprietor/ partner",
      "Association with Practice unit (In years)",
      "Any Post Qualification or Certificate course pursued within or outside ICAI.",
      "Professional experience in practice",
      "Predominant function (e.g. audit, tax, consulting)",
      "Details of Changes",
    ];

    // Table Data (4 rows including header)
    const dataRow = [
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
    ];

    // Adjust table width and column distribution
    const colWidth = [50, 50, 50, 50, 50, 50, 50]; // 7 columns
    const tableWidt = colWidth.reduce((a, b) => a + b, 0);
    const startXa = (doc.page.width - tableWidt) / 2;
    let startYb = doc.y;

    // Draw Table Header
    doc.font("Helvetica");
    let xPosa = startXa;
    tableHeaders.forEach((header, i) => {
      doc.rect(xPosa, startYb, colWidth[i], 190).stroke();
      doc.text(header, xPosa + 5, startYb + 5, { width: colWidth[i] - 10 });
      xPosa += colWidth[i];
    });
    startYb += 190;

    // Draw Table Data
    doc.font("Helvetica");
    dataRow.forEach((row) => {
      let xPosa = startXa;
      row.forEach((text, i) => {
        doc.rect(xPosa, startYb, colWidth[i], 30).stroke();
        doc.text(text, xPosa + 5, startYb + 5, { width: colWidth[i] - 10 });
        xPosa += colWidth[i];
      });
      startYb += 30;
    });

    doc.moveDown(4);
    doc
      .font("Helvetica")
      .text(
        "12. Particulars of Chartered Accountants Employed / Paid Assistant or Consultants as on <______>:(last date of block period of peer review)",
        doc.page.margins.left,
        doc.y
      );

    doc.moveDown(1);
    // Table Headers
    const columnTitles = [
      "Name (s)",
      "Membership no.",
      "Association with Practice unit (In years)",
      "Experience (In years)",
    ];

    // Table Data (4 rows including header)
    const rowDataa = [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ];

    // Adjust table width and column distribution
    const columnWidthx = [90, 90, 90, 90]; // 4 columns
    const totalTableWidthy = columnWidthx.reduce((a, b) => a + b, 0);
    const initialXPositionz = (doc.page.width - totalTableWidthy) / 2;
    let initialYPositiona = doc.y;

    // Draw Table Header
    doc.font("Helvetica");
    let currentXPositionX = initialXPositionz;
    columnTitles.forEach((header, i) => {
      doc
        .rect(currentXPositionX, initialYPositiona, columnWidthx[i], 150)
        .stroke();
      doc.text(header, currentXPositionX + 5, initialYPositiona + 5, {
        width: columnWidthx[i] - 10,
      });
      currentXPositionX += columnWidthx[i];
    });
    initialYPositiona += 50;

    // Draw Table Data
    doc.font("Helvetica");
    rowDataa.forEach((row) => {
      let currentXPositionX = initialXPositionz;
      row.forEach((text, i) => {
        doc
          .rect(currentXPositionX, initialYPositiona, columnWidthx[i], 30)
          .stroke();
        doc.text(text, currentXPositionX + 4, initialYPositiona + 4, {
          width: columnWidthx[i] - 10,
        });
        currentXPositionX += columnWidthx[i];
      });
      initialYPositiona += 50;
    });
    doc.moveDown(3);

    doc
      .font("Helvetica")
      .text(
        "13.Details of Other Employees as on <______>:(last date of block period of peer review)",
        doc.page.margins.left,
        doc.y
      );

    // Table Headers
    const tableTitles = ["Particulars", "Number"];

    // Table Data (4 rows including header)
    const rows = [
      ["(a) Semi-Qualified Assistants", ""],
      ["(b) Articled Assistants", ""],
      ["(c) Administrative Staff", ""],
      ["(d) Others", ""],
    ];

    // Adjust table width and column distribution
    const columnSizes = [150, 150]; // 2 columns
    const totalWidth = columnSizes.reduce((a, b) => a + b, 0);
    const startXx = (doc.page.width - totalWidth) / 2;
    let startYy = doc.y;

    // Draw Table Header
    doc.font("Helvetica");
    let posX = startXx;
    tableTitles.forEach((header, i) => {
      doc.rect(posX, startYy, columnSizes[i], 30).stroke();
      doc.text(header, posX + 5, startYy + 5, { width: columnSizes[i] - 10 });
      posX += columnSizes[i];
    });
    startYy += 30;

    // Draw Table Data
    doc.font("Helvetica");
    rows.forEach((row) => {
      let posX = startXx;
      row.forEach((text, i) => {
        doc.rect(posX, startYy, columnSizes[i], 30).stroke();
        doc.text(text, posX + 5, startYy + 5, { width: columnSizes[i] - 10 });
        posX += columnSizes[i];
      });
      startYy += 30;
    });

    //Add New Page
    doc.addPage();

    doc
      .font("Helvetica")
      .text(
        "14.If the PU has any branch offices, furnish the following details of member in charge and number of staff:)",
        doc.page.margins.left,
        doc.y
      );
    doc.moveDown(1);

    // Table Headers
    const tableColumns = [
      "S.No",
      "Member In Charge",
      "No. of Staff",
      "Membership No",
      "Address",
      "Whether assurance services rendered",
    ];

    // Table Data (3 rows including header)
    const tableRows = [
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
    ];

    // Adjust table width and column distribution
    const columnWidths = [30, 80, 80, 80, 80, 80]; // 6 columns
    const totalTableWidth = columnWidths.reduce((a, b) => a + b, 0);
    const startXPosition = (doc.page.width - totalTableWidth) / 2;
    let startYPosition = doc.y;

    // Draw Table Header
    doc.font("Helvetica").fontSize(10);
    let currentX = startXPosition;
    const headerHeight = 60; // Increased header height
    tableColumns.forEach((header, i) => {
      doc
        .rect(currentX, startYPosition, columnWidths[i], headerHeight)
        .stroke();
      doc.text(header, currentX + 5, startYPosition + 12, {
        width: columnWidths[i] - 10,
      });
      currentX += columnWidths[i];
    });
    startYPosition += headerHeight;

    // Draw Table Data
    doc.font("Helvetica").fontSize(9);
    const rowHeight = 35; // Increased row height
    tableRows.forEach((row) => {
      let currentX = startXPosition;
      row.forEach((text, i) => {
        doc.rect(currentX, startYPosition, columnWidths[i], rowHeight).stroke();
        doc.text(text, currentX + 4, startYPosition + 10, {
          width: columnWidths[i] - 10,
        });
        currentX += columnWidths[i];
      });
      startYPosition += rowHeight;
    });

    doc.moveDown(4);

    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        "15.(i) How is the control procedure followed by the Branch/es?",
        doc.page.margins.left,
        doc.y
      )
      .text(
        "(ii) And whether any periodic sample testing of clients handled by Branch/es is done by HO?",
        doc.page.margins.left,
        doc.y + 20
      );
    doc.moveDown(2);

    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        "16. Gross receipts of the Practice Unit [both H.O. and branch(es)] as per books of accounts from assurance functions for the period under review. In case of ",
        doc.page.margins.left,
        doc.y,
        { continued: true }
      )
      .font("Helvetica-Bold")
      .text("centralized billing the branch turnover may be added with HO", {
        continued: true,
      })
      .font("Helvetica")
      .text(", otherwise separate figures (Rs. in Lakhs) to be given:");

    doc.moveDown(1);

    // Table Headers
    const headerss = [
      "Financial Year",
      "Head Office",
      "Branch--",
      "Branch--",
      "Branch--",
    ];
    const rowss = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];

    const columnWidthss = [100, 80, 80, 80, 80];
    const totalWidthh = columnWidthss.reduce((a, b) => a + b, 0);
    const startXX = (doc.page.width - totalWidthh) / 2;
    let startYY = doc.y;

    // Draw Table Headers

    doc.font("Helvetica-Bold").fontSize(10);
    let currentXX = startXX;
    headerss.forEach((header, i) => {
      doc.rect(currentXX, startYY, columnWidthss[i], 30).stroke();
      doc.text(header, currentXX + 5, startYY + 10, {
        width: columnWidthss[i] - 10,
        align: "center",
      });
      currentXX += columnWidthss[i];
    });
    startYY += 30;

    // Draw Table Rows
    doc.font("Helvetica").fontSize(9);
    rowss.forEach((row) => {
      let currentXX = startXX;
      row.forEach((text, i) => {
        doc.rect(currentXX, startYY, columnWidthss[i], 30).stroke();
        doc.text(text, currentXX + 5, startYY + 10, {
          width: columnWidthss[i] - 10,
          align: "center",
        });
        currentXX += columnWidthss[i];
      });
      startYY += 30;
    });

    doc.moveDown(4);
    doc.fontSize(14).text("OR", doc.page.width / 2 - 10, doc.y);
    doc.moveDown(2);

    doc.text(
      "Total Gross receipts of the Practice Unit [both H.O. and branch(es)] as per books of accounts for the period under review. In case of centralized billing the branch turnover may be added with HO otherwise separate figures (Rs. in Lakhs) to be given.",
      doc.page.margins.left
    );

    doc.moveDown(2);

    // // Repeat the same table
    // doc.moveDown(1);

    // // Table Headers
    // const headerTitles = [
    //   "Financial Year",
    //   "Head Office",
    //   "Branch 1",
    //   "Branch 2",
    //   "Branch 3",
    // ];

    // const dataRowsy = [
    //   ["", "", "", "", ""],
    //   ["", "", "", "", ""],
    //   ["", "", "", "", ""],
    // ];

    // const columnSizesy = [100, 80, 80, 80, 80]; // Increased width for proper spacing
    // const totalTableWidthx = columnSizesy.reduce((a, b) => a + b, 0);
    // const pageWidth = doc.page.width;
    // //const marginX = 50; // Margin for better layout

    // const initialXy = (pageWidth - totalTableWidthx) / 2; // Center table
    // let initialYy = doc.y; // Add some space from the previous content

    // // Draw Table Headers
    // doc.font("Helvetica-Bold").fontSize(10);
    // let positionXy = initialXy;
    // headerTitles.forEach((header, i) => {
    //   doc.rect(positionXy, initialYy, columnSizesy[i], 30).stroke();
    //   doc.text(header, positionXy + 5, initialYy + 10, {
    //     width: columnSizesy[i] - 10,
    //     align: "center",
    //   });
    //   positionXy += columnSizesy[i];
    // });
    // initialYy += 30; // Move Y position down after headers

    // // Draw Table Rows
    // doc.font("Helvetica").fontSize(9);
    // dataRowsy.forEach((row) => {
    //   let positionXy = initialXy; // Reset positionX for each row
    //   row.forEach((text, i) => {
    //     doc.rect(positionXy, initialYy, columnSizesy[i], 30).stroke();
    //     doc.text(text, positionXy + 5, initialYy + 10, {
    //       width: columnSizesy[i] - 10,
    //       align: "center",
    //     });
    //     positionXy += columnSizesy[i];
    //   });
    //   initialYy += 30; // Move Y position down for the next row
    // });
    doc.moveDown(1);
    doc.addPage();

    doc
      .font("Helvetica")
      .text("17. ", { continued: true }) // Keeps text on the same line
      .font("Helvetica-Bold") // Set font to bold
      .text("Concentration: ", { continued: true }) // Keeps text bold
      .font("Helvetica") // Switch back to regular font
      .text(
        "Furnish details where professional fees from any client exceed 15% of the PU’s total gross receipts:",
        doc.page.margins.left
      );
    doc.moveDown(1);

    // Define Table Headers
    const clientTableHeaders = [
      "Name or Code Number of the Client",
      "Types of Services (Assurance / Non-Assurance)",
      "% of PU’s Total Gross Receipts",
      "Financial Year",
    ];

    const clientTableData = [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ];

    const columnSizesc = [100, 100, 100, 100]; // Adjusted column widths
    const totalTableWidthc = columnSizesc.reduce(
      (sum, width) => sum + width,
      0
    );
    const tableStartX = (doc.page.width - totalTableWidthc) / 2;
    let tableStartY = doc.y;

    // Draw Table Headers
    doc.font("Helvetica-Bold").fontSize(10);
    let currentXPosition = tableStartX;
    clientTableHeaders.forEach((headerText, index) => {
      doc.rect(currentXPosition, tableStartY, columnSizesc[index], 50).stroke();
      doc.text(headerText, currentXPosition + 5, tableStartY + 10, {
        width: columnSizesc[index] - 10,
        align: "center",
      });
      currentXPosition += columnSizesc[index];
    });
    tableStartY += 50;

    // Draw Table Rows
    doc.font("Helvetica").fontSize(9);
    clientTableData.forEach((row) => {
      let currentXPosition = tableStartX;
      row.forEach((cellText, index) => {
        doc
          .rect(currentXPosition, tableStartY, columnSizesc[index], 30)
          .stroke();
        doc.text(cellText, currentXPosition + 5, tableStartY + 10, {
          width: columnSizesc[index] - 10,
          align: "center",
        });
        currentXPosition += columnSizesc[index];
      });
      tableStartY += 30;
    });
    doc.moveDown(4);

    doc
      .font("Helvetica")
      .fontSize(12) // Increased font size
      .text(
        "18. Whether PU has ever undertaken self-evaluation as per ‘Digital Competency Maturity Model-2? ___________________________If yes, when_____________?",
        doc.page.margins.left,
        doc.y
      );
    doc.moveDown(1);

    doc
      .font("Helvetica")
      .text(
        "19. Has the PU been subjected to a Peer Review in the past? ___________. If yes, the Certificate number issued by the Board_____________________.",
        doc.page.margins.left,
        doc.y
      );
    doc.moveDown(1);

    doc
      .font("Helvetica")
      .text(
        "20. Whether any Partner/Employee of Practice Unit has been found guilty by the Disciplinary Committee in the past 3 years in any capacity.",
        doc.page.margins.left,
        doc.y
      );
    doc.moveDown(1);

    // Define Table Headers
    const tableHeaderse = [
      "Name of Partner/Employee",
      "Membership No",
      "Case No.",
      "Whether found guilty YES/NO",
    ];

    // Define Table Data (3 Rows)
    const tableRowse = [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ];

    // Define Column Widths
    const columnSizese = [130, 100, 100, 130]; // Adjusted column widths
    const totalTableWidthe = columnSizese.reduce((a, b) => a + b, 0);
    const tableStartXe = (doc.page.width - totalTableWidthe) / 2;
    let tableStartYe = doc.y;

    // Draw Table Headers
    doc.font("Helvetica-Bold").fontSize(10);
    let colPositionX = tableStartXe;
    tableHeaderse.forEach((header, i) => {
      doc.rect(colPositionX, tableStartYe, columnSizese[i], 50).stroke();
      doc.text(header, colPositionX + 5, tableStartYe + 10, {
        width: columnSizese[i] - 10,
        align: "center",
      });
      colPositionX += columnSizese[i];
    });
    tableStartYe += 50;

    // Draw Table Rows
    doc.font("Helvetica").fontSize(9);
    tableRowse.forEach((row) => {
      let colPositionX = tableStartXe;
      row.forEach((text, i) => {
        doc.rect(colPositionX, tableStartYe, columnSizese[i], 30).stroke();
        doc.text(text, colPositionX + 5, tableStartYe + 10, {
          width: columnSizese[i] - 10,
          align: "center",
        });
        colPositionX += columnSizese[i];
      });
      tableStartYe += 30;
    });
    doc.moveDown(4);

    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        "21. Whether any client obtained through the process of tendering?____________________",
        doc.page.margins.left,
        doc.y
      );
    doc.moveDown(1);

    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        "22. Please provide details of assurance clients where report/certificate has been ",
        doc.page.margins.left,
        doc.y,
        { continued: true } // ✅ Corrected "continue: true" to "continued: true"
      )
      .font("Helvetica-Bold")
      .text("signed during the period under review", { continued: true }) // ✅ Correct continued usage
      .underline(doc.page.margins.left, doc.y, 300, 12) // ✅ Added underline effect
      .font("Helvetica")
      .text(
        " financial year wise and branch wise as per Annexure A (Please use additional sheet for year-wise details)"
      );

    doc.moveDown(1);
    //add new page
    doc.addPage();

    // Add content to the PDF
    doc.fontSize(12).text("ANNEXURE A", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(10)
      .text(
        "Note: The clients obtained through tender may please be marked with the word tender in bracket.",
        { align: "left" }
      );
    doc.moveDown();

    // Add content to the PDF
    doc.fontSize(12).text("ANNEXURE A", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(10)
      .text(
        "Note: The clients obtained through tender may please be marked with the word tender in bracket.",
        { align: "left" }
      );
    doc.moveDown();

    // Define the table structure
    const table = {
      headers: [
        "Sr. No.",
        "Category of Client (Name or code of client)",
        "Name of Branch/HO of PU",
        "Name of Signing Partner",
        "Type of Engagement*",
        "Whether Engagement Quality review done?",
        "Turn over Rs. Lakhs",
        "Borrowing Rs. Lakhs",
        "Net worth Rs. Lakhs",
      ],
      rows: [
        ["A", "Any Bank or Insurance Company", "", "", "", "", "", "", ""],
        ["A1", "", "", "", "", "", "", "", ""],
        ["A2", "", "", "", "", "", "", "", ""],
        ["A3", "", "", "", "", "", "", "", ""],
        [
          "B",
          "Non Banking Financial Companies having public deposits of Rs.100 crore or above.",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["B1", "", "", "", "", "", "", "", ""],
        ["B2", "", "", "", "", "", "", "", ""],
        ["B3", "", "", "", "", "", "", "", ""],
        [
          "C",
          "Central or State Public Sector Undertakings and Central Cooperative Societies having turnover exceeding Rs.250 crore or net worth exceeding Rs.5 crores.",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["C1", "", "", "", "", "", "", "", ""],
        ["C2", "", "", "", "", "", "", "", ""],
        ["C3", "", "", "", "", "", "", "", ""],
        [
          "D",
          "Enterprise which is listed in India or Abroad as defined under SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015.",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["D1", "", "", "", "", "", "", "", ""],
        ["D2", "", "", "", "", "", "", "", ""],
        ["D3", "", "", "", "", "", "", "", ""],
        [
          "E",
          "Asset Management Companies or Mutual Funds.",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["E1", "", "", "", "", "", "", "", ""],
        ["E2", "", "", "", "", "", "", "", ""],
        ["E3", "", "", "", "", "", "", "", ""],
        [
          "F",
          "Entities preparing the financial statements as per Ind AS.",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["F1", "", "", "", "", "", "", "", ""],
        ["F2", "", "", "", "", "", "", "", ""],
        ["F3", "", "", "", "", "", "", "", ""],
        [
          "G",
          "Any Body corporate including trusts which are covered under public interest entities.",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
      ],
    };

    // Function to draw the table with lines
    function drawTable(doc, table) {
      const initialY = doc.y;
      const columnWidth = (doc.page.width - 100) / table.headers.length;
      const rowHeight = 20;

      // Draw headers
      table.headers.forEach((header, i) => {
        doc.text(header, 50 + i * columnWidth, initialY, {
          width: columnWidth,
          align: "left",
        });
      });

      // Draw horizontal lines for headers
      doc
        .moveTo(50, initialY + 15)
        .lineTo(doc.page.width - 50, initialY + 15)
        .stroke();

      // Draw rows
      table.rows.forEach((row, rowIndex) => {
        const y = initialY + (rowIndex + 1) * rowHeight;
        row.forEach((cell, cellIndex) => {
          doc.text(cell, 50 + cellIndex * columnWidth, y, {
            width: columnWidth,
            align: "left",
          });
        });

        // Draw horizontal lines for rows
        doc
          .moveTo(50, y + 15)
          .lineTo(doc.page.width - 50, y + 15)
          .stroke();
      });

      // Draw vertical lines for columns
      for (let i = 0; i <= table.headers.length; i++) {
        const x = 50 + i * columnWidth;
        doc
          .moveTo(x, initialY)
          .lineTo(x, initialY + (table.rows.length + 1) * rowHeight)
          .stroke();
      }
    }

    // Draw the table
    drawTable(doc, table);

    //Add New Page
    doc.addPage();

    doc.moveDown(4);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(
        "*Type of engagement (1) Central Statutory Audit (CSA), (2) Statutory Audit (SA), (3) Tax Audit (TA), (4) Internal Audit (IA), (5) Others (Concurrent, GST, certification work etc.)",
        doc.page.margins.left
      );

    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(12).text("Note:", { align: "left" });

    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        "Type of assurance service engagements include Central Statutory Audit, Statutory Audit, Tax Audit, GST Audit, Internal Audit, Certification work but does not include:",
        { align: "left" }
      );

    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text("(i) Management consultancy engagements;", { indent: 20 });
    doc.moveDown(0.5);
    doc.fontSize(12).text("(ii) Representation before various authorities;", {
      indent: 20,
    });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(
        "(iii) Engagements to prepare tax return or advising clients in taxation matters;",
        {
          indent: 20,
        }
      );
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text("(iv) Engagements for the compilation of financial statements;", {
        indent: 20,
      });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(
        "(v) Engagements solely to assist the client in preparing, compiling, or collating information other than financial statements;",
        {
          indent: 20,
        }
      );
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text("(vi) Testifying as an expert witness;", { indent: 20 });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(
        "(vii) Providing expert opinion on points of principle, such as Accounting Standards or the applicability of certain laws based on facts provided by the client;",
        {
          indent: 20,
        }
      );
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text("(viii) Engagements for due diligence.", { indent: 20 });

    // ===== HEADER =====

    //const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    //Add New Page
    doc.addPage();

    // Header
    doc
      .fontSize(16) // Slightly larger for PART B
      .font("Helvetica-Bold")
      .text("PART B", {
        align: "center",
        width: contentWidth,
      });

    doc
      .fontSize(14) // Slightly smaller for General Controls
      .text("GENERAL CONTROLS (Based on SQC 1)", {
        align: "center",
        width: contentWidth,
      });

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("(Not applicable for New Units)", {
        align: "center",
        width: contentWidth,
      });
    doc.moveDown(1);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        "The Standard on Quality Control i.e. SQC-1 has been made mandatory by ICAI on and from 1st April 2009. Hence, the PU is required to establish a system of ‘Quality Control’, designed to provide reasonable assurance that the PU and its personnel comply with professional standards; regulatory, legal and ethical requirements.",
        { align: "justify", width: contentWidth }
      );
    doc.moveDown(1);

    doc.text(
      "Broadly, PU system of quality control should include policies and procedures addressing leadership responsibility, ethical requirements, acceptance and continuance of client relationship, Human Resources, Engagement Performance and Monitoring etc.",
      { align: "justify", width: contentWidth }
    );
    doc.moveDown(1);

    // Notes Section
    doc.font("Helvetica-Bold").text("Notes:", { align: "left" });
    // doc.moveDown(1);
    doc
      .font("Helvetica")
      .text(
        "i) The application of SQC-1 will depend on various factors such as the size and operating characteristics of the PU and whether it is part of network.",
        { align: "justify", width: contentWidth }
      );
    doc.moveDown(3);

    doc.text(
      "ii) Refer to implementation Guide to SQC1: https://resource.cdn.icai.org/20913frpubcd_aasb1.pdf",
      {
        align: "justify",
        width: contentWidth,
        link: "https://resource.cdn.icai.org/20913frpubcd_aasb1.pdf",
        underline: true,
      }
    );
    doc.moveDown(6);

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("PART B (1)", { align: "center", width: contentWidth });
    doc.moveDown(1);
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("LEADERSHIP RESPONSIBILITIES FOR QUALITY WITHIN THE FIRM", {
        align: "center",
      });
    //doc.moveDown(2);

    // TABLE CONFIGURATION
    const generateTable = (headers, data, startY) => {
      const pageWidth = doc.page.width;
      const tableWidth = 600;
      const startX = (pageWidth - tableWidth) / 2;
      const colWidths = [50, 220, 150, 60, 60];
      let yPosition = startY;

      doc.lineWidth(1);

      // Draw Headers
      doc.font("Helvetica-Bold");
      let xPos = startX;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition, colWidths[index], 25).stroke(); // Increased header height
        doc.text(header, xPos + 8, yPosition + 7, {
          // Adjusted text padding
          width: colWidths[index] - 16,
          align: "center",
        });
        xPos += colWidths[index];
      });
      yPosition += 25; // Increased spacing after headers

      // Draw Data Rows
      doc.font("Helvetica");
      data.forEach((row, rowIndex) => {
        let xPos = startX;
        doc.rect(xPos, yPosition, colWidths[0], 25).stroke();
        doc.text((rowIndex + 1).toString(), xPos + 8, yPosition + 7, {
          width: colWidths[0] - 16,
          align: "center",
        });
        xPos += colWidths[0];

        row.forEach((text, index) => {
          doc.rect(xPos, yPosition, colWidths[index + 1], 25).stroke();
          doc.text(text, xPos + 8, yPosition + 7, {
            width: colWidths[index + 1] - 16,
          });
          xPos += colWidths[index + 1];
        });
        yPosition += 25; // Adjusted row spacing
      });
      return yPosition;
    };

    //  // New Page
    //  doc.addPage();

    // Table Headers
    const headersA = [
      "S.No 12.",
      "Policies and procedures",
      "Remark/Yes/No/Na",
    ];
    const dataRowsA = [
      ["1", "Does the PU have a Quality Control Manual in place?", ""],
      [
        "2",
        "Whom has the firm entrusted with the responsibility for developing, implementing, and operating the Firm’s QC system?",
        "",
      ],
      [
        "3",
        "Who is ultimately responsible for ensuring the effectiveness of the firm’s System of QC and setting a tone that emphasizes the importance of quality?",
        "",
      ],
    ];

    const tableWidth1 = 400;
    const colWidthsA = [40, 200, 180];
    const startXA = (doc.page.width - tableWidth1) / 2;
    let startYA = doc.y;

    doc.font("Helvetica");
    let xPosA = startXA;
    headersA.forEach((header, i) => {
      doc.rect(xPosA, startYA, colWidthsA[i], 100).stroke();
      doc.text(header, xPosA + 5, startYA + 5, { width: colWidthsA[i] - 10 });
      xPos += colWidthsA[i];
    });
    startY += 50;

    doc.font("Helvetica");
    dataRowsA.forEach((row) => {
      let xPos = startX;
      row.forEach((text, i) => {
        doc.rect(xPos, startY, colWidths[i], 72).stroke();
        doc.text(text, xPos + 5, startY + 5, { width: colWidths[i] - 10 });
        xPos += colWidths[i];
      });
      startY += 72;
    });

    // doc.fontSize(4).font("Helvetica-Bold").text("13", );

    // New Page
    doc.addPage();

    // 222
    // TABLE CONFIGURATION
    const drawTable2 = (doc, headers, data, startY2) => {
      const tableWidth = 400;
      const colWidths = [40, 200, 200]; // Adjusted column widths for proper spacing
      const startX2 = (doc.page.width - tableWidth) / 2;
      let yPosition = startY2;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPos = startX2;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition, colWidths[index], 30).stroke();
        doc.text(header, xPos + 5, yPosition + 10, {
          width: colWidths[index] - 10,
        });
        xPos += colWidths[index];
      });
      yPosition += 30;

      // Draw Data Rows
      doc.font("Helvetica");
      data.forEach((row, rowIndex) => {
        let xPos = startX2;
        row.forEach((text, index) => {
          doc.rect(xPos, yPosition, colWidths[index], 65).stroke();
          doc.text(text, xPos + 5, yPosition + 8, {
            width: colWidths[index] - 10,
          });
          xPos += colWidths[index];
        });
        yPosition += 65;
      });

      return yPosition;
    };

    // Table Headers
    const headers2 = [
      "S.No. 13",
      "Policies and procedures",
      "Remark/Yes/No/Na",
    ];
    const dataRows2 = [
      [
        "1",
        "Whether the same has been formally documented and agreed upon by partners?",
        "",
      ],
      [
        "2",
        "Whom has the firm entrusted with the responsibility for developing, implementing, and operating the Firm’s QC system?",
        "",
      ],
      [
        "3",
        "Who is ultimately responsible for ensuring the firm’s System of QC and setting a tone that emphasizes the importance of quality?",
        "",
      ],
      [
        "4",
        "Are the policies and procedures regularly reviewed and updated?",
        "",
      ],
      [
        "5",
        "Does the firm have a process for monitoring compliance with its quality control policies?",
        "",
      ],
      [
        "6",
        "How does the firm ensure proper documentation of its quality control system?",
        "",
      ],
      ["7", "Is there a dedicated team for quality assurance?", ""],
      ["8", "Does the firm conduct internal audits for quality control?", ""],
      [
        "9",
        "Are corrective actions taken when deficiencies in the quality control system are identified?",
        "",
      ],
    ];

    // Set the starting Y position for the table
    let startY2 = doc.y || 700; // Default to 100 if doc.y is undefined

    // Draw the table
    startY2 = drawTable2(doc, headers2, dataRows2, startY2);

    // New Page
    doc.addPage();

    // 3 page
    // TABLE CONFIGURATION
    const drawTable3 = (doc, headers, data, startY3) => {
      const tableWidth = 400;
      const colWidths = [40, 200, 200]; // Adjusted column widths for proper spacing
      const startX3 = (doc.page.width - tableWidth) / 2;
      let yPosition = startY3;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPos = startX3;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition, colWidths[index], 30).stroke();
        doc.text(header, xPos + 5, yPosition + 10, {
          width: colWidths[index] - 10,
        });
        xPos += colWidths[index];
      });
      yPosition += 30;

      // Draw Data Rows
      doc.font("Helvetica");
      data.forEach((row, rowIndex) => {
        let xPos = startX3;
        row.forEach((text, index) => {
          doc.rect(xPos, yPosition, colWidths[index], 45).stroke();
          doc.text(text, xPos + 5, yPosition + 8, {
            width: colWidths[index] - 10,
          });
          xPos += colWidths[index];
        });
        yPosition += 45;
      });

      return yPosition;
    };

    // Table Headers
    const headers3 = ["S.No.", "Policies and procedures", "Remark/Yes/No/Na"];
    const dataRows3 = [
      [
        "",
        "developing, implementing and ---maintaining Firm’s QC policies and procedures:?",
        "",
      ],
      ["(i)", "Manpower", ""],
      ["(ii)", "IT tools", ""],
      ["(iii)", "Library", ""],
      ["(iv)", "Regular review mechanism etc.", ""],
    ];

    // Set the starting Y position for the table
    let startY3 = doc.y || 700; // Default to 100 if doc.y is undefined

    // Draw the table
    startY3 = drawTable3(doc, headers3, dataRows3, startY3);
    doc.moveDown(5);

    // Header
    doc.fontSize(14).font("Helvetica-Bold").text("PART B (II)");
    doc.fontSize(12).font("Helvetica-Bold").text("ETHICAL REQUIREMENTS");
    // doc.moveDown(1);

    //////////////////
    // TABLE CONFIGURATION
    const drawTable32 = (doc, headers, data, startY2) => {
      const tableWidth = 400;
      const colWidths = [40, 200, 200]; // Adjusted column widths for proper spacing
      const startX32 = (doc.page.width - tableWidth) / 2;
      let yPosition = startY2; // Use the parameter startY2

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPos = startX32;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition, colWidths[index], 40).stroke(); // Corrected height
        doc.text(header, xPos + 5, yPosition + 10, {
          width: colWidths[index] - 10,
        });
        xPos += colWidths[index];
      });
      yPosition += 40; // Adjusted header row height

      // Draw Data Rows
      doc.font("Helvetica");
      data.forEach((row) => {
        let xPos = startX32;
        row.forEach((text, index) => {
          doc.rect(xPos, yPosition, colWidths[index], 29).stroke(); // Corrected row height
          doc.text(text, xPos + 7, yPosition + 10, {
            width: colWidths[index] - 10,
          });
          xPos += colWidths[index];
        });
        yPosition += 29; // Adjusted row height
      });

      return yPosition;
    };

    // Table Headers
    const headers32 = [
      "S.No. 14",
      "Policies and procedures",
      "Remark/Yes/No/Na",
    ];
    const dataRows32 = [
      [
        "1",
        "Whether the same has been formally documented and agreed upon by partners?",
        "",
      ],
      [
        "2",
        "Whom has the firm entrusted with the responsibility for developing, implementing, and operating the Firm’s QC system?",
        "",
      ],
      [
        "3",
        "Who is ultimately responsible for ensuring the firm’s System of QC and setting a tone that emphasizes the importance of quality?",
        "",
      ],
      [
        "4",
        "Are the policies and procedures regularly reviewed and updated?",
        "",
      ],
      [
        "5",
        "Does the firm have a process for monitoring compliance with its quality control policies?",
        "",
      ],
      [
        "6",
        "How does the firm ensure proper documentation of its quality control system?",
        "",
      ],
      ["7", "Is there a dedicated team for quality assurance?", ""],
      ["8", "Does the firm conduct internal audits for quality control?", ""],
      [
        "9",
        "Are corrective actions taken when deficiencies in the quality control system are identified?",
        "",
      ],
    ];

    // Set the starting Y position for the table
    let startY32 = doc.y || 100; // Default to 100 if doc.y is undefined

    // Draw the table
    startY32 = drawTable32(doc, headers32, dataRows32, startY32);

    // New Page
    doc.addPage();

    //  doc.fontSize(14).font("Helvetica-Bold").text("16", );

    // 333
    // TABLE CONFIGURATION
    const drawTable33 = (doc, headers, data, startY33) => {
      const tableWidth = 400;
      const colWidths = [40, 200, 200]; // Column widths
      const startX33 = (doc.page.width - tableWidth) / 2;
      let yPosition = startY33;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPos = startX33;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition, colWidths[index], 50).stroke(); // Increased header height
        doc.text(header, xPos + 5, yPosition + 15, {
          width: colWidths[index] - 10,
        });
        xPos += colWidths[index];
      });
      yPosition += 50; // Adjusted header row height

      // Draw Data Rows with dynamic height
      doc.font("Helvetica");
      data.forEach((row) => {
        let xPos = startX33;

        // Calculate row height dynamically based on text content
        let rowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: colWidths[index] - 10 })
            )
          ) + 15; // Add padding for spacing

        row.forEach((text, index) => {
          doc.rect(xPos, yPosition, colWidths[index], rowHeight).stroke();
          doc.text(text, xPos + 7, yPosition + 10, {
            width: colWidths[index] - 10,
          });
          xPos += colWidths[index];
        });

        yPosition += rowHeight; // Move down by the calculated row height
      });

      return yPosition;
    };

    // Table Headers
    const headers33 = [
      "S.No.15",
      "Policies and procedures",
      "Remark/Yes/No/Na",
    ];
    const dataRows33 = [
      [
        "1",
        "Whether the same has been formally documented and agreed upon by partners?",
        "",
      ],
      [
        "2",
        "Whom has the firm entrusted with the responsibility for developing, implementing, and operating the Firm’s QC system?",
        "",
      ],
      [
        "3",
        "Who is ultimately responsible for ensuring the firm’s System of QC and setting a tone that emphasizes the importance of quality?",
        "",
      ],
      [
        "4",
        "Are the policies and procedures regularly reviewed and updated?",
        "",
      ],
      [
        "5",
        "Does the firm have a process for monitoring compliance with its quality control policies?",
        "",
      ],
      [
        "6",
        "How does the firm ensure proper documentation of its quality control system?",
        "",
      ],
      ["7", "Is there a dedicated team for quality assurance?", ""],
      ["8", "Does the firm conduct internal audits for quality control?", ""],
      [
        "9",
        "Are corrective actions taken when deficiencies in the quality control system are identified?",
        "",
      ],
    ];

    // Set the starting Y position for the table
    let startY33 = doc.y || 100;

    // Draw the table
    startY33 = drawTable33(doc, headers33, dataRows33, startY33);

    // New Page
    doc.addPage();

    // 333
    // TABLE CONFIGURATION
    const drawTable34 = (doc, headers, data, startY34) => {
      const tableWidth = 400;
      const colWidths = [40, 200, 200]; // Column widths
      const startX34 = (doc.page.width - tableWidth) / 2;
      let yPosition = startY34;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPos = startX34;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition, colWidths[index], 50).stroke(); // Increased header height
        doc.text(header, xPos + 5, yPosition + 15, {
          width: colWidths[index] - 10,
        });
        xPos += colWidths[index];
      });
      yPosition += 50; // Adjusted header row height

      // Draw Data Rows with dynamic height
      doc.font("Helvetica");
      data.forEach((row) => {
        let xPos = startX34;

        // Calculate row height dynamically based on text content
        let rowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: colWidths[index] - 10 })
            )
          ) + 15; // Add padding for spacing

        row.forEach((text, index) => {
          doc.rect(xPos, yPosition, colWidths[index], rowHeight).stroke();
          doc.text(text, xPos + 7, yPosition + 10, {
            width: colWidths[index] - 10,
          });
          xPos += colWidths[index];
        });

        yPosition += rowHeight; // Move down by the calculated row height
      });

      return yPosition;
    };

    // Table Headers
    const headers34 = [
      "S.No.16",
      "Policies and procedures",
      "Remark/Yes/No/Na",
    ];
    const dataRows34 = [
      [
        "1",
        "Whether the same has been formally documented and agreed upon by partners?",
        "",
      ],
      [
        "2",
        "Whom has the firm entrusted with the responsibility for developing, implementing, and operating the Firm’s QC system?",
        "",
      ],
      [
        "3",
        "Who is ultimately responsible for ensuring the firm’s System of QC and setting a tone that emphasizes the importance of quality?",
        "",
      ],
      [
        "4",
        "Are the policies and procedures regularly reviewed and updated?",
        "",
      ],
      [
        "5",
        "Does the firm have a process for monitoring compliance with its quality control policies?",
        "",
      ],
      [
        "6",
        "How does the firm ensure proper documentation of its quality control system?",
        "",
      ],
      ["7", "Is there a dedicated team for quality assurance?", ""],
      ["8", "Does the firm conduct internal audits for quality control?", ""],
      [
        "9",
        "Are corrective actions taken when deficiencies in the quality control system are identified?",
        "",
      ],
    ];

    // Set the starting Y position for the table
    let startY34 = doc.y || 100;

    // Draw the table
    startY34 = drawTable34(doc, headers34, dataRows34, startY34);

    // New Page
    doc.addPage();

    //Table create
    const drawTable35 = (doc, headers, data, startY35) => {
      const tableWidth = 400;
      const colWidths = [40, 200, 200]; // Column widths
      const startX35 = (doc.page.width - tableWidth) / 2;
      let yPosition = startY35;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPos = startX35;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition, colWidths[index], 50).stroke();
        doc.text(header, xPos + 5, yPosition + 15, {
          width: colWidths[index] - 10,
        });
        xPos += colWidths[index];
      });
      yPosition += 50; // Adjusted header row height

      // Draw Data Rows
      doc.font("Helvetica");
      data.forEach((row, i) => {
        let xPos = startX35;

        // Calculate row height dynamically
        let rowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: colWidths[index] - 10 })
            )
          ) + 15; // Add padding

        row.forEach((text, index) => {
          doc.rect(xPos, yPosition, colWidths[index], rowHeight).stroke();
          doc.text(text, xPos + 7, yPosition + 10, {
            width: colWidths[index] - 10,
          });
          xPos += colWidths[index];
        });

        yPosition += rowHeight; // Move down
      });

      return yPosition;
    };

    // Table Headers
    const headers35 = [
      "S.No.17",
      "Policies and procedures",
      "Remark/Yes/No/Na",
    ];
    const dataRows35 = [
      [
        "1",
        "Whether the same has been formally documented and agreed upon by partners?",
        "",
      ],
      [
        "2",
        "Whom has the firm entrusted with the responsibility for developing, implementing, and operating the Firm’s QC system?",
        "",
      ],
      [
        "3",
        "Who is ultimately responsible for ensuring the firm’s System of QC and setting a tone that emphasizes the importance of quality?",
        "",
      ],
      [
        "4",
        "Are the policies and procedures regularly reviewed and updated?",
        "",
      ],
      [
        "5",
        "Does the firm have a process for monitoring compliance with its quality control policies?",
        "",
      ],
      [
        "6",
        "How does the firm ensure proper documentation of its quality control system?",
        "",
      ],
      ["7", "Is there a dedicated team for quality assurance?", ""],
      ["8", "Does the firm conduct internal audits for quality control?", ""],
      [
        "9",
        "Are corrective actions taken when deficiencies in the quality control system are identified?",
        "",
      ],
      ["10", "Does the firm have a formal risk management process?", ""],
      [
        "11",
        "How does the firm address non-compliance issues related to quality control?",
        "",
      ],
    ];

    // Set the starting Y position for the table
    let startY35 = doc.y || 100;

    // Draw the table
    startY35 = drawTable35(doc, headers35, dataRows35, startY35);

    // New Page
    doc.addPage();

    const drawTable36 = (doc, headers, data, startY36) => {
      const tableWidth = 400;
      const colWidths = [40, 200, 200]; // Column widths
      const startX36 = (doc.page.width - tableWidth) / 2;
      let yPosition = startY36;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPos = startX36;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition, colWidths[index], 24).stroke(); // Increased header height
        doc.text(header, xPos + 5, yPosition + 10, {
          width: colWidths[index] - 10,
          align: "center", // Center align header text
        });
        xPos += colWidths[index];
      });
      yPosition += 24; // Adjusted header row height

      // Draw Data Rows
      doc.font("Helvetica");
      data.forEach((row) => {
        let xPos = startX36;

        // **Calculate max row height for text wrapping**
        let rowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: colWidths[index] - 5 })
            )
          ) + 7; // Add padding

        row.forEach((text, index) => {
          doc.rect(xPos, yPosition, colWidths[index], rowHeight).stroke();
          doc.text(text, xPos + 3, yPosition + 5, {
            width: colWidths[index] - 5,
            align: "left", // Align text properly
          });
          xPos += colWidths[index];
        });

        yPosition += rowHeight; // Move down
      });

      return yPosition;
    };

    // Table Headers
    const headers36 = [
      "S.No.",
      " 18 Policies and procedures",
      "Remark/Yes/No/Na",
    ];
    const dataRows36 = [
      [
        "8(i)",
        "Has the PU received fees from a client below the minimum scale of fees recommended for audit assignments by the ICAI? ",
        "",
      ],
      [
        "8(ii)",
        "If yes, reason for accepting fee below recommended scales",
        "",
      ],
      [
        "9(i)",
        "Has the PU, being statutory auditor of a client rendered any services to the same client, as mentioned in section 144 of Companies Act 2013",
        "",
      ],
      [
        "9(ii)",
        "(if yes, specify reason with name of the entities and year in which such service was rendered)",
        "",
      ],
      [
        "10(i)",
        "Has the PU, as incoming auditor for an entity, followed the direction given by the ICAI not to accept an appointment as auditor in the case of unjustified removal of earlier auditor?",
        "",
      ],
      ["10(ii)", "If no, reasons for non-adherence to the direction", ""],
      [
        "11(i)",
        "Does the PU or a Network, as a good and healthy practice, make a disclosure of the payment received by it for other services through the medium of a different firm or firms in which the said PU or Network or its partners may have an ownership interest. ",
        "",
      ],
      ["11.(ii)", "(If no, specify reasons)", ""],
      [
        "12",
        "Has the PU followed the Guidelines issued by the ICAI in respect of engagement/(s)procured through Tender?",
        "",
      ],
      [
        "13",
        "Is the website of the PU in conformity with Institute's guidelines/ directions issued on posting of particulars on website by Practice Unit(s)?",
        "",
      ],
    ];

    // Set the starting Y position for the table
    let startY36 = doc.y || 100;

    // Draw the table
    startY36 = drawTable36(doc, headers36, dataRows36, startY36);

    // New Page
    doc.addPage();

    const drawTable37 = (doc, headers, data, startY37) => {
      const tableWidth = 400;
      const colWidths = [40, 200, 200]; // Column widths
      const startX37 = (doc.page.width - tableWidth) / 2;
      let yPosition = startY37;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPos = startX37;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition, colWidths[index], 24).stroke(); // Increased header height
        doc.text(header, xPos + 5, yPosition + 10, {
          width: colWidths[index] - 10,
          align: "center", // Center align header text
        });
        xPos += colWidths[index];
      });
      yPosition += 24; // Adjusted header row height

      // Draw Data Rows
      doc.font("Helvetica");
      data.forEach((row) => {
        let xPos = startX37;

        // **Calculate max row height for text wrapping**
        let rowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: colWidths[index] - 5 })
            )
          ) + 7; // Add padding

        row.forEach((text, index) => {
          doc.rect(xPos, yPosition, colWidths[index], rowHeight).stroke();
          doc.text(text, xPos + 3, yPosition + 5, {
            width: colWidths[index] - 5,
            align: "left", // Align text properly
          });
          xPos += colWidths[index];
        });

        yPosition += rowHeight; // Move down
      });

      return yPosition;
    };

    // Table Headers
    const headers37 = [
      "S.No.",
      " 18 Policies and procedures",
      "Remark/Yes/No/Na",
    ];
    const dataRows37 = [
      [
        "8(i)",
        "Has the PU received fees from a client below the minimum scale of fees recommended for audit assignments by the ICAI? ",
        "",
      ],
      [
        "8(ii)",
        "If yes, reason for accepting fee below recommended scales",
        "",
      ],
      [
        "9(i)",
        "Has the PU, being statutory auditor of a client rendered any services to the same client, as mentioned in section 144 of Companies Act 2013",
        "",
      ],
      [
        "9(ii)",
        "(if yes, specify reason with name of the entities and year in which such service was rendered)",
        "",
      ],
      [
        "10(i)",
        "Has the PU, as incoming auditor for an entity, followed the direction given by the ICAI not to accept an appointment as auditor in the case of unjustified removal of earlier auditor?",
        "",
      ],
      ["10(ii)", "If no, reasons for non-adherence to the direction", ""],
      [
        "11(i)",
        "Does the PU or a Network, as a good and healthy practice, make a disclosure of the payment received by it for other services through the medium of a different firm or firms in which the said PU or Network or its partners may have an ownership interest. ",
        "",
      ],
      ["11.(ii)", "(If no, specify reasons)", ""],
      [
        "12",
        "Has the PU followed the Guidelines issued by the ICAI in respect of engagement/(s)procured through Tender?",
        "",
      ],
      [
        "13",
        "Is the website of the PU in conformity with Institute's guidelines/ directions issued on posting of particulars on website by Practice Unit(s)?",
        "",
      ],
    ];

    // Set the starting Y position for the table
    let startY37 = doc.y || 100;

    //doc.addPage();
    // Create first table with 3 columns and 7 rows
    const firstTable = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    doc.moveDown(1);

    // Table headers for the first table
    firstTable.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        doc.text(cell, 50 + cellIndex * 150, 100 + rowIndex * 30, {
          width: 140,
          align: "center",
        });
      });
    });

    // Add second table with 4 columns and 4 rows (e.g., a smaller table)
    const secondTable = [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ];

    // Move down after the first table
    doc.moveDown(3);

    // Table headers for the second table
    secondTable.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        doc.text(cell, 50 + cellIndex * 120, 250 + rowIndex * 30, {
          width: 100,
          align: "center",
        });
      });
    });

    // Add title or header
    doc
      .fontSize(16)
      .text("Policies and Procedures Table", { align: "center" })
      .moveDown(2);

    // Function to draw a table with borders
    function drawTable(doc, startX, startY, tableData, colWidths, rowHeight) {
      if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
        console.error("Invalid table data!");
        return;
      }

      const rowCount = tableData.length;
      const colCount = tableData[0].length;

      let y = startY;

      // Draw horizontal lines (rows)
      for (let i = 0; i <= rowCount; i++) {
        doc
          .moveTo(startX, y)
          .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y)
          .stroke();
        y += rowHeight;
      }

      let x = startX;

      // Draw vertical lines (columns)
      for (let j = 0; j <= colCount; j++) {
        doc
          .moveTo(x, startY)
          .lineTo(x, startY + rowHeight * rowCount)
          .stroke();
        x += colWidths[j] || 0;
      }

      // Insert text into table cells
      y = startY + 8;
      tableData.forEach((row) => {
        x = startX + 5;
        row.forEach((cell, cellIndex) => {
          doc.text(cell, x, y, {
            width: colWidths[cellIndex] - 10,
            align: "center",
          });
          x += colWidths[cellIndex] || 0;
        });
        y += rowHeight;
      });
    }

    // Table 1: (3 columns, 7 rows)
    const firstTableData = [
      ["S.no", "Policies and Procedure", "Remarks (Yes/No/NA)"],
      ["14", "Whether your firm has been reviewed by:", ""],
      ["(i)", "The Quality Review Board (QRB)", ""],
      ["(ii)", "Financial Reporting Review Board (FRRB)", ""],
      ["(iii)", "Any regulator (Pls. specify)", ""],
      ["(iv)", "If Yes, details as under.", ""],
      ["", "", ""],
      [
        "15",
        "Have any Government Bodies/ Authorities evaluated the performance of the firm to the extent of debarment/ blacklisting? ",
        "",
      ],
    ];

    drawTable(doc, 50, 100, firstTableData, [50, 300, 100], 80);

    // Move down after the first table
    doc.moveDown(8);

    // Table 2: (4 columns, 4 rows)
    const secondTableData = [
      [
        "Yr.Of Review",
        "Name of entity",
        "Broad description of deficiencies",
        "Dt. Of Submission of compliance report (where ever reqd.)",
      ],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ];

    drawTable(doc, 100, 400, secondTableData, [50, 80, 80, 80], 40);
    doc.moveDown();

    // Get the page width
    const pageWidth = doc.page.width;

    // Function to center text manually
    function centerText(text, fontSize, yOffset, isBold = false) {
      const font = isBold ? "Times-Bold" : "Times-Roman";
      doc.font(font).fontSize(fontSize);

      // Get text width and calculate position to center it
      const textWidth = doc.widthOfString(text);
      const x = (pageWidth - textWidth) / 2;

      doc.text(text, x, yOffset);
    }

    // Add centered text
    centerText("PART B (III)", 18, 150, true);
    centerText(
      "Acceptance and Continuance of Client Relationships and Specific",
      14,
      200
    );
    centerText("Engagements", 14, 220);

    doc.addPage();

    // Function to draw a table
    function drawTable(doc, startX, startY, tableData, colWidths, rowHeight) {
      if (!tableData || tableData.length === 0) return startY; // Avoid error if table is empty

      const rowCount = tableData.length;
      const colCount = tableData[0].length;
      let y = startY;

      // Draw horizontal lines (rows)
      for (let i = 0; i <= rowCount; i++) {
        doc
          .moveTo(startX, y)
          .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y)
          .stroke();
        y += rowHeight;
      }

      let x = startX;

      // Draw vertical lines (columns)
      for (let j = 0; j <= colCount; j++) {
        doc
          .moveTo(x, startY)
          .lineTo(x, startY + rowHeight * rowCount)
          .stroke();
        x += colWidths[j] || 0;
      }

      // Insert text into table cells
      y = startY + 8;
      tableData.forEach((row) => {
        x = startX + 5;
        row.forEach((cell, cellIndex) => {
          doc.text(cell, x, y, {
            width: colWidths[cellIndex] - 10,
            align: "left",
          });
          x += colWidths[cellIndex] || 0;
        });
        y += rowHeight;
      });

      return y; // Return the Y position after the table
    }

    // Table Data (3 columns, 12 rows)
    const tableData = [
      ["S.no", "Policies and Procedures", "Remarks (Yes/No/NA)"],
      ["", "clients:", ""],
      [
        "(i)",
        "Evaluating whether the firm has sufficient personnel with necessary capabilities and competence",
        "",
      ],
      [
        "(ii)",
        "Specialists in terms of specific industry experience or certain skill sets are available, if needed",
        "",
      ],
      [
        "(iii)",
        "Individuals meeting the criteria and eligibility requirements to perform an engagement QC review are available, when needed, whether internally or externally",
        "",
      ],
      [
        "(iv)",
        "Assessment that the firm would be able to complete the engagement within agreed deadline",
        "",
      ],
      [
        "5.(i)",
        "Does the PU prepare engagement letter documenting the understanding with the client?",
        "",
      ],
      ["5.(ii)", "Is the engagement letter signed by the client?", ""],
      [
        "6",
        "Has the PU withdrawn from an engagement and/or from client relationship during the period of review?",
        "",
      ],
      ["a)", "If yes, has the reason for withdrawal been documented", ""],
      ["b)", "Reviewing prior audit findings, if applicable", ""],
      [
        "(viii)",
        "If yes, please mention the Names /Codes of the clients alongwith the year and the reason for withdrawal- (Pls. use extra sheet, if required)",
        "",
      ],
    ];

    const startXc = 50;
    let startYc = 100;
    const colWidthsc = [50, 350, 100]; // Adjust column widths
    const rowHeightc = 40; // Adjust row height

    // Draw the table
    startY = drawTable(
      doc,
      startXc,
      startYc,
      tableData,
      colWidthsc,
      rowHeightc
    );

    doc.addPage();

    // Function to draw a table
    function drawTable(doc, startX, startY, tableDataa, colWidths, rowHeight) {
      if (!tableDataa || tableDataa.length === 0) return startY; // Avoid error if table is empty

      const rowCount = tableDataa.length;
      const colCount = tableDataa[0].length;
      let y = startY;

      // Draw horizontal lines (rows)
      for (let i = 0; i <= rowCount; i++) {
        doc
          .moveTo(startX, y)
          .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y)
          .stroke();
        y += rowHeight;
      }

      let x = startX;

      // Draw vertical lines (columns)
      for (let j = 0; j <= colCount; j++) {
        doc
          .moveTo(x, startY)
          .lineTo(x, startY + rowHeight * rowCount)
          .stroke();
        x += colWidths[j] || 0;
      }

      // Insert text into table cells
      y = startY + 8;
      tableDataa.forEach((row) => {
        x = startX + 5;
        row.forEach((cell, cellIndex) => {
          doc.text(cell, x, y, {
            width: colWidths[cellIndex] - 10,
            align: "left",
          });
          x += colWidths[cellIndex] || 0;
        });
        y += rowHeight;
      });

      return y; // Return the Y position after the table
    }

    // Table Data (3 columns, 12 rows)
    const tableDataa = [
      ["S.no", "Policies and Procedures", "Remarks (Yes/No/NA)"],
      [
        "1(iv)",
        "If no, How has the client Engagement/acceptance been documented? Pls. elaborate",
        "",
      ],
      [
        "2",
        "Which of the following processes does the PU have in place when accepting or deciding to continue a client relationship:",
        "",
      ],
      [
        "(i)",
        "Informing Firm personnel of the policies and procedures for accepting and continuing clients",
        "",
      ],
      [
        "(ii)",
        "Considering relevant ethical requirements, including independence",
        "",
      ],
      [
        "(iii)",
        "Obtaining sufficient information about the client and understanding the nature of its business",
        "",
      ],
      ["(iv)", "Assessing the integrity of the client", ""],
      ["(v)", "Evaluating our ability to serve the client appropriately", ""],
      [
        "(vi)",
        "Assessing whether acceptance/continuance would create any conflicts of interest",
        "",
      ],
      ["(vii)", "Reviewing prior audit findings, if applicable", ""],
      [
        "(viii)",
        "Determining if there are any legal or regulatory concerns",
        "",
      ],
      ["(ix)", "Approving client engagement as per firm’s approval matrix", ""],
    ];

    const startXd = 50;
    let startYd = 100;
    const colWidthsd = [50, 350, 100]; // Adjust column widths
    const rowHeightd = 40; // Adjust row height

    // Draw the table
    startY = drawTable(
      doc,
      startXd,
      startYd,
      tableData,
      colWidthsd,
      rowHeightd
    );

    doc.addPage();

    //Page No 22
    // Table Headers
    const tableColumnTitles = [
      "S.no",
      "Policies and Procedures",
      "Remarks (Yes/No/NA)",
    ];

    // Table Data (3 rows)
    const tableContentRows = [
      [
        "7",
        "Did the PU face any issues relating to acceptance or continuance of client relationships and specific engagements during the period of review?",
        "",
      ],
      ["a)", "If yes, how was it resolved?", ""],
      ["b)", "Who has the custody of such documents?", ""],
    ];

    // Column Widths
    const columnWidthsA = [50, 300, 100]; // Adjust column width
    const rowHeightValue = 100; // Adjust row height

    // Calculate table start position
    const tableStartXA =
      (doc.page.width - columnWidthsA.reduce((a, b) => a + b, 0)) / 2;
    let tableStartYA = doc.y;

    // Draw Table Header
    doc.font("Helvetica-Bold");
    let columnPositionX = tableStartXA;
    tableColumnTitles.forEach((header, index) => {
      doc
        .rect(
          columnPositionX,
          tableStartYA,
          columnWidthsA[index],
          rowHeightValue
        )
        .stroke();
      doc.text(header, columnPositionX + 5, tableStartYA + 15, {
        width: columnWidthsA[index] - 10,
        align: "center",
      });
      columnPositionX += columnWidthsA[index];
    });
    tableStartYA += rowHeightValue;

    // Draw Table Rows
    doc.font("Helvetica");
    tableContentRows.forEach((row) => {
      let columnPositionX = tableStartXA;
      row.forEach((cellText, index) => {
        doc
          .rect(
            columnPositionX,
            tableStartYA,
            columnWidthsA[index],
            rowHeightValue
          )
          .stroke();
        doc.text(cellText, columnPositionX + 5, tableStartYA + 15, {
          // Fixed reference here
          width: columnWidthsA[index] - 10,
          align: "left",
        });
        columnPositionX += columnWidthsA[index];
      });
      tableStartYA += rowHeightValue;
    });
    doc.moveDown(4);

    // Centered Title: PART B (IV)

    // Add centered text
    centerText("PART (IV)", 15, 500, true);
    centerText("HUMAN RESOURCES", 14, 800);

    doc.moveDown(10);
    // Function to draw a table
    function createTable(doc, posX, posY, tableContent, columnSizes, rowSize) {
      if (!tableContent || tableContent.length === 0) return posY; // Avoid error if table is empty

      const numRows = tableContent.length;
      const numCols = tableContent[0].length;
      let currentY = posY;

      // Draw horizontal lines (rows)
      for (let i = 0; i <= numRows; i++) {
        doc
          .moveTo(posX, currentY)
          .lineTo(posX + columnSizes.reduce((a, b) => a + b, 0), currentY)
          .stroke();
        currentY += rowSize;
      }

      let currentX = posX;

      // Draw vertical lines (columns)
      for (let j = 0; j <= numCols; j++) {
        doc
          .moveTo(currentX, posY)
          .lineTo(currentX, posY + rowSize * numRows)
          .stroke();
        currentX += columnSizes[j] || 0;
      }

      // Insert text into table cells
      currentY = posY + 8;
      tableContent.forEach((row) => {
        currentX = posX + 5;
        row.forEach((cell, cellIndex) => {
          doc.text(cell, currentX, currentY, {
            width: columnSizes[cellIndex] - 10,
            align: "left",
          });
          currentX += columnSizes[cellIndex] || 0;
        });
        currentY += rowSize;
      });

      return currentY; // Return the Y position after the table
    }

    // Table Data (3 columns, 12 rows)
    const tableContentData = [
      ["S.no", "Policies and Procedures", "Remarks (Yes/No/NA)"],
      [
        "1",
        "Which of the procedures does the PU have in place for managing the Human Resource function:",
        "",
      ],
      [
        "(ii)",
        "How frequently the designated person/ PU evaluate the PUs personnel needs?",
        "",
      ],
      [
        "(iii)",
        "Is there a formal documented process for hiring by the PU, covering:",
        "",
      ],
      [
        "(a)",
        "Does the PU have an established criterion for determining which individuals would be involved in hiring process?",
        "",
      ],
      [
        "(b)",
        "Has the PU laid down any qualification, experiences, attributes required for the entry level and experienced personnel to be hired?",
        "",
      ],
      [
        "(c)",
        "Additional procedures like performing background checks etc. been put in place?",
        "",
      ],
      ["(d)", "Whether joining check-list is maintained?", ""],
      [
        "2",
        "Does the firm maintain and monitor the employee turnover ratio and identify measures to keep it minimal?",
        "",
      ],
      // ["(vii)", "Reviewing prior audit findings, if applicable", ""],
      // [
      //   "(viii)",
      //   "Determining if there are any legal or regulatory concerns",
      //   "",
      // ],
      // ["(ix)", "Approving client engagement as per firm’s approval matrix", ""],
    ];

    doc.addPage();

    const positionX = 50;
    let positionY = 100;
    const columnSizesArray = [50, 350, 100]; // Adjust column widths
    const rowSizeValue = 40; // Adjust row height

    // Draw the table
    positionY = createTable(
      doc,
      positionX,
      positionY,
      tableContentData,
      columnSizesArray,
      rowSizeValue
    );

    // Page No 23
    // Define table headers
    doc.moveDown(6);
    const headersp = [
      "S.No.",
      "Policies and Procedures",
      "Remarks (Yes/No/NA)",
    ];
    const columnWidthsp = [50, 400, 100];
    const rowHeightp = 50;

    // Sample data with bold text for certain entries
    const tableDatap = [
      [
        "3",
        "Does the firm maintain a minimum Staff to Partner Ratio, Partner to Manager, Manager to Articles, Client to Staff ratio, etc.",
        "",
      ],
      [
        "4",
        "Which of the following considerations does the PU have in place to select the engagement partner & team required for an engagement:",
        "",
      ],
      [
        "",
        "a) Understanding the role of PUs Quality Control and Code of Ethics issued by the Institute in ensuring the integrity of the accounting, auditing and attest functions to user of reports",
        "",
      ],
      [
        "",
        "b) Performance, supervision and reporting aspects of the engagement, which ordinarily are gained through training or participation in similar engagements",
        "",
      ],
      [
        "",
        "c) The industry in which the client operates, including its organization and operating characteristics, sufficient to identify areas of high or unusual risk associated with engagement",
        "",
      ],
      [
        "",
        "d) The skills that contribute to sound professional judgment, including the ability to exercise professional skepticism",
        "",
      ],
      ["", "e) Adequate mix of different level personnel in the team", ""],
      [
        "",
        "f) How the auditee uses information technology and the manner in which information systems are used to record and maintain financial information",
        "",
      ],
      [
        "5",
        "Which of the following procedures does the PU follow to determine the capabilities and competencies possessed by personnel:",
        "",
      ],
    ];

    // Function to draw table
    function drawTable(
      doc,
      startXp,
      startYp,
      tableDatap,
      colWidthsp,
      rowHeightp,
      headersp
    ) {
      let y = startYp;

      // Ensure headersp and colWidthsp are valid
      if (!headersp || !Array.isArray(headersp)) return;
      if (!colWidthsp || !Array.isArray(colWidthsp)) return;

      // Draw headers
      doc.font("Helvetica-Bold");
      let x = startXp;
      headersp.forEach((header, index) => {
        if (colWidthsp[index] !== undefined) {
          doc.rect(x, y, colWidthsp[index], rowHeightp).stroke();
          doc.text(header, x + 5, y + 12, {
            width: colWidthsp[index] - 10,
            align: "center",
          });
          x += colWidthsp[index];
        }
      });
      y += rowHeightp;

      // Draw table rows
      doc.font("Helvetica");
      tableDatap.forEach((row, rowIndex) => {
        x = startXp;
        row.forEach((cell, cellIndex) => {
          if (cellIndex < colWidthsp.length) {
            doc.rect(x, y, colWidthsp[cellIndex], rowHeightp).stroke();

            // Bold text for important lines
            if (cellIndex === 1 && rowIndex === 1) {
              doc.font("Helvetica-Bold");
            } else {
              doc.font("Helvetica");
            }

            doc.text(cell, x + 5, y + 12, {
              width: colWidthsp[cellIndex] - 10,
              align: "left",
            });
            x += colWidthsp[cellIndex];
          }
        });
        y += rowHeightp;
      });

      return y; // Return new Y position
    }

    doc.moveDown(10);
    // Start position of the table
    const startXp = 50;
    let startYp = 200;
    startYp = drawTable(
      doc,
      startXp,
      startYp,
      tableDatap,
      columnWidthsp,
      rowHeightp,
      headersp
    );

    doc.addPage();

    //Page No 24
    doc;

    // Table position
    const startX24 = 50;
    let startY24 = 150;
    const rowHeight24 = 30;
    const colWidths24 = [50, 380, 100]; // Column widths: S.No., Policies, Remarks

    // Table Headers
    const headers24 = ["S.No.", "Policies and Procedures", "Remarks/Yes/No/NA"];
    const data24 = [
      [
        "(i)",
        "Does the PU have an established criterion for evaluating personal characteristics such as integrity, competence, and motivation?",
        "",
      ],
      [
        "(ii)a.",
        "Does the PU evaluate the personnel at least annually to determine their capabilities and competencies?",
        "",
      ],
      ["(ii)b.", "If yes, whether this is documented?", ""],
      [
        "6.",
        "Does the PU have any policy for assigning responsibility for engagements to an engagement partner?",
        "",
      ],
      [
        "7.",
        "Does the PU have following parameters in place to ensure that the knowledge of its personnel get updated on an ongoing process:",
        "",
      ],
      [
        "(i)",
        "Requires personnel (including articled trainees) to participate in the CPED programs in accordance with firm guidelines to keep them updated on the current developments",
        "",
      ],
      [
        "(ii)",
        "Maintains/tracks record of CPE status of its professional personnel as per the requirements of the ICAI",
        "",
      ],
      [
        "(iii)",
        "Provides CPED course materials / access to digital content on the latest changes in accounting, auditing, independence requirement",
        "",
      ],
      ["(iv)", "Provides orientation and training programs for new hires", ""],
      [
        "(v)",
        "Employees are equipped with technological skill sets – like AI, Blockchain, Audit & Data analytical tools, etc.",
        "",
      ],
      ["(vi)", "Does the PU sponsor any of skill development tools?", ""],
    ];

    // Function to draw a table row
    function drawRow(doc, y, row) {
      let x = startX24;
      row.forEach((text, i) => {
        doc.rect(x, y, colWidths24[i], rowHeight24).stroke(); // Draws the box
        doc.text(text, x + 5, y + 10, {
          width: colWidths24[i] - 10,
          align: "left",
        }); // Adds text inside
        x += colWidths24[i];
      });
    }

    // Draw table headers
    drawRow(doc, startY24, headers24);
    startY24 += rowHeight24;

    // Draw table rows
    data24.forEach((row, index) => {
      drawRow(doc, startY24, row);
      startY24 += rowHeight24;
    });

    doc.addPage();

    //Page No 25

    // Ensure doc is initialized before this

    // First Table Position
    const table1StartX = 50;
    let table1StartY = 150;
    const tableRowHeight = 40;
    const tableColWidths = [50, 380, 100]; // Column widths: S.No., Policies, Remarks

    // First Table Column Headers (Renamed)
    const columnHeadersTable1 = [
      "S.No.",
      "Policies and Procedures",
      "Remarks/Yes/No/NA",
    ];
    const table1Data = [
      [
        "(vii)",
        "Does the PU provide access to technology, infrastructure and methodology for better enablement of day-to-day work?",
        "",
      ],
      [
        "(viii)",
        "Does the PU organize self-developed programs like group discussions, mock presentations, short reviews by Team Leader etc.?",
        "",
      ],
      [
        "8",
        "Does the PU have policies and procedures for career advancement of its personnel?",
        "",
      ],
      [
        "9",
        "Is there a system for evaluating the performances on a timely basis with the individual being evaluated?",
        "",
      ],
      [
        "10",
        "Is there a fast-track advancement policy for star performers?",
        "",
      ],
    ];

    // Function to draw a table row
    function drawTableRow(doc, y, row) {
      let x = table1StartX;
      row.forEach((text, i) => {
        doc.rect(x, y, tableColWidths[i], tableRowHeight).stroke(); // Draws the box
        doc.text(text, x + 5, y + 15, {
          width: tableColWidths[i] - 10,
          align: "left",
        }); // Adds text inside
        x += tableColWidths[i];
      });
    }

    // Draw First Table
    drawTableRow(doc, table1StartY, columnHeadersTable1);
    table1StartY += tableRowHeight;
    table1Data.forEach((row) => {
      drawTableRow(doc, table1StartY, row);
      table1StartY += tableRowHeight;
    });

    doc.moveDown(4);
    // Move down to center heading
    let middleHeadingY = table1StartY + 30; // Space below first table
    doc.fontSize(14).text("Part B (V)", { align: "center" }).moveDown(0.3);
    doc
      .fontSize(16)
      .text("Engagement Performance", { align: "center", underline: true });

    doc.moveDown(4);

    // Second Table Position (Below Middle Heading)
    let table2StartY = middleHeadingY + 50; // Adjust spacing

    // Second Table Column Headers (Renamed)
    const columnHeadersTable2 = [
      "S.No.",
      "Policies and Procedures",
      "Remarks/Yes/No/NA",
    ];
    const table2Data = [
      [
        "1. (i)",
        "Does the PU provide access to technology, infrastructure and methodology for better enablement of day-to-day work?",
        "",
      ],
      [
        "(ii) a",
        "Are the responsibilities assigned to appropriate personnel during the planning phase?",
        "",
      ],
      [
        "(ii) b",
        "Is the background information on the client and the engagement developed/updated and team briefed accordingly?",
        "",
      ],
      [
        "(ii) c",
        "Does the firm prepare a planning document mentioning the staffing requirements/the risks/time allocation etc.?",
        "",
      ],
      ["", "", ""], // Empty row if needed
    ];

    // Draw Second Table
    drawTableRow(doc, table2StartY, columnHeadersTable2);
    table2StartY += tableRowHeight;
    table2Data.forEach((row) => {
      drawTableRow(doc, table2StartY, row);
      table2StartY += tableRowHeight;
    });

    doc.addPage();

    //Page No 26

    // Function to draw the Quality Control Table
    const drawQualityControlTable = (doc, headers, data, startYPosition) => {
      const tableWidthPX = 400;
      const columnWidthsPX = [40, 200, 200]; // Column widths
      const startXPosition = (doc.page.width - tableWidthPX) / 2;
      let yCursorPosition = startYPosition;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPosHeader = startXPosition;
      headers.forEach((header, index) => {
        doc
          .rect(xPosHeader, yCursorPosition, columnWidthsPX[index], 50)
          .stroke();
        doc.text(header, xPosHeader + 5, yCursorPosition + 15, {
          width: columnWidthsPX[index] - 10,
        });
        xPosHeader += columnWidthsPX[index];
      });
      yCursorPosition += 50; // Adjusted header row height

      // Draw Data Rows
      doc.font("Helvetica");
      data.forEach((row) => {
        let xPosRow = startXPosition;

        // Calculate row height dynamically
        let dynamicRowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: columnWidthsPX[index] - 10 })
            )
          ) + 15; // Add padding

        row.forEach((text, index) => {
          doc
            .rect(
              xPosRow,
              yCursorPosition,
              columnWidthsPX[index],
              dynamicRowHeight
            )
            .stroke();
          doc.text(text, xPosRow + 7, yCursorPosition + 10, {
            width: columnWidthsPX[index] - 10,
          });
          xPosRow += columnWidthsPX[index];
        });

        yCursorPosition += dynamicRowHeight; // Move down
      });

      return yCursorPosition;
    };

    // Table Headers (Renamed)
    const tableHeadersQC = [
      "S.No.",
      "Policies and Procedures",
      "Remark/Yes/No/Na",
    ];

    const tableDataQC = [
      [
        "d)",
        "Whether checklist of relevant Laws/Rules including those related with Accountancy & audit is shared with the engagement team?",
        "",
      ],
      [
        "e)",
        "Whether industry briefing about nature, structure & vertical, and important points from previous year audit summary memorandum are provided to team during planning of the engagement?",
        "",
      ],
      ["f", "Any other (pls. specify)", ""],
      [
        "2.",
        "Does the PU conduct pre-assignment meeting with the clients, liaison office etc. to understand the preparedness of the client to start the professional functions.",
        "",
      ],
      [
        "3",
        "Does the PU prepare and document Audit Summary Memorandum to provide the history of the planned risks, the audit procedures which mitigated the risk, conclusions on controls etc.?",
        "",
      ],
      [
        "4",
        "Does the PU prepare standardized forms, checklists and questionnaires used in performance engagements?",
        "",
      ],
      [
        "5",
        "Does the team leader/Engagement Partner keep a track of the audit findings, other significant issues at various stages of the engagement (including disposal/discussion with the TCWG)?",
        "",
      ],
      ["6", "How does the PU ensure that ", ""],
      [
        "(i)",
        "the qualified team members review the work performed by other team members on a timely basis?",
        "",
      ],
    ];

    // Define starting Y position
    let firstTableStartY = 100;

    // ✅ Call drawQualityControlTable function
    firstTableStartY = drawQualityControlTable(
      doc,
      tableHeadersQC,
      tableDataQC,
      firstTableStartY
    );

    // Add a new page for the next table
    doc.addPage();

    // Function to create second table
    // Function to create table
    const drawTable26 = (doc, headers, data, startYPosition) => {
      const tableWidthPX = 490;
      const columnWidthsPX = [40, 250, 200]; // Column widths
      const startXPosition = (doc.page.width - tableWidthPX) / 2;
      let yCursorPosition = startYPosition;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPosHeader = startXPosition;
      headers.forEach((header, index) => {
        doc
          .rect(xPosHeader, yCursorPosition, columnWidthsPX[index], 40)
          .stroke();
        doc.text(header, xPosHeader + 5, yCursorPosition + 12, {
          width: columnWidthsPX[index] - 10,
        });
        xPosHeader += columnWidthsPX[index];
      });
      yCursorPosition += 40; // Move to the next row after header

      // Draw Data Rows
      doc.font("Helvetica");

      data.forEach((row) => {
        let xPosRow = startXPosition;

        // Calculate row height dynamically (Ensures text fits correctly)
        let dynamicRowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: columnWidthsPX[index] - 10 })
            )
          ) + 10; // **Reduced padding to avoid excessive margin**

        row.forEach((text, index) => {
          doc
            .rect(
              xPosRow,
              yCursorPosition,
              columnWidthsPX[index],
              dynamicRowHeight
            )
            .stroke();
          doc.text(text, xPosRow + 7, yCursorPosition + 5, {
            width: columnWidthsPX[index] - 10,
          });
          xPosRow += columnWidthsPX[index];
        });

        yCursorPosition += dynamicRowHeight; // **Move cursor exactly by row height**
      });

      return yCursorPosition;
    };
    doc.addPage();
    //Page NO 27
    // Table Headers
    const headers26 = ["S.No", "Policies and procedures", "Remark/Yes/No/Na"];

    const dataRows26 = [
      [
        "(ii)",
        "Is there any document maintained by the PU for the supervision of work performed?",
        "",
      ],
      [
        "7",
        "What is the mode for maintaining the working papers?  Electronic mode or in physical form or in a hybrid manner?",
        "",
      ],
      [
        "8",
        "What tool does the PU use for maintaining the working in electronic form?",
        "",
      ],
      [
        "9",
        "Which of the following procedures does the PU have in place to maintain confidentiality, safe custody, integrity, accessibility and retrievability of engagement documentation:",
        "",
      ],
      [
        "(i)",
        "Documenting when and by whom the engagement documentation was prepared and reviewed",
        "",
      ],
      [
        "(ii)",
        "Protecting integrity of information at all stages of engagement especially when the information was shared through electronic means",
        "",
      ],
      [
        "(iii)",
        "Preventing unauthorized changes in engagement documentation",
        "",
      ],
      [
        "(iv)",
        "Allowing access to engagement documentation by engagement team and other authorized parties only",
        "",
      ],
      [
        "(v)",
        "Enabling confidential storage of hardcopies of engagement documentation",
        "",
      ],
      [
        "(vi)",
        "Requiring use of passwords by engagement team members and data encryption to restrict access to electronic engagement documentation to authorized users",
        "",
      ],
    ];

    // Set the starting Y position for the table
    let startY26 = doc.y || 100;

    // Draw the table
    startY26 = drawTable26(doc, headers26, dataRows26, startY26);

    //Page No 28
    // Page NO 27
    // Table Headers
    const headers28 = ["S.No", "Policies and procedures", "Remark/Yes/No/Na"];

    const dataRows28 = [
      [
        "(ii)",
        "Is there any document maintained by the PU for the supervision of work performed?",
        "",
      ],
      [
        "7",
        "What is the mode for maintaining the working papers? Electronic mode or in physical form or in a hybrid manner?",
        "",
      ],
      [
        "8",
        "What tool does the PU use for maintaining the working in electronic form?",
        "",
      ],
      [
        "9",
        "Which of the following procedures does the PU have in place to maintain confidentiality, safe custody, integrity, accessibility and retrievability of engagement documentation:",
        "",
      ],
      [
        "(i)",
        "Documenting when and by whom the engagement documentation was prepared and reviewed",
        "",
      ],
      [
        "(ii)",
        "Protecting integrity of information at all stages of engagement especially when the information was shared through electronic means",
        "",
      ],
      [
        "(iii)",
        "Preventing unauthorized changes in engagement documentation",
        "",
      ],
      [
        "(iv)",
        "Allowing access to engagement documentation by engagement team and other authorized parties only",
        "",
      ],
      [
        "(v)",
        "Enabling confidential storage of hardcopies of engagement documentation",
        "",
      ],
      [
        "(vi)",
        "Requiring use of passwords by engagement team members and data encryption to restrict access to electronic engagement documentation to authorized users",
        "",
      ],
    ];

    // Set the starting Y position for the table
    let startY28 = doc.y || 100;

    // Draw the table 28
    // Function to draw Table 22 (Define it before using)
    const drawTable22 = (doc, headers, data, startYPosition) => {
      const tableWidthPX = 490;
      const columnWidthsPX = [40, 250, 200]; // Column widths
      const startXPosition = (doc.page.width - tableWidthPX) / 2;
      let yCursorPosition = startYPosition;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPosHeader = startXPosition;
      headers.forEach((header, index) => {
        doc
          .rect(xPosHeader, yCursorPosition, columnWidthsPX[index], 40)
          .stroke();
        doc.text(header, xPosHeader + 5, yCursorPosition + 12, {
          width: columnWidthsPX[index] - 10,
        });
        xPosHeader += columnWidthsPX[index];
      });
      yCursorPosition += 40; // Move to the next row after header

      // Draw Data Rows
      doc.font("Helvetica");

      data.forEach((row) => {
        let xPosRow = startXPosition;

        // Calculate row height dynamically (Ensures text fits correctly)
        let dynamicRowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: columnWidthsPX[index] - 10 })
            )
          ) + 10; // Reduced padding to avoid excessive margin

        row.forEach((text, index) => {
          doc
            .rect(
              xPosRow,
              yCursorPosition,
              columnWidthsPX[index],
              dynamicRowHeight
            )
            .stroke();
          doc.text(text, xPosRow + 7, yCursorPosition + 5, {
            width: columnWidthsPX[index] - 10,
          });
          xPosRow += columnWidthsPX[index];
        });

        yCursorPosition += dynamicRowHeight; // Move cursor exactly by row height
      });

      return yCursorPosition;
    };

    // Page NO 22
    // Table Headers
    const headers22 = ["S.No", "Policies and procedures", "Remark/Yes/No/Na"];

    const dataRows22 = [
      [
        "(vii)",
        "Maintaining appropriate backup routines at appropriate stages during the engagement",
        "",
      ],
      [
        "(viii)",
        "Enabling the scanned copies to be retrieved and printed by authorized personnel",
        "",
      ],
      [
        "10.",
        "Which procedures does the PU follow to ensure that it maintains engagement documentation for a period of time sufficient to meet the needs of the firm, professional standards, laws and regulations:",
        "",
      ],
      [
        "(i)",
        "For how many years the PU maintains engagement documentation?",
        "",
      ],
      [
        "(ii)",
        "How does the PU enable retrieval of, and access to engagement documentation during the retention period in case of electronic documentation as the underlying technology may be upgraded or changed overtime",
        "",
      ],
      [
        "(iii)",
        "Does the PU ensure that, record of changes made to engagement documentation after assembly of files has been completed?",
        "",
      ],
      [
        "(iv)",
        "Does the PU ensure that only authorized external parties access and review specific engagement documentation for QC or other purposes?",
        "",
      ],
      [
        "(11)",
        "Does the PU have the policy for documenting the issue requiring consultation, including any decisions that were taken, the basis for those decisions and how they were implemented?",
        "",
      ],
    ];

    // Set the starting Y position for the table
    let startY22 = doc.y || 100;

    // ✅ Draw the table after function is defined
    startY22 = drawTable22(doc, headers22, dataRows22, startY22);

    doc.addPage();
    //Page No 29
    // Function to draw Table 29 (Define it before using)
    const drawTable29 = (doc, headers, data, startYPosition) => {
      const pageWidth = doc.page.width - 40; // Keeping some margin
      const columnCount = headers.length;
      const columnWidthsPX = Array(columnCount).fill(pageWidth / columnCount); // Distribute width equally
      const startXPosition = (doc.page.width - pageWidth) / 2;
      let yCursorPosition = startYPosition;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPosHeader = startXPosition;
      headers.forEach((header, index) => {
        doc
          .rect(xPosHeader, yCursorPosition, columnWidthsPX[index], 40)
          .stroke();
        doc.text(header, xPosHeader + 5, yCursorPosition + 12, {
          width: columnWidthsPX[index] - 10,
        });
        xPosHeader += columnWidthsPX[index];
      });
      yCursorPosition += 40; // Move to the next row after header

      // Draw Data Rows
      doc.font("Helvetica");

      data.forEach((row) => {
        let xPosRow = startXPosition;

        // Calculate row height dynamically based on content
        let dynamicRowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: columnWidthsPX[index] - 10 })
            )
          ) + 10; // Add padding for spacing

        row.forEach((text, index) => {
          doc
            .rect(
              xPosRow,
              yCursorPosition,
              columnWidthsPX[index],
              dynamicRowHeight
            )
            .stroke();
          doc.text(text, xPosRow + 7, yCursorPosition + 5, {
            width: columnWidthsPX[index] - 10,
          });
          xPosRow += columnWidthsPX[index];
        });

        yCursorPosition += dynamicRowHeight; // Move cursor exactly by row height
      });

      return yCursorPosition;
    };

    // Page NO 29
    // Table Headers
    const headers29 = ["S.No", "Policies and procedures", "Remark/Yes/No/Na"];

    const dataRows29 = [
      [
        "(12)",
        "Who resolves with the differences of professional judgement among members of the engagement team?",
        "",
      ],
      [
        "(13)",
        "Is there a formally designed an escalation matrix, in case the differences are not resolved at certain level?",
        "",
      ],
      ["(14)", "Are the conclusions reached properly documented?", ""],
      [
        "(15)",
        "What happens if the members of the team continue to disagree with the resolution?",
        "",
      ],
      [
        "(16)",
        "When does the PU release the report in cases where differences in opinion exist?",
        "",
      ],
      [
        "(17)",
        "Does the PU have a policy of having engagement quality review conducted for all audit of financial statements of listed entities?",
        "",
      ],
      [
        "(18)",
        "Which of the criteria does the PU have in place for carrying out the engagement QC review for its engagements (other than covered above):",
        "",
      ],
      ["(i)", "Certain class of engagements (mention the class)", ""],
      ["(ii)", "Risks in an engagement (mention type/level)", ""],
      [
        "(iii)",
        "Unusual circumstances (mention the particular circumstance)",
        "",
      ],
      ["(iv)", "Required by law or regulation (quote the law/regulation)", ""],
    ];

    // Set the starting Y position for the table
    let startY29 = doc.y || 100;

    // ✅ Draw the table after function is defined
    startY29 = drawTable29(doc, headers29, dataRows29, startY29);

    doc.addPage();
    //Page No 30
    // Function to draw Table 30 (Define it before using)
    const drawTable30 = (doc, headers, data, startYPosition) => {
      const pageWidth = doc.page.width - 80; // Keeping margins for better formatting
      const columnWidthsPX = [50, 320, 120]; // S.No | Policies and Procedure | Remarks/Yes/No/Na
      const startXPosition = (doc.page.width - pageWidth) / 2;
      let yCursorPosition = startYPosition;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPosHeader = startXPosition;
      headers.forEach((header, index) => {
        doc
          .rect(xPosHeader, yCursorPosition, columnWidthsPX[index], 40)
          .stroke();
        doc.text(header, xPosHeader + 5, yCursorPosition + 12, {
          width: columnWidthsPX[index] - 10,
        });
        xPosHeader += columnWidthsPX[index];
      });
      yCursorPosition += 40; // Move to the next row after header

      // Draw Data Rows
      doc.font("Helvetica");

      data.forEach((row) => {
        let xPosRow = startXPosition;

        // Calculate row height dynamically based on text content
        let dynamicRowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: columnWidthsPX[index] - 10 })
            )
          ) + 10; // Add padding for spacing

        row.forEach((text, index) => {
          doc
            .rect(
              xPosRow,
              yCursorPosition,
              columnWidthsPX[index],
              dynamicRowHeight
            )
            .stroke();
          doc.text(text, xPosRow + 7, yCursorPosition + 5, {
            width: columnWidthsPX[index] - 10,
          });
          xPosRow += columnWidthsPX[index];
        });

        yCursorPosition += dynamicRowHeight; // Move cursor to the next row
      });

      return yCursorPosition;
    };

    // Page NO 30
    // Table Headers
    const headers30 = ["S.No", "Policies and Procedure", "Remarks/Yes/No/Na"];

    const dataRows30 = [
      ["(v)", "Any other like size (pls. elaborate)", ""], // New field added
      [
        "19",
        "Which of the following procedures are followed by the PU for addressing the nature, timing, extent, and documentation of engagement QC review:",
        "",
      ],
      [
        "(i)",
        "Discuss significant accounting, auditing and financial reporting issues with the engagement partner",
        "",
      ],
      [
        "(ii)",
        "Discuss with the EP the engagement team’s identification and audit of high-risk assertions and transactions",
        "",
      ],
      [
        "(iii)",
        "Confirm with the EP that there are no significant unresolved issues",
        "",
      ],
      [
        "(iv)",
        "Read the financial statements and the report and consider whether the report is appropriate",
        "",
      ],
      [
        "(v)",
        "The procedures required by the firm’s policies on engagement QC review have been performed",
        "",
      ],
      [
        "(vi)",
        "The engagement QC review has been completed before the report is released",
        "",
      ],
      [
        "(vii)",
        "Resolving conflict between the engagement partner and the engagement QC reviewer regarding significant matters",
        "",
      ],
      [
        "20",
        "Which of the following are the PU's established criteria for eligibility of ‘Engagement Quality Assurance Reviewers’:",
        "",
      ],
      ["(i)", "Selected by QC partner or the Managing Partner", ""],
    ];

    // Set the starting Y position for the table
    let startY30 = doc.y || 100;

    // ✅ Draw the table after function is defined
    startY30 = drawTable30(doc, headers30, dataRows30, startY30);

    doc.addPage();

    //Page No . 31
    // Function to draw a table with dynamic row heights
    const drawTable31 = (doc, headers, data, startYPosition) => {
      const pageWidth = doc.page.width - 80; // Keeping margins for better formatting
      const columnWidthsPX = [50, 320, 120]; // S.No | Policies and Procedure | Remarks/Yes/No/Na
      const startXPosition = (doc.page.width - pageWidth) / 2;
      let yCursorPosition = startYPosition;

      doc.lineWidth(1);
      doc.font("Helvetica-Bold");

      // Draw Headers
      let xPosHeader = startXPosition;
      headers.forEach((header, index) => {
        doc
          .rect(xPosHeader, yCursorPosition, columnWidthsPX[index], 40)
          .stroke();
        doc.text(header, xPosHeader + 5, yCursorPosition + 12, {
          width: columnWidthsPX[index] - 10,
        });
        xPosHeader += columnWidthsPX[index];
      });
      yCursorPosition += 40; // Move to the next row after header

      // Draw Data Rows
      doc.font("Helvetica");

      data.forEach((row) => {
        let xPosRow = startXPosition;

        // Calculate row height dynamically based on text content
        let dynamicRowHeight =
          Math.max(
            ...row.map((text, index) =>
              doc.heightOfString(text, { width: columnWidthsPX[index] - 10 })
            )
          ) + 10; // Add padding for spacing

        row.forEach((text, index) => {
          doc
            .rect(
              xPosRow,
              yCursorPosition,
              columnWidthsPX[index],
              dynamicRowHeight
            )
            .stroke();
          doc.text(text, xPosRow + 7, yCursorPosition + 5, {
            width: columnWidthsPX[index] - 10,
          });
          xPosRow += columnWidthsPX[index];
        });

        yCursorPosition += dynamicRowHeight; // Move cursor to the next row
      });

      return yCursorPosition;
    };

    // Page NO 31
    // Table Headers
    const headers31 = ["S.No", "Policies and Procedure", "Remarks/Yes/No/Na"];

    const dataRows31 = [
      ["(ii)", "Has technical expertise and experience", ""],
      [
        "(iii)",
        "Carries out the responsibilities with objectivity and due professional care without regard to relative positions",
        "",
      ],
      [
        "(iv)",
        "Meets the independence requirements relating to engagement reviewed",
        "",
      ],
      [
        "(v)",
        "Does not participate in the performance of the engagement except when consulted by the engagement partner",
        "",
      ],
      ["(vi)", "Any other (Pls. specify)", ""],
    ];

    // Set the starting Y position for the table
    let startY31 = 50;

    // Draw the first table using drawTable31
    startY31 = drawTable31(doc, headers31, dataRows31, startY31);

    // Add space between tables
    startY31 += 40;

    // Set up initial coordinates for the second table
    let x31 = 50;
    let y31 = startY31;
    const rowHeight31 = 30; // Consistent row height

    // Declare column widths for the second table
    const colWidth31_1 = 50; // Column for S.No.
    const colWidth31_2 = 300; // Column for Policies and Procedures
    const colWidth31_3 = 150; // Column for Remarks/Yes/No/Na

    // Function to draw a table row with borders
    function drawTableRow31(doc, x31, y31, col1, col2, col3) {
      // Draw cell borders
      doc
        .rect(x31, y31, colWidth31_1, rowHeight31)
        .stroke()
        .rect(x31 + colWidth31_1, y31, colWidth31_2, rowHeight31)
        .stroke()
        .rect(x31 + colWidth31_1 + colWidth31_2, y31, colWidth31_3, rowHeight31)
        .stroke();

      // Add text inside the cells
      doc.text(col1, x31 + 5, y31 + 10, { width: colWidth31_1 - 10 });
      doc.text(col2, x31 + colWidth31_1 + 5, y31 + 10, {
        width: colWidth31_2 - 10,
      });
      doc.text(col3, x31 + colWidth31_1 + colWidth31_2 + 5, y31 + 10, {
        width: colWidth31_3 - 10,
      });
    }

    // Draw the second table
    doc.fontSize(12).text("PART B (VI)", x31, y31);
    y31 += 30;
    doc.fontSize(12).text("Monitoring", x31, y31);
    y31 += 30;

    // Draw headers with borders
    drawTableRow31(
      doc,
      x31,
      y31,
      "S.No.",
      "Policies and Procedures",
      "Remarks/Yes/No/Na"
    );
    y31 += rowHeight31;

    // Draw table rows with borders
    drawTableRow31(
      doc,
      x31,
      y31,
      "1.(i)",
      "Does the PU have Policies and Procedures to confirm on the adequacy and relevance of Quality Control procedures adopted?",
      ""
    );
    y31 += rowHeight31;

    drawTableRow31(
      doc,
      x31,
      y31,
      "1.(ii)",
      "If yes, what document is in place to establish the procedure",
      ""
    );
    y31 += rowHeight31;

    drawTableRow31(
      doc,
      x31,
      y31,
      "2",
      "Who is responsible to evaluate the Quality and Control policies and procedures to ensure the relevance, adequacy, effectiveness and appropriateness with current trends?",
      ""
    );
    y31 += rowHeight31;

    drawTableRow31(
      doc,
      x31,
      y31,
      "3",
      "How frequently are the processes and the procedures related to QC revised?",
      ""
    );
    y31 += rowHeight31;

    drawTableRow31(
      doc,
      x31,
      y31,
      "4",
      "When was the last revision to the Quality Control policies and procedures carried out?",
      ""
    );
    y31 += rowHeight31;

    drawTableRow31(
      doc,
      x31,
      y31,
      "5.(i)",
      "Did the PU follow ongoing consideration and evaluation system of quality controls?",
      ""
    );
    y31 += rowHeight31;

    drawTableRow31(
      doc,
      x31,
      y31,
      "5.(ii)",
      "If yes, what document is in place to establish the same",
      ""
    );
    y31 += rowHeight31;

    doc.addPage();

    //Page No 32
    // Set up initial coordinates
    let x32 = 50;
    let y32 = 50;
    const rowHeight32 = 25; // Consistent row height
    const colWidth1_32 = 50; // S.No column width
    const colWidth2_32 = 330; // Policies and Procedures column width
    const colWidth3_32 = 150; // Remarks column width

    // Function to draw a table row with columns
    function drawTableRow32(doc, x32, y32, col1, col2, col3) {
      // Draw column borders
      doc
        .rect(x32, y32, colWidth1_32, rowHeight32) // Column 1 (S.No)
        .rect(x32 + colWidth1_32, y32, colWidth2_32, rowHeight32) // Column 2 (Policies and Procedures)
        .rect(x32 + colWidth1_32 + colWidth2_32, y32, colWidth3_32, rowHeight32) // Column 3 (Remarks)
        .stroke();

      // Add text inside columns
      doc.text(col1, x32 + 5, y32 + 8, { width: colWidth1_32 - 10 });
      doc.text(col2, x32 + colWidth1_32 + 5, y32 + 8, {
        width: colWidth2_32 - 10,
      });
      doc.text(col3, x32 + colWidth1_32 + colWidth2_32 + 5, y32 + 8, {
        width: colWidth3_32 - 10,
      });
    }

    // Draw the table headers
    doc.fontSize(12).font("Helvetica-Bold");
    drawTableRow32(
      doc,
      x32,
      y32,
      "S.No.",
      "Policies and Procedures",
      "Remarks/Yes/No/Na"
    );
    y32 += rowHeight32;

    // Draw the table rows
    doc.fontSize(12).font("Helvetica");
    drawTableRow32(
      doc,
      x32,
      y32,
      "6.",
      "Which of the following monitoring procedure, the PU has in place for QC:",
      ""
    );
    y32 += rowHeight32;

    drawTableRow32(
      doc,
      x32,
      y32,
      "(i)",
      "Designated partner/(s) for performing annual inspection",
      ""
    );
    y32 += rowHeight32;

    drawTableRow32(
      doc,
      x32,
      y32,
      "(ii)",
      "Deciding how long to retain detailed inspection documentation",
      ""
    );
    y32 += rowHeight32;

    drawTableRow32(
      doc,
      x32,
      y32,
      "(iii)",
      "Reviewing correspondence regarding consultation on independence, integrity and objectivity matters and acceptance and continuance decisions",
      ""
    );
    y32 += rowHeight32;

    drawTableRow32(
      doc,
      x32,
      y32,
      "(iv)",
      "Preparing summary inspection report for the partner and sets forth any recommended changes that should be made to the firm’s policies and procedures",
      ""
    );
    y32 += rowHeight32;

    drawTableRow32(
      doc,
      x32,
      y32,
      "(v)",
      "Reviewing and evaluating Firm practice aids, such as audit programs, forms, checklists and considering that they are up to date relevant",
      ""
    );
    y32 += rowHeight32;

    drawTableRow32(
      doc,
      x32,
      y32,
      "(vi)",
      "Reviewing summary of CPED records of firms professional personnel",
      ""
    );
    y32 += rowHeight32;

    drawTableRow32(
      doc,
      x32,
      y32,
      "(vii)",
      "Reviewing other administrative and personnel records pertaining to QC elements",
      ""
    );
    y32 += rowHeight32;

    drawTableRow32(
      doc,
      x32,
      y32,
      "(viii)",
      "Soliciting information on the effectiveness of training programs from the Firm’s personnel",
      ""
    );
    y32 += rowHeight32;

    drawTableRow32(doc, x32, y32, "(ix)", "Any other (Pls. elaborate)", "");
    y32 += rowHeight32;

    // Add space for the signature section
    y32 += 40;
    doc.fontSize(12).text("Signature", x32, y32);
    y32 += rowHeight32;
    doc.text(
      "Name of Proprietor/Partner/individual Practicing in own name:",
      x32,
      y32
    );
    y32 += rowHeight32;
    doc.text("Membership No. of the Signatory", x32, y32);
    y32 += rowHeight32;
    doc.text("Date:", x32, y32);

    //ADD New Page
    doc.addPage();
    doc.moveDown(6);
    //Page No 33
    // Title Section
    doc.font("Helvetica-Bold").fontSize(18).text("PART C", { align: "center" });

    doc
      .fontSize(12)
      .text("(Scores obtained by self-evaluation using AQMM v1.0)", {
        align: "center",
      });

    doc
      .fontSize(10)
      .text(
        "[Mandatory Applicable w.e.f 1st April 2023 for Practice units conducting statutory audit of listed entities " +
          "(other than branches of banks and Insurance companies) and recommendatory for other Practice Units]",
        { align: "center" }
      );

    // Section 1 Title
    doc
      .fontSize(14)
      .text("Section 1 - Practice Management – Operation", { underline: true });

    // Set up initial coordinates
    let x33 = 50;
    let y33 = 50;
    const rowHeight33 = 20; // Consistent row height
    const colWidth1_33 = 100; // Width for Competency Basis
    const colWidth2_33 = 150; // Width for Score Basis
    const colWidth3_33 = 80; // Width for Max Scores
    const colWidth4_33 = 80; // Width for Scores obtained

    // Function to draw a table row with borders
    function drawTableRow33(doc, x33, y33, col1, col2, col3, col4) {
      // Draw column borders
      doc
        .rect(x33, y33, colWidth1_33, rowHeight33) // Column 1 (Competency Basis)
        .rect(x33 + colWidth1_33, y33, colWidth2_33, rowHeight33) // Column 2 (Score Basis)
        .rect(x33 + colWidth1_33 + colWidth2_33, y33, colWidth3_33, rowHeight33) // Column 3 (Max Scores)
        .rect(
          x33 + colWidth1_33 + colWidth2_33 + colWidth3_33,
          y33,
          colWidth4_33,
          rowHeight33
        ) // Column 4 (Scores Obtained)
        .stroke();

      // Add text inside columns
      doc.text(col1, x33 + 5, y33 + 5, { width: colWidth1_33 - 10 });
      doc.text(col2, x33 + colWidth1_33 + 5, y33 + 5, {
        width: colWidth2_33 - 10,
      });
      doc.text(col3, x33 + colWidth1_33 + colWidth2_33 + 5, y33 + 5, {
        width: colWidth3_33 - 10,
      });
      doc.text(
        col4,
        x33 + colWidth1_33 + colWidth2_33 + colWidth3_33 + 5,
        y33 + 5,
        { width: colWidth4_33 - 10 }
      );
    }

    // Draw the table headers
    doc.fontSize(12).font("Helvetica-Bold");
    drawTableRow33(
      doc,
      x33,
      y33,
      "Competency Basis",
      "Score Basis",
      "Max Scores",
      "Scores obtained"
    );
    y33 += rowHeight33;

    // Draw the table rows
    doc.fontSize(12).font("Helvetica");
    drawTableRow33(
      doc,
      x33,
      y33,
      "1",
      "Practice Management – Operation",
      "",
      ""
    );
    y33 += rowHeight33;

    drawTableRow33(doc, x33, y33, "1.1.", "Practice Areas of the Firm", "", "");
    y33 += rowHeight33;

    drawTableRow33(
      doc,
      x33,
      y33,
      "i",
      "Revenue from audit and assurance services",
      "(i) 50% to 75% – 5 Points",
      "8"
    );
    y33 += rowHeight33;

    drawTableRow33(doc, x33, y33, "", "", "(ii) Above 75% – 8 Points", "");
    y33 += rowHeight33;

    drawTableRow33(
      doc,
      x33,
      y33,
      "ii",
      "Does the firm have a vision and mission statement? Does it address Forward looking practice statements/Plans?",
      "For Yes – 4 Points",
      "4"
    );
    y33 += rowHeight33;

    drawTableRow33(doc, x33, y33, "", "Total", "", "12");
    y33 += rowHeight33;

    drawTableRow33(
      doc,
      x33,
      y33,
      "1.2.",
      "Work Flow - Practice Manuals",
      "",
      ""
    );
    y33 += rowHeight33;

    drawTableRow33(
      doc,
      x33,
      y33,
      "i.",
      "Presence of Audit manuals containing the firm’s methodology that ensures compliance with auditing standards and implementation thereof.",
      "For Yes – 8 Points",
      "8"
    );
    y33 += rowHeight33;

    drawTableRow33(
      doc,
      x33,
      y33,
      "ii.",
      "Availability of standard formats relevant for audit quality like -",
      "For No – 0 Point",
      "8"
    );
    y33 += rowHeight33;

    drawTableRow33(doc, x33, y33, "", "- LCE", "", "");
    y33 += rowHeight33;

    drawTableRow33(doc, x33, y33, "", "- Representation letter", "", "");
    y33 += rowHeight33;

    drawTableRow33(doc, x33, y33, "", "- Significant working papers", "", "");
    y33 += rowHeight33;

    drawTableRow33(
      doc,
      x33,
      y33,
      "",
      "- Reports and implementation thereof",
      "",
      ""
    );
    y33 += rowHeight33;

    drawTableRow33(doc, x33, y33, "", "Total", "", "16");
    y33 += rowHeight33;

    //Add New Page
    doc.addPage();

    // Table No 34

    doc.moveDown(1);

    // Define column positions
    const startX34_1 = 50;
    const startY34_1 = 250;
    const colWidths34_1 = [80, 250, 100, 80]; // Adjust column widths
    let y = startY34_1;

    // Table Headers
    doc.font("Helvetica-Bold").fontSize(12);
    const headers34_1 = [
      "Competency Basis",
      "Score Basis",
      "Max Scores",
      "Scores Obtained",
    ];

    // Draw table header background
    doc
      .rect(
        startX34_1,
        y,
        colWidths34_1.reduce((a, b) => a + b, 0),
        25
      )
      .fill("#d3d3d3");
    doc.fillColor("black");

    headers34_1.forEach((text, i) => {
      doc.text(
        text,
        startX34_1 + colWidths34_1.slice(0, i).reduce((a, b) => a + b, 0) + 5,
        y + 5,
        { width: colWidths34_1[i] - 10, align: "center" }
      );
    });

    y += 30;

    // Draw horizontal line below headers
    doc
      .moveTo(startX34_1, y)
      .lineTo(startX34_1 + colWidths34_1.reduce((a, b) => a + b, 0), y)
      .stroke();

    // Table Data
    const data34_1 = [
      ["1.3", " Quality Review Manuals of Audit Tool", "", "", ""],
      [
        "i",
        "Usage of Client Acceptance/engagement acceptance checklists and adequate documentation thereof.",
        "For Yes – 4 Points, For No – 0 Point",
        "4",
        "",
      ],
      [
        "ii",
        "Evaluation of Independence for all engagements (partners, managers, staff, trainees) based on the extent required. The firm must identify self-interest threat, familiarity threat, intimidation threat, self- review threat, advocacy threat and conflict of interest.",
        "For Yes – 4 Points, For No – 0 Point",
        "4",
        "",
      ],
      [
        "iii",
        "Does the Firm maintain and use the engagement withdrawal/ rejection policy, templates, etc.",
        "For Yes – 4 Points, For No – 0 Point",
        "4",
        "",
      ],
      [
        "iv",
        "Availability and use of standard checklists in performance of an Audit for Compliance with Accounting and Auditing Standards",
        "For Yes – 4 Points, For No – 0 Point",
        "4",
        "",
      ],
      [
        "v",
        "Availability and use of standard formats for audit documentation of Business Understanding, Sampling basis, Materiality determination, Data analysis, and Control Evaluation",
        "For Yes – 4 Points, For No – 0 Point",
        "4",
        "",
      ],
      [
        "vi",
        "Are the documents related to Quality control mentioned from (i) to (v) above reviewed and updated on a frequent basis (say annually) or with each change in the respective regulation or statute and remedial action taken?",
        "For Yes – 4 Points, For No – 0 Point",
        "4",
        "",
      ],
    ];

    doc.font("Helvetica").fontSize(10);
    const rowHeight34_1 = 60;

    data34_1.forEach((row, rowIndex) => {
      let x = startX34_1;

      // Draw row border
      doc
        .rect(
          startX34_1,
          y,
          colWidths34_1.reduce((a, b) => a + b, 0),
          rowHeight34_1
        )
        .stroke();

      row.forEach((text, i) => {
        // Draw column separator
        doc
          .moveTo(x, y)
          .lineTo(x, y + rowHeight34_1)
          .stroke();

        doc.text(text, x + 5, y + 10, {
          width: colWidths34_1[i] - 10,
          align: "left",
        });
        x += colWidths34_1[i];
      });

      y += rowHeight34_1;

      // Handle page overflow
      if (y > 700) {
        doc.addPage();
        y = 100;
      }
    });

    //add new page
    doc.addPage();

    //Page No 35
    // Add title or header Page No 35
    doc
      .fontSize(16)
      .text("Service Delivery - Effort Monitoring", { align: "center" })
      .moveDown(2);

    // Function to draw a table with borders
    function drawTable(doc, startX, startY, tableData, colWidths, rowHeight) {
      if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
        console.error("Invalid table data!");
        return;
      }

      const rowCount = tableData.length;
      const colCount = tableData[0].length;

      let y = startY;

      // Draw horizontal lines (rows)
      for (let i = 0; i <= rowCount; i++) {
        doc
          .moveTo(startX, y)
          .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y)
          .stroke();
        y += rowHeight;
      }

      let x = startX;

      // Draw vertical lines (columns)
      for (let j = 0; j <= colCount; j++) {
        doc
          .moveTo(x, startY)
          .lineTo(x, startY + rowHeight * rowCount)
          .stroke();
        x += colWidths[j] || 0;
      }

      // Insert text into table cells
      y = startY + 8;
      tableData.forEach((row) => {
        x = startX + 5;
        row.forEach((cell, cellIndex) => {
          // For the first row, make text bold
          if (y === startY + 8) {
            doc.font("Helvetica-Bold").text(cell, x, y, {
              width: colWidths[cellIndex] - 10,
              align: "left",
            });
            doc.font("Helvetica");
          } else {
            doc.text(cell, x, y, {
              width: colWidths[cellIndex] - 10,
              align: "left",
            });
          }
          x += colWidths[cellIndex] || 0;
        });
        y += rowHeight;
      });
    }

    // Table data for the effort monitoring table
    const effortMonitoringTable = [
      ["Competency Basis", "Score Basis", "Max Scores", "Scores obtained"],
      [
        "respective regulation or statute and remedial action taken?",
        "",
        "",
        "",
      ],
      ["", "Total", "", "24", ""],
      ["1.4", "Service Delivery - Effort monitoring", "", ""],
      [
        "i.",
        " Does the firm carry out a Capacity planning for each engagement?",
        "For Yes – 4 Points\nFor No – 0 Point",
        "4",
        "",
      ],
      [
        "ii.",
        " Is a process of Budgeting & Planning of efforts required maintained (hours/days/ weeks)?",
        "For Yes – 4 Points\nFor No – 0 Point",
        "4",
        "",
      ],
      [
        "iii.",
        " Are Budget vs Actual analysis of time and effort spent carried out to identify the costing and pricing?",
        "Up to 10% – 0 Point\nMore than 10% and up to 30% – 4 Points\nMore than 30% and up to 50% – 8 Points\nMore than 50% and up to 70% – 12 Points\nMore than 70% and up to 90% – 16 Points\nMore than 90% – 20 Points",
        "20",
        "",
      ],
      [
        "iv.",
        " Does the firm deploy technology for monitoring efforts spent - Utilisation of tools to track each activity (similar to Project management - Say timesheets, task management, etc.)? Note: DCMM Version 2 may be referred to arrive at the",
        "For Yes – 8 Points",
        "8",
        "",
      ],
    ];

    // Draw the table
    drawTable(doc, 50, 100, effortMonitoringTable, [40, 200, 200, 60, 60], 60);
    doc.moveDown(4);

    doc.addPage;

    //Page No 36
    // // Add title or header
    // doc
    //   .fontSize(16)
    //   .text("Quality Control for Engagements", { align: "center" })
    //   .moveDown(2);

    // // Improved table drawing function
    // function drawTable(doc, startX, startY, tableData, colWidths, rowHeight) {
    //   if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
    //     console.error("Invalid table data:", tableData);
    //     return;
    //   }

    //   const rowCount = tableData.length;
    //   const colCount = tableData[0].length;

    //   let y = startY;

    //   // Draw horizontal lines (rows)
    //   for (let i = 0; i <= rowCount; i++) {
    //     doc
    //       .moveTo(startX, y)
    //       .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y)
    //       .stroke();
    //     y += rowHeight;
    //   }

    //   let x = startX;

    //   // Draw vertical lines (columns)
    //   for (let j = 0; j <= colCount; j++) {
    //     doc
    //       .moveTo(x, startY)
    //       .lineTo(x, startY + rowHeight * rowCount)
    //       .stroke();
    //     x += colWidths[j] || 0;
    //   }

    //   // Insert text into table cells
    //   y = startY + 8;
    //   tableData.forEach((row) => {
    //     x = startX + 5;
    //     row.forEach((cell, cellIndex) => {
    //       // Handle empty cells
    //       const cellContent =
    //         cell === undefined || cell === null ? "" : cell.toString();

    //       // For header row and "Total" row, make text bold
    //       if (
    //         y === startY + 8 ||
    //         (typeof cell === "string" && cell.includes("Total"))
    //       ) {
    //         doc.font("Helvetica-Bold").text(cellContent, x, y, {
    //           width: colWidths[cellIndex] - 10,
    //           align: "left",
    //         });
    //         doc.font("Helvetica");
    //       } else {
    //         doc.text(cellContent, x, y, {
    //           width: colWidths[cellIndex] - 10,
    //           align: "left",
    //         });
    //       }
    //       x += colWidths[cellIndex] || 0;
    //     });
    //     y += rowHeight;
    //   });
    // }

    // // Properly formatted table data
    // const qualityControlTable = [
    //   ["Competency Basis", "Score Basis", "Max Scores", "Scores obtained"],
    //   ["technical maturity of the firm/ CA.", "", "", ""],
    //   ["Total", "", "36", ""],
    //   ["1.5", "Quality Control for engagements", "", ""],
    //   [
    //     "I.",
    //     "Does the firm have a Quality Review of all Listed audit engagements as per para 60 of SQC12 Is there a document of time spent for review of all engagements?",
    //     "For Yes – 8 Points\nFor No – 0 Point",
    //     "8",
    //   ],
    //   [
    //     "II.",
    //     "Total engagements having concluded to be satisfactory as per quality review vs No of engagements quality reviewed",
    //     "Up to 10% – 0 Point\nMore than 10% and up to 30% – 4 Points\nMore than 30% and up to 50% – 8 Points\nMore than 50% and up to 70% – 12 Points\nMore than 70% and up to 90% – 16 Points\nMore than 90% – 20 Points",
    //     "20",
    //   ],
    //   [
    //     "III.",
    //     "No. of engagements without findings by ICAI, Committees of ICAI and regulators that require significant improvements",
    //     "10% to 30% – 4 Points\nMore than 30% and up to 50% – 8 Points\nMore than 50% and up to 70% – 12 Points\nMore than 70% and up to 90% – 16 Points\nMore than 90% – 20 Points",
    //     "20",
    //   ],
    // ];

    // // Verify table data before drawing
    // if (
    //   qualityControlTable &&
    //   Array.isArray(qualityControlTable) &&
    //   qualityControlTable.length > 0
    // ) {
    //   // Draw the table with adjusted column widths
    //   drawTable(doc, 50, 100, qualityControlTable, [50, 250, 150, 80], 60);
    // } else {
    //   console.error("Table data is invalid:", qualityControlTable);
    // }

    // Finalize the PDF

    doc.end();

    writeStream.on("finish", () => {
      callback(null, pdfPath);
    });
  } catch (error) {
    callback(error, null);
  }
};

module.exports = generateFormOnePDF;
