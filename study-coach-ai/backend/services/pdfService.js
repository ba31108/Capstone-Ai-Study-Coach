'use strict';

const pdfParse = require('pdf-parse');

const extractTextFromBuffer = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text || '';
};

module.exports = { extractTextFromBuffer };
