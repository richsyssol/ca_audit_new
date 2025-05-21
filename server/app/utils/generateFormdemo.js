const PDFDocument = require("pdfkit");
const fs = require("fs");

function generatePDF(data, outputFile) {
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(outputFile);
  doc.pipe(stream);

  // Title
  doc.fontSize(16).text(data.title, { align: "center" }).moveDown();

  // Table Headers
  doc.fontSize(12).text("Competency Basis", 100, doc.y, { bold: true });
  doc.text("Score Basis", 300, doc.y);
  doc.text("Max Scores", 400, doc.y);
  doc.text("Scores Obtained", 500, doc.y);
  doc.moveDown();

  // Table Rows
  data.sections.forEach((section) => {
    doc.fontSize(14).text(section.title, { underline: true }).moveDown(0.5);
    section.questions.forEach((q) => {
      doc.fontSize(12).text(q.question, { width: 250 });
      doc.text(q.scoreBasis, 300, doc.y);
      doc.text(q.maxScore, 400, doc.y);
      doc.text(q.scoreObtained, 500, doc.y);
      doc.moveDown(0.5);
    });
  });

  // Total Score
  doc
    .moveDown()
    .fontSize(14)
    .text(`Total: ${data.totalScore}`, { align: "right" });

  doc.end();
}

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

generatePDF(sampleData, "output.pdf");
