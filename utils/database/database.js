const { Client } = require('pg');

/**
 * Database connection
*/
const dbConfig = {
  user: 'postgres',
  password: '',
  host: 'localhost',
  port: 5432,
  database: "shoes"
};

const dbClient = new Client(dbConfig);

dbClient.connect();

module.exports = dbClient;