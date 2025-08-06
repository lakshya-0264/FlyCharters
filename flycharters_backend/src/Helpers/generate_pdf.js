// utils/generateInvoicePDF.js
import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (invoiceData, resStream) => {
  const doc = new PDFDocument({ margin: 40 });

  // Pipe the document to response stream
  doc.pipe(resStream);

  // ========== Header ==========
  doc.fontSize(16).text('Example Company 1', { align: 'left' });
  doc.fontSize(10).text('Phone: +91-978-654-3210');
  doc.text('Email: info1@examplecompany.com');
  doc.text('GST: 27GST00000');
  doc.moveDown();

  doc.fontSize(14).text('QUOTE / CHARTER INVOICE', { align: 'center' });
  doc.moveDown();

  // ========== Quote Info ==========
  doc.fontSize(10)
    .text(`Date: ${invoiceData.date}`)
    .text(`Quote ID: ${invoiceData.quoteId}`)
    .text(`Customer: ${invoiceData.customer}`)
    .text(`Contact: ${invoiceData.contact}`)
    .moveDown();

  // ========== Aircraft Info ==========
  doc.text(`Aircraft: ${invoiceData.aircraft}`);
  doc.text(`Base: ${invoiceData.base}`);
  doc.text(`Cost per Hour: ₹${invoiceData.costPerHour.toFixed(2)}`);
  doc.moveDown();

  doc.text(`Date of Travel: ${invoiceData.travelDate}`);
  doc.text(`Passengers: ${invoiceData.passengers}`);
  doc.text(`Block Time: ${invoiceData.blockTime} hrs`);
  doc.moveDown();

  // ========== Table Header ==========
  doc.font('Helvetica-Bold');
  doc.text('Item Description', 50, doc.y);
  doc.text('Block Time', 250, doc.y);
  doc.text('Rate', 350, doc.y);
  doc.text('Total', 450, doc.y);
  doc.moveDown();
  doc.font('Helvetica');

  // ========== Table Rows ==========
  invoiceData.items.forEach((item) => {
    doc.text(item.description, 50, doc.y);
    doc.text(item.blockTime, 250, doc.y);
    doc.text(`₹${item.rate}`, 350, doc.y);
    doc.text(`₹${item.total}`, 450, doc.y);
    doc.moveDown();
  });

  // ========== Totals ==========
  doc.moveDown();
  doc.font('Helvetica-Bold');
  doc.text(`Grand Total: ₹${invoiceData.grandTotal}`, { align: 'right' });
  doc.text(`Grand Total with GST (18%): ₹${invoiceData.grandTotalWithGST}`, { align: 'right' });
  doc.font('Helvetica');
  doc.moveDown();

  // ========== Bank Details ==========
  doc.text('Bank Details:', { underline: true });
  doc.text('Account Name: EXAMPLE');
  doc.text('Account Number: 00000000');
  doc.text('Branch: NIRALA BAZAR');
  doc.text('IFSC Code: KKBK0000000');
  doc.moveDown();

  // ========== Terms ==========
  doc.text('Terms & Conditions', { underline: true });
  doc.text('This quote is valid for 30 days from the issue date.');
  doc.text('Full payment is required before departure.');
  doc.text('Cancellation charges may apply as per company policy.');
  doc.text('Aircraft availability is subject to change without notice.');
  doc.moveDown();

  // ========== Signature ==========
  doc.text('Authorized Signature');
  doc.text('__________________________');
  doc.moveDown();

  doc.text('Thank you for choosing our services!', { align: 'center' });

  doc.end(); // finalize
};
