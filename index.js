const pdfLib = require("pdf-lib");
const fs = require("fs");

const { PDFDocument, StandardFonts, rgb } = pdfLib;

var XLSX = require("xlsx");

// INVOICE TO //
const drawInvoiceTo = (
  page,
  { TITLE_TEXT_Y, fontOptions, marginLeft, height, lineHeight },
  NAME_TO,
  NAME_FROM,
  ADRESS
) => {
  // INVOICE TO

  const INVOICE_TO_Y = TITLE_TEXT_Y - 25;
  const INVOICE_TO_TEXT = "Invoice to: ";
  page.drawText(INVOICE_TO_TEXT, {
    x: marginLeft,
    y: INVOICE_TO_Y,
    ...fontOptions,
  });

  // Invoice To: NAME

  const INVOICE_TO_NAME_Y = INVOICE_TO_Y - lineHeight;
  const INVOICE_TO_NAME_TEXT = NAME_TO + " " + NAME_FROM;

  page.drawText(INVOICE_TO_NAME_TEXT, {
    x: marginLeft,
    y: INVOICE_TO_NAME_Y,
    ...fontOptions,
  });

  // Invoice To: Adress

  const INVOICE_TO_ADRESS_Y = INVOICE_TO_NAME_Y - lineHeight;

  page.drawText(ADRESS, {
    x: marginLeft,
    y: INVOICE_TO_ADRESS_Y,
    ...fontOptions,
  });
};

// HEADER
const drawHeader = (
  page,
  { TITLE_TEXT_Y, fontOptions, marginLeft, width, lineHeight }
) => {
  page.drawText("Ahmed Ezzat", {
    x: marginLeft,
    y: TITLE_TEXT_Y,
    ...fontOptions,
  });

  page.drawText("Lasku / Invoice", {
    x: width - 250,
    y: TITLE_TEXT_Y,
    ...fontOptions,
  });

  // Line Below Title Text

  const TITLE_LINE_Y = TITLE_TEXT_Y - 10;
  page.drawLine({
    start: { x: 0, y: TITLE_LINE_Y },
    end: { x: width, y: TITLE_LINE_Y },
    thickness: 2,
    color: rgb(0, 0, 0),
    opacity: 1,
  });
};

const drawRightSideInfo = (
  page,
  { TITLE_TEXT_Y, fontOptions, marginLeft, width, lineHeight },
  INVOICE_DATE,
  DUE_DATE,
  OUR_REFERENCE
) => {
  const y = TITLE_TEXT_Y - 25;
  const x = width - 250;

  page.drawText("Invoice date: " + INVOICE_DATE, { x, y, ...fontOptions });

  const y2 = y - lineHeight;

  page.drawText("Invoice no: " + "INVOICE NUMBER", {
    x,
    y: y2,
    ...fontOptions,
  });

  const y3 = y2 - lineHeight;

  page.drawText("Reference no: " + "REFERENCE NUMBER MISSING", {
    x,
    y: y3,
    ...fontOptions,
  });

  const y4 = y3 - lineHeight;

  page.drawText("Payment terms: " + DUE_DATE, { x, y: y4, ...fontOptions });

  const y5 = y4 - lineHeight;

  page.drawText("Our reference: " + OUR_REFERENCE, {
    x,
    y: y5,
    ...fontOptions,
  });
};

const drawInvoiceInfoHeaders = (
  page,
  { TITLE_TEXT_Y, fontOptions, marginLeft, width, lineHeight }
) => {
  const y = TITLE_TEXT_Y - 150;
  const x = marginLeft;

  page.drawText("Description", {
    x,
    y,
    ...fontOptions,
  });

  page.drawText("No Of Hours", {
    x: x + 150,
    y,
    ...fontOptions,
  });

  page.drawText(`Price € /hour`, { x: x + 220, y, ...fontOptions });

  page.drawText(`Taxfree`, { x: x + 280, y, ...fontOptions });
  page.drawText(`VAT-%`, { x: x + 340, y, ...fontOptions });
  page.drawText(`Total`, { x: x + 400, y, ...fontOptions });

  page.drawLine({
    start: { x: marginLeft, y: y - 10 },
    end: { x: x + 450, y: y - 10 },
    thickness: 2,
    color: rgb(0, 0, 0),
    opacity: 1,
  });
};

// Invoice INFO

const drawInvoiceInfo = (
  page,
  { TITLE_TEXT_Y, fontOptions, marginLeft, width, lineHeight },
  DESCRIPTION,
  NO_HOURS,
  PRICE_HOUR,
  VAT_PERCENT,
  TOTAL
) => {
  const y = TITLE_TEXT_Y - 180;
  const x = marginLeft;

  page.drawText(DESCRIPTION, { x, y, ...fontOptions });
  page.drawText(NO_HOURS, { x: x + 150, y, ...fontOptions });
  page.drawText(PRICE_HOUR, { x: x + 220, y, ...fontOptions });

  page.drawText(`Taxfree`, { x: x + 280, y, ...fontOptions });
  page.drawText(VAT_PERCENT, { x: x + 340, y, ...fontOptions });
  page.drawText(TOTAL, { x: x + 400, y, ...fontOptions });
};

// CREATE FILE !!
const createFile = async (arr) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const form = pdfDoc.getForm();

  const page = pdfDoc.addPage();

  console.log(arr);
  const [
    INVOICE_NO,
    NAME_TO,
    NAME_FROM,
    ADRESS,
    INVOICE_DATE,
    DUE_DATE,
    OUR_REFERENCE,
    DESCRIPTION,
    PERIOD,
    NO_HOURS,
    PRICE_HOUR,
    VAT_PERCENT,
    VAT_AMOUNT,
    TOTAL,
    CONTACT_PHONE,
    CONTACT_EMAIL,
    NOTES,
    PAYMENT,
  ] = arr;

  const { width, height } = page.getSize();

  const marginLeft = 50;
  const fontSize = 10;
  const lineHeight = 15;

  const fontOptions = {
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  };

  const TITLE_TEXT_Y = height - 4 * fontSize;

  const options = {
    marginLeft,
    fontSize,
    lineHeight,
    fontOptions,
    TITLE_TEXT_Y,
    width,
    height,
  };

  drawHeader(page, options);

  drawInvoiceTo(page, options, NAME_TO, NAME_FROM, ADRESS);

  drawRightSideInfo(page, options, INVOICE_DATE, OUR_REFERENCE);

  drawInvoiceInfoHeaders(page, options);

  drawInvoiceInfo(
    page,
    options,
    DESCRIPTION,
    NO_HOURS,
    PRICE_HOUR,
    VAT_PERCENT,
    TOTAL
  );

  const pdfBytes = await pdfDoc.save();

  fs.writeFile("./result/invoice_" + Date.now() + ".pdf", pdfBytes, (err) => {
    console.log(err);
  });
};

const file = XLSX.readFile("invoices.xlsx");

file.SheetNames.forEach((sheetName) => {
  const XL_row_object = XLSX.utils.sheet_to_row_object_array(
    file.Sheets[sheetName]
  );

  XL_row_object.forEach((obj, i) => {
    if (i !== 0) {
      const arr = [];
      for (const key in obj) {
        let val = obj[key];

        if (typeof val === "number") val = val.toString();
        console.log(val);
        arr.push(val);
      }
      createFile(arr);
    }
  });
});
