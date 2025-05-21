const PDFDocument = require("pdfkit");

function createPDF(doc, data) {
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
}

module.exports = createPDF;
