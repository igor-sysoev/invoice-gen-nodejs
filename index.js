const pdfLib = require("pdf-lib");
const fs = require("fs");

const { PDFDocument, StandardFonts, rgb } = pdfLib;

const INVOICE_NO = 938;
const NAME_TO = "Ahmed";
const NAME_FROM = "Yaser";
const ADRESS = "2992 Punavouri, helsinki, Finland";
const INVOICE_DATE = "23/7";
const DUE_DATE = "14 days";

const OUR_REFERENCE = "Freelance Instractor";

const DESCRIPTION = "Online Ocurse - English";

const NO_HOURS = "20";

const PRICE_HOUR = "10";

const VAT_PERCENT = "24";

const VAT_AMOUNT = "81.45";

const TOTAL = "101";

const CONTACT_PHONE = "0465726013";

const CONTACT_EMAIL = "test@gmail.com";

const linePath = "M730,297L0,295";

// INVOICE TO //
const drawInvoiceTo = (
  page,
  { TITLE_TEXT_Y, fontOptions, marginLeft, height, lineHeight }
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
  { TITLE_TEXT_Y, fontOptions, marginLeft, width, lineHeight }
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
  { TITLE_TEXT_Y, fontOptions, marginLeft, width, lineHeight }
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
const createFile = async () => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const form = pdfDoc.getForm();

  const page = pdfDoc.addPage();

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

  drawInvoiceTo(page, options);

  drawRightSideInfo(page, options);

  drawInvoiceInfoHeaders(page, options);

  drawInvoiceInfo(page, options);

  const pdfBytes = await pdfDoc.save();

  fs.writeFile("./test.pdf", pdfBytes, (err) => {
    console.log(err);
  });
};

createFile();
