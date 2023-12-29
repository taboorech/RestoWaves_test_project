const { Router } = require("express");
const router = Router();
const { getAuthSheets } = require("../utils/getAuthSheets/getAuthSheets");
const { getSizes } = require('../utils/getSizes/getSizes');
const dbClient = require("../utils/database/database");

/**
 * Getting all the data from google spreadsheet
 * 
 * Based on the received metadata, an object is created and all information is recorded by models by keys,
 * after which all data is obtained by sorting through the arrays and added to the database
*/
router.get("/getRows", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const metadata = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  const data = {};

  await Promise.all(metadata.data.sheets.map(async (sheet) => {
    data[sheet.properties.title] = (await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheet.properties.title}!A4:D18`,
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
    })).data;

    await Promise.all(data[sheet.properties.title].values[0].filter((row, index) => index !== 0).map(async (name) => {
      let elIndex = data[sheet.properties.title].values[0].indexOf(name);
      const price = data[sheet.properties.title].values[1][elIndex];
      const article = data[sheet.properties.title].values[2][elIndex];
      const size = getSizes(data[sheet.properties.title], elIndex)
      try {
        await dbClient.query(`INSERT INTO "shoes" ("model", "article", "price", "size", "name") VALUES ($1, $2, $3, $4, $5)`, [sheet.properties.title, article, price, size, name]);
        return true;
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }));
  }))

  res.send(data);
});

module.exports = router;