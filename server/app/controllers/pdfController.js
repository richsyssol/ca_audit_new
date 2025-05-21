const fs = require("fs");
const PDFDocument = require("pdfkit");
const createPDF = require("../utils/template");

const sampleData = {
  title: "Competency Evaluation Report",
  sections: [
    {
      title: "Employee Relations",
      questions: [
        {
          question: "Does the firm evaluate Employee relation?",
          scoreBasis: "Yes - 4",
          maxScore: 4,
          scoreObtained: 4,
        },
        {
          question: "Statutory contributions and benefits?",
          scoreBasis: "Yes - 8",
          maxScore: 8,
          scoreObtained: 8,
        },
      ],
    },
    {
      title: "Performance Evaluation",
      questions: [
        {
          question: "Does the firm have written KPIs?",
          scoreBasis: "Yes - 8",
          maxScore: 8,
          scoreObtained: 8,
        },
        {
          question: "Are engagement partners reviewed?",
          scoreBasis: "Yes - 8",
          maxScore: 8,
          scoreObtained: 8,
        },
      ],
    },
  ],
  totalScore: 240,
};

exports.generatePDF = (req, res) => {
  const doc = new PDFDocument();
  const filePath = "output.pdf";

  doc.pipe(fs.createWriteStream(filePath));
  createPDF(doc, sampleData);
  doc.end();

  doc.pipe(res);
};
