const express = require("express");
const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("views"));

// Serve the form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "form.html"));
});

// Generate PDF endpoint
app.post("/generate-pdf", (req, res) => {
  const formData = req.body;

  // Generate HTML with form data for both pages
  const html = generateCompletePdfHtml(formData);

  // PDF options
  const options = {
    format: "A4",
    border: {
      top: "20mm",
      right: "20mm",
      bottom: "20mm",
      left: "20mm",
    },
    type: "pdf",
    timeout: 60000,
  };

  // Create PDF
  pdf.create(html, options).toBuffer((err, buffer) => {
    if (err) {
      console.error("PDF generation error:", err);
      return res.status(500).json({ error: err.message });
    }

    // Save PDF to server
    const filename = `PeerReview_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "pdfs", filename);

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error("Error saving PDF:", err);
      } else {
        console.log("PDF saved:", filename);
      }
    });

    // Send PDF to client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(buffer);
  });
});

function generateCompletePdfHtml(data) {
  console.log(data);
  // Format dates for display
  const startDate = data.reviewStartDate
    ? new Date(data.reviewStartDate).toLocaleDateString()
    : "";
  const endDate = data.reviewEndDate
    ? new Date(data.reviewEndDate).toLocaleDateString()
    : "";
  const declarationDate = data.declarationDate
    ? new Date(data.declarationDate).toLocaleDateString()
    : "";

  // Generate checked options
  const checkedReasons = {
    mandatory: data.applyReason?.includes("mandatory") ? "✓" : "☐",
    voluntary: data.applyReason?.includes("voluntary") ? "✓" : "☐",
    specialCase: data.applyReason?.includes("specialCase") ? "✓" : "☐",
    newUnit: data.applyReason?.includes("newUnit") ? "✓" : "☐",
    boardDecision: data.applyReason?.includes("boardDecision") ? "✓" : "☐",
  };

  const checkedOptions = {
    sameCity: data.reviewerOption?.includes("sameCity") ? "✓" : "☐",
    outsideCity: data.reviewerOption?.includes("outsideCity") ? "✓" : "☐",
    either: data.reviewerOption?.includes("either") ? "✓" : "☐",
    preferredCity: data.reviewerOption?.includes("preferredCity") ? "✓" : "☐",
  };

  //   Page No 6
  const establishmentDate = data.establishmentDate
    ? new Date(data.establishmentDate).toLocaleDateString()
    : "";

  const reviewFrom = data.reviewFrom
    ? new Date(data.reviewFrom).toLocaleDateString()
    : "";

  const reviewTo = data.reviewTo
    ? new Date(data.reviewTo).toLocaleDateString()
    : "";
  const statusValue = data.status || [];
  const statusArray = Array.isArray(statusValue) ? statusValue : [statusValue];
  const statusChecks = {
    partnership: statusArray.includes("Partnership") ? "✓" : "☐",
    proprietorship: statusArray.includes("Proprietorship") ? "✓" : "☐",
    llp: statusArray.includes("Limited Liability Partnership") ? "✓" : "☐",
    individual: statusArray.includes("Practicing in individual name")
      ? "✓"
      : "☐",
  };

  // Networking details

  const networkSinceDate = data.networkSince
    ? new Date(data.networkSince).toLocaleDateString()
    : "";
  const networkingDetails = `
    <div style="margin-top: 10px;">
      <p>(i) Name of network: <span class="dotted-field">${
        data.networkName || ""
      }</span></p>
      <p>(ii) Since when the Networking is entered into: <span class="dotted-field">${networkSinceDate}</span></p>
      <p>(iii) Is there any exit from the Networking recently: 
        <span>${data.hasExit === "yes" ? "Yes" : "No"}</span>
      </p>
      <p>Reason for such exit: <span class="dotted-field">${
        data.reasonForExit || ""
      }</span></p>
    </div>
  `;

  const signatureDate =
    data.signature_date || new Date().toISOString().split("T")[0];

  //form no 8

  //function generateCompletePdfHtml(data) {
  // Format dates for display
  const selfEvalDate = data.self_evaluation_date
    ? new Date(data.self_evaluation_date).toLocaleDateString()
    : "";

  //Form no 9
  const formatCell = (value) => value || "&nbsp;";

  //Form no 10
  function generateEntityRows(data, prefix, count) {
    let rows = "";

    for (let i = 1; i <= count; i++) {
      rows += `
      <tr>
        <td style="width:6.4%;">${prefix.charAt(0).toUpperCase()}${i}</td>
        <td style="width:10.7%;"><span class="input-value">${
          data[`${prefix}_name${i}`] || ""
        }</span></td>
        <td style="width:7.72%;"><span class="input-value">${
          data[`${prefix}_engagement${i}`] || ""
        }</span></td>
        <td style="width:7.52%;"><span class="input-value">${
          data[`${prefix}_type${i}`] || ""
        }</span></td>
        <td style="width:7.92%;"><span class="input-value">${
          data[`${prefix}_fees${i}`] || ""
        }</span></td>
        <td style="width:9.5%;"><span class="input-value">${
          data[`${prefix}_remarks${i}`] || ""
        }</span></td>
        <td style="width:9.52%;"><span class="input-value">${
          data[`${prefix}_col6_${i}`] || ""
        }</span></td>
        <td style="width:13.82%;"><span class="input-value">${
          data[`${prefix}_col7_${i}`] || ""
        }</span></td>
        <td style="width:8.42%;"><span class="input-value">${
          data[`${prefix}_col8_${i}`] || ""
        }</span></td>
        <td style="width:10.86%;"><span class="input-value">${
          data[`${prefix}_col9_${i}`] || ""
        }</span></td>
        <td style="width:7.62%;"><span class="input-value">${
          data[`${prefix}_col10_${i}`] || ""
        }</span></td>
      </tr>
    `;
    }

    return rows;
  }

  //Page No 23 to 25

  const getDisplayValue26 = (value) => {
    if (!value) return "";
    return value === "Yes" ? "Yes" : value === "No" ? "No" : "N/A";
  };

  //   Page No 26
  // Helper function to get radio button value
  const getRadioValue = (name) => {
    return data[name] === "yes" ? "YES" : data[name] === "no" ? "NO" : "N/A";
  };

  // Page No 30
  // Helper function to get display value for YES/NO/NA fields
  const getDisplayValue = (value) => {
    if (!value) return "";
    return value === "YES" ? "YES" : value === "NO" ? "NO" : "N/A";
  };

  //   Form No 31
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  // Generate the complete HTML with both pages

  //Page no 32
  // Generate checked options
  const generateCheckbox = (value) => (value ? "✓" : "☐");

  // QC monitoring responses
  const qcResponses = {};
  for (let i = 1; i <= 9; i++) {
    const key = `qc_monitoring_${i === 9 ? "ix" : "i".repeat(i)}`;
    qcResponses[key] = data[key] || "";
  }

  // Page No 35
  function getBudgetAnalysisText(value) {
    const points = parseInt(value) || 0;
    switch (points) {
      case 0:
        return "Up to 10% (0 Points)";
      case 4:
        return "More than 10% and up to 30% (4 Points)";
      case 8:
        return "More than 30% and up to 50% (8 Points)";
      case 12:
        return "More than 50% and up to 70% (12 Points)";
      case 16:
        return "More than 70% and up to 90% (16 Points)";
      case 20:
        return "More than 90% (20 Points)";
      default:
        return "";
    }
  }

  // Page no 36

  const qualityReviewScore = data.quality_review === "yes" ? 8 : 0;
  const satisfactoryScore = parseInt(data.satisfactory_engagements || 0);
  const withoutFindingsScore = parseInt(data.engagements_without_findings || 0);
  const totalScore =
    qualityReviewScore + satisfactoryScore + withoutFindingsScore;

  // page no 37

  const getSelectValue = (name) => {
    const value = data[name];
    if (name === "question_i") {
      return value === "4" ? "Yes" : "No";
    } else if (name === "question_ii") {
      switch (value) {
        case "0":
          return "Less than 5% - 0 Point";
        case "-1":
          return "More than 5% to 15% (-1) Point";
        case "-3":
          return "More than 15% to 30% to 50% (-3) Points";
        case "-4":
          return "More than 50% (-4) Points";
        default:
          return "";
      }
    } else if (name === "question_iii") {
      switch (value) {
        case "0":
          return "Less than 5% - 0 Point";
        case "-1":
          return "More than 5% to 15% (-1) Point";
        case "-2":
          return "More than 15% to 30% (-2) Points";
        case "-3":
          return "More than 30% to 50% (-3) Points";
        case "-4":
          return "More than 50% (-4) Points";
        default:
          return "";
      }
    } else if (name === "question_iv") {
      return value === "0" ? "Yes - 12 Points" : "No - 0 Point";
    }
    return "";
  };

  // Calculate total score
  const total =
    (data.question_i === "4" ? 12 : 0) +
    (parseInt(data.question_ii) || 0) +
    (parseInt(data.question_iii) || 0) +
    (data.question_iv === "0" ? 12 : 0);

  // Page No 38
  // Calculate scores for each question
  const scoreI = data.question_i === "4" ? 12 : -1;
  const scoreII = parseInt(data.question_ii) || 0;
  const scoreIII = parseInt(data.question_iii) || 0;
  const scoreIV = data.question_iv === "0" ? 12 : 0;
  const totals = scoreI + scoreII + scoreIII + scoreIV;

  // Page 37 to 41

  function generateTechAdoptionRows(data) {
    const techItems = [
      { id: "i_1", text: "Internal communication - chats" },
      {
        id: "i_2",
        text: "Has the firm automated its office with automated Attendance System and Leave management?",
      },
      {
        id: "i_3",
        text: "Project or activity management/ Timesheet management",
      },
      { id: "i_4", text: "Digital storage of records (scan, etc.)" },
      { id: "i_5", text: "Centralised server/ Cloud" },
      { id: "i_6", text: "Digital Library (Own or ICAI)" },
      {
        id: "i_7",
        text: "Client interaction (Alerts, updates, availability of information in website, etc.)",
      },
      { id: "i_8", text: "Video conferencing facilities adopted" },
      {
        id: "i_9",
        text: "Does the firm use only licensed operating system, software etc.?",
      },
      { id: "i_10", text: "Own E-mail domains, E-mail usage policies, etc." },
      { id: "i_11", text: "Use of anti-virus and malware protection tools" },
      { id: "i_12", text: "Data security, etc." },
      { id: "i_13", text: "Cyber security measures" },
    ];

    return techItems
      .map(
        (item) => `
    <tr>
      <td style="width: 9.0769%;"></td>
      <td style="width: 39.3228%;">
        <p class="bullet-item"><span class="calibri">• ${item.text}</span></p>
      </td>
      <td style="width: 20.5234%;">
        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">For Yes - 4 Points</span></p>
        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">For No - 0 Point</span></p>
      </td>
      <td style="width: 19.4968%;" class="text-center">
        <p style="margin-top:2.0pt;"><span class="calibri">4</span></p>
      </td>
      <td style="width: 13.734%;" class="text-center">
        <p style="margin-top:2.0pt;"><strong>${
          data[`tech_adoption_${item.id}`] === "yes" ? "Yes" : "No"
        } (Score: ${
          data[`tech_adoption_${item.id}`] === "yes" ? 4 : 0
        })</strong></p>
      </td>
    </tr>
  `
      )
      .join("");
  }

  // Calculate scores
  const calculateScore = (section, values) => {
    let score = 0;

    if (section === "client_sensitization") {
      if (values.i === "yes") score += 8;
      if (values.ii === "yes") score += 8;
    } else if (section === "tech_adoption") {
      // Office technology
      if (values.i_1 === "yes") score += 4;

      if (values.i_2 === "yes") score += 4;
      if (values.i_3 === "yes") score += 4;
      if (values.i_4 === "yes") score += 4;
      if (values.i_5 === "yes") score += 4;
      if (values.i_6 === "yes") score += 4;
      if (values.i_7 === "yes") score += 4;
      if (values.i_8 === "yes") score += 4;
      if (values.i_9 === "yes") score += 4;
      if (values.i_10 === "yes") score += 4;

      // Service delivery technology
      if (values.ii === "yes") score += 12;
    } else if (section === "revenue_pricing") {
      if (values.i === "yes") score += 4;
      if (values.ii === "yes") score += 8;
      if (values.iii === "50") score += 2;
      if (values.iii === "more_than_50") score += 4;
    }

    return score;
  };

  // Calculate section totals
  const clientSensitizationScore = calculateScore("client_sensitization", {
    i: data.client_sensitization_i,
    ii: data.client_sensitization_ii,
  });

  const techAdoptionScore = calculateScore("tech_adoption", {
    i_1: data.tech_adoption_i_1,
    i_2: data.tech_adoption_i_2,
    i_3: data.tech_adoption_i_3,
    i_4: data.tech_adoption_i_4,
    i_5: data.tech_adoption_i_5,
    i_6: data.tech_adoption_i_6,
    i_7: data.tech_adoption_i_7,
    i_8: data.tech_adoption_i_8,
    i_9: data.tech_adoption_i_9,
    i_10: data.tech_adoption_i_10,
    ii: data.tech_adoption_ii,
  });

  const revenuePricingScore = calculateScore("revenue_pricing", {
    i: data.revenue_pricing_i,
    ii: data.revenue_pricing_ii,
    iii: data.revenue_pricing_iii,
  });

  const section1Total =
    clientSensitizationScore + techAdoptionScore + revenuePricingScore;

  // page no 42 to 46
  function calculateSubtotal(formData, sectionPrefix, criteriaCount) {
    let subtotal = 0;
    const romanNumerals = [
      "i",
      "ii",
      "iii",
      "iv",
      "v",
      "vi",
      "vii",
      "viii",
      "ix",
      "x",
      "xi",
      "xii",
      "xiii",
      "xiv",
    ];

    for (let i = 0; i < criteriaCount; i++) {
      const score = parseInt(
        formData[`score_${sectionPrefix}_${romanNumerals[i]}`] || 0
      );
      subtotal += score;
    }
    return subtotal;
  }

  function generateAssessmentRow(number, criteria, basis, maxScore, score) {
    return `
    <tr>
      <td>${number}</td>
      <td>${criteria}</td>
      <td>${basis}</td>
      <td class="text-center">${maxScore}</td>
      <td class="text-center">${score || 0}</td>
    </tr>
  `;
  }

  function generateTotalRow(label, maxScore, score) {
    return `
    <tr class="total-row">
      <td colspan="2">${label}</td>
      <td></td>
      <td class="text-center">${maxScore}</td>
      <td class="text-center">${score}</td>
    </tr>
  `;
  }

  // Calculate all scores
  const formData = "formData";
  const scores = {
    section_2_1: calculateSubtotal(formData, "2_1", 6),
    section_2_2: calculateSubtotal(formData, "2_2", 4),
    section_2_3: calculateSubtotal(formData, "2_3", 14),
    section_2_4: calculateSubtotal(formData, "2_4", 3),
    section_2_5: calculateSubtotal(formData, "2_5", 4),
    totalScore: 0,
  };
  scores.totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);

  //   Page No 47 to 50
  const getScore = (field) => data[field] || "0";

  // Page No 11 to 20

  const checkedResources = {
    manpower: data.resources?.includes("Manpower") ? "✓" : "☐",
    it: data.resources?.includes("IT tools") ? "✓" : "☐",
    library: data.resources?.includes("Library") ? "✓" : "☐",
    review: data.resources?.includes("Regular review mechanism") ? "✓" : "☐",
  };

  return `

    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: "Arial Narrow", sans-serif;
                font-size: 15px;
                line-height: 13.5pt;
                margin: 0;
                padding: 20px;
            }
            .form-container {
                max-width: 800px;
                margin: 0 auto;
            }
            .text-center {
                text-align: center;
            }
            .text-justify {
                text-align: justify;
            }
            .form-title {
                margin-top: 4.9pt;
                margin-bottom: 6pt;
                margin-left: 12.3pt;
                text-indent: -12.3pt;
            }
            .underline {
                text-decoration: underline;
            }
            table {
                border-collapse: collapse;
                width: 100%;
                margin: 10px 0;
            }
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 5px;
                vertical-align: top;
            }
            th {
                background-color: #d9d9d9;
                text-align: center;
            }
            .dotted-field {
                border-bottom: 1px dotted black;
                min-width: 200px;
                display: inline-block;
            }
            .dotted-field1 {
                border-bottom: 1px dotted black;
                min-width: 50px;
                display: inline-block;
            }
            .dotted-field2 {
                border-bottom: 1px dotted black;
                min-width: 80px;
                display: inline-block;
            }
            ol {
                padding-left: 20px;
            }
            ol.lower-roman {
                list-style-type: lower-roman;
            }
            .checkbox {
                font-family: "Arial Unicode MS";
            }
            textarea {
                width: 100%;
                border: 1px solid black;
                font-family: Arial Narrow;
                font-size: 15px;
            }
            .declaration-section {
                margin-top: 30px;
            }
            .signature-section {
                margin-top: 50px;
            }
            .yes-no-table {
                width: 50px;
                float: right;
                margin-top: 40px;
                
            }
            .page-break {
                page-break-before: always;
                margin-top: 50px;
            }
        </style>
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.5;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
            h1 {
                text-align: center;
                font-size: 16px;
                margin-bottom: 10px;
            }
            h1:first-child {
                margin-top: 0;
            }
            .section {
                margin-bottom: 20px;
            }
            .form-group {
                margin-bottom: 10px;
            }
            label {
                font-weight: bold;
            }
            .dotted-field {
                border-bottom: 1px dotted #000;
                min-width: 300px;
                display: inline-block;
                padding-bottom: 2px;
                margin-left: 5px;
            }
            .checkbox {
                font-family: "Arial Unicode MS";
                margin-right: 5px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
            }
            table, th, td {
                border: 1px solid #000;
            }
            th, td {
                padding: 5px;
                text-align: left;
            }
            .page-break {
                page-break-before: always;
                margin-top: 50px;
            }
        </style>
    </head>
    <body>
        <!-- Page 1 -->
        <div class="form-container">
            <p class="form-title text-center"><strong>FORM 1</strong></p>
            <p class="text-center">
                <strong>APPLICATION CUM QUESTIONNAIRE TO BE SUBMITTED BY<br>PRACTICE UNIT</strong>
            </p>
            <p class="text-center">
                <strong>[<em>As per</em> <em>Clause 6(1) &amp; 6 (2) of the Peer Review Guidelines 2022]</em></strong>
            </p>
            <p><strong>&nbsp;</strong></p>
            <p><strong>The Secretary, Peer Review Board,</strong></p>
            <p><strong>The Institute of Chartered Accountants of India,&nbsp;</strong></p>
            <p><strong>ICAI Bhawan,</strong></p>
            <p><strong>Post Box No. 7100,</strong></p>
            <p><strong>Indraprastha Marg, New Delhi – 110002&nbsp;</strong></p>
            <p><strong>&nbsp;</strong></p>
            <p class="text-center"><strong>APPLICATION</strong></p>
            <p class="text-center"><strong>&nbsp;</strong></p>
            <p>Dear Sir,</p>
            <p class="text-center"><strong><s><span style="text-decoration:none;">&nbsp;</span></s></strong></p>
            
            <ol>
                <li>
                    Our Firm <span class="dotted-field">${
                      data.firmName || ""
                    }</span> 
                    (Name of practice unit as per ICAI Records); FRN/ M. No <span class="dotted-field1">${
                      data.firmRegNumber || ""
                    }</span> 
                    (Firm Registration Number/ Mem. No.) would like to apply for Peer Review for the period from 
                    <span class="dotted-field2">${startDate}</span> to <span class="dotted-field2">${endDate}</span> 
                    (three preceding financial years from the date of application). We have gone through the Peer Review Guidelines 2022 hosted at 
                    <a href="https://resource.cdn.icai.org/72010prb57960-peer-review-guidelines2022.pdf">
                        https://resource.cdn.icai.org/72010prb57960-peer-review-guidelines2022.pdf
                    </a> 
                    and undertake to abide by the same.
                </li>
                
                <li>
                    I/We hereby declare that my/our firm is applying for Peer Review (Tick the applicable clause):
                    <ol class="lower-roman">
                        <li>
                            <span class="checkbox">${
                              checkedReasons.mandatory
                            }</span> 
                            As it is Mandatory by: ICAI Any other Regulator (please specify) 
                            <span class="dotted-field1">${
                              data.otherRegulator || ""
                            }</span>
                        </li>
                        <li><span class="checkbox">${
                          checkedReasons.voluntary
                        }</span> Voluntarily:</li>
                        <li><span class="checkbox">${
                          checkedReasons.specialCase
                        }</span> As a special case Review initiated by the Board:</li>
                        <li><span class="checkbox">${
                          checkedReasons.newUnit
                        }</span> New Unit:</li>
                        <li><span class="checkbox">${
                          checkedReasons.boardDecision
                        }</span> As per decision of the Board:</li>
                    </ol>
                </li>
                
                <li>
    I/We hereby declare that my/our firm has signed reports pertaining 
    <div class="page-break"></div>
    to the following assurance services during the period under review:
</li>
            </ol>
            
            <table>
                <tr>
                    <th>S. No.</th>
                    <th>Type of Assurance service rendered</th>
                    <th>Major type of Client <u>(please specify)</u> (e.g.: Banks; Insurance Company; Manufacturing; Individuals; Trading ; any other )</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Central Statutory Audit</td>
                    <td>${data.clientType1 || ""}</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Statutory Audit</td>
                    <td>${data.clientType2 || ""}</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Internal Audit</td>
                    <td>${data.clientType3 || ""}</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Tax Audit</td>
                    <td>${data.clientType4 || ""}</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>Concurrent Audit</td>
                    <td>${data.clientType5 || ""}</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>Certification work</td>
                    <td>${data.clientType6 || ""}</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>Any other, please specify ${
                      data.otherService ? "✓" : "☐"
                    }</td>
                    <td>${data.clientType7 || ""}</td>
                </tr>
            </table>
            
            <ol start="4">
                <li>
                    I / We hereby declare that my/ our firm has Conducted/ has not Conducted Statutory Audit of enterprises Listed in India or abroad as defined under SEBI LODR, 2015 during the Review Period.
                </li>
                
                <li>
                    Option for appointment of Reviewer: (Tick appropriate option)
                    <ol class="lower-roman">
                        <li><span class="checkbox">${
                          checkedOptions.sameCity
                        }</span> Same City</li>
                        <li><span class="checkbox">${
                          checkedOptions.outsideCity
                        }</span> From outside City</li>
                        <li><span class="checkbox">${
                          checkedOptions.either
                        }</span> Either option (i) or (ii)</li>
                        <li>
                            <span class="checkbox">${
                              checkedOptions.preferredCity
                            }</span> 
                            Preferred City in case of option (ii) <span class="dotted-field1">${
                              data.preferredCity || ""
                            }</span>
                        </li>
                    </ol>
                </li>
                
                <li>
                    Mail Id for communication with the Practice unit 
                    <span class="dotted-field">${
                      data.communicationEmail || ""
                    }</span>
                </li>
                
                <li>
                    Address for sending the Peer Review Certificate<br>
                    <div style="border:1px solid black; padding:5px; min-height:50px;">
                        ${
                          data.certificateAddress
                            ? data.certificateAddress.replace(/\n/g, "<br>")
                            : ""
                        }
                    </div>
                </li>
            </ol>
            
            <p style="text-align: center; text-decoration: underline; margin-top: 20px; border-top: 3px solid black; padding-top: 10px; font-weight: bold;">
                Further Information to be submitted by New Unit
            </p>
              <li>
                    8.	Tick the applicable clause or mention N.A. as the case may be:<br> 
                </li>
        </div>
        
        <!-- Page 2 -->
        <div class="page-break form-container">
            <ol>
                <li>
                    <ul>
                        <li>
                            CA <span class="dotted-field">${
                              data.partnerName1 || ""
                            }</span>, 
                            M.No. [<span class="dotted-field1">${
                              data.memberNumber1 || ""
                            }</span>], 
                            partner of my firm is/was a partner/proprietor of the firm 
                            <span class="dotted-field">${
                              data.firmName1 || ""
                            }</span> (name and FRN of firm as per ICAI records)
                            having a Peer Review Certificate No. (<span class="dotted-field1">${
                              data.certNumber1 || ""
                            }</span>) 
                            that is valid from <span class="dotted-field2">${
                              data.validFrom1 || ""
                            }</span> till <span class="dotted-field2">${
    data.validTill1 || ""
  }</span>.
                        </li>
                        <li>
                            I am/was a partner/proprietor of the firm 
                            <span class="dotted-field">${
                              data.firmName2 || ""
                            }</span>(name and FRN of firm as per ICAI records) 
                            having a Peer Review Certificate No. (<span class="dotted-field1">${
                              data.certNumber2 || ""
                            }</span>) 
                            that is valid from <span class="dotted-field2">${
                              data.validFrom2 || ""
                            }</span> till <span class="dotted-field2">${
    data.validTill2 || ""
  }</span>.
                        </li>
                        <li>
                            CA <span class="dotted-field">${
                              data.employeeName || ""
                            }</span>, 
                            (M.No. <span class="dotted-field1">${
                              data.employeeMemberNumber || ""
                            }</span>), 
                            an employee of my firm who is a Chartered Accountant, is/was a partner/proprietor of the firm 
                            <span class="dotted-field">${
                              data.firmName3 || ""
                            }</span>(name and FRN of firm as per ICAI records) 
                            having a Peer Review Certificate No. (<span class="dotted-field1">${
                              data.certNumber3 || ""
                            }</span>) 
                            that is valid from <span class="dotted-field2">${
                              data.validFrom3 || ""
                            }</span> till <span class="dotted-field2">${
    data.validTill3 || ""
  }</span>.
                        </li>
                        <li>
                            CA <span class="dotted-field">${
                              data.partnerName2 || ""
                            }</span>, 
                            M.No. [<span class="dotted-field1">${
                              data.memberNumber2 || ""
                            }</span>], 
                            partner of my firm <span class="dotted-field">${
                              data.firmName4 || ""
                            }</span>, 
                            is an Empanelled Peer Reviewer who has qualified the test organised by the Board.
                        </li>
                        <li>
                            I, CA <span class="dotted-field">${
                              data.proprietorName || ""
                            }</span>, 
                            M.No. <span class="dotted-field1">${
                              data.proprietorNumber || ""
                            }</span>, 
                            am an Empanelled Peer Reviewer who has qualified the test organised by the Board.
                        </li>
                    </ul>
                    
                    
                    <div style="clear: both;"></div>
                </li>

                <li>
                    <p>Policies, procedures, and infrastructure of my firm are in conformity with the Standards on Quality Control (SQC-1).</p>

                      <table class="yes-no-table" style="width: 50px; border: 1px solid #000; border-collapse: collapse; margin: 10px 0;">
                          <tbody>
                              <tr>
                                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">☑ YES</td>
                              </tr>
                              <tr>
                                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">□ NO</td>
                              </tr>
                          </tbody>
                      </table>
                    
                </li>

                <li>
                    <p>I wish to undertake audit of listed entity and further declare that: (Fill as applicable or else mention N.A.)</p>
                    <ul>
                        <li>
                            CA <span class="dotted-field">${
                              data.listedPartnerName || ""
                            }</span>, 
                            M.No. [<span class="dotted-field1">${
                              data.listedPartnerNumber || ""
                            }</span>], 
                            partner of my firm has carried out audit of Listed company in last three years.
                        </li>
                        <li>
                            I, CA <span class="dotted-field">${
                              data.listedProprietorName || ""
                            }</span>, 
                            M.No. <span class="dotted-field1">${
                              data.listedProprietorNumber || ""
                            }</span> 
                            (in case of proprietorship firm) have carried out audit of Listed company in last three years.
                        </li>
                    </ul>
                </li>

                <li>
                    <p>The Practice Unit nominates its Partner CA <span class="dotted-field">${
                      data.nominatedPartnerName || ""
                    }</span> for Peer Review process. 
                    His Mobile No. is <span class="dotted-field1">${
                      data.nominatedPartnerMobile || ""
                    }</span> 
                    and E-MAIL id is <span class="dotted-field">${
                      data.nominatedPartnerEmail || ""
                    }</span>.</p>
                </li>

                <li>
                    <p>Annexure: Questionnaire</p>
                </li>
            </ol>

            <div class="declaration-section">
                <p>• I hereby Declare that the details furnished above are true and correct</p>

                <p class="page-break"> as borne out by the facts to the best of my knowledge and belief.</p>

                <p>• I understand that the Peer Review Certificate, issued on the basis of the report submitted by the reviewer does not provide immunity from Disciplinary/ legal proceedings or actions initiated against Practice Unit or its partners/ employees. </p>
                <p>•	I undertake to pay the fee to the Peer Reviewer within 7 days from the date of receipt of the invoice from the Peer Reviewer. </p>
                <p>•	I further undertake and agree that the certificate can be revoked for any of the reason stated in the Peer Review Guidelines</p>
            </div>

                    <div class="signature-section" style="line-height: 1.8; padding: 10px 0;">
            <ul style="list-style: none; padding: 0;">
                <li>
                    <strong>Place:</strong> <span class="dotted-field1">${
                      data.place || ""
                    }</span>
                </li>
                <li>
                    <strong>Date:</strong> <span class="dotted-field1">${declarationDate}</span>
                </li>
                <li>
                    <div style="display: flex; justify-content: space-between;">
                        <span><strong>Signature of the Proprietor/Partner</strong></span>
                        <span><strong>Name:</strong> <span class="dotted-field1">${
                          data.signatoryName || ""
                        }</span></span>
                    </div>
                </li>
                <li>
                    <strong>Membership No.:</strong> <span class="dotted-field1">${
                      data.signatoryMemberNumber || ""
                    }</span>
                </li>
            </ul>
        </div>
        <body>
        

        // Page No 5
        <div class="container page-break">
            <h1>Annexure</h1>
            <h1>QUESTIONNAIRE</h1>
            <h1>(PART A - PROFILE OF PRACTICE UNIT (PU))</h1>
            
            <div class="section">
                <div class="form-group">
    <label>1. Name of the Practice Unit:</label>
    <span style="display: block; border: 1px solid #000; padding: 0.5em; margin-top: 0.5em; min-height: 2.5em; width: 100%;">
        ${data.practiceUnitName || ""}
    </span>
</div>

                
                <div class="form-group">
    <label>2. Peer Review of:</label>
    <span style="display: flex; gap: 1em; margin-top: 0.5em;">
        <label>
            <input type="checkbox" ${
              data.reviewType === "HO" ? "checked" : ""
            } disabled />
            HO
        </label>
        <label>
            <input type="checkbox" ${
              data.reviewType === "Branch" ? "checked" : ""
            } disabled />
            Branch
        </label>
        
    </span>
</div>

                <div class="form-group">
                    <label>3. Address (As per ICAI records):</label>
                    <span class="dotted-field">
                    <p>${data.address || ""}</p>
                </div>
                
                <div class="form-group">
                    <label>4. Email ID of PU:</label>
                    <span class="dotted-field">${data.email || ""}</span>
                </div>
                
                <div class="form-group">
                    <label>Website of PU:</label>
                    <span class="dotted-field">${data.website || ""}</span>
                </div>
                
                <div class="form-group">
                    <label>5. Status:</label>
                    <p>
                        <span class="checkbox">${
                          statusChecks.partnership
                        }</span> Partnership &nbsp;
                        <span class="checkbox">${
                          statusChecks.proprietorship
                        }</span> Proprietorship &nbsp;
                        <span class="checkbox">${
                          statusChecks.llp
                        }</span> Limited Liability Partnership &nbsp;
                        <span class="checkbox">${
                          statusChecks.individual
                        }</span> Practicing in individual name
                    </p>
                </div>
                
                <div class="form-group">
                    <label>6. Date of establishment of the PU:</label>
                    <span class="dotted-field">${establishmentDate}</span>
                </div>
                
                <div class="form-group">
                    <label>7. Firm Registration Number:</label>
                    <span class="dotted-field">${
                      data.firmRegNumber || ""
                    }</span>
                    <small>(Membership No. in case of an individual practicing in own name)</small>
                </div>
                
                 <div class="form-group">
                <label>8. Is there any networking firm?</label>
                <span>${data.hasNetworking === "yes" ? "Yes" : "No"}</span>
                ${networkingDetails}
            </div>
                
                <div class="form-group">
                    <label>9. Period of assurance service under review</label>
                    <p>
                        From: <span class="dotted-field">${reviewFrom}</span> 
                        To: <span class="dotted-field">${reviewTo}</span>
                    </p>
                </div>
                
                <div class="form-group">
                 <label>10. Contact person of PU for Peer Review (along with Mobile No. and Email id):</label>
                <div class="dotted-field">
              <p style="white-space: pre-wrap; margin: 0;">${
                data.contactPerson || ""
              }</p>
                </div>
            </div>
      </div>
        </div>

        <div class="form-container page-break">
            <!-- Section 11 -->
            <div class="section-title">
                11. Particulars about the constitution of the PU <strong>during the period under review</strong> (as per <strong>Form 18</strong> filled with the ICAI). Is there assurance service like Statutory audit, tax audit, Taxation etc. headed by different partners, if yes details to be provided in the below table:
            </div>
            
            <table class="partner-table">
                <tbody>
                    <tr>
                        <td rowspan="2" style="width: 5.8%;">Name of sole-practitioner/ sole-proprietor/ partner</td>
                        <td rowspan="2" style="width: 15.5%;">Membership no. of sole-practitioner/ sole-proprietor/ partner</td>
                        <td rowspan="2" style="width: 14.56%;">Association with Practice unit (in years)</td>
                        <td rowspan="2" style="width: 15.68%;">Any Post Qualification or Certificate course pursued within or outside ICAI.</td>
                        <td rowspan="2" style="width: 15.62%;">Professional experience in practice</td>
                        <td rowspan="2" style="width: 16%;">Predominant function (e.g. audit, tax, consulting)</td>
                        <td colspan="2" style="width: 16.82%;">Details of Changes</td>
                    </tr>
                    <tr>
                        <td style="width: 8.62%;">Joined (Year)</td>
                        <td style="width: 8.2%;">Left (Year)</td>
                    </tr>
                    <tr>
                        <td>${data.partner1_name || ""}</td>
                        <td>${data.partner1_membership || ""}</td>
                        <td>${data.partner1_association || ""}</td>
                        <td>${data.partner1_qualification || ""}</td>
                        <td>${data.partner1_experience || ""}</td>
                        <td>${data.partner1_function || ""}</td>
                        <td>${data.partner1_joined || ""}</td>
                        <td>${data.partner1_left || ""}</td>
                    </tr>
                    <tr>
                        <td>${data.partner2_name || ""}</td>
                        <td>${data.partner2_membership || ""}</td>
                        <td>${data.partner2_association || ""}</td>
                        <td>${data.partner2_qualification || ""}</td>
                        <td>${data.partner2_experience || ""}</td>
                        <td>${data.partner2_function || ""}</td>
                        <td>${data.partner2_joined || ""}</td>
                        <td>${data.partner2_left || ""}</td>
                    </tr>
                    <tr>
                        <td>${data.partner3_name || ""}</td>
                        <td>${data.partner3_membership || ""}</td>
                        <td>${data.partner3_association || ""}</td>
                        <td>${data.partner3_qualification || ""}</td>
                        <td>${data.partner3_experience || ""}</td>
                        <td>${data.partner3_function || ""}</td>
                        <td>${data.partner3_joined || ""}</td>
                        <td>${data.partner3_left || ""}</td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Section 12 -->
            <div class="section-title">
                12. Particulars of Chartered Accountants Employed / Paid Assistant or Consultants as on ${
                  data.as_on_date || ""
                } (last date of block period of peer review):
            </div>
            
            <div align="center">
                <table style="width: 397px;">
                    <tbody>
                        <tr>
                            <td style="width: 71.75pt;">Name (s)</td>
                            <td style="width: 73.6pt;">Membership no.</td>
                            <td style="width: 80.7pt;">Association with the practice unit (in years)</td>
                            <td style="width: 70.95pt;">Experience (in years)</td>
                        </tr>
                        <tr>
                            <td>${data.ca1_name || ""}</td>
                            <td>${data.ca1_membership || ""}</td>
                            <td>${data.ca1_association || ""}</td>
                            <td>${data.ca1_experience || ""}</td>
                        </tr>
                        <tr>
                            <td>${data.ca2_name || ""}</td>
                            <td>${data.ca2_membership || ""}</td>
                            <td>${data.ca2_association || ""}</td>
                            <td>${data.ca2_experience || ""}</td>
                        </tr>
                        <tr>
                            <td>${data.ca3_name || ""}</td>
                            <td>${data.ca3_membership || ""}</td>
                            <td>${data.ca3_association || ""}</td>
                            <td>${data.ca3_experience || ""}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Section 13 -->
            <div class="section-title">
                13. Details of Other Employees as on ${
                  data.as_on_date_employees || ""
                } (last date of block period of peer review):
            </div>
            
            <table class="employee-table">
                <tbody>
                    <tr>
                        <td style="width: 63.22%;">Particulars</td>
                        <td style="width: 36.78%;">Number</td>
                    </tr>
                    <tr>
                        <td>(a) Semi-Qualified Assistants</td>
                        <td>${data.semi_qualified || ""}</td>
                    </tr>
                    <tr>
                        <td>(b) Articled Assistants</td>
                        <td>${data.articled_assistants || ""}</td>
                    </tr>
                    <tr>
                        <td>(c) Administrative Staff</td>
                        <td>${data.admin_staff || ""}</td>
                    </tr>
                    <tr>
                        <td>(d) Others</td>
                        <td>${data.other_staff || ""}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section-title page-break">
                14. If the PU has any branch offices, furnish the following details of member in charge and number of staff:
            </div>
            
            <table class="branch-table">
                <tbody>
                    <tr>
                        <td style="width: 10.54%;">S.No</td>
                        <td style="width: 18.08%;">Member in Charge</td>
                        <td style="width: 16.6%;">No. of staff</td>
                        <td style="width: 18.06%;">Membership No</td>
                        <td style="width: 15.06%;">Address</td>
                        <td style="width: 21.64%;">Whether assurance services rendered</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>${data.branch1_member || ""}</td>
                        <td>${data.branch1_staff || ""}</td>
                        <td>${data.branch1_membership || ""}</td>
                        <td>${data.branch1_address || ""}</td>
                        <td>${data.branch1_assurance || ""}</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>${data.branch2_member || ""}</td>
                        <td>${data.branch2_staff || ""}</td>
                        <td>${data.branch2_membership || ""}</td>
                        <td>${data.branch2_address || ""}</td>
                        <td>${data.branch2_assurance || ""}</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>${data.branch3_member || ""}</td>
                        <td>${data.branch3_staff || ""}</td>
                        <td>${data.branch3_membership || ""}</td>
                        <td>${data.branch3_address || ""}</td>
                        <td>${data.branch3_assurance || ""}</td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Section 15 -->
            <div class="section-title">
                15. (i). How is the control procedure followed by the Branch/es?
            </div>
            <div class="control-procedure dotted-field">
                ${data.control_procedure || ""}
            </div>
            
            <div class="section-title " >
                (ii). And whether any periodic sample testing of clients handled by branch/es is done by HO?
            </div>
            <div class="control-procedure dotted-field">
                ${data.sample_testing || ""}
            </div>
            
            <!-- Section 16 -->
            <div class="section-title">
                16. Gross receipts of the Practice Unit [both H.O. and branch(es)] as per books of accounts from assurance functions for the period under review. In case of centralized billing the branch turnover may be added with HO, otherwise separate figures (Rs. in Lakhs) to be given:
            </div>
            
            <table class="receipts-table">
                <tbody>
                    <tr>
                        <td style="width: 25.64%;">Financial Year</td>
                        <td style="width: 18.58%;">Head Office</td>
                        <td style="width: 18.6%;">Branch 1</td>
                        <td style="width: 18.58%;">Branch 2</td>
                        <td style="width: 18.6%;">Branch 3</td>
                    </tr>
                    <tr>
                        <td>${data.fy1_year || ""}</td>
                        <td>${data.fy1_ho || ""}</td>
                        <td>${data.fy1_branch1 || ""}</td>
                        <td>${data.fy1_branch2 || ""}</td>
                        <td>${data.fy1_branch3 || ""}</td>
                    </tr>
                    <tr>
                        <td>${data.fy2_year || ""}</td>
                        <td>${data.fy2_ho || ""}</td>
                        <td>${data.fy2_branch1 || ""}</td>
                        <td>${data.fy2_branch2 || ""}</td>
                        <td>${data.fy2_branch3 || ""}</td>
                    </tr>
                    <tr>
                        <td>${data.fy3_year || ""}</td>
                        <td>${data.fy3_ho || ""}</td>
                        <td>${data.fy3_branch1 || ""}</td>
                        <td>${data.fy3_branch2 || ""}</td>
                        <td>${data.fy3_branch3 || ""}</td>
                    </tr>
                </tbody>
            </table>
            
            <p class="text-center" style="margin-top: 12pt; margin-bottom: 5pt;">
                OR
            </p>
            
            <div class="section-title">
                Total Gross receipts of the Practice Unit [both H.O. and branch(es)] as per books of accounts for the period under review. In case of centralized billing the branch turnover may be added with HO otherwise separate figures (Rs. in Lakhs) to be given:
            </div>
            
            <table class="receipts-table">
                <tbody>
                    <tr>
                        <td style="width: 25.64%;">Financial Year</td>
                        <td style="width: 18.58%;">Head Office</td>
                        <td style="width: 18.6%;">Branch 1</td>
                        <td style="width: 18.58%;">Branch 2</td>
                        <td style="width: 18.6%;">Branch 3</td>
                    </tr>
                    <tr>
                        <td>${data.total_fy1_year || ""}</td>
                        <td>${data.total_fy1_ho || ""}</td>
                        <td>${data.total_fy1_branch1 || ""}</td>
                        <td>${data.total_fy1_branch2 || ""}</td>
                        <td>${data.total_fy1_branch3 || ""}</td>
                    </tr>
                    <tr>
                        <td>${data.total_fy2_year || ""}</td>
                        <td>${data.total_fy2_ho || ""}</td>
                        <td>${data.total_fy2_branch1 || ""}</td>
                        <td>${data.total_fy2_branch2 || ""}</td>
                        <td>${data.total_fy2_branch3 || ""}</td>
                    </tr>
                    <tr>
                        <td>${data.total_fy3_year || ""}</td>
                        <td>${data.total_fy3_ho || ""}</td>
                        <td>${data.total_fy3_branch1 || ""}</td>
                        <td>${data.total_fy3_branch2 || ""}</td>
                        <td>${data.total_fy3_branch3 || ""}</td>
                    </tr>
                </tbody>
            </table>
        </div>

            <!-- Page No 8 -->
        <!-- Section 17 -->
            <div class="section-title page-break">
                17. Concentration: Furnish details where professional fees from any client exceed 15% of the PU's total gross receipts:
            </div>
            
            <table class="concentration-table">
                <tbody>
                    <tr>
                        <td style="width: 25%;">Name or code number of the Client</td>
                        <td style="width: 25%;">Type of Service (Assurance / Non Assurance)</td>
                        <td style="width: 25%;">% of PU's total gross receipts</td>
                        <td style="width: 25.02%;">Financial Year</td>
                    </tr>
                    <tr>
                        <td>${data.client1_name || ""}</td>
                        <td>${data.client1_type || ""}</td>
                        <td>${data.client1_percentage || ""}</td>
                        <td>${data.client1_year || ""}</td>
                    </tr>
                    <tr>
                        <td>${data.client2_name || ""}</td>
                        <td>${data.client2_type || ""}</td>
                        <td>${data.client2_percentage || ""}</td>
                        <td>${data.client2_year || ""}</td>
                    </tr>
                    <tr>
                        <td>${data.client3_name || ""}</td>
                        <td>${data.client3_type || ""}</td>
                        <td>${data.client3_percentage || ""}</td>
                        <td>${data.client3_year || ""}</td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Section 18 -->
            <div class="section-title">
                18. Whether PU has ever undertaken self-evaluation as per 'Digital Competency Maturity Model-2'?
            </div>
            <div class="yes-no-option">
                ${data.self_evaluation === "yes" ? "✓ Yes" : "☐ Yes"}
                ${
                  data.self_evaluation === "yes"
                    ? `If yes, when: ${selfEvalDate}`
                    : ""
                }
                ${data.self_evaluation === "no" ? "✓ No" : "☐ No"}
            </div>
            
            <!-- Section 19 -->
            <div class="section-title">
                19. Has the PU been subjected to a Peer Review in the past?
            </div>
            <div class="yes-no-option">
                ${data.previous_review === "yes" ? "✓ Yes" : "☐ Yes"}
                ${
                  data.previous_review === "yes"
                    ? `Certificate number issued by the Board: ${
                        data.certificate_number || ""
                      }`
                    : ""
                }
                ${data.previous_review === "no" ? "✓ No" : "☐ No"}
            </div>
            
            <!-- Section 20 -->
            <div class="section-title">
                20. Whether any Partner/Employee of Practice Unit has been found guilty by the Disciplinary Committee in the past 3 years in any capacity.
            </div>
            
            <table class="disciplinary-table">
                <tbody>
                    <tr>
                        <td style="width: 25%;">Name of Partner/Employee</td>
                        <td style="width: 25%;">Membership No.</td>
                        <td style="width: 25%;">Case No.</td>
                        <td style="width: 25.02%;">Whether found guilty YES/NO</td>
                    </tr>
                    <tr>
                        <td>${data.disciplinary1_name || ""}</td>
                        <td>${data.disciplinary1_membership || ""}</td>
                        <td>${data.disciplinary1_case || ""}</td>
                        <td>${data.disciplinary1_guilty || ""}</td>
                    </tr>
                    <tr>
                        <td>${data.disciplinary2_name || ""}</td>
                        <td>${data.disciplinary2_membership || ""}</td>
                        <td>${data.disciplinary2_case || ""}</td>
                        <td>${data.disciplinary2_guilty || ""}</td>
                    </tr>
                    <tr>
                        <td>${data.disciplinary3_name || ""}</td>
                        <td>${data.disciplinary3_membership || ""}</td>
                        <td>${data.disciplinary3_case || ""}</td>
                        <td>${data.disciplinary3_guilty || ""}</td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Section 21 -->
            <div class="section-title">
                21. Whether any client obtained through the process of tendering?
            </div>
            <div class="yes-no-option">
                ${data.tender_clients === "yes" ? "✓ Yes" : "☐ Yes"}
                ${data.tender_clients === "no" ? "✓ No" : "☐ No"}
            </div>
            
            <!-- Section 22 -->
            <div class="section-title">
                22. Please provide details of assurance clients where report/certificate has been <u>signed during the period under review</u>, financial year wise and branch wise as per Annexure A (Please use additional sheet for year-wise details):
            </div>
            

            <!-- Page No 9 -->

            <p class="text-center page-break"><strong>ANNEXURE A</strong></p>
        <p class="note"><strong>Note: The clients obtained through <u>tender</u> may please be marked with the word tender in bracket.</strong></p>
        
        <table>
            <thead>
                <tr>
                    <th style="width:6.4%">Sr. No.</th>
                    <th style="width:10.7%">Category of Client<br>(Name or code of client)</th>
                    <th style="width:7.72%">Name of Branch/HO of PU</th>
                    <th style="width:7.52%">Name of Signing Partner</th>
                    <th colspan="3" style="width:26.94%">Type of Engagement*</th>
                    <th style="width:13.82%">Whether Engagement Quality review done?</th>
                    <th style="width:8.42%">Turn over Rs. Lakhs</th>
                    <th style="width:10.86%">Borrowing Rs. Lakhs</th>
                    <th style="width:7.62%">Net worth Rs. Lakhs</th>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td colspan="2"></td>
                    <td style="width:7.92%">FY....</td>
                    <td style="width:9.5%">FY....</td>
                    <td style="width:9.52%">FY....</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <!-- Category A: Any Bank or Insurance Company -->
                <tr class="section-title">
                    <td><strong>A</strong></td>
                    <td colspan="10"><strong>Any Bank or Insurance Company</strong></td>
                </tr>
                <tr>
                    <td>A1</td>
                    <td>${formatCell(data.categoryA1_client)}</td>
                    <td>${formatCell(data.categoryA1_branch)}</td>
                    <td>${formatCell(data.categoryA1_partner)}</td>
                    <td>${formatCell(data.categoryA1_engagement1)}</td>
                    <td>${formatCell(data.categoryA1_engagement2)}</td>
                    <td>${formatCell(data.categoryA1_engagement3)}</td>
                    <td>${formatCell(data.categoryA1_review)}</td>
                    <td>${formatCell(data.categoryA1_turnover)}</td>
                    <td>${formatCell(data.categoryA1_borrowing)}</td>
                    <td>${formatCell(data.categoryA1_networth)}</td>
                </tr>
                <tr>
                    <td>A2</td>
                    <td>${formatCell(data.categoryA2_client)}</td>
                    <td>${formatCell(data.categoryA2_branch)}</td>
                    <td>${formatCell(data.categoryA2_partner)}</td>
                    <td>${formatCell(data.categoryA2_engagement1)}</td>
                    <td>${formatCell(data.categoryA2_engagement2)}</td>
                    <td>${formatCell(data.categoryA2_engagement3)}</td>
                    <td>${formatCell(data.categoryA2_review)}</td>
                    <td>${formatCell(data.categoryA2_turnover)}</td>
                    <td>${formatCell(data.categoryA2_borrowing)}</td>
                    <td>${formatCell(data.categoryA2_networth)}</td>
                </tr>
                <tr>
                    <td>A3</td>
                    <td>${formatCell(data.categoryA3_client)}</td>
                    <td>${formatCell(data.categoryA3_branch)}</td>
                    <td>${formatCell(data.categoryA3_partner)}</td>
                    <td>${formatCell(data.categoryA3_engagement1)}</td>
                    <td>${formatCell(data.categoryA3_engagement2)}</td>
                    <td>${formatCell(data.categoryA3_engagement3)}</td>
                    <td>${formatCell(data.categoryA3_review)}</td>
                    <td>${formatCell(data.categoryA3_turnover)}</td>
                    <td>${formatCell(data.categoryA3_borrowing)}</td>
                    <td>${formatCell(data.categoryA3_networth)}</td>
                </tr>
                
                <!-- Category B: Non Banking Financial Companies -->
                <tr class="section-title">
                    <td><strong>B</strong></td>
                    <td colspan="10"><strong>Non Banking Financial Companies having public deposits of Rs.100 crore or above.</strong></td>
                </tr>
                <tr>
                    <td>B1</td>
                    <td>${formatCell(data.categoryB1_client)}</td>
                    <td>${formatCell(data.categoryB1_branch)}</td>
                    <td>${formatCell(data.categoryB1_partner)}</td>
                    <td>${formatCell(data.categoryB1_engagement1)}</td>
                    <td>${formatCell(data.categoryB1_engagement2)}</td>
                    <td>${formatCell(data.categoryB1_engagement3)}</td>
                    <td>${formatCell(data.categoryB1_review)}</td>
                    <td>${formatCell(data.categoryB1_turnover)}</td>
                    <td>${formatCell(data.categoryB1_borrowing)}</td>
                    <td>${formatCell(data.categoryB1_networth)}</td>
                </tr>
                <tr>
                    <td>B2</td>
                    <td>${formatCell(data.categoryB2_client)}</td>
                    <td>${formatCell(data.categoryB2_branch)}</td>
                    <td>${formatCell(data.categoryB2_partner)}</td>
                    <td>${formatCell(data.categoryB2_engagement1)}</td>
                    <td>${formatCell(data.categoryB2_engagement2)}</td>
                    <td>${formatCell(data.categoryB2_engagement3)}</td>
                    <td>${formatCell(data.categoryB2_review)}</td>
                    <td>${formatCell(data.categoryB2_turnover)}</td>
                    <td>${formatCell(data.categoryB2_borrowing)}</td>
                    <td>${formatCell(data.categoryB2_networth)}</td>
                </tr>
                <tr>
                    <td>B3</td>
                    <td>${formatCell(data.categoryB3_client)}</td>
                    <td>${formatCell(data.categoryB3_branch)}</td>
                    <td>${formatCell(data.categoryB3_partner)}</td>
                    <td>${formatCell(data.categoryB3_engagement1)}</td>
                    <td>${formatCell(data.categoryB3_engagement2)}</td>
                    <td>${formatCell(data.categoryB3_engagement3)}</td>
                    <td>${formatCell(data.categoryB3_review)}</td>
                    <td>${formatCell(data.categoryB3_turnover)}</td>
                    <td>${formatCell(data.categoryB3_borrowing)}</td>
                    <td>${formatCell(data.categoryB3_networth)}</td>
                </tr>
                
                <!-- Category C: Central or State Public Sector Undertakings -->
                <tr class="section-title">
                    <td><strong>C</strong></td>
                    <td colspan="10"><strong>Central or State Public Sector Undertakings and Central Cooperative Societies having turnover exceeding Rs.250 crore or net worth exceeding Rs.5 crores.</strong></td>
                </tr>
                <tr>
                    <td>C1</td>
                    <td>${formatCell(data.categoryC1_client)}</td>
                    <td>${formatCell(data.categoryC1_branch)}</td>
                    <td>${formatCell(data.categoryC1_partner)}</td>
                    <td>${formatCell(data.categoryC1_engagement1)}</td>
                    <td>${formatCell(data.categoryC1_engagement2)}</td>
                    <td>${formatCell(data.categoryC1_engagement3)}</td>
                    <td>${formatCell(data.categoryC1_review)}</td>
                    <td>${formatCell(data.categoryC1_turnover)}</td>
                    <td>${formatCell(data.categoryC1_borrowing)}</td>
                    <td>${formatCell(data.categoryC1_networth)}</td>
                </tr>
                <tr>
                    <td>C2</td>
                    <td>${formatCell(data.categoryC2_client)}</td>
                    <td>${formatCell(data.categoryC2_branch)}</td>
                    <td>${formatCell(data.categoryC2_partner)}</td>
                    <td>${formatCell(data.categoryC2_engagement1)}</td>
                    <td>${formatCell(data.categoryC2_engagement2)}</td>
                    <td>${formatCell(data.categoryC2_engagement3)}</td>
                    <td>${formatCell(data.categoryC2_review)}</td>
                    <td>${formatCell(data.categoryC2_turnover)}</td>
                    <td>${formatCell(data.categoryC2_borrowing)}</td>
                    <td>${formatCell(data.categoryC2_networth)}</td>
                </tr>
                <tr>
                    <td>C3</td>
                    <td>${formatCell(data.categoryC3_client)}</td>
                    <td>${formatCell(data.categoryC3_branch)}</td>
                    <td>${formatCell(data.categoryC3_partner)}</td>
                    <td>${formatCell(data.categoryC3_engagement1)}</td>
                    <td>${formatCell(data.categoryC3_engagement2)}</td>
                    <td>${formatCell(data.categoryC3_engagement3)}</td>
                    <td>${formatCell(data.categoryC3_review)}</td>
                    <td>${formatCell(data.categoryC3_turnover)}</td>
                    <td>${formatCell(data.categoryC3_borrowing)}</td>
                    <td>${formatCell(data.categoryC3_networth)}</td>
                </tr>
                
                <!-- Category D: Listed Enterprises -->
                <tr class="section-title">
                    <td><strong>D</strong></td>
                    <td colspan="10"><strong>Enterprise which is listed in India or Abroad as defined under SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015.</strong></td>
                </tr>
                <tr>
                    <td>D1</td>
                    <td>${formatCell(data.categoryD1_client)}</td>
                    <td>${formatCell(data.categoryD1_branch)}</td>
                    <td>${formatCell(data.categoryD1_partner)}</td>
                    <td>${formatCell(data.categoryD1_engagement1)}</td>
                    <td>${formatCell(data.categoryD1_engagement2)}</td>
                    <td>${formatCell(data.categoryD1_engagement3)}</td>
                    <td>${formatCell(data.categoryD1_review)}</td>
                    <td>${formatCell(data.categoryD1_turnover)}</td>
                    <td>${formatCell(data.categoryD1_borrowing)}</td>
                    <td>${formatCell(data.categoryD1_networth)}</td>
                </tr>
                <tr>
                    <td>D2</td>
                    <td>${formatCell(data.categoryD2_client)}</td>
                    <td>${formatCell(data.categoryD2_branch)}</td>
                    <td>${formatCell(data.categoryD2_partner)}</td>
                    <td>${formatCell(data.categoryD2_engagement1)}</td>
                    <td>${formatCell(data.categoryD2_engagement2)}</td>
                    <td>${formatCell(data.categoryD2_engagement3)}</td>
                    <td>${formatCell(data.categoryD2_review)}</td>
                    <td>${formatCell(data.categoryD2_turnover)}</td>
                    <td>${formatCell(data.categoryD2_borrowing)}</td>
                    <td>${formatCell(data.categoryD2_networth)}</td>
                </tr>
                <tr>
                    <td>D3</td>
                    <td>${formatCell(data.categoryD3_client)}</td>
                    <td>${formatCell(data.categoryD3_branch)}</td>
                    <td>${formatCell(data.categoryD3_partner)}</td>
                    <td>${formatCell(data.categoryD3_engagement1)}</td>
                    <td>${formatCell(data.categoryD3_engagement2)}</td>
                    <td>${formatCell(data.categoryD3_engagement3)}</td>
                    <td>${formatCell(data.categoryD3_review)}</td>
                    <td>${formatCell(data.categoryD3_turnover)}</td>
                    <td>${formatCell(data.categoryD3_borrowing)}</td>
                    <td>${formatCell(data.categoryD3_networth)}</td>
                </tr>
                
                <!-- Category E: Asset Management Companies -->
                <tr class="section-title">
                    <td><strong>E</strong></td>
                    <td colspan="10"><strong>Asset Management Companies or Mutual Funds.</strong></td>
                </tr>
                <tr>
                    <td>E1</td>
                    <td>${formatCell(data.categoryE1_client)}</td>
                    <td>${formatCell(data.categoryE1_branch)}</td>
                    <td>${formatCell(data.categoryE1_partner)}</td>
                    <td>${formatCell(data.categoryE1_engagement1)}</td>
                    <td>${formatCell(data.categoryE1_engagement2)}</td>
                    <td>${formatCell(data.categoryE1_engagement3)}</td>
                    <td>${formatCell(data.categoryE1_review)}</td>
                    <td>${formatCell(data.categoryE1_turnover)}</td>
                    <td>${formatCell(data.categoryE1_borrowing)}</td>
                    <td>${formatCell(data.categoryE1_networth)}</td>
                </tr>
                <tr>
                    <td>E2</td>
                    <td>${formatCell(data.categoryE2_client)}</td>
                    <td>${formatCell(data.categoryE2_branch)}</td>
                    <td>${formatCell(data.categoryE2_partner)}</td>
                    <td>${formatCell(data.categoryE2_engagement1)}</td>
                    <td>${formatCell(data.categoryE2_engagement2)}</td>
                    <td>${formatCell(data.categoryE2_engagement3)}</td>
                    <td>${formatCell(data.categoryE2_review)}</td>
                    <td>${formatCell(data.categoryE2_turnover)}</td>
                    <td>${formatCell(data.categoryE2_borrowing)}</td>
                    <td>${formatCell(data.categoryE2_networth)}</td>
                </tr>
                <tr>
                    <td>E3</td>
                    <td>${formatCell(data.categoryE3_client)}</td>
                    <td>${formatCell(data.categoryE3_branch)}</td>
                    <td>${formatCell(data.categoryE3_partner)}</td>
                    <td>${formatCell(data.categoryE3_engagement1)}</td>
                    <td>${formatCell(data.categoryE3_engagement2)}</td>
                    <td>${formatCell(data.categoryE3_engagement3)}</td>
                    <td>${formatCell(data.categoryE3_review)}</td>
                    <td>${formatCell(data.categoryE3_turnover)}</td>
                    <td>${formatCell(data.categoryE3_borrowing)}</td>
                    <td>${formatCell(data.categoryE3_networth)}</td>
                </tr>
                
                <!-- Category F: Ind AS Entities -->
                <tr class="section-title">
                    <td><strong>F</strong></td>
                    <td colspan="10"><strong>Entities preparing the financial statements as per Ind AS.</strong></td>
                </tr>
                <tr>
                    <td>F1</td>
                    <td>${formatCell(data.categoryF1_client)}</td>
                    <td>${formatCell(data.categoryF1_branch)}</td>
                    <td>${formatCell(data.categoryF1_partner)}</td>
                    <td>${formatCell(data.categoryF1_engagement1)}</td>
                    <td>${formatCell(data.categoryF1_engagement2)}</td>
                    <td>${formatCell(data.categoryF1_engagement3)}</td>
                    <td>${formatCell(data.categoryF1_review)}</td>
                    <td>${formatCell(data.categoryF1_turnover)}</td>
                    <td>${formatCell(data.categoryF1_borrowing)}</td>
                    <td>${formatCell(data.categoryF1_networth)}</td>
                </tr>
                <tr>
                    <td>F2</td>
                    <td>${formatCell(data.categoryF2_client)}</td>
                    <td>${formatCell(data.categoryF2_branch)}</td>
                    <td>${formatCell(data.categoryF2_partner)}</td>
                    <td>${formatCell(data.categoryF2_engagement1)}</td>
                    <td>${formatCell(data.categoryF2_engagement2)}</td>
                    <td>${formatCell(data.categoryF2_engagement3)}</td>
                    <td>${formatCell(data.categoryF2_review)}</td>
                    <td>${formatCell(data.categoryF2_turnover)}</td>
                    <td>${formatCell(data.categoryF2_borrowing)}</td>
                    <td>${formatCell(data.categoryF2_networth)}</td>
                </tr>
                <tr>
                    <td>F3</td>
                    <td>${formatCell(data.categoryF3_client)}</td>
                    <td>${formatCell(data.categoryF3_branch)}</td>
                    <td>${formatCell(data.categoryF3_partner)}</td>
                    <td>${formatCell(data.categoryF3_engagement1)}</td>
                    <td>${formatCell(data.categoryF3_engagement2)}</td>
                    <td>${formatCell(data.categoryF3_engagement3)}</td>
                    <td>${formatCell(data.categoryF3_review)}</td>
                    <td>${formatCell(data.categoryF3_turnover)}</td>
                    <td>${formatCell(data.categoryF3_borrowing)}</td>
                    <td>${formatCell(data.categoryF3_networth)}</td>
                </tr>
                
                <!-- Category G: Other Public Interest Entities -->
                <tr class="section-title">
                    <td><strong>G</strong></td>
                    <td colspan="10"><strong>Any Body corporate including trusts which are covered under public interest entities.</strong></td>
                </tr>
            </tbody>
        </table>
        
        <!--Page No 10 -->

        <h2>List of Entities</h2>
        <table>
            <tbody>
                <!-- G Category -->
                <tr>
                    <td style="width:6.4%;"><strong>G1</strong></td>
                    <td colspan="10" style="width:93.6%;">
                        <strong>Listed entities</strong>
                    </td>
                </tr>
                ${generateEntityRows(data, "g1", 3)}
                
                <!-- H Category -->
                <tr>
                    <td style="width:6.4%;"><strong>H</strong></td>
                    <td colspan="10" style="width:93.6%;">
                        <strong>Entities which have raised funds from public or banks or financial institutions or by way of donations/contributions over Fifty Crores rupees during the period under review.</strong>
                    </td>
                </tr>
                ${generateEntityRows(data, "h1", 3)}
                
                <!-- I Category -->
                <tr>
                    <td style="width:6.4%;"><strong>I</strong></td>
                    <td colspan="10" style="width:93.6%;">
                        <strong>Entities which have been funded by Central and / or State Government(s) schemes of over Rs.50 crores during the period under review.</strong>
                    </td>
                </tr>
                ${generateEntityRows(data, "i1", 3)}
                
                <!-- J Category -->
                <tr>
                    <td style="width:6.4%;"><strong>J</strong></td>
                    <td colspan="10" style="width:93.6%;">
                        <strong>Entities having Net Worth of more than Rs.100 Crores rupees or having turnover of Rs.250 crore or above during the period under review.</strong>
                    </td>
                </tr>
                ${generateEntityRows(data, "j1", 3)}
                
                <!-- K Category -->
                <tr>
                    <td style="width:6.4%;"><strong>K</strong></td>
                    <td colspan="10" style="width:93.6%;">
                        <strong>Any other</strong>
                    </td>
                </tr>
                ${generateEntityRows(data, "k1", 3)}
            </tbody>
        </table>

        <!-- Type of engagement-->
        <p style="margin-top: 20px;">
                <strong>*Type of engagement (1) Central Statutory Audit (CSA), (2) Statutory Audit (SA), (3) Tax Audit (TA), (4) Internal Audit (IA), (5) Others</strong>
                (Concurrent, GST, certification work etc.)
            </p>
            <p style="margin-left: 27.0pt; text-indent: -27.05pt;">
                Note: Type of assurance service engagements include Central Statutory Audit, Statutory Audit, Tax Audit, GST Audit, Internal Audit, Certification work but does not include:
            </p>
            <ol style="list-style-type: lower-roman; margin-left: 44.4px;">
                <li>Management consultancy Engagements;</li>
                <li>Representation before various authorities;</li>
                <li>Engagements to prepare tax return or advising clients in taxation matter;</li>
                <li>Engagements for the compilation of financial statement;</li>
            </ol>

            <!-- Form 1 Page No 1 to 10 End -->

            <!-- Page No 11 to 20 Start -->
                <!-- Page 11 -->
        <div class="form-container page-break">
            <div class="note-section">
                <ol class="lower-roman">
                    <li>Engagements solely to assist the client in preparing, compiling or collating information other than financial statement;</li>
                    <li>Testifying as an expert witness;</li>
                    <li>Providing expert opinion on points of principle, such as Accounting Standards or the applicability of certain loss on basis off acts provide by the client; and</li>
                    <li>Engagements for due diligence.</li>
                </ol>
            </div>

            <!-- Page 12 -->
            
        <div class="form-container page-break">
            <h1 class="text-center">PART B</h1>
            <h1 class="text-center">GENERAL CONTROLS (Based on SQC 1)</h1>
            <p class="text-center"><em>(Not applicable for New Units)</em></p>

            <p class="text-justify">The Standard on Quality Control i.e. SQC-1 has been made mandatory by ICAI on and from (1st April 2009). Hence, the PU is required to establish a system of 'Quality Control', designed to provide reasonable assurance that the PU and its personnel comply with professional standards; regulatory, legal and ethical requirements.</p>

            <p class="text-justify">Broadly, PU system of quality control should include policies and procedures addressing leadership responsibility, ethical requirements, acceptance and continuance of client relationship, Human Resources, Engagement Performance and Monitoring etc. A Questionnaire based on these criteria is given in Part B(I); B(II); B(III); B(IV); B(V) and B(VI) herein below.</p>

            <p><em>[Notes:</em></p>
            <ol class="lower-roman">
                <li>The application of SQC-1 will depend on various factors such as the size and operating characteristics of the PU and whether it is part of network.]</li>
                <li>Refer to implementation Guide to SQC1: <a href="https://resource.cdn.icai.org/20913frpubcd_aasb1.pdf">https://resource.cdn.icai.org/20913frpubcd_aasb1.pdf</a></li>
            </ol>

            <h3 class="text-center section-title">PART B (I)</h3>
            <h4 class="section-title">LEADERSHIP RESPONSIBILITIES FOR QUALITY WITHIN THE FIRM</h4>

            <table>
                <thead>
                    <tr>
                        <th style="width: 10%;">S.No.</th>
                        <th style="width: 60%;">Policies and Procedures</th>
                        <th style="width: 30%;">Remarks/Yes/No/Na</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center;">1</td>
                        <td>Does the PU have a Quality Control Manual in place?</td>
                        <td class="remarks-cell">
                            ${data.qc_manual || ""}
                            <br><br>
                            <textarea>${data.qc_manual_remarks || ""}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">2</td>
                        <td>Whom has the firm entrusted with the responsibility for developing, implementing, and operating the Firm's QC system?</td>
                        <td class="remarks-cell">
                            ${data.qc_responsible_person || ""}
                            <br><br>
                            <textarea>${
                              data.qc_responsible_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">3</td>
                        <td>Who is ultimately responsible for ensuring the effectiveness of the firm's System of QC and setting a tone that emphasizes the importance of quality?</td>
                        <td class="remarks-cell">
                            ${data.qc_ultimate_responsible || ""}
                            <br><br>
                            <textarea>${
                              data.qc_ultimate_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">4</td>
                        <td>Whether the same has been formally documented and agreed upon by partners?</td>
                        <td class="remarks-cell">
                            ${data.documented_agreement || ""}
                            <br><br>
                            <textarea>${
                              data.documented_agreement_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                     <tr class="page-break">
                        <td style="text-align: center;">5 (i)</td>
                        <td>
                            Who evaluates the client relationships and specific engagements to ensure that commercial considerations do not override the objectives of the system of QC?
                        </td>
                        <td>
                            ${data.client_evaluator || ""}
                            <br><br>
                            <textarea>${
                              data.client_evaluator_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">5 (ii)</td>
                        <td>
                            How often is this evaluation carried out?
                        </td>
                        <td>
                            ${data.evaluation_frequency || ""}
                            <br><br>
                            <textarea>${
                              data.evaluation_frequency_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">6</td>
                        <td>
                            What is the procedure followed by firm to ensure that fee considerations and scope of services do not infringe upon the quality of work and proper documentation as envisaged in SQC 1 is maintained?
                        </td>
                        <td>
                            <textarea>${data.fee_procedure || ""}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">7 (i)</td>
                        <td>
                            How and when are the Firm's QC policies and procedures shared with the personnel working in the Firm?
                        </td>
                        <td>
                            <textarea>${data.policy_sharing || ""}</textarea>
                        </td>
                    </tr>
 <tr>
                        <td style="text-align: center;">7 (ii)</td>
                        <td>
                            Whether refresher sessions are taken periodically?
                        </td>
                        <td>
                            ${data.refresher_sessions || ""}
                            <br><br>
                            <textarea>${
                              data.refresher_sessions_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">8</td>
                        <td>
                            Does the firm’s compensation system provide incentives and advancement to the personnel who demonstrate quality of work and compliance with professional standards?
                        </td>
                        <td>
                            ${data.firm_incentives_advancements || ""}
                            <br><br>
                            <textarea>${
                              data.firm_incentives_advancements_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">9</td>
                        <td>
                           Has the PU come across any instances where the QC was overridden?
                        </td>
                        <td>
                            ${data.pu_instance_overridden || ""}
                            <br><br>
                            <textarea>${
                              data.pu_instance_overridden_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">10</td>
                        <td>
                            Which of the following resources have the firm deployed for developing, implementing and maintaining Firm's QC policies and procedures:
                        </td>
                        <td>
                            <textarea>${data.resources_remarks || ""}</textarea>
                        </td>
                    </tr>
                    <tr>
                     <td style="text-align: center;">(i)</td>
                     <td><span class="checkbox">${
                       checkedResources.manpower
                     }</span> Manpower</td>
                     <td>
                            <textarea>${
                              data.manpower_resource_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    <tr>
                     <td style="text-align: center;">(ii)</td>
                     <td><span class="checkbox">${
                       checkedResources.it
                     }</span> IT tools</td>
                     <td>
                            <textarea>${
                              data.ittools_resource_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    <tr>
                     <td style="text-align: center;">(iii)</td>
                     <td><span class="checkbox">${
                       checkedResources.library
                     }</span> library</td>
                     <td>
                            <textarea>${
                              data.library_resource_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    <tr>
                     <td style="text-align: center;">(iv)</td>
                     <td><span class="checkbox">${
                       checkedResources.review
                     }</span> Regular review mechanism etc.</td>
                     <td>
                            <textarea>${
                              data.review_resource_remarks || ""
                            }</textarea>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>

        <!-- Page 14 -->
<div class="page-section page-break">
                <h3 class="text-center section-title">
                    PART B (II)
                </h3>
                <h4 class="text-center section-title">
                    ETHICAL REQUIREMENTS
                </h4>
                
                <table>
                    <thead>
                        <tr>
                            <th style="width: 10%; border: 1pt solid windowtext; padding: 5.4pt; text-align: center;">S.No.</th>
                            <th style="width: 60%; border: 1pt solid windowtext; padding: 5.4pt;">Policies and Procedures</th>
                            <th style="width: 30%; border: 1pt solid windowtext; padding: 5.4pt;">Remarks/Yes/No/Na</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="text-align: center;">1</td>
                            <td>
                                <strong>Which of the following procedures does the PU have in place for ensuring that the personnel adhere to ethical requirements those contained in the code:</strong>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style="text-align: center; border: 1pt solid windowtext; padding: 5.4pt;">(i)</td>
                            <td>
                                Designated Independence and Ethics Partner who is responsible for all aspects of independence and ethics of the PUs partners and professional staff
                            </td>
                            <td>
                                ${data.ethics_partner || ""}
                                <br><br>
                                <textarea>${
                                  data.ethics_partner_remarks || ""
                                }</textarea>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">(ii)</td>
                            <td>
                                If answer to (i) above is yes, name of the Partner
                            </td>
                            <td>
                                ${data.ethics_partner_name || ""}
                                <br><br>
                                <textarea>${
                                  data.ethics_partner_name_remarks || ""
                                }</textarea>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">(iii)</td>
                            <td>
                                Is the Partner same as QC Partner?
                            </td>
                            <td>
                                ${data.same_as_qc_partner || ""}
                                <br><br>
                                <textarea>${
                                  data.same_as_qc_partner_remarks || ""
                                }</textarea>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">(iv)</td>
                            <td>
                                Has the PU established a system for identifying all services performed for each client and evaluating whether any of the services impair independence?
                            </td>
                            <td>
                                ${data.pu_establish_system || ""}
                                <br><br>
                                <textarea>${
                                  data.pu_establish_system_remarks || ""
                                }</textarea>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">(v)</td>
                            <td>
                                Does the PU regularly update itself with the changes in professional ethics and independence standards/ requirements?
                            </td>
                            <td>
                                ${data.pu_update_changes || ""}
                                <br><br>
                                <textarea>${
                                  data.pu_update_changes_remarks || ""
                                }</textarea>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">(vi)</td>
                            <td>
                                What checks are put in place to ensure that all personnel follow the independence and ethics policies of the PU?
                            </td>
                            <td>
                                <textarea>${
                                  data.checks_independence_ethic_policies || ""
                                }</textarea>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="text-align: center;">2</td>
                            <td>
                                <strong>Which of the following checks does the PU put in place to ensure that the independence requirements are communicated to its personnel:</strong>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">(i)</td>
                            <td>
                                Does the PU maintain a list of entities with which PU personnel and others, if any, are prohibited from having a financial or business relationship?
                            </td>
                            <td>
                                ${data.prohibited_entities_list || ""}
                                <br><br>
                                <textarea>${
                                  data.prohibited_entities_list_remarks || ""
                                }</textarea>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">(ii)</td>
                            <td>
                                Does the PU make the list available to the concerned personnel so that they evaluate 
            <!-- Page 15 -->
                                their independence?
                            </td>
                            <td>
                                ${data.list_availability || ""}
                                <br><br>
                                <textarea>${
                                  data.list_availability_remarks || ""
                                }</textarea>
                            </td>
                        </tr>
                         <tr>
                <td style="text-align: center;">(iii)</td>
                <td>Are the changes in the list notified to the personnel as soon as such changes occur?</td>
                <td>${data.changes_notified || ""}<br><textarea>${
    data.changes_notified_remarks || ""
  }</textarea></td>
            </tr>
            <tr>
                <td style="text-align: center;">(iv)</td>
                <td>Does the PU provide frequent reminders of professional responsibilities to personnel?</td>
                <td>${data.frequent_reminders || ""}<br><textarea>${
    data.frequent_reminders_remarks || ""
  }</textarea></td>
            </tr>
            <tr>
                <td style="text-align: center;">3.</td>
                <td><strong>Which of the following policies, procedures and safeguards the PU has in place to mitigate threats to its independence?</strong></td>
                <td></td>
            </tr>
            <tr>
                <td style="text-align: center;">(i)</td>
                <td>Do the Engagement Partners provide the PU with relevant information about client engagement to enable it to evaluate the overall impact on independence requirements?</td>
                <td>${data.engagement_partners_info || ""}
                <br>
                <textarea>${
                  data.engagement_partners_info_remarks || ""
                }</textarea></td>
            </tr>
             <tr>
                <td style="text-align: center;">(ii)</td>
                <td>Does the PU provide training to partners and professional staff on what constitutes threat to independence and the safeguards that may be taken to reduce the threats to an acceptable level?</td>
                <td>${data.pu_provide_training || ""}
                <br>
                <textarea>${
                  data.pu_provide_training_remarks || ""
                }</textarea></td>
            </tr>
             <tr>
                <td style="text-align: center;">(iii)</td>
                <td>Accumulating and communicating relevant information to appropriate personnel </td>
                <td>${data.accumulation_communication || ""}
                <br>
                <textarea>${
                  data.accumulation_communication_remarks || ""
                }</textarea></td>
            </tr>
             <tr>
                <td style="text-align: center;">(iv)</td>
                <td>How and to whom the personnel notify of circumstances and relationships that cause threat to independence?</td>
                <td>${data.personnel_notify_threats || ""}
            </tr>
             <tr>
                <td style="text-align: center;">(v)</td>
                <td>What are the steps taken by PU so that the self-interest threat to independence is mitigated?</td>
                <td>${data.pu_steps_taken || ""}
            </tr>
             <tr>
                <td style="text-align: center;">(vi)a</td>
                <td>How the PU is mitigating the self-review threats. </td>
                <td>
                <textarea>${
                  data.pu_mitigating_self_review_threats || ""
                }</textarea>
                </td>
            </tr>
             <tr>
                <td style="text-align: center;">(vi)b</td>
                <td>Is there any checklist where the steps have been outlined?</td>
                <td>${data.checklist_steps_outlined || ""}
                <br>
                <textarea>${
                  data.checklist_steps_outlined_remarks || ""
                }</textarea></td>
            </tr>
             <tr>
                <td style="text-align: center;">(vii)a.</td>
                <td>How the PU is mitigating the risk of 
                <!-- Page 16 -->
                advocacy threats.</td>
                <td>
                <textarea>${
                  data.pu_mitigating_advocacy_threats || ""
                }</textarea>
                </td>
            </tr>
            <tr>
          <td style="text-align: center;">(vii)b.</td>
          <td>Can the PU demonstrate the same?</td>
          <td>
            ${data.can_demonstrate || ""}
            <br><textarea>${data.can_demonstrate_remarks || ""}</textarea>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">(viii)a.</td>
          <td>How the PU is mitigating the familiarity threats.</td>
          <td>
            <textarea>${data.familiarity_threats_mitigation || ""}</textarea>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">(viii)b.</td>
          <td>Can PU demonstrate the same?</td>
          <td>
            ${data.can_demonstrate_familiarity || ""}
            <br><textarea>${
              data.can_demonstrate_familiarity_remarks || ""
            }</textarea>
          </td>
        </tr>
         <tr>
          <td style="text-align: center;">(viii)c.</td>
          <td>Is the relationship with client personal disclosed in the Independence form?</td>
          <td>
            ${data.relationship_disclosed || ""}
            <br><textarea>${
              data.relationship_disclosed_remarks || ""
            }</textarea>
          </td>
        </tr>
         <tr>
          <td style="text-align: center;">(ix)a.</td>
          <td>Can the PU demonstrate that professional skepticism was used in the entire assignment? </td>
          <td>
            ${data.professional_skepticism || ""}
            <br><textarea>${
              data.professional_skepticism_remarks || ""
            }</textarea>
          </td>
        <tr>
         <tr>
          <td style="text-align: center;">(ix)b.</td>
          <td>What measures are taken to mitigate the same?</td>
          <td>
           <textarea> ${data.mitigation_measures || ""}</textarea>
          </td>
        <tr>
          <td style="text-align: center;">4.</td>
          <td><strong>What policies, processes and safeguards has the PU established with regard to threats to its independence:</strong></td>
          <td></td>
          </tr>
        <tr>
          <td style="text-align: center;">(i)</td>
          <td>Is it ensured that the PU does not have any financial interests in audit clients, their owners and officials?</td>
          <td>
            ${data.pu_financial_interests || ""}
            <br><textarea>${
              data.pu_financial_interests_remarks || ""
            }</textarea>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">(ii)</td>
          <td>Does the ethics policy of the PU emphasize that the members of PU must not have other than business relationships in audit clients, their owners and officials?</td>
          <td>
            ${data.pu_ethics_policy || ""}
            <br><textarea>${data.pu_ethics_policy_remarks || ""}</textarea>
          </td>
        </tr>
         <tr>
          <td style="text-align: center;">(iii)a.</td>
          <td>Does the PU have the policy of rotating out senior personnel from the assurance engagements after a certain length of service at a particular engagement?</td>
          <td>
            ${data.pu_policy_rotating_personnel || ""}
            <br><textarea>${
              data.pu_policy_rotating_personnel_remarks || ""
            }</textarea>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">(iii)b.</td>
          <td>If yes what is the length of service?</td>
          <td>
            ${data.services_length || ""}
            <br><textarea>${data.services_length_remarks || ""}</textarea>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">(iv)</td>
          <td>Whether there is a policy that the personnel declares - the acceptance of gifts & hospitality from clients/owners</td>
          <td>
            ${data.policy_declare_acceptance_of_gifts || ""}
            <br><textarea>${
              data.policy_declare_acceptance_of_gifts_remarks || ""
            }</textarea>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">(v)</td>
          <td>Does the PU have the policy to obtain annual independence declaration from all personnel?</td>
          <td>
            ${data.policy_annual_independence_declaration || ""}
            <br><textarea>${
              data.policy_annual_independence_declaration_remarks || ""
            }</textarea>
          </td>
        </tr>
<!-- Page 17 -->
        <tr>
          <td style="text-align: center;">(vi)</td>
          <td>As a step in the engagement program, is the Engagement Partner required to sign a compliance with independence requirements?</td>
          <td>
            ${data.compliance_sign_required || ""}
            <br><textarea style="width: 100%; margin-top: 5px;">${
              data.compliance_sign_remarks || ""
            }</textarea>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">(vii)</td>
          <td>In case professional service is conducted jointly with other auditor, is the annual independence confirmed for the other auditor?</td>
          <td>
            ${data.joint_auditor_confirmation || ""}
            <br><textarea style="width: 100%; margin-top: 5px;">${
              data.joint_auditor_remarks || ""
            }</textarea>
          </td>
        </tr>
        <tr>
           <td style="text-align: center;">5</td>
           <td>
            <strong>Are the number of audit assignments held by the PU, at any time, more than the specified number of audit assignments:</strong>
            </td>
            <td></td>
           </tr>
           <tr>
          <td style="text-align: center;">(i)</td>
          <td>Under the prevailing Companies Act and/or the limit prescribed by the ICAI.</td>
          <td>
            ${data.exceeds_prevailing_companies_act || ""}
            <br><textarea style="width: 100%; margin-top: 5px;">${
              data.prevailing_companies_act_remarks || ""
            }</textarea>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">(ii)</td>
          <td>Tax audit assignments as per ICAI notification</td>
          <td>
            ${data.exceeds_tax_audit_assignments || ""}
            <br><textarea style="width: 100%; margin-top: 5px;">${
              data.tax_audit_assignments_remarks || ""
            }</textarea>
          </td>
        </tr>
         <tr>
          <td style="text-align: center;">6(i)</td>
          <td>Has the PU accepted appointment as Statutory Auditor of – PSU(s)/Government Company (ies) Listed company(ies) and other Public Company(ies) having turnover of more than Rs. 50 crores or more in a year and accepted other work or assignment or service in regard to the same entity(ies) on a remuneration which in total exceeds the fee payable for carrying out statutory audit of the same entity.)</td>
          <td>
            ${data.statutory_auditor_appointment || ""}
            <br><textarea style="width: 100%; margin-top: 5px;">${
              data.statutory_auditor_remarks || ""
            }</textarea>
          </td>
        </tr>
         <tr>
          <td style="text-align: center;">6(ii)</td>
          <td>If yes, specify reasons</td>
          <td>
            <textarea>${data.appointment_reasons || ""}</textarea>
          </td>
        </tr>
         <tr>
          <td style="text-align: center;">7(i)</td>
          <td>Has the PU accepted appointment as an auditor of a concern while it/he is indebted to the concern or has given any guarantee or provided any security in connection with the indebtedness of any third person to the concern, for the limits fixed in the statute and in other cases for amount not exceeding Rs.1,00,000. </td>
          <td>
            ${data.indebted_appointment || ""}
            <br><textarea style="width: 100%; margin-top: 5px;">${
              data.indebted_appointment_remarks || ""
            }</textarea>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">7(ii)</td>
          <td>If yes, specify reasons</td>
          <td>
           <textarea>${data.indebted_reasons || ""}</textarea>
          </td>
        </tr>
        <!-- Page 18 -->
         <tr>
              <td style="text-align: center;">8.(i)</td>
              <td>Has the PU received fees from a client below the minimum scale of fees recommended for audit assignments by the ICAI?</td>
              <td>
                ${data.below_min_fees || ""}
                <textarea>${data.below_min_fees_remarks || ""}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">8(ii)</td>
              <td>If yes, reason for accepting fee below recommended scales</td>
              <td>
                <textarea>${data.fee_reason_remarks || ""}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">9.(i)</td>
              <td>Has the PU, being statutory auditor of a client rendered any services to the same client, as mentioned in section 144 of Companies Act 2013</td>
              <td>
                ${data.section144_services || ""}
                <textarea>${data.section144_services_remarks || ""}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">9.(ii)</td>
              <td>(if yes, specify reason with name of the entities and year in which such service was rendered)</td>
              <td>
                <textarea>${data.service_details_remarks || ""}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">10.(i)</td>
              <td>Has the PU, as incoming auditor for an entity, followed the direction given by the ICAI not to accept an appointment as auditor in the case of unjustified removal of earlier auditor?</td>
              <td>
                ${data.icai_direction || ""}
                <textarea>${data.icai_direction_remarks || ""}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">10.(ii)</td>
              <td>If no, reasons for non-adherence to the direction</td>
              <td>
                <textarea>${data.non_adherence_remarks || ""}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">11.(i)</td>
              <td>Does the PU or a Network, as a good and healthy practice, make a disclosure of the payment received by it for other services through the medium of a different firm or firms in which the said PU or Network or its partners may have an ownership interest.</td>
              <td>
                ${data.disclosure_practice || ""}
                <textarea>${data.disclosure_practice_remarks || ""}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">11.(ii)</td>
              <td>(If no, specify reasons)</td>
              <td>
                <textarea>${data.non_disclosure_remarks || ""}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">12</td>
              <td>Has the PU followed the Guidelines issued by the ICAI in respect of engagement/(s)procured through Tender?</td>
              <td>
                ${data.tender_guidelines || ""}
                <textarea>${data.tender_guidelines_remarks || ""}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">13</td>
              <td>Is the website of the PU in conformity with Institute's guidelines/ directions issued on posting of particulars on website by Practice Unit(s)?</td>
              <td>
                ${data.website_conformity || ""}
                <textarea>${data.website_conformity_remarks || ""}</textarea>
              </td>
            </tr>
<!-- Page 19 -->

            <tr>
              <td style="text-align: center;">14.</td>
              <td><strong>Whether your firm has been reviewed by:</strong></td>
              <td></td>
            </tr>
            <tr>
              <td style="text-align: center;">(i)</td>
              <td>The Quality Review Board (QRB)</td>
              <td>
              ${data.qrb_reviewed || ""}
              <textarea>${data.qrb_reviewed_remarks}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">(ii)</td>
              <td>Financial Reporting Review Board (FRRB)</td>
              <td>
              ${data.frrb_reviewed || ""}
              <textarea>${data.frrb_reviewed_remarks}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">(iii)</td>
              <td>Any regulator (Pls. specify)</td>
              <td>
              ${data.other_regulator_reviewed || ""}
              <textarea>${data.other_regulator_remarks}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">(iv)</td>
              <td>If yes, details as under:</td>
              <td></td>
              </tr>
              <tr>
              <td></td>
              <td>
                <table class="nested-table">
                  <tr>
                    <td><strong>Yr. of Review</strong></td>
                    <td><strong>Name of entity</strong></td>
                    <td><strong>Broad description of deficiencies</strong></td>
                    <td><strong>Dt. Of Submission of compliance report (where ever reqd.)</strong></td>
                  </tr>
                  ${(data.review_details || [])
                    .map(
                      (detail) => `
                    <tr>
                      <td>${detail.year || ""}</td>
                      <td>${detail.entity_name || ""}</td>
                      <td>${detail.deficiencies || ""}</td>
                      <td>${detail.compliance_date || ""}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </table>
              </td>
              <td></td>
            </tr>
            <tr>
            <td style="text-align: center;">15.</td>
            <td>Have any Government Bodies/ Authorities evaluated the performance of the firm to the extent of debarment/ blacklisting?</td>
            <td>
            ${data.govt_evaluation || ""}
            <textarea>${data.govt_evaluation_remarks}</textarea>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Part B (III) -->
        <h3 class="page-break" style="text-align: center;">PART B (III)</h3>
        <h4 style="text-align: center;">Acceptance and Continuance of Client Relationships and Specific Engagements</h4>
        
        <table>
          <thead>
            <tr>
              <th style="text-align: center; width: 10%">S.No.</th>
              <th style= "width: 60%">Policies and Procedures</th>
              <th style= "width: 30%">Remarks/Yes/No/Na</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center;">1(i)</td>
              <td>Whether PU documents the decisions taken relating to acceptance and continuance of client relationships/ engagements?</td>
              <td>
              ${data.client_acceptance_documented || ""}
               <textarea>${data.client_acceptance_remarks}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">1(ii)</td>
              <td>Does PU maintain a client engagement/ acceptance and continuance form?</td>
              <td>
              ${data.client_form_maintained || ""}
              <textarea>${data.client_form_remarks}</textarea>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">1(iii)</td>
              <td>Who is responsible for completing the client engagement/acceptance and continuance form?</td>
              <td>${data.responsible_person || ""}</td>
            </tr>

            <!-- Page 20 -->
            <tr>
  <td style="text-align: center;">1(iv)</td>
  <td>If No, how has the client engagement/acceptance been documented Pls. elaborate.</td>
  <td>${data.alternative_documentation || ""}</td>
</tr>
<tr>
  <td style="text-align: center;">2.</td>
  <td><strong>Which of the following processes does the PU have in place when accepting or deciding to continue a client relationship:</strong></td>
  <td></td>
</tr>
<tr>
  <td style="text-align: center;">(i)</td>
  <td>Informing Firm personnel of the policies and procedures for accepting and continuing clients</td>
  <td>${data.informing_personnel || ""}</td>
</tr>
<tr>
  <td style="text-align: center;">(ii)</td>
  <td>Usage of Client Acceptance/engagement acceptance checklists listing down:</td>
  <td></td>
</tr>
<tr>
  <td style="text-align: center;">a</td>
  <td>Obtaining and evaluating relevant information before accepting or continuing clients</td>
  <td>
  ${data.evaluating_information || ""}
  <textarea>${data.evaluating_information_remarks || ""}</textarea>
  </td>
</tr>
<tr>
  <td style="text-align: center;">b</td>
  <td>Performing Background checks for the business, KMP, sister concerns, and other person(s) in questions</td>
  <td>
  ${data.background_checks || ""}
  <textarea>${data.background_checks_remarks || ""}</textarea>
  </td>
</tr>
<tr>
  <td style="text-align: center;">c</td>
  <td>Considering the integrity of the client</td>
  <td>
  ${data.client_integrity || ""}
  <textarea>${data.background_checks_remarks || ""}</textarea>
  </td>
</tr>
<tr>
  <td style="text-align: center;">d</td>
  <td>Communicating with previous auditor when required or recommended by professional standards</td>
  <td>
  ${data.previous_auditor_communication || ""}
  <textarea>${data.previous_auditor_remarks || ""}</textarea>
  </td>
</tr>
<tr>
  <td style="text-align: center;">e</td>
  <td>Evaluating the risk of providing services to clients for which the firm's objectivity or independence may be impaired</td>
  <td>
  ${data.risk_evaluation || ""}
  <textarea>${data.risk_evaluation_remarks || ""}</textarea>
  </td>
</tr>
<tr>
  <td style="text-align: center;">f</td>
  <td>Whether all KYC norms issued by ICAI are fulfilled?</td>
  <td>
  ${data.kyc_norms || ""}
  <textarea>${data.kyc_norms_remarks || ""}</textarea>
  </td>
</tr>
<tr>
  <td style="text-align: center;">3.</td>
  <td>Who evaluates the information about the client and gives final approval for acceptance/continuance of client engagement?</td>
  <td>${data.approval_person || ""}</td>
</tr>
<tr>
  <td style="text-align: center;">4.</td>
  <td><strong>Which of the following procedures the firm has in place for assessing its capability before taking up new engagements/continuance of existing clients:</strong></td>
  <td></td>
</tr>
                    </tbody>
                </table>
            <!-- Page No 11 to 20 End -->
            <!-- Page No 21 to 22 -->
            <table>
            <tr>
            <td style="text-align: center;">(i)</td>
            <td>Evaluating whether the firm has sufficient personnel with necessary capabilities and competence</td>
            <td>${data.firm_personnel_sufficiency}
            <textarea>${data.firm_personnel_remarks}</textarea>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">(ii)</td>
            <td>Specialists in terms of specific industry experience or certain skill sets are available, if needed</td>
            <td>${data.specialists_availability}
            <textarea>${data.specialists_remarks}</textarea>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">(iii)</td>
            <td>Individuals meeting the criteria and eligibility requirements to perform an engagement QC review are available, when needed, whether internally or externally</td>
            <td>${data.qc_review_availability}
            <textarea>${data.qc_review_remarks}</textarea>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">(iv)</td>
            <td>Assessment that the firm would be able to complete the engagement within agreed deadline</td>
            <td>${data.deadline_assessment}
            <textarea>${data.deadline_remarks}</textarea>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">5.(i)</td>
            <td>Does the PU prepare engagement letter documenting the understanding with the client?</td>
            <td>${data.engagement_letter_prepared}
            <textarea>${data.engagement_letter_remarks}</textarea>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">5.(ii)</td>
            <td>Is the engagement letter signed by the client?</td>
            <td>${data.engagement_letter_signed}
            <textarea>${data.signed_letter_remarks}</textarea>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">6.</td>
            <td>Has the PU withdrawn from an engagement and/or from client relationship during the period of review?
            <td></td>
            </tr>
             <tr>
                <td style="text-align: center;">a)</td>
                <td>If yes, has the reason for withdrawal been documented</td>
                <td>${data.withdrawal_documented}
            <textarea>${data.documentation_remarks}</textarea>
            </td>
            </tr>
            <tr>
                <td style="text-align: center;">b)</td>
                <td>If yes, please mention the Names /Codes of the clients alongwith the year and the reason for
                  withdrawal- (Pls. use extra sheet, if required)
                  <table>
                  <tr>
                    <td><strong>Client Name/ Code</strong></td>
                    <td><strong>Year Of Withdrawal </strong></td>
                    <td><strong>Reason Of Withdrawal</strong></td>
                  </tr>
                  ${(data.withdrawal_details || [])
                    .map(
                      (detail) => `
                    <tr>
                      <td>${detail.client_name || ""}</td>
                      <td>${detail.year || ""}</td>
                      <td>${detail.reason || ""}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </table>
                  </td>
                  <td></td>
            </tr>
            <!-- Page 21 -->
            <tr>
            <td style="text-align: center;">7</td>
            <td>Did the PU face any issues relating to acceptance or continuance of client relationships and specific engagements during the period of review?</td>
            <td>${data.client_issues}<br>
            <textarea>${data.client_issues_remarks}</textarea>
            </td>
          </tr>
           <tr>
      <td style="text-align: center;">a)</td>
      <td>If yes, how was it resolved?</td>
      <td>
      <textarea>${data.resolution_details}</textarea>
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">b)</td>
      <td>Who has the custody of such documents?</td>
      <td>
      <textarea>${data.custody_details}</textarea>
      </td>
    </tr>
                    </tbody>
                </table>

                 <h3 style="text-align: center;">PART B (IV)</h3>
                 <h4 style="text-align: center;">Human Resources</h4>
    <table style="width: 100%;">
      <thead>
        <tr>
          <th style="width: 10%; text-align: center;">S.No.</th>
          <th style="width: 60%; text-align: center;">Policies and Procedures</th>
          <th style="width: 30%; text-align: center;">Remarks/Yes/No/Na</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: center;">1.</td>
          <td><strong>Which of the procedures does the PU have in place for managing the Human Resource function:</strong></td>
          <td></td>
        </tr>
        <tr>
          <td style="text-align: center;">(i)</td>
          <td>Does the PU have a designated individual to be responsible for managing Human Resource function?</td>
          <td>${data.hr_designated}<br><textarea>${
    data.hr_designated_remarks
  }</textarea></td>
        </tr>
        <tr>
          <td style="text-align: center;">(ii)</td>
          <td>How frequently the designated person/ PU evaluate the PUs personnel needs?</td>
          <td>${data.personnel_evaluation_freq}<br><textarea>${
    data.evaluation_freq_remarks
  }</textarea></td>
        </tr>
        <tr>
          <td style="text-align: center;">(iii)</td>
          <td>Is there a formal documented process for hiring by the PU, covering:</td>
          <td></td>
        </tr>
        <tr>
          <td style="text-align: center;">a)</td>
          <td>Does the PU have an established criterion for determining which individuals would be involved in hiring process?</td>
          <td>${data.hiring_criteria}<br><textarea>${
    data.hiring_criteria_remarks
  }</textarea></td>
        </tr>
        <tr>
          <td style="text-align: center;">b)</td>
          <td>Has the PU laid down any qualification, experiences, attributes required for the entry level and experienced personnel to be hired?</td>
          <td>${data.qualifications_defined}<br><textarea>${
    data.qualifications_remarks
  }</textarea></td>
        </tr>
        <tr>
          <td style="text-align: center;">c)</td>
          <td>Additional procedures like performing background checks etc. been put in place?</td>
          <td>${data.background_checks}<br><textarea>${
    data.background_checks_remarks
  }</textarea></td>
        </tr>
        <tr>
          <td style="text-align: center;">d)</td>
          <td>Whether joining check-list is maintained?</td>
          <td>${data.joining_checklist}<br><textarea>${
    data.checklist_remarks
  }</textarea></td>
        </tr>
        <tr>
          <td style="text-align: center;">2.</td>
          <td>Does the firm maintain and monitor the employee turnover ratio and identify measures to keep it minimal?</td>
          <td>${data.turnover_monitoring}<br><textarea>${
    data.turnover_remarks
  }</textarea></td>
        </tr>
      </tbody>
    </table>

            
            <!-- Page No 23 to 25 -->
                  <table>
            <thead>
                <tr>
                    <th style="width: 11.28%">S.No.</th>
                    <th style="width: 61.18%">Policies and procedure</th>
                    <th style="width: 27.52%">Remarks/Yes/No/NA</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center">3.</td>
                    <td>Does the firm maintain a minimum Staff to Partner Ratio, Partner to Manager, Manager to Articles, Client to Staff ratio, etc.</td>
                    <td class="text-center">${getDisplayValue26(data.q3)}</td>
                </tr>
                <tr>
                    <td class="text-center">4.</td>
                    <td><strong>Which of the following considerations does the PU have in place to select the engagement partner & team required for an engagement:</strong></td>
                    <td></td>
                </tr>
                <tr>
                    <td>a)</td>
                    <td>Understanding the role of PUs Quality Control and Code of Ethics issued by the Institute in ensuring the integrity of the accounting, auditing and attest functions to user of reports</td>
                    <td class="text-center">${getDisplayValue26(data.q4a)}</td>
                </tr>
                <tr>
                    <td>b)</td>
                    <td>Performance, supervision and reporting aspects of the engagement, which ordinarily are gained through training or participation in similar engagements</td>
                    <td class="text-center">${getDisplayValue26(data.q4b)}</td>
                </tr>
                <tr>
                    <td>c)</td>
                    <td>The industry in which the client operates, including its organization and operating characteristics, sufficient to identify areas of high or unusual risk associated with engagement</td>
                    <td class="text-center">${getDisplayValue26(data.q4c)}</td>
                </tr>
                <tr>
                    <td>d)</td>
                    <td>The skills that contribute to sound professional judgment, including the ability to exercise professional skepticism</td>
                    <td class="text-center">${getDisplayValue26(data.q4d)}</td>
                </tr>
                <tr>
                    <td>e)</td>
                    <td>Adequate mix of different level personnel in the team</td>
                    <td class="text-center">${getDisplayValue26(data.q4e)}</td>
                </tr>
                <tr>
                    <td>f)</td>
                    <td>How the auditee uses information technology and the manner in which information systems are used to record and maintain financial information</td>
                    <td class="text-center">${getDisplayValue26(data.q4f)}</td>
                </tr>
                <tr>
                    <td class="text-center">5.</td>
                    <td><strong>Which of the following procedures does the PU follow to determine the capabilities and competencies possessed by personnel:</strong></td>
                    <td></td>
                </tr>
                <tr>
                    <td>(i)</td>
                    <td>Does the PU have an established criterion for evaluating personal characteristics such as integrity, competence and motivation?</td>
                    <td class="text-center">${getDisplayValue26(data.q5i)}</td>
                </tr>
                <tr>
                    <td>(ii)a.</td>
                    <td>Does the PU evaluate the personnel at least annually to determine their capabilities and competencies?</td>
                    <td class="text-center">${getDisplayValue26(
                      data.q5iia
                    )}</td>
                </tr>
                <tr>
                    <td>(ii)b.</td>
                    <td>If yes, whether this is documented?</td>
                    <td class="text-center">${getDisplayValue26(
                      data.q5iib
                    )}</td>
                </tr>
                <tr>
                    <td class="text-center">6.</td>
                    <td>Does the PU have any policy for assigning responsibility for engagements to an engagement partner?</td>
                    <td class="text-center">${getDisplayValue26(data.q6)}</td>
                </tr>
                <tr>
                    <td class="text-center">7.</td>
                    <td><strong>Does the PU have following parameters in place to ensure that the knowledge of its personnel get updated on an ongoing process:</strong></td>
                    <td></td>
                </tr>
                <tr>
                    <td>(i)</td>
                    <td>Requires personnel (including articled trainees) to participate in the CPED programs in accordance with firm guidelines to keep them updated on the current developments</td>
                    <td class="text-center">${getDisplayValue26(data.q7i)}</td>
                </tr>
                <tr>
                    <td>(ii)</td>
                    <td>Maintains/tracks record of CPE status of its professional personnel as per the requirements of the ICAI</td>
                    <td class="text-center">${getDisplayValue26(data.q7ii)}</td>
                </tr>
                <tr>
                    <td>(iii)</td>
                    <td>Provides CPED course materials / access to digital content on the latest changes in accounting, auditing, independence requirement</td>
                    <td class="text-center">${getDisplayValue26(
                      data.q7iii
                    )}</td>
                </tr>
                <tr>
                    <td>(iv)</td>
                    <td>Provides orientation and training programs for new hires</td>
                    <td class="text-center">${getDisplayValue26(data.q7iv)}</td>
                </tr>
                <tr>
                    <td>(v)</td>
                    <td>Employees are equipped with technological skill sets – like AI, Blockchain, Audit & Data analytical tools, etc.</td>
                    <td class="text-center">${getDisplayValue26(data.q7v)}</td>
                </tr>
                <tr>
                    <td>(vi)</td>
                    <td>Does the PU sponsor any of skill development tools?</td>
                    <td class="text-center">${getDisplayValue26(data.q7vi)}</td>
                </tr>
                <tr>
                    <td>(vii)</td>
                    <td>Does the PU provide access to technology, infrastructure and methodology for better enablement of day to day work?</td>
                    <td class="text-center">${getDisplayValue26(
                      data.q7vii
                    )}</td>
                </tr>
                <tr>
                    <td>(viii)</td>
                    <td>Does the PU organize self-developed programs like group discussions, mock presentation, short reviews by Team Leader etc.?</td>
                    <td class="text-center">${getDisplayValue26(
                      data.q7viii
                    )}</td>
                </tr>
                <tr>
                    <td class="text-center">8.</td>
                    <td>Does the PU have policies and procedures for career advancement of its personnel?</td>
                    <td class="text-center">${getDisplayValue26(data.q8)}</td>
                </tr>
                <tr>
                    <td class="text-center">9.</td>
                    <td>Is there a system for evaluating the performances on timely basis with the individual being evaluated?</td>
                    <td class="text-center">${getDisplayValue26(data.q9)}</td>
                </tr>
                <tr>
                    <td class="text-center">10.</td>
                    <td>Is there a fast track advancement policy for star performers?</td>
                    <td class="text-center">${getDisplayValue26(data.q10)}</td>
                </tr>
            </tbody>
        </table>

        <div class="page-break"></div>

        <h2 class="sub-title">PART B (V) - Engagement Performance</h2>
        <table>
            <thead>
                <tr>
                    <th style="width: 10.78%">S.No.</th>
                    <th style="width: 54.68%">Policies and Procedures</th>
                    <th style="width: 34.56%">REMARKS/YES/NO/NA</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1.(i)</td>
                    <td>Does the PU plan for performing engagements in accordance with professional standards and regulatory and legal requirements?</td>
                    <td class="text-center">${getDisplayValue26(data.q1i)}</td>
                </tr>
                <tr>
                    <td>(ii)</td>
                    <td><u>If yes, what does the plan encompass</u>:</td>
                    <td>${data.q1ii || ""}</td>
                </tr>
                <tr>
                    <td>a)</td>
                    <td>Are the responsibilities assigned to appropriate personnel during the planning phase?</td>
                    <td class="text-center">${getDisplayValue26(
                      data.q1iia
                    )}</td>
                </tr>
                <tr>
                    <td>b)</td>
                    <td>Is the background information on the client and the engagement developed/updated and team briefed accordingly?</td>
                    <td class="text-center">${getDisplayValue26(
                      data.q1iib
                    )}</td>
                </tr>
                <tr>
                    <td>c)</td>
                    <td>Does the firm prepare a planning document mentioning the staffing requirements/the risks/time allocation etc.?</td>
                    <td class="text-center">${getDisplayValue26(
                      data.q1iic
                    )}</td>
                </tr>
            </tbody>
        </table>

            <!-- Page No 26 to 30 --> 
                <!-- Page No 26 -->

            <table class="page-break">
        <tbody>
          <tr>
            <td class="width-10 border-all">
              <div>
                <ul>
                  <li>d)&nbsp;&nbsp;&nbsp;&nbsp;</li>
                </ul>
              </div>
            </td>
            <td class="width-54 border-top border-right border-bottom">
              <p class="text-justify">Whether checklist of relevant Laws/Rules including those related with Accountancy & audit is shared with the engagement team?</p>
            </td>
            <td class="width-34 border-top border-right border-bottom">
              <p class="text-justify">${data.q1a || ""}</p>
            </td>
          </tr>
          <tr>
            <td class="width-10 border-right border-bottom border-left">
              <div>
                <ul>
                  <li>e)&nbsp;&nbsp;&nbsp;&nbsp;</li>
                </ul>
              </div>
            </td>
            <td class="width-54 border-right border-bottom">
              <p class="text-justify">Whether industry briefing about nature, structure & vertical, and important points from previous year audit summary memorandum are provided to team during planning of the engagement?</p>
            </td>
            <td class="width-34 border-right border-bottom">
              <p class="text-justify">${data.q1b || ""}</p>
            </td>
          </tr>
          <tr>
            <td class="width-10 border-right border-bottom border-left">
              <div>
                <ul>
                  <li>f)&nbsp;&nbsp;&nbsp;&nbsp;</li>
                </ul>
              </div>
            </td>
            <td class="width-54 border-right border-bottom">
              <p class="text-justify">Any other (pls. specify)</p>
            </td>
            <td class="width-34 border-right border-bottom">
              <p class="text-justify">${data.q1c || ""}</p>
            </td>
          </tr>
          <tr>
            <td class="width-10 border-right border-bottom border-left text-center">
              <p>2.</p>
            </td>
            <td class="width-54 border-right border-bottom">
              <p class="text-justify">Does the PU conduct pre-assignment meeting with the clients, liaison office etc. to understand the preparedness of the client to start the professional functions.</p>
            </td>
            <td class="width-34 border-right border-bottom">
              <p class="text-justify">${data.q2 || ""}</p>
            </td>
          </tr>
          <tr>
            <td class="width-10 border-right border-bottom border-left text-center">
              <p>3.</p>
            </td>
            <td class="width-54 border-right border-bottom">
              <p class="text-justify">Does the PU prepare and document Audit Summary Memorandum to provide the history of the planned risks, the audit procedures which mitigated the risk, conclusions on controls etc.?</p>
            </td>
            <td class="width-34 border-right border-bottom">
              <p class="text-justify">${data.q3 || ""}</p>
            </td>
          </tr>
          <tr>
            <td class="width-10 border-right border-bottom border-left text-center">
              <p>4.</p>
            </td>
            <td class="width-54 border-right border-bottom">
              <p class="text-justify">Does the PU prepare standardized forms, checklists and questionnaires used in performance engagements?</p>
            </td>
            <td class="width-34 border-right border-bottom">
              <p class="text-justify">${data.q4 || ""}</p>
            </td>
          </tr>
          <tr>
            <td class="width-10 border-right border-bottom border-left text-center">
              <p>5.</p>
            </td>
            <td class="width-54 border-right border-bottom">
              <p class="text-justify">Does the team leader/Engagement Partner keep a track of the audit findings, other significant issues at various stages of the engagement (including disposal/discussion with the TCWG)?</p>
            </td>
            <td class="width-34 border-right border-bottom">
              <p class="text-justify">${data.q5 || ""}</p>
            </td>
          </tr>
          <tr>
            <td class="width-10 border-right border-bottom border-left text-center">
              <p>6.</p>
            </td>
            <td class="width-54 border-right border-bottom">
              <p class="text-justify">How does the PU ensure that&nbsp;</p>
            </td>
            <td class="width-34 border-right border-bottom">
              <p class="text-justify">${data.q6i || ""}</p>
            </td>
          </tr>
          <tr>
            <td class="width-10 border-right border-bottom border-left">
              <div>
                <ul>
                  <li>(i)&nbsp;&nbsp;&nbsp;&nbsp;</li>
                </ul>
              </div>
            </td>
            <td class="width-54 border-right border-bottom">
              <p class="text-justify">the qualified team members review the work performed by other team members on a timely basis?</p>
            </td>
            <td class="width-34 border-right border-bottom">
              <p class="text-justify">${data.q6i || ""}</p>
            </td>
          </tr>
        </tbody>
      </table>

        <!-- Page No 27 -->
            <table class="page-break">
                <tbody>
                    <tr>
                        <td style="width: 6%; text-align: center;"><strong>S.No.</strong></td>
                        <td style="width: 51.4093%;"><strong>Policies and Procedures</strong></td>
                        <td style="width: 34.56%;"><strong>REMARKS/YES/NO/NA</strong></td>
                    </tr>
                    <tr>
                        <td style="width: 6%; text-align: right;">(ii)</td>
                        <td style="width: 51.4093%;">
                            Is there any document maintained by the PU for the supervision of work performed?
                        </td>
                        <td style="width: 34.56%;">
                            <p>${getRadioValue("supervision_doc")}</p>
                            <p>${data.supervision_doc_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6%; text-align: center;">7.</td>
                        <td style="width: 51.4093%;">
                            What is the mode for maintaining the working papers? Electronic mode or in physical form or in a hybrid manner?
                        </td>
                        <td style="width: 34.56%;">
                            <p>${data.working_paper_mode || "Not specified"}</p>
                            <p>${data.working_paper_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6%; text-align: center;">8.</td>
                        <td style="width: 51.4093%;">
                            What tool does the PU use for maintaining the working in electronic form?
                        </td>
                        <td style="width: 34.56%;">
                            <p>${data.electronic_tool || "Not specified"}</p>
                            <p>${data.electronic_tool_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6%; text-align: center;">9.</td>
                        <td style="width: 51.4093%;">
                            <strong>Which of the following procedures does the PU have in place to maintain confidentiality, safe custody, integrity, accessibility and retrievability of engagement documentation:</strong>
                        </td>
                        <td style="width: 34.56%;">
                            <p>${
                              data.documentation_procedures_remarks || ""
                            }</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6%; text-align: right;">(i)</td>
                        <td style="width: 51.4093%;">
                            Documenting when and by whom the engagement documentation was prepared and reviewed
                        </td>
                        <td style="width: 34.56%;">
                            <p>${getRadioValue("doc_prep_review")}</p>
                            <p>${data.doc_prep_review_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6%; text-align: right;">(ii)</td>
                        <td style="width: 51.4093%;">
                            Protecting integrity of information at all stages of engagement especially when the information was shared through electronic means
                        </td>
                        <td style="width: 34.56%;">
                            <p>${getRadioValue("info_integrity")}</p>
                            <p>${data.info_integrity_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6%; text-align: right;">(iii)</td>
                        <td style="width: 51.4093%;">
                            Preventing unauthorized changes in engagement documentation
                        </td>
                        <td style="width: 34.56%;">
                            <p>${getRadioValue("prevent_unauthorized")}</p>
                            <p>${data.prevent_unauthorized_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6%; text-align: right;">(iv)</td>
                        <td style="width: 51.4093%;">
                            Allowing access to engagement documentation by engagement team and other authorized parties only
                        </td>
                        <td style="width: 34.56%;">
                            <p>${getRadioValue("access_control")}</p>
                            <p>${data.access_control_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6%; text-align: right;">(v)</td>
                        <td style="width: 51.4093%;">
                            Enabling confidential storage of hardcopies of engagement documentation
                        </td>
                        <td style="width: 34.56%;">
                            <p>${getRadioValue("hardcopy_storage")}</p>
                            <p>${data.hardcopy_storage_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6%; text-align: right;">(vi)</td>
                        <td style="width: 51.4093%;">
                            Requiring use of passwords by engagement team members and data encryption to restrict access to electronic engagement documentation to authorized users
                        </td>
                        <td style="width: 34.56%;">
                            <p>${getRadioValue("password_encryption")}</p>
                            <p>${data.password_encryption_remarks || ""}</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Page No 28 -->
            <table class="page-break">
                <tbody>
                    <tr>
                        <td style="width: 6.1227%; text-align: center;"><strong>S.No</strong></td>
                        <td style="width: 55.3745%;"><strong>Policies and Procedures</strong></td>
                        <td style="width: 36.7729%;"><strong>REMARKS/YES/NO/NA</strong></td>
                    </tr>
                    <tr>
                        <td style="width: 6.1227%; text-align: right;">(vii)</td>
                        <td style="width: 55.3745%;">
                            Maintaining appropriate backup routines at appropriate stages during the engagement
                        </td>
                        <td style="width: 36.7729%;">
                            <p>${getRadioValue("backup_routines")}</p>
                            <p>${data.backup_routines_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6.1227%; text-align: right;">(viii)</td>
                        <td style="width: 55.3745%;">
                            Enabling the scanned copies to be retrieved and printed by authorized personnel
                        </td>
                        <td style="width: 36.7729%;">
                            <p>${getRadioValue("scanned_copies")}</p>
                            <p>${data.scanned_copies_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6.1227%; text-align: center;">10.</td>
                        <td style="width: 55.3745%;">
                            <strong>Which procedures does the PU follow to ensure that it maintains engagement documentation for a period of time sufficient to meet the needs of the firm, professional standards, laws and regulations:</strong>
                        </td>
                        <td style="width: 36.7729%;">
                            <p>${data.document_retention_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6.1227%; text-align: right;">(i)</td>
                        <td style="width: 55.3745%;">
                            For how many years the PU maintains engagement documentation?
                        </td>
                        <td style="width: 36.7729%;">
                            <p>${
                              data.retention_years || "Not specified"
                            } years</p>
                            <p>${data.retention_years_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6.1227%; text-align: right;">(ii)</td>
                        <td style="width: 55.3745%;">
                            How does the PU enable retrieval of, and access to engagement documentation during the retention period in case of electronic documentation as the underlying technology may be upgraded or changed overtime
                        </td>
                        <td style="width: 36.7729%;">
                            <p>${data.retrieval_method || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6.1227%; text-align: right;">(iii)</td>
                        <td style="width: 55.3745%;">
                            Does the PU ensure that, record of changes made to engagement documentation after assembly of files has been completed?
                        </td>
                        <td style="width: 36.7729%;">
                            <p>${getRadioValue("change_records")}</p>
                            <p>${data.change_records_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6.1227%; text-align: right;">(iv)</td>
                        <td style="width: 55.3745%;">
                            Does the PU ensure that only authorized external parties access and review specific engagement documentation for QC or other purposes?
                        </td>
                        <td style="width: 36.7729%;">
                            <p>${getRadioValue("external_access")}</p>
                            <p>${data.external_access_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 6.1227%; text-align: center;">11.</td>
                        <td style="width: 55.3745%;">
                            Does the PU have the policy for documenting the issue requiring consultation, including any decisions that were taken, the basis for those decisions and how they were implemented?
                        </td>
                        <td style="width: 36.7729%;">
                            <p>${getRadioValue("consultation_policy")}</p>
                            <p>${data.consultation_policy_remarks || ""}</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Page No 29 -->

         <table class="page-break">
                <tbody>
                    <tr>
                        <td style="width: 7.1382%; text-align: center;"><strong>S.No.</strong></td>
                        <td style="width: 56.8145%;"><strong>Policies and Procedures</strong></td>
                        <td style="width: 34.4827%;"><strong>REMARKS/YES/NO/NA</strong></td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: center;">12.</td>
                        <td style="width: 56.8145%;">
                            Who resolves with the differences of professional judgement among members of the engagement team?
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${data.judgement_resolver || "Not specified"}</p>
                            <p>${data.judgement_resolver_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: center;">13.</td>
                        <td style="width: 56.8145%;">
                            Is there a formally designed an escalation matrix, in case the differences are not resolved at certain level?
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${getRadioValue("escalation_matrix")}</p>
                            <p>${data.escalation_matrix_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: center;">14.</td>
                        <td style="width: 56.8145%;">
                            Are the conclusions reached properly documented?
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${getRadioValue("conclusions_documented")}</p>
                            <p>${data.conclusions_documented_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: center;">15.</td>
                        <td style="width: 56.8145%;">
                            What happens if the members of the team continue to disagree with the resolution?
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${data.disagreement_procedure || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: center;">16.</td>
                        <td style="width: 56.8145%;">
                            When does the PU release the report in cases where differences in opinion exist?
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${data.report_release_policy || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: center;">17.</td>
                        <td style="width: 56.8145%;">
                            Does the PU have a policy of having engagement quality review conducted for all audit of financial statements of listed entities?
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${getRadioValue("quality_review_policy")}</p>
                            <p>${data.quality_review_policy_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: center;">18.</td>
                        <td style="width: 56.8145%;">
                            <strong>Which of the criteria does the PU have in place for carrying out the engagement QC review for its engagements (other than covered above):</strong>
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${data.qc_criteria_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: right;">(i)</td>
                        <td style="width: 56.8145%;">
                            Certain class of engagements (mention the class)
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${data.engagement_class || "Not specified"}</p>
                            <p>${data.engagement_class_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: right;">(ii)</td>
                        <td style="width: 56.8145%;">
                            Risks in an engagement (mention type/level)
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${data.risk_type || "Not specified"}</p>
                            <p>${data.risk_type_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: right;">(iii)</td>
                        <td style="width: 56.8145%;">
                            Unusual circumstances (mention the particular circumstance)
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${
                              data.unusual_circumstances || "Not specified"
                            }</p>
                            <p>${data.unusual_circumstances_remarks || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 7.1382%; text-align: right;">(iv)</td>
                        <td style="width: 56.8145%;">
                            Required by law or regulation (quote the law/regulation)
                        </td>
                        <td style="width: 34.4827%;">
                            <p>${data.law_regulation || "Not specified"}</p>
                            <p>${data.law_regulation_remarks || ""}</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Page No 30 -->
                            

            <table class="page-break">
            <tbody>
                <tr>
                    <td style="width: 7.2423%;"><strong>S.No</strong></td>
                    <td style="width: 57.3345%;"><strong>Policies and Procedures</strong></td>
                    <td style="width: 35.3417%;"><strong>REMARKS/YES/NO/NA</strong></td>
                </tr>
                <tr>
                    <td class="text-right">(v)</td>
                    <td>Any other like size (pls. elaborate)</td>
                    <td class="remarks-col">${data.other_like_size || ""}</td>
                </tr>
                <tr>
                    <td class="text-center">19.</td>
                    <td><strong>Which of the following procedures are followed by the PU for addressing the nature, timing, extent, and documentation of engagement QC review:</strong></td>
                    <td class="remarks-col"></td>
                </tr>
                <tr>
                    <td class="text-right">(i)</td>
                    <td>Discuss significant accounting, auditing and financial reporting issues with the engagement partner</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.procedure_1
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-right">(ii)</td>
                    <td>Discuss with the EP the engagement team's identification and audit of high risk assertions and transactions</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.procedure_2
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-right">(iii)</td>
                    <td>Confirm with the EP that there are no significant unresolved issues</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.procedure_3
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-right">(iv)</td>
                    <td>Read the financial statements and the report and consider whether the report is appropriate</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.procedure_4
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-right">(v)</td>
                    <td>The procedures required by the firm's policies on engagement QC review have been performed</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.procedure_5
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-right">(vi)</td>
                    <td>The engagement QC review has been completed before the report is released</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.procedure_6
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-right">(vii)</td>
                    <td>Resolving conflict between the engagement partner and the engagement QC reviewer regarding significant matters</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.procedure_7
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-center">20.</td>
                    <td><strong>Which of the following are the PU's established criteria for eligibility of 'Engagement Quality Assurance Reviewers':</strong></td>
                    <td class="remarks-col"></td>
                </tr>
                <tr>
                    <td class="text-right">(i)</td>
                    <td>Selected by QC partner or the Managing Partner</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.criteria_1
                    )}</span></td>
                </tr>
            </tbody>
        </table>

        <!-- Page No 31 -->
        <!-- First Table -->
        <table class="page-break">
            <tbody>
                <tr>
                    <td style="width: 10.076%;"><strong>S.No.</strong></td>
                    <td style="width: 47.5629%;"><strong>Policies and Procedures</strong></td>
                    <td style="width: 34.56%;"><strong>REMARKS/YES/NO/NA</strong></td>
                </tr>
                <tr>
                    <td class="text-right">(ii)</td>
                    <td>Has technical expertise and experience</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.technical_expertise
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-right">(iii)</td>
                    <td>Carries out the responsibilities with objectivity and due professional care without regard to relative positions</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.objectivity
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-right">(iv)</td>
                    <td>Meets the independence requirements relating to engagement reviewed</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.independence
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-right">(v)</td>
                    <td>Does not participate in the performance of the engagement except when consulted by the engagement partner</td>
                    <td class="remarks-col"><span class="checkbox">${getDisplayValue(
                      data.participation
                    )}</span></td>
                </tr>
                <tr>
                    <td class="text-right">(vi)</td>
                    <td>Any other (Pls. specify)</td>
                    <td class="remarks-col">${data.other_specify || ""}</td>
                </tr>
            </tbody>
        </table>

        <!-- Part B (VI) Monitoring Section -->
        <div class="section-title text-center">PART B (VI) Monitoring</div>

        <!-- Second Table -->
        <table class="monitoring-table">
            <thead>
                <tr>
                    <td style="width: 9.0554%;"><strong>S.No.</strong></td>
                    <td style="width: 50.1788%;"><strong>Policies and Procedures</strong></td>
                    <td style="width: 40.6833%;"><strong>Remarks/Yes/No/Na</strong></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1.(i)</td>
                    <td>Does the PU have Policies and Procedures to confirm on the adequacy and relevance of Quality Control procedures adopted?</td>
                    <td><span class="checkbox">${getDisplayValue(
                      data.qc_procedures
                    )}</span></td>
                </tr>
                <tr>
                    <td>1.(ii)</td>
                    <td>If yes, what document is in place to establish the procedure</td>
                    <td>${data.qc_document || ""}</td>
                </tr>
                <tr>
                    <td>2.</td>
                    <td>Who is responsible to evaluate the Quality and Control policies and procedures to ensure the relevance, adequacy, effectiveness and appropriateness with current trends?</td>
                    <td>${data.responsible_person || ""}</td>
                </tr>
                <tr>
                    <td>3.</td>
                    <td>How frequently are the processes and the procedures related to QC revised?</td>
                    <td>${data.revision_frequency || ""}</td>
                </tr>
                <tr>
                    <td>4.</td>
                    <td>When was the last revision to the Quality Control policies and procedures carried out?</td>
                    <td>${formatDate(data.last_revision_date)}</td>
                </tr>
                <tr>
                    <td>5.(i)</td>
                    <td>Did the PU follow ongoing consideration and evaluation system of quality controls?</td>
                    <td><span class="checkbox">${getDisplayValue(
                      data.ongoing_evaluation
                    )}</span></td>
                </tr>
                <tr>
                    <td>5.(ii)</td>
                    <td>If yes, what document is in place to establish the same</td>
                    <td>${data.evaluation_document || ""}</td>
                </tr>
            </tbody>
        </table>

        <!-- Page No 32 -->

        <style>
            body {
                font-family: "Arial Narrow", sans-serif;
                font-size: 15px;
                line-height: 13.5pt;
                margin: 0;
                padding: 20px;
            }
            table {
                border-collapse: collapse;
                width: 100%;
                margin: 10px 0;
            }
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 5px;
                vertical-align: top;
            }
            .text-center {
                text-align: center;
            }
            .dotted-field {
                border-bottom: 1px dotted black;
                display: inline-block;
                min-width: 100px;
            }
            .signature-line {
                margin-top: 50px;
                border-top: 1px solid black;
                width: 200px;
            }
        </style>

        <table class="page-break">
            <tbody>
                <tr>
                    <td style="width: 2.5591%;"></td>
                    <td style="width: 10.2362%; border: 1pt solid windowtext; padding: 0cm 5.4pt; height: 1pt; vertical-align: top;">S.No</td>
                    <td style="width: 39.3722%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; height: 1pt; vertical-align: top;">Policies and Procedures</td>
                    <td style="width: 14.7911%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; height: 1pt; vertical-align: top;"></td>
                    <td style="width: 33.0435%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; height: 1pt; vertical-align: top;">Remarks/Yes/No/Na</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 0cm; width: 2.5591%;"></td>
                    <td style="width: 10.2362%; border: 1pt solid windowtext; padding: 0cm 5.4pt; height: 1pt; vertical-align: top;">
                        <p>6.</p>
                    </td>
                    <td colspan="2" style="width: 54.1612%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; height: 1pt; vertical-align: top;">
                        <p><strong>Which of the following monitoring procedure, the PU has in place for QC:</strong></p>
                    </td>
                    <td style="width: 33.0435%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; height: 1pt; vertical-align: top;">
                        <p>&nbsp;</p>
                    </td>
                </tr>
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9]
                  .map((i) => {
                    const key = `qc_monitoring_${
                      i === 9 ? "ix" : "i".repeat(i)
                    }`;
                    const label = [
                      "Designated partner/(s) for performing annual inspection",
                      "Deciding how long to retain detailed inspection documentation",
                      "Reviewing correspondence regarding consultation on independence, integrity and objectivity matters and acceptance and continuance decisions",
                      "Preparing summary inspection report for the partner and sets forth any recommended changes that should be made to the firm's policies and procedures",
                      "Reviewing and evaluating Firm practice aids, such as audit programs, forms, checklists and considering that they are up to date relevant",
                      "Reviewing summary of CPED records of firms professional personnel",
                      "Reviewing other administrative and personnel records pertaining to QC elements",
                      "Soliciting information on the effectiveness of training programs from the Firm's personnel",
                      `Any other (Pls. elaborate) ${
                        i === 9 ? data.qc_monitoring_other_details || "" : ""
                      }`,
                    ][i - 1];

                    return `
                  <tr>
                      <td style="border: none; padding: 0cm; width: 2.5591%;"></td>
                      <td style="width: 10.2362%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt; height: 1pt; vertical-align: top;">
                          <p style="text-align:center;">(${
                            i === 9 ? "ix" : "i".repeat(i)
                          })</p>
                      </td>
                      <td colspan="2" style="width: 54.1612%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; height: 1pt; vertical-align: top;">
                          <p>${label}</p>
                      </td>
                      <td style="width: 33.0435%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; height: 1pt; vertical-align: top;">
                          <p>${data[key] || ""}</p>
                      </td>
                  </tr>`;
                  })
                  .join("")}
                <tr>
                    <td colspan="3" style="width: 52.1674%; border: none; padding: 0cm 5.4pt; vertical-align: top;">
                        <p>Signature</p>
                        <p>${data.signature || ""}</p>
                    </td>
                    <td style="border: none; padding: 0cm; width: 47.6357%;" colspan="2"></td>
                </tr>
                <tr>
                    <td colspan="3" style="width: 52.1674%; border: none; padding: 0cm 5.4pt; vertical-align: top;">
                        <p>Name of Proprietor/Partner/ individual Practicing in own name:</p>
                        <p>${data.signatory_name || ""}</p>
                    </td>
                    <td style="border: none; padding: 0cm; width: 47.6357%;" colspan="2"></td>
                </tr>
                <tr>
                    <td colspan="3" style="width: 52.1674%; border: none; padding: 0cm 5.4pt; vertical-align: top;">
                        <p>Membership No. of the Signatory</p>
                        <p>${data.membership_number || ""}</p>
                    </td>
                    <td style="border: none; padding: 0cm; width: 47.6357%;" colspan="2"></td>
                </tr>
            </tbody>
        </table>
       
        <!-- Page NO 33. -->

        <div class="header page-break">
            <h1>PART C </h1>
            <h1>Scores obtained by self-evaluation using AQMMv1.0</h1>
            <p><strong>[Mandatory Applicable w.e.f 1<sup>st</sup> April 2023 for Practice units conducting statutory audit of listed entities (other than branches of banks and Insurance companies) and recommendatory for other Practice Units]</strong></p>
        </div>

        <!-- Section 1: Practice Management - Operation -->
        <div class="section-title">Section 1: Practice Management – Operation</div>
        
        <table>
            <thead>
                <tr>
                    <th colspan="2">Competency Basis</th>
                    <th>Score Basis</th>
                    <th>Max Scores</th>
                    <th>Scores obtained</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="5"><strong>1.1 Practice Areas of the Firm</strong></td>
                </tr>
                <tr>
                    <td>I</td>
                    <td>Revenue from audit and assurance services</td>
                    <td>
                        <p>(i) 50% to 75% – 5 Points</p>
                        <p>(ii) Above 75% – 8 Points</p>
                    </td>
                    <td class="text-center">8</td>
                    <td class="text-center">${data.revenue_score || "0"}</td>
                </tr>
                <tr>
                    <td>ii</td>
                    <td>Does the firm have a vision and mission statement? Does it address Forward looking practice statements/Plans?</td>
                    <td>
                        <p>For Yes – 4 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${data.vision_mission || "0"}</td>
                </tr>
                <tr>
                    <td></td>
                    <td><strong>Total</strong></td>
                    <td></td>
                    <td class="text-center">12</td>
                    <td class="text-center">${data.section1_1_total || "0"}</td>
                </tr>
            </tbody>
        </table>

        <table>
            <thead>
                <tr>
                    <th colspan="2">Competency Basis</th>
                    <th>Score Basis</th>
                    <th>Max Scores</th>
                    <th>Scores obtained</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="5"><strong>1.2 Work Flow - Practice Manuals</strong></td>
                </tr>
                <tr>
                    <td>i.</td>
                    <td>Presence of Audit manuals containing the firm's methodology that ensures compliance with auditing standards and implementation thereof.</td>
                    <td>
                        <p>For Yes – 8 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">8</td>
                    <td class="text-center">${data.audit_manuals || "0"}</td>
                </tr>
                <tr>
                    <td>ii.</td>
                    <td>
                        Availability of standard formats relevant for audit quality like:
                        <p>- LOE</p>
                        <p>- Representation letter</p>
                        <p>- Significant working papers</p>
                        <p>- Reports and implementation thereof</p>
                    </td>
                    <td>
                        <p>For Yes – 8 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">8</td>
                    <td class="text-center">${data.standard_formats || "0"}</td>
                </tr>
                <tr>
                    <td></td>
                    <td><strong>Total</strong></td>
                    <td></td>
                    <td class="text-center">16</td>
                    <td class="text-center">${data.section1_2_total || "0"}</td>
                </tr>
            </tbody>
        </table>

        <!-- Page No 34 -->
        <div class="header">
            <p><strong>Quality Review Manuals Section</strong></p>
        </div>

        <!-- Section 1.3: Quality Review Manuals or Audit Tool -->
        <div class="section-title">1.3 Quality Review Manuals or Audit Tool</div>
        
        <table>
            <thead>
                <tr>
                    <th style="width: 6%;">S.No.</th>
                    <th style="width: 54%;">Competency Basics</th>
                    <th style="width: 30%;">Score Basis</th>
                    <th style="width: 5%;">Max Scores</th>
                    <th style="width: 5%;">Scores Obtained</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>i.</td>
                    <td>Usage of Client Acceptance/engagement acceptance checklists and adequate documentation thereof.</td>
                    <td>
                        <p>For Yes – 4 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${
                      data.acceptance_checklists || "0"
                    }</td>
                </tr>
                <tr>
                    <td>ii.</td>
                    <td>Evaluation of Independence for all engagements (partners, managers, staff, trainees) based on the extent required. The firm must identify self-interest threat, familiarity threat, intimidation threat, self-review threat, advocacy threat and conflict of interest.</td>
                    <td>
                        <p>For Yes – 4 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${
                      data.independence_evaluation || "0"
                    }</td>
                </tr>
                <tr>
                    <td>iii.</td>
                    <td>Does the Firm maintain and use the engagement withdrawal/rejection policy, templates, etc.</td>
                    <td>
                        <p>For Yes – 4 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${
                      data.withdrawal_policy || "0"
                    }</td>
                </tr>
                <tr>
                    <td>iv.</td>
                    <td>Availability and use of standard checklists in performance of an Audit for Compliance with Accounting and Auditing Standards</td>
                    <td>
                        <p>For Yes – 4 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${
                      data.standard_checklists || "0"
                    }</td>
                </tr>
                <tr>
                    <td>v.</td>
                    <td>Availability and use of standard formats for audit documentation of Business Understanding, Sampling basis, Materiality determination, Data analysis, and Control Evaluation</td>
                    <td>
                        <p>For Yes – 4 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${data.standard_formats || "0"}</td>
                </tr>
                <tr>
                    <td>vi.</td>
                    <td>Are the documents related to Quality control mentioned from (i) to (v) above reviewed and updated on a frequent basis (say annually) or with each change in the respective regulation or statute and remedial action taken?</td>
                    <td>
                        <p>For Yes – 4 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${
                      data.documents_reviewed || "0"
                    }</td>
                </tr>
                <tr>
                    <td></td>
                    <td><strong>Total</strong></td>
                    <td></td>
                    <td class="text-center">24</td>
                    <td class="text-center">${data.section1_3_total || "0"}</td>
                </tr>
            </tbody>
        </table>


        <!-- Page No 35 -->

        <div class="header page-break">
        <!-- Section 1.4: Service Delivery - Effort Monitoring -->
        <div class="section-title">1.4 Service Delivery - Effort Monitoring</div>
        
        <table>
            <thead>
                <tr>
                    <th style="width: 8%;">S.No.</th>
                    <th style="width: 44%;">Competency Basis</th>
                    <th style="width: 24%;">Score Basis</th>
                    <th style="width: 11%;">Max Scores</th>
                    <th style="width: 13%;">Scores Obtained</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>i.</td>
                    <td>Does the firm carry out a Capacity planning for each engagement?</td>
                    <td>
                        <p>For Yes – 4 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${
                      data.capacity_planning || "0"
                    }</td>
                </tr>
                <tr>
                    <td>ii.</td>
                    <td>Is a process of Budgeting & Planning of efforts required maintained (hours/days/weeks)?</td>
                    <td>
                        <p>For Yes – 4 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${
                      data.budgeting_process || "0"
                    }</td>
                </tr>
                <tr>
                    <td>iii.</td>
                    <td>Are Budget vs Actual analysis of time and effort spent carried out to identify the costing and pricing?</td>
                    <td>
                        <p>Up to 10% – 0 Point</p>
                        <p>More than 10% and up to 30% – 4 Points</p>
                        <p>More than 30% and up to 50% – 8 Points</p>
                        <p>More than 50% and up to 70% – 12 Points</p>
                        <p>More than 70% and up to 90% – 16 Points</p>
                        <p>More than 90% – 20 Points</p>
                    </td>
                    <td class="text-center">20</td>
                    <td class="text-center">${getBudgetAnalysisText(
                      data.budget_analysis
                    )}</td>
                </tr>
                <tr>
                    <td>iv.</td>
                    <td>Does the firm deploy technology for monitoring efforts spent - Utilisation of tools to track each activity (similar to Project management - Say timesheets, task management, etc.)?</td>
                    <td>
                        <p>For Yes – 8 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">8</td>
                    <td class="text-center">${data.tech_monitoring || "0"}</td>
                </tr>
                <tr>
                    <td></td>
                    <td><strong>Total</strong></td>
                    <td></td>
                    <td class="text-center">36</td>
                    <td class="text-center">${data.section1_4_total || "0"}</td>
                </tr>
            </tbody>
        </table>

        <!-- Page No 36 -->

        <h1 class="page-break">Quality Control Assessment Report</h1>

      <div class="section-title">1.5 Quality Control for Engagements</div>

      <table>
        <thead>
          <tr>
            <th style="width: 8%;">S.No.</th>
            <th style="width: 44%;">Competency Basis</th>
            <th style="width: 24%;">Score Basis</th>
            <th style="width: 11%;">Max Scores</th>
            <th style="width: 13%;">Scores Obtained</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>i.</td>
            <td>Does the firm have a Quality Review of all Listed audit engagements as per para 60 of SQC1? Is there a document of time spent for review of all engagements?</td>
            <td>
              <p>For Yes – 8 Points</p>
              <p>For No – 0 Point</p>
            </td>
            <td class="text-center">8</td>
            <td>
              <span class="checkbox">${
                data.quality_review === "yes" ? "✓ (8)" : "✗ (0)"
              }</span>
            </td>
          </tr>
          <tr>
            <td>ii.</td>
            <td>Total engagements having concluded to be satisfactory as per quality review vs No of engagements quality reviewed</td>
            <td>
              <p>Up to 10% – 0 Point</p>
              <p>More than 10% and up to 30% – 4 Points</p>
              <p>More than 30% and up to 50% – 8 Points</p>
              <p>More than 50% and up to 70% – 12 Points</p>
              <p>More than 70% and up to 90% – 16 Points</p>
              <p>More than 90% – 20 Points</p>
            </td>
            <td class="text-center">20</td>
            <td>${data.satisfactory_engagements || "0"} Points</td>
          </tr>
          <tr>
            <td>iii.</td>
            <td>No. of engagements without findings by ICAI, Committees of ICAI and regulators that require significant improvements</td>
            <td>
              <p>10% to 30% – 4 Points</p>
              <p>More than 30% and up to 50% – 8 Points</p>
              <p>More than 50% and up to 70% – 12 Points</p>
              <p>More than 70% and up to 90% – 16 Points</p>
              <p>More than 90% – 20 Points</p>
            </td>
            <td class="text-center">20</td>
            <td>${data.engagements_without_findings || "0"} Points</td>
          </tr>
          <tr>
            <td></td>
            <td><strong>Total</strong></td>
            <td></td>
            <td class="text-center">36</td>
            <td><strong>${totalScore} Points</strong></td>
          </tr>
        </tbody>
      </table>

      <!-- Page No 37 -->

      <table class="page-break">
            <thead>
                <tr>
                    <th style="width: 8%;">S.No.</th>
                    <th style="width: 44%;">Competency Basis</th>
                    <th style="width: 24%;">Score Basis</th>
                    <th style="width: 11%;">Max Scores</th>
                    <th style="width: 13%;">Scores Obtained</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>iv.</td>
                    <td>Documentation of the firm in accordance with SQC 1</td>
                    <td>
                        <p>For the presence of documentation in the critical areas of Ethical require-ments, Acceptance and continuance of client relation-ships and specific engagements, and Engage-ment performance – 6 Points</p>
                        <p>For the presence of documentation in the areas of Leadership responsibilities for quality within the firm, Human resources, and Monitoring – 6 Points</p>
                    </td>
                    <td class="text-center">12</td>
                    <td>${getRadioValue("capacity_planning")}</td>
                </tr>
                <tr>
                    <td>v.</td>
                    <td>Does the firm have Accounting and Auditing Resources in the form of soft copies of archives Q&As, firm thought leadership, a dedicated/ Shared Technical desk?</td>
                    <td>
                        <p>For Yes – 8 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">8</td>
                    <td>${getRadioValue("budgeting_process")}</td>
                </tr>
                <tr>
                    <td>vi.</td>
                    <td>Is appropriate time spent on understanding the business, risk assessment and planning an engagement?Have risks been mitigated through performance of audit procedures?</td>
                    <td>
                        <p>For Yes – 12 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">12</td>
                    <td>${getSelectValue("budget_analysis")}</td>
                </tr>
                <tr class="total-row">
                    <td></td>
                    <td><strong>Total</strong></td>
                    <td></td>
                    <td class="text-center">36</td>
                    <td>${total}</td>
                </tr>
            </tbody>
        </table>

        <!-- Page No 38 -->

         <table class="page-break">
            <thead>
                <tr>
                    <th style="width: 8%;">S.No.</th>
                    <th style="width: 44%;">Competency Basis</th>
                    <th style="width: 24%;">Score Basis</th>
                    <th style="width: 11%;">Max Scores</th>
                    <th style="width: 13%;">Scores Obtained</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>i.</td>
                    <td>Does the firm follow/implement Standard delivery methodology – the adoption of audit manuals, adherence to practice standards and tools?</td>
                    <td class="score-basis">
                        <p>For No - 0 Points</p>
                    </td>
                    <td class="text-center">12</td>
                    <td>${getRadioValue("question_i")} (Score: ${scoreI})</td>
                </tr>
                <tr>
                    <td>ii.</td>
                    <td>The number of statutory audit engagements re-worked (filing errors, information insufficiency, wrong interpretation of provisions, etc.)</td>
                    <td class="score-basis">
                        <p>Less than 5% - 0 Point</p>
                        <p>More than 5% to 15% (-1) Point</p>
                        <p>More than 15% to 30% to 50% (-3) Points</p>
                        <p>More than 50% (-4) Points</p>
                    </td>
                    <td class="text-center">0</td>
                    <td>${getSelectValue(
                      "question_ii"
                    )} (Score: ${scoreII})</td>
                </tr>
                <tr>
                    <td>iii.</td>
                    <td>Number of client disputes (other than fees disputes) and how they are addressed.</td>
                    <td class="score-basis">
                        <p>Less than 5% – 0 Point</p>
                        <p>More than 5% to 15%: (-1) Point</p>
                        <p>More than 15% to 30%: (-2) Points</p>
                        <p>More than 30% to 50%: (-3) Points</p>
                        <p>More than 50%: (-4) Points</p>
                    </td>
                    <td class="text-center">12</td>
                    <td>${getSelectValue(
                      "question_iii"
                    )} (Score: ${scoreIII})</td>
                </tr>
                <tr>
                    <td>iv.</td>
                    <td>Is the timing of audit interactions with management planned in such a way that integrates with the auditor's requirements so that audit timelines can be met?</td>
                    <td class="score-basis">
                        <p>For Yes – 12 Points</p>
                        <p>For No – 0 Point</p>
                    </td>
                    <td class="text-center">12</td>
                    <td>${getSelectValue(
                      "question_iv"
                    )} (Score: ${scoreIV})</td>
                </tr>
                <tr class="total-row">
                    <td></td>
                    <td><strong>Total</strong></td>
                    <td></td>
                    <td class="text-center">36</td>
                    <td><strong>${totals}</strong></td>
                </tr>
            </tbody>
        </table>


        <!-- Page No 39 to 41-->

      <table class="page-break">
            <thead>
                <tr>
                    <th style="width: 9.0769%;">S.No.</th>
                    <th style="width: 39.3228%;">Competency Basis</th>
                    <th style="width: 20.5234%;">Score Basis</th>
                    <th style="width: 19.4968%;">Max Scores</th>
                    <th style="width: 13.734%;">Scores<br>obtained</th>
                </tr>
            </thead>
            <tbody>
                <!-- Client Sensitization Section -->
                <tr>
                    <td style="width: 9.0769%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><strong class="century-schoolbook">1.7</strong></p>
                    </td>
                    <td colspan="4" style="width: 90.7693%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><strong class="century-schoolbook">Client Sensitisation</strong></p>
                    </td>
                </tr>
                <tr>
                    <td style="width: 9.0769%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="century-schoolbook">i.</span></p>
                    </td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="century-schoolbook">Awareness meetings and Knowledge dissemination meetings/articles/document sharing with clients including:</span></p>
                        <p style="margin-top:2.0pt;text-align:justify;margin-left:18.3pt;text-indent:-18.3pt;"><span class="century-schoolbook">1) Updating client on audit issues, formally- effectiveness of the process of communication with management and those charged with Governance;</span></p>
                        <p style="margin-top:2.0pt;text-align:justify;margin-left:18.3pt;text-indent:-18.3pt;"><span class="century-schoolbook">2) Updating client on changes in accounting, legal, audit aspects, etc. with client specific impact; and</span></p>
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="century-schoolbook">3) Follow through on previous audit observations and updates to management and those charged with Governance.</span></p>
                    </td>
                    <td style="width: 20.5234%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="century-schoolbook">For Yes - 8 Points</span></p>
                        <p style="margin-top:3.0pt;text-align:justify;"><span class="century-schoolbook">For No - 0 Point</span></p>
                    </td>
                    <td style="width: 19.4968%;" class="text-center">
                        <p style="margin-top:2.0pt;"><span class="century-schoolbook">8</span></p>
                    </td>
                    <td style="width: 13.734%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong>${getSelectValue(
                          "client_sensitization_i"
                        )} (Score: ${
    data.client_sensitization_i === "yes" ? 8 : 0
  })</strong></p>
                    </td>
                </tr>
                <tr>
                    <td style="width: 9.0769%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="century-schoolbook">ii.</span></p>
                    </td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="century-schoolbook">Monitoring planned hours vs actual hours across engagement; the focus is on the existence of a monitoring mechanism</span></p>
                    </td>
                    <td style="width: 20.5234%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="century-schoolbook">For Yes - 8 Points</span></p>
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="century-schoolbook">For No - 0 Point</span></p>
                    </td>
                    <td style="width: 19.4968%;" class="text-center">
                        <p style="margin-top:2.0pt;"><span class="century-schoolbook">8</span></p>
                    </td>
                    <td style="width: 13.734%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong>${getSelectValue(
                          "client_sensitization_ii"
                        )} (Score: ${
    data.client_sensitization_ii === "yes" ? 8 : 0
  })</strong></p>
                    </td>
                </tr>
                <tr class="total-row">
                    <td style="width: 9.0769%;"></td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><strong class="century-schoolbook">Total</strong></p>
                    </td>
                    <td style="width: 20.5234%;"></td>
                    <td style="width: 19.4968%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong class="century-schoolbook">16</strong></p>
                    </td>
                    <td style="width: 13.734%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong>${clientSensitizationScore}</strong></p>
                    </td>
                </tr>

                <!-- Technology Adoption Section -->
                <tr>
                    <td style="width: 9.0769%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><strong class="century-schoolbook">1.8</strong></p>
                    </td>
                    <td colspan="4" style="width: 90.7693%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><strong class="century-schoolbook">Technology Adoption</strong></p>
                    </td>
                </tr>
                <tr>
                    <td style="width: 9.0769%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">(i)</span></p>
                    </td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="century-schoolbook">Technology adoption at</span></p>
                    </td>
                    <td style="width: 20.5234%;"></td>
                    <td style="width: 19.4968%;" class="text-center"></td>
                    <td style="width: 13.734%;" class="text-center"></td>
                </tr>
                
                <tr>
                    <td style="width: 9.0769%;"></td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="century-schoolbook">Office -</span></p>
                    </td>
                    <td style="width: 20.5234%;"></td>
                    <td style="width: 19.4968%;" class="text-center"></td>
                    <td style="width: 13.734%;" class="text-center"></td>
                </tr>
                
                <!-- Office Technology Items -->
                ${generateTechAdoptionRows(data)}
                
                <tr>
                    <td style="width: 9.0769%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">ii.</span></p>
                    </td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">Awareness and Adoption of Technology for Service delivery - Say, use of Audit tools, usage of analytical tools, use of data visualisation tools or adoption of an audit tool. Note: DCMM version 2 may be referred to arrive at the technical maturity of the firm/CA.</span></p>
                    </td>
                    <td style="width: 20.5234%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">For Yes - 12 Points</span></p>
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">For No - 0 Point</span></p>
                    </td>
                    <td style="width: 19.4968%;" class="text-center">
                        <p style="margin-top:2.0pt;"><span class="calibri">12</span></p>
                    </td>
                    <td style="width: 13.734%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong>${getSelectValue(
                          "tech_adoption_ii"
                        )} (Score: ${
    data.tech_adoption_ii === "yes" ? 12 : 0
  })</strong></p>
                    </td>
                    
                </tr>
                <tr class="total-row">
                    <td style="width: 9.0769%;"></td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><strong class="calibri">Total</strong></p>
                    </td>
                    <td style="width: 20.5234%;"></td>
                    <td style="width: 19.4968%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong class="calibri">64</strong></p>
                    </td>
                    <td style="width: 13.734%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong>${techAdoptionScore}</strong></p>
                    </td>
                </tr>

                <!-- Revenue, Budgeting & Pricing Section -->
                <tr>
                    <td style="width: 9.0769%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><strong class="century-schoolbook">1.9</strong></p>
                    </td>
                    <td colspan="4" style="width: 90.7693%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><strong class="century-schoolbook">Revenue, Budgeting & Pricing</strong></p>
                    </td>
                </tr>
                <tr>
                    <td style="width: 9.0769%;">
                        <p style="margin-top:0cm;text-align:justify;"><span class="calibri">i.</span></p>
                    </td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">Whether the client wise revenue is in compliance with the Code of Ethics (currently fees from one client should not exceed 40% of total revenue unless safeguards are put in place) and once the deferred clauses of Part A are implemented this will be reduced to 15%.</span></p>
                    </td>
                    <td style="width: 20.5234%;">
                        <p style="margin-top:3.0pt;text-align:justify;"><span class="calibri">For Yes -4 Points</span></p>
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">For No - 0 Point</span></p>
                    </td>
                    <td style="width: 19.4968%;" class="text-center">
                        <p style="margin-top:2.0pt;"><span class="calibri">4</span></p>
                    </td>
                    <td style="width: 13.734%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong>${getSelectValue(
                          "revenue_pricing_i"
                        )} (Score: ${
    data.revenue_pricing_i === "yes" ? 4 : 0
  })</strong></p>
                    </td>
                </tr>
                <tr>
                    <td style="width: 9.0769%;">
                        <p style="margin-top:0cm;text-align:justify;"><span class="calibri">ii.</span></p>
                    </td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">Fee considerations and scope of services should not infringe upon the quality of work and documentation as envisaged in SQC 1 under Leadership is responsible for quality within the firm.</span></p>
                    </td>
                    <td style="width: 20.5234%;">
                        <p style="margin-top:3.0pt;text-align:justify;"><span class="calibri">Yes - 8 Points</span></p>
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">For No - 0 Point</span></p>
                    </td>
                    <td style="width: 19.4968%;" class="text-center">
                        <p style="margin-top:2.0pt;"><span class="calibri">8</span></p>
                    </td>
                    <td style="width: 13.734%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong>${getSelectValue(
                          "revenue_pricing_ii"
                        )} (Score: ${
    data.revenue_pricing_ii === "yes" ? 8 : 0
  })</strong></p>
                    </td>
                </tr>
                <tr>
                    <td style="width: 9.0769%;">
                        <p style="margin-top:3.0pt;text-align:justify;"><span class="calibri">iii.</span></p>
                    </td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><span class="calibri">Adherence to a minimum scale of fees standards recommended by ICAI</span></p>
                    </td>
                    <td style="width: 20.5234%;">
                        <p style="margin-top:4.0pt;text-align:justify;"><span class="calibri">For up to 50% of the engagements- 2 Points</span></p>
                        <p style="margin-top:4.0pt;text-align:justify;"><span class="calibri">For More than 50% of the engagements - 4 Points</span></p>
                        <p style="margin-top:3.0pt;text-align:justify;"><span class="calibri">For None - 0 Point</span></p>
                    </td>
                    <td style="width: 19.4968%;" class="text-center">
                        <p style="margin-top:2.0pt;"><span class="calibri">4</span></p>
                    </td>
                    <td style="width: 13.734%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong>${getSelectValue(
                          "revenue_pricing_iii"
                        )} (Score: ${
    data.revenue_pricing_iii === "50"
      ? 2
      : data.revenue_pricing_iii === "more_than_50"
      ? 4
      : 0
  })</strong></p>
                    </td>
                </tr>
                <tr class="total-row">
                    <td style="width: 9.0769%;"></td>
                    <td style="width: 39.3228%;">
                        <p style="margin-top:2.0pt;text-align:justify;"><strong class="calibri">Total</strong></p>
                    </td>
                    <td style="width: 20.5234%;"></td>
                    <td style="width: 19.4968%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong class="calibri">16</strong></p>
                    </td>
                    <td style="width: 13.734%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong>${revenuePricingScore}</strong></p>
                    </td>
                </tr>

                <!-- Section 1 Total -->
                <tr class="total-row">
                    <td colspan="3" style="width: 72.98%;">
                        <p style="margin-top:2.0pt;text-align:center;"><strong class="calibri">Total of Section 1</strong></p>
                    </td>
                    <td style="width: 19.4968%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong class="calibri">280</strong></p>
                    </td>
                    <td style="width: 13.734%;" class="text-center">
                        <p style="margin-top:2.0pt;"><strong>${section1Total}</strong></p>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Page No 42 to 46-->

      <!--   <table>
        <tr>
          <th>Firm Name:</th>
          <td>${formData.firmName || ""}</td>
        </tr>
        <tr>
          <th>Assessor Name:</th>
          <td>${formData.assessorName || ""}</td>
        </tr>
        <tr>
          <th>Assessment Date:</th>
          <td>${formData.assessmentDate || ""}</td>
        </tr>
      </table> -->
    </div>

    <table class="assessment-table page-break">
      <thead>
        <tr>
          <th style="width: 5%;">S.No.</th>
          <th style="width: 60%;">Competency Basis</th>
          <th style="width: 15%;">Score Basis</th>
          <th style="width: 10%;">Max</th>
          <th style="width: 10%;">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="5" class="section-header">2. Human Resource Management</td>
        </tr>
        
        <!-- Section 2.1 -->
        <tr>
          <td colspan="5" class="subsection-header">2.1. Resource Planning & Monitoring as per the firm's policy</td>
        </tr>
        ${generateAssessmentRow(
          "2.1.i",
          "Does the firm have a process of Employee/ Resource Planning for the engagements based on skill set requirement, experience, etc.?",
          "Yes=4, No=0",
          4,
          formData.score_2_1_i
        )}
        ${generateAssessmentRow(
          "2.1.ii",
          "Methods/Tools used by the firm for Resource Allocation (use of spreadsheets, work flow tools, etc.)",
          "Yes=4, No=0",
          4,
          formData.score_2_1_ii
        )}
        ${generateAssessmentRow(
          "2.1.iii",
          "Is there a method of tracking the employee activity, to identity resource productivity (e.g., timesheet)?",
          "Yes=4, No=0",
          4,
          formData.score_2_1_iii
        )}
        ${generateAssessmentRow(
          "2.1.iv",
          "Does the firm maintain a minimum Staff to Partner Ratio, Partner to Manager, Manager to Articles, Client to Staff ratio, etc.",
          "Yes=8, No=0",
          8,
          formData.score_2_1_iv
        )}
        ${generateAssessmentRow(
          "2.1.v",
          "Does the firm monitor the Utilisation & Realisation rate per employee",
          "Yes=4, No=0",
          4,
          formData.score_2_1_v
        )}
        ${generateAssessmentRow(
          "2.1.vi",
          "Does the firm document the resource plan for each engagement and file it for reference during the engagement?",
          "Yes=4, No=0",
          4,
          formData.score_2_1_vi
        )}
        ${generateTotalRow("Subtotal", 28, scores.section_2_1)}
        
        <!-- Section 2.2 -->
        <tr>
          <td colspan="5" class="subsection-header">2.2. Employee Training & Development</td>
        </tr>
        ${generateAssessmentRow(
          "2.2.i",
          "Does the firm have an employee training policy?",
          "Yes=4, No=0",
          4,
          formData.score_2_2_i
        )}
        ${generateAssessmentRow(
          "2.2.ii",
          "Number of Professional Development hours/days spent (Frequency) as a firm – per employee",
          "Based on hours",
          24,
          formData.score_2_2_ii
        )}
        ${generateAssessmentRow(
          "2.2.iii",
          "Employees are equipped with technological skill sets – AI, Blockchain, Audit & Data analytical tools, etc.",
          "Yes=8, No=0",
          8,
          formData.score_2_2_iii
        )}
        ${generateAssessmentRow(
          "2.2.iv",
          "Whether the firm has a performance management culture that rewards high performing employees?",
          "Yes=8, No=0",
          8,
          formData.score_2_2_iv
        )}
        ${generateTotalRow("Subtotal", 44, scores.section_2_2)}
        
        <!-- Section 2.3 -->
        <tr>
          <td colspan="5" class="subsection-header">2.3. Resources Turnover & Compensation Management</td>
        </tr>
        ${generateAssessmentRow(
          "2.3.i",
          "Does the Firm evaluate a team composition overall to build the Team Strength?",
          "Yes=8, No=0",
          8,
          formData.score_2_3_i
        )}
        ${generateAssessmentRow(
          "2.3.ii",
          "Does the firm maintain and monitor the employee turnover ratio?",
          "Yes=8, No=0",
          8,
          formData.score_2_3_ii
        )}
        ${generateAssessmentRow(
          "2.3.iii",
          "Qualified professionals retained by the firm (resources available to a partner)",
          "Based on count",
          20,
          formData.score_2_3_iii
        )}
        ${generateAssessmentRow(
          "2.3.iv",
          "Does the firm evaluate the Employee relation with the firm?",
          "Yes=4, No=0",
          4,
          formData.score_2_3_iv
        )}
        ${generateAssessmentRow(
          "2.3.v",
          "Statutory contributions, Health Insurance and other benefits",
          "Yes=8, No=0",
          8,
          formData.score_2_3_v
        )}
        ${generateAssessmentRow(
          "2.3.vi",
          "Does the firm evaluate for which kind of audits does it have a revolving door?",
          "Yes=4, No=0",
          4,
          formData.score_2_3_vi
        )}
        ${generateAssessmentRow(
          "2.3.vii",
          "Progress of people through an established framework",
          "Yes=8, No=0",
          8,
          formData.score_2_3_vii
        )}
        ${generateAssessmentRow(
          "2.3.viii",
          "Access and use of technology, infrastructure",
          "Yes=8, No=0",
          8,
          formData.score_2_3_viii
        )}
        ${generateAssessmentRow(
          "2.3.ix",
          "Coaching and mentoring program investment",
          "Yes=8, No=0",
          8,
          formData.score_2_3_ix
        )}
        ${generateAssessmentRow(
          "2.3.x",
          "Special policies to provide time to rejuvenate",
          "Yes=4, No=0",
          4,
          formData.score_2_3_x
        )}
        ${generateAssessmentRow(
          "2.3.xi",
          "Focused policies for staff well-being",
          "Yes=8, No=0",
          8,
          formData.score_2_3_xi
        )}
        ${generateAssessmentRow(
          "2.3.xii",
          "An established mechanism to listen to people",
          "Yes=8, No=0",
          8,
          formData.score_2_3_xii
        )}
        ${generateAssessmentRow(
          "2.3.xiii",
          "Standards of recruiting people",
          "Yes=4, No=0",
          4,
          formData.score_2_3_xiii
        )}
        ${generateAssessmentRow(
          "2.3.xiv",
          "Are employees compensated as per defined approach?",
          "Yes=4, No=0",
          4,
          formData.score_2_3_xiv
        )}
        ${generateTotalRow("Subtotal", 104, scores.section_2_3)}
        
        <!-- Section 2.4 -->
        <tr>
          <td colspan="5" class="subsection-header">2.4. Qualification Skill Set of employees and use of Experts</td>
        </tr>
        ${generateAssessmentRow(
          "2.4.i",
          "Number of Professionally qualified members – ACA/FCA",
          "Based on %",
          12,
          formData.score_2_4_i
        )}
        ${generateAssessmentRow(
          "2.4.ii",
          "Post Qualification Certifications (DISA, IP, etc.)",
          "Applicable=8, NA=0",
          8,
          formData.score_2_4_ii
        )}
        ${generateAssessmentRow(
          "2.4.iii",
          "Members with Specialisation courses or Certifications",
          "Based on %",
          12,
          formData.score_2_4_iii
        )}
        ${generateTotalRow("Subtotal", 32, scores.section_2_4)}
        
        <!-- Section 2.5 -->
        <tr>
          <td colspan="5" class="subsection-header">2.5. Performance evaluation measures carried out by the firm (KPI's)</td>
        </tr>
        ${generateAssessmentRow(
          "2.5.i",
          "Does the firm have written KPIs for performance evaluation?",
          "Yes=8, No=0",
          8,
          formData.score_2_5_i
        )}
        ${generateAssessmentRow(
          "2.5.ii",
          "Method for measurement and evaluation are determined/specific",
          "Yes=8, No=0",
          8,
          formData.score_2_5_ii
        )}
        ${generateAssessmentRow(
          "2.5.iii",
          "There is a decided frequency for the evaluation",
          "Yes=8, No=0",
          8,
          formData.score_2_5_iii
        )}
        ${generateAssessmentRow(
          "2.5.iv",
          "Are engagement partners reviewed based on review results?",
          "Yes=8, No=0",
          8,
          formData.score_2_5_iv
        )}
        ${generateTotalRow("Subtotal", 32, scores.section_2_5)}
        
        <!-- Final Total -->
        <tr class="total-row">
          <td colspan="3">Total Score</td>
          <td class="text-center">240</td>
          <td class="text-center">${scores.totalScore}</td>
        </tr>
      </tbody>
    </table>


    <!-- Page no 47 to 50 -->

    <table class="page-break">
            <thead>
                <tr>
                    <th style="width: 8%">Ref</th>
                    <th style="width: 45%">Competency Basis</th>
                    <th style="width: 27%">Score Basis</th>
                    <th style="width: 10%">Max Scores</th>
                    <th style="width: 10%">Scores Obtained</th>
                </tr>
            </thead>
            <tbody >
                <!-- Section 3.1 - Practice Management -->
                <tr class="section-header">
                    <td>3</td>
                    <td colspan="4">Practice Management – Strategic/Functional</td>
                </tr>
                <tr class="subsection-header">
                    <td>3.1</td>
                    <td colspan="4">Practice Management</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Does the firm Manage the following attributes relating to Assurance partners to maintain the same at optimum levels as deemed fit for the respective organisations?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>i.</td>
                    <td>Does the firm have a balanced mix of experienced and new Assurance partners?</td>
                    <td>
                        For average partner experience of partners > 5 years – 4 Points<br>
                        For average partner experience of partners > 10 years – 8 Points
                    </td>
                    <td class="text-center">8</td>
                    <td class="text-center">${getScore("score_3_1_i")}</td>
                </tr>
                <tr>
                    <td>ii.</td>
                    <td>Is the firm compliant with the ICAI Code of Ethics, Companies Act 2013 and other regulatory requirements in relation to Professional Independence and Conflict of Interest?</td>
                    <td>
                        For Yes – 8 Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">8</td>
                    <td class="text-center">${getScore("score_3_1_ii")}</td>
                </tr>
                <tr>
                    <td>iii.</td>
                    <td>Is there is a 'whistle blower' policy?</td>
                    <td>
                        For Yes – 4 Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${getScore("score_3_1_iii")}</td>
                </tr>
                <tr class="total-row">
                    <td></td>
                    <td>Total</td>
                    <td></td>
                    <td class="text-center">20</td>
                    <td class="text-center">${getScore("total_3_1")}</td>
                </tr>

                <!-- Section 3.2 - Infrastructure -->
                <tr class="subsection-header">
                    <td>3.2</td>
                    <td colspan="4">Infrastructure – Physical & Others</td>
                </tr>
                <tr>
                    <td>i.</td>
                    <td>Number of Branches & Associates and network firms and affiliates</td>
                    <td>
                        Upto 3 – 2 Points<br>
                        4 to 7 – 4 Points<br>
                        8 to 15 – 6 Points<br>
                        More than 15 – 8 Points
                    </td>
                    <td class="text-center">8</td>
                    <td class="text-center">${getScore("score_3_2_i")}</td>
                </tr>
                <tr>
                    <td>ii.</td>
                    <td>Are branch level activities Centralised/ Decentralised in accounting, Invoicing, and Payroll processing</td>
                    <td>
                        Centralised – 8 Points<br>
                        Decentralised – 4 Points
                    </td>
                    <td class="text-center">8</td>
                    <td class="text-center">${getScore("score_3_2_ii")}</td>
                </tr>
                <tr>
                    <td>iii.</td>
                    <td>Physical & Logical Security of Information are extended and implemented across locations?</td>
                    <td>
                        For Yes – 8 Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">8</td>
                    <td class="text-center">${getScore("score_3_2_iii")}</td>
                </tr>
                <tr>
                    <td>iv.</td>
                    <td>Are there adequate DA tools and IT infrastructure available and are they being used for the relevant assignment?</td>
                    <td>
                        For Yes – 12 Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">12</td>
                    <td class="text-center">${getScore("score_3_2_iv")}</td>
                </tr>
                <tr>
                    <td>v.</td>
                    <td>Is the infrastructure adequate in terms of internet/intranet network bandwidth/ VPN/Wi-Fi etc. for remote working?</td>
                    <td>
                        For Yes – 12 Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">12</td>
                    <td class="text-center">${getScore("score_3_2_v")}</td>
                </tr>
                <tr class="total-row">
                    <td></td>
                    <td>Total</td>
                    <td></td>
                    <td class="text-center">48</td>
                    <td class="text-center">${getScore("total_3_2")}</td>
                </tr>

                <!-- Section 3.3 - Practice Credentials -->
                <tr class="subsection-header">
                    <td>3.3</td>
                    <td colspan="4">Practice Credentials</td>
                </tr>
                <tr>
                    <td></td>
                    <td>What are the credentials of the firm that distinguish the firm or stands as testimony to the quality of the firm?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>i.</td>
                    <td>Is the firm ICAI Peer Review certified?</td>
                    <td>
                        For Yes – 4 Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">4</td>
                    <td class="text-center">${getScore("score_3_3_i")}</td>
                </tr>
                <tr>
                    <td>ii.</td>
                    <td>Empanelment with RBI / C&AG</td>
                    <td>
                        For Yes – 8 Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">8</td>
                    <td class="text-center">${getScore("score_3_3_ii")}</td>
                </tr>
                <tr>
                    <td>iii.</td>
                    <td>Is there an advisory as well as a decision, to not allot work due to unsatisfactory performance by the CAG office?</td>
                    <td>
                        For Yes – (-5) Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">0</td>
                    <td class="text-center">${getScore("score_3_3_iii")}</td>
                </tr>
                <tr>
                    <td>iv.</td>
                    <td>Have any Government Bodies/ Authorities evaluated the performance of the firm to the extent of debarment/ blacklisting?</td>
                    <td>
                        For Yes – (-10) Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">0</td>
                    <td class="text-center">${getScore("score_3_3_iv")}</td>
                </tr>
                <tr>
                    <td>v.</td>
                    <td>Any negative assessment in the report of the Quality Review Board?</td>
                    <td>
                        For Yes – (-5) Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">0</td>
                    <td class="text-center">${getScore("score_3_3_v")}</td>
                </tr>
                <tr>
                    <td>vi.</td>
                    <td>Has there been a case of professional misconduct on the part of a member of the firm where he has been proved guilty?</td>
                    <td>
                        For Yes – (-5) Points<br>
                        For No – 0 Point
                    </td>
                    <td class="text-center">0</td>
                    <td class="text-center">${getScore("score_3_3_vi")}</td>
                </tr>
                <tr class="total-row">
                    <td></td>
                    <td>Total</td>
                    <td></td>
                    <td class="text-center">12</td>
                    <td class="text-center">${getScore("total_3_3")}</td>
                </tr>

                <!-- Section Totals -->
                <tr class="total-row">
                    <td colspan="3">Total of Section 3</td>
                    <td class="text-center">80</td>
                    <td class="text-center">${getScore("total_section_3")}</td>
                </tr>
                <tr class="grand-total-row">
                    <td colspan="3">Grand Total</td>
                    <td class="text-center">600</td>
                    <td class="text-center">${getScore("grand_total")}</td>
                </tr>
            </tbody>
        </table>


        </div>
    </body>
    </html>
  `;
}

// Create pdfs directory if it doesn't exist
const pdfDir = path.join(__dirname, "pdfs");
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
