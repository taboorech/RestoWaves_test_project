const { google } = require('googleapis');

/**
 * A function for connecting to Google Sheets
*/
async function getAuthSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const spreadsheetId = "1Qiyuw-F3Me3X_eTlwMfhugAsrJIw68H5CxMaomgp5h0";

  return {
    auth,
    client,
    googleSheets,
    spreadsheetId,
  };
}

module.exports.getAuthSheets = getAuthSheets;