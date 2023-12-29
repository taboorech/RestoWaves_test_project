const { Router } = require("express");
const router = Router();
const dbClient = require("../utils/database/database");

/**
 * Receiving all products
*/
router.get('/products', async (req, res) => {
  try {
    const result = await dbClient.query('SELECT * FROM shoes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * Receipt of products for id
*/
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbClient.query('SELECT * FROM shoes WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * Updating the name for the product ID
*/
router.patch('/products/:id/update/:newName', async (req, res) => {
  const { id, newName } = req.params;
  try {
    const result = await dbClient.query('UPDATE shoes SET name = $2 WHERE id = $1', [id, newName]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * Receiving the product according to its size
*/
router.get('/products/size/:size', async (req, res) => {
  const { size } = req.params;
  try {
    const result = await dbClient.query(`SELECT * FROM "shoes" WHERE "size" LIKE '%${size}%'`);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;