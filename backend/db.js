const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite'); // built into Node 22.13+ (no native build needed)

const dbPath = path.resolve(__dirname, process.env.DB_PATH || './products.db');
const db = new DatabaseSync(dbPath);

// Create table, then seed 10 sample records only if the table is empty
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
const { n } = db.prepare('SELECT COUNT(*) AS n FROM products').get();
if (n === 0) {
  db.exec(fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8'));
  console.log('Seeded sample products');
}

module.exports = db;
