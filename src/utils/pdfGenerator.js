const PDFDocument = require("pdfkit");

class PDFGenerator {
  constructor(margin = 50) {
    this.doc = new PDFDocument({ margin });
  }

  /**
   * Draw a cell in the table with border
   */
  drawCell(text, x, y, width, height, align = "left") {
    this.doc.rect(x, y, width, height).stroke();
    this.doc.text(text, x + 5, y + 10, {
      width: width - 10,
      align,
    });
  }

  /**
   * Draw table header
   */
  drawTableHeader(startX, y, colWidths, rowHeight) {
    this.drawCell("No.", startX, y, colWidths[0], rowHeight, "center");
    this.drawCell(
      "Nama Barang",
      startX + colWidths[0],
      y,
      colWidths[1],
      rowHeight
    );
    this.drawCell(
      "Kategori",
      startX + colWidths[0] + colWidths[1],
      y,
      colWidths[2],
      rowHeight
    );
    this.drawCell(
      "Jumlah",
      startX + colWidths[0] + colWidths[1] + colWidths[2],
      y,
      colWidths[3],
      rowHeight,
      "center"
    );
    this.drawCell(
      "Satuan",
      startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
      y,
      colWidths[4],
      rowHeight,
      "center"
    );
  }

  /**
   * Generate Berita Acara PDF
   */
  generateBeritaAcara(transaction) {
    // Header
    this.doc
      .fontSize(20)
      .text("BERITA ACARA KELUAR BARANG", { align: "center" });
    this.doc.moveDown();

    // Transaction details
    this.doc.fontSize(12);
    this.doc.text(`Nomor Referensi: ${transaction.reference}`);
    this.doc.text(
      `Tanggal: ${transaction.createdAt.toLocaleDateString("id-ID")}`
    );
    this.doc.text(`Petugas: ${transaction.createdBy}`);
    if (transaction.notes) {
      this.doc.text(`Keterangan: ${transaction.notes}`);
    }
    this.doc.moveDown();

    // Table configuration
    const startX = 50;
    const rowHeight = 30;
    const colWidths = [40, 190, 110, 70, 70];
    let y = this.doc.y;

    // Draw initial table header
    this.drawTableHeader(startX, y, colWidths, rowHeight);

    // Items
    y += rowHeight;
    transaction.items.forEach((item, index) => {
      if (y > 700) {
        this.doc.addPage();
        y = 50;
        this.drawTableHeader(startX, y, colWidths, rowHeight);
        y += rowHeight;
      }

      // Draw item row
      this.drawCell(
        String(index + 1),
        startX,
        y,
        colWidths[0],
        rowHeight,
        "center"
      );
      this.drawCell(
        item.item.name,
        startX + colWidths[0],
        y,
        colWidths[1],
        rowHeight
      );
      this.drawCell(
        item.item.category,
        startX + colWidths[0] + colWidths[1],
        y,
        colWidths[2],
        rowHeight
      );
      this.drawCell(
        String(item.quantity),
        startX + colWidths[0] + colWidths[1] + colWidths[2],
        y,
        colWidths[3],
        rowHeight,
        "center"
      );
      this.drawCell(
        item.item.unit || "-",
        startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
        y,
        colWidths[4],
        rowHeight,
        "center"
      );

      y += rowHeight;
    });

    y += 20; // Add space after table

    // Signatures
    const signatureY = y + 50;

    // Left signature (Petugas)
    this.doc.text("Petugas Gudang", 50, signatureY, { align: "center" });
    this.doc.text("", 50, signatureY + 60, { align: "center" }); // Space for signature
    this.doc.text(transaction.createdBy, 50, signatureY + 80, {
      align: "center",
    });

    // Right signature (Penerima)
    this.doc.text("Penerima", 400, signatureY, { align: "center" });
    this.doc.text("", 400, signatureY + 60, { align: "center" }); // Space for signature
    this.doc.text("(____________________)", 400, signatureY + 80, {
      align: "center",
    });

    return this.doc;
  }
}

module.exports = PDFGenerator;
