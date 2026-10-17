require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());            // allow the HTML page to call the API from any origin
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend'))); // serve the frontend too

// ---- helpers -------------------------------------------------------------
function validate(body) {
  const errors = [];
  const name = (body.product_name || '').toString().trim();
  const brand = (body.brand || '').toString().trim();
  const category = (body.category || '').toString().trim();
  const price = Number(body.price);
  const stock = Number.parseInt(body.stock_quantity ?? 0, 10);
  const rating = body.rating === undefined || body.rating === '' ? 0 : Number(body.rating);

  if (!name) errors.push('product_name is required');
  if (!brand) errors.push('brand is required');
  if (!category) errors.push('category is required');
  if (!Number.isFinite(price) || price < 0) errors.push('price must be a number >= 0');
  if (!Number.isInteger(stock) || stock < 0) errors.push('stock_quantity must be an integer >= 0');
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) errors.push('rating must be between 0 and 5');

  return {
    errors,
    data: { product_name: name, brand, category, price, stock_quantity: stock, rating, description: (body.description || '').toString().trim() }
  };
}

// ---- routes --------------------------------------------------------------
// GET all
app.get('/api/products', (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY id').all();
  res.json(rows);
});

// GET one
app.get('/api/products/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json(row);
});

// POST create
app.post('/api/products', (req, res) => {
  const { errors, data } = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const info = db.prepare(
    `INSERT INTO products (product_name, brand, category, price, stock_quantity, rating, description)
     VALUES (@product_name, @brand, @category, @price, @stock_quantity, @rating, @description)`
  ).run(data);
  const created = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

// PUT update
app.put('/api/products/:id', (req, res) => {
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  const { errors, data } = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  db.prepare(
    `UPDATE products SET product_name=@product_name, brand=@brand, category=@category, price=@price,
       stock_quantity=@stock_quantity, rating=@rating, description=@description,
       updated_at=CURRENT_TIMESTAMP WHERE id=@id`
  ).run({ ...data, id: req.params.id });
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
});

// DELETE
app.delete('/api/products/:id', (req, res) => {
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted', id: Number(req.params.id) });
});

// Unknown API routes -> JSON 404
app.use('/api', (req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
