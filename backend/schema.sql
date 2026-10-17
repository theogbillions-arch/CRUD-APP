CREATE TABLE IF NOT EXISTS products (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name   VARCHAR(150) NOT NULL,
  brand          VARCHAR(80)  NOT NULL,
  category       VARCHAR(60)  NOT NULL,
  price          DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  rating         DECIMAL(2,1) DEFAULT 0,
  description    TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
