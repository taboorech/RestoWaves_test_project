const express = require('express');
const productsRouter = require("./routes/products");
const sheetsRouter = require('./routes/sheets');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * Connecting all routers
*/
app.use('/', productsRouter);
app.use('/sheets', sheetsRouter);

/**
 * A function that is called once an hour to check for size updates
 * 
 * Based on the received metadata, an object is created and all information on models by keys is recorded,
 * after which all dimensions are obtained and, if necessary, changes are made to the database
*/
setInterval(async () => {
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

    await Promise.all(data[sheet.properties.title].values[2].filter((row, index) => index !== 0).map(async (article) => {
      try {
        const result = await dbClient.query(`SELECT * FROM "shoes" WHERE article = $1 AND model = $2`, [article, sheet.properties.title]);
        if (result.rows.length > 0) {
          let elIndex = data[sheet.properties.title].values[2].indexOf(article);
          const size = getSizes(data[sheet.properties.title], elIndex);
          if(result.rows[0].size !== size) {
            try {
              await dbClient.query('UPDATE "shoes" SET size = $3 WHERE article = $1 AND model = $2', [article, sheet.properties.title, size]);
              return true;
            } catch (err) {
              console.error(err);
              res.status(500).json({ message: 'Internal Server Error' });
            }
          }
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }));
  }))

}, 3600000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});