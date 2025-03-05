const PDFDocument = require("pdfkit");
const fs = require("fs");

class PDFGenerator {
  constructor(margin = 50) {
    // Create document with slightly smaller margins to accommodate the border
    this.doc = new PDFDocument({
      margin: margin,
      size: "A4",
    });
  }

  /**
   * Draw a cell in the table with border
   */
  drawCell(
    text,
    x,
    y,
    width,
    height,
    align = "left",
    fontSize = 11,
    isBold = false,
    bgColor = null
  ) {
    this.doc.lineWidth(0.5); // Reduce the thickness of the table border
    if (bgColor) {
      this.doc.rect(x, y, width, height).fillAndStroke(bgColor, "black");
    } else {
      this.doc.rect(x, y, width, height).stroke();
    }

    if (isBold) {
      this.doc.font("Helvetica-Bold");
    } else {
      this.doc.font("Helvetica");
    }

    // Add padding from top and adjust vertical positioning
    this.doc
      .fillColor("black")
      .fontSize(fontSize)
      .text(text || "", x + 5, y + 5, {
        width: width - 10,
        align,
      });
  }

  /**
   * Draw table header
   */
  drawTableHeader(startX, y, colWidths, rowHeight) {
    const headers = [
      "NO",
      "URAIAN",
      "NO. MEMO / NOTA DINAS",
      "KEPADA",
      "VOL",
      "SAT",
    ];
    headers.forEach((header, index) => {
      this.drawCell(
        header,
        startX + colWidths.slice(0, index).reduce((a, b) => a + b, 0),
        y,
        colWidths[index],
        rowHeight,
        "center",
        10,
        true,
        "#f0f0f0" // Background color for table header
      );
    });
  }

  /**
   * Generate Berita Acara PDF
   */
  generateBeritaAcara(transaction) {
    if (!transaction || !transaction.items) {
      throw new Error("Invalid transaction data");
    }

    const date = new Date(transaction.createdAt);
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    // Add border around the entire page
    this.doc
      .rect(20, 20, this.doc.page.width - 40, this.doc.page.height - 40)
      .stroke();

    // Add header image
    const headerImagePath = "src/utils/image/header-pdf.png";
    const maxWidth = this.doc.page.width - 60; // Leave margins on both sides
    const headerImageY = 30; // Position from top

    // Add the header image to the PDF document
    // - headerImagePath: Path to the image file
    // - 50: X position of the image from the left margin
    // - headerImageY: Y position of the image from the top margin
    // - width: Set the width of the image to maxWidth, maintaining aspect ratio
    // - align: Center the image horizontally
    this.doc.image(headerImagePath, 30, headerImageY, {
      width: maxWidth,
      align: "center",
    });

    // Move down after image
    this.doc.y = headerImageY + 80; // Adjust this value based on image height

    // Header - bold and centered
    this.doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("black")
      .text("BERITA ACARA PENYERAHAN BARANG", { align: "center" });

    this.doc.moveDown(2);

    // Date and description line with real data
    this.doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("black")
      .text(
        `Pada hari : ${days[date.getDay()]} tanggal ${date.getDate()} bulan ${
          months[date.getMonth()]
        } tahun ${date.getFullYear()}`,
        { align: "left" }
      );

    this.doc.moveDown(0.5);

    this.doc
      .fillColor("black")
      .text(
        "Telah diserahkan barang sesuai permintaan pada memo dan sudah diperiksa dan diterima dengan baik barang sebagai berikut :",
        { align: "left" }
      );

    this.doc.moveDown(1);

    // Table configuration
    const startX = 50;
    const tableWidth = this.doc.page.width - 110; // Adjust table width to fit within border
    const headerHeight = 25;
    const rowHeight = 50; // Increased height for data rows

    // Calculate column widths as percentages of table width
    const colWidths = [
      tableWidth * 0.07, // NO (8%)
      tableWidth * 0.22, // URAIAN (22%)
      tableWidth * 0.28, // NO. MEMO / NOTA DINAS (28%)
      tableWidth * 0.23, // KEPADA (22%)
      tableWidth * 0.1, // VOL (10%)
      tableWidth * 0.1, // SATUAN (10%)
    ];

    let y = this.doc.y;

    // Draw initial table header
    this.drawTableHeader(startX, y, colWidths, headerHeight);

    // Table rows with actual transaction items
    y += headerHeight;
    transaction.items.forEach((item, index) => {
      // NO column
      this.drawCell(
        (index + 1).toString(),
        startX,
        y,
        colWidths[0],
        rowHeight,
        "center"
      );

      // URAIAN column (item name)
      this.drawCell(
        item.item.name,
        startX + colWidths[0],
        y,
        colWidths[1],
        rowHeight
      );

      // NO. MEMO / NOTA DINAS column (transaction reference)
      this.drawCell(
        transaction.reference,
        startX + colWidths[0] + colWidths[1],
        y,
        colWidths[2],
        rowHeight
      );

      // KEPADA column
      this.drawCell(
        transaction.to || "",
        startX + colWidths[0] + colWidths[1] + colWidths[2],
        y,
        colWidths[3],
        rowHeight
      );

      // VOL column (quantity)
      this.drawCell(
        item.quantity.toString(),
        startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
        y,
        colWidths[4],
        rowHeight,
        "center"
      );

      // SAT column (unit)
      this.drawCell(
        item.item.unit || "",
        startX + colWidths.slice(0, 5).reduce((a, b) => a + b, 0),
        y,
        colWidths[5],
        rowHeight,
        "center"
      );

      y += rowHeight;
    });

    // Footer text - now positioned to match the image
    this.doc.moveDown(4.5);
    this.doc.font("Helvetica").fontSize(11).fillColor("black").text(
      "Demikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya",
      50, // X position closer to the left margin
      this.doc.y,
      {
        align: "left",
      }
    );

    // Signatures
    this.doc.moveDown(4);

    // Signature section
    const signatureColumnWidth = 200;

    // Left signature
    this.doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("black")
      .text("Yang Menerima", 80, this.doc.y, {
        align: "left",
        width: signatureColumnWidth,
      });

    // Right signature with date
    const currentDate = new Date();
    this.doc
      .fillColor("black")
      .text(
        `Suralaya, ${currentDate.getDate()} ${
          months[currentDate.getMonth()]
        } ${currentDate.getFullYear()}\nYang Menyerahkan`,
        this.doc.page.width - 250,
        this.doc.y - 24,
        {
          align: "center",
          width: signatureColumnWidth,
        }
      );

    // Signatures
    this.doc.moveDown(6);
    // Signature section
    const namesignatureColumnWidth = 200;

    // Left signature
    this.doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("black")
      .text("..................", 90, this.doc.y, {
        align: "left",
        width: namesignatureColumnWidth,
      });

    // Right signature with date

    this.doc
      .fillColor("black")
      .text(`..................`, this.doc.page.width - 250, this.doc.y - 12, {
        align: "center",
        width: signatureColumnWidth,
      });

    return this.doc;
  }
}

// Example usage
if (require.main === module) {
  const doc = new PDFGenerator().generateBeritaAcara({
    day: "SELASA",
    date: "10",
  });

  doc.pipe(fs.createWriteStream("berita-acara.pdf"));
  doc.end();
  console.log("PDF generated successfully!");
}

module.exports = PDFGenerator;
