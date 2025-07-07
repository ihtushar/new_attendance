// Minimal Google Sheets integration using the googleapis package.
// Requires a service account JSON key file path in GOOGLE_KEY and the
// spreadsheet ID in SHEET_ID environment variables.
const { google } = require('googleapis');

async function getSheetsClient() {
  const keyPath = process.env.GOOGLE_KEY;
  if (!keyPath) throw new Error('GOOGLE_KEY not set');
  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function addAttendanceRow(email, status) {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.SHEET_ID;
  const values = [[new Date().toISOString(), email, status]];
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}

module.exports = { addAttendanceRow };
