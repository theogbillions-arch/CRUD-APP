<<<<<<< HEAD
# Tech Product Showcase - Single-Table CRUD (Node.js + Express + SQLite)
Uses Node's built-in SQLite (`node:sqlite`), so no C++ build tools are needed. Requires Node 22.13+.

## Run locally (PowerShell)
```
cd backend
npm install
npm start
```
Open http://localhost:3000 (Express serves the frontend and the API).
The `products` table is created and seeded with 10 records on first start.

## API  (resource: products)
| Method | URL                  | Purpose        |
|--------|----------------------|----------------|
| GET    | /api/products        | List all       |
| GET    | /api/products/:id    | Get one        |
| POST   | /api/products        | Create         |
| PUT    | /api/products/:id    | Update         |
| DELETE | /api/products/:id    | Delete         |

POST / PUT body:
```json
{ "product_name": "Pixel 9", "brand": "Google", "category": "Smartphone",
  "price": 799, "stock_quantity": 10, "rating": 4.5, "description": "..." }
```

## Postman video checklist
1. GET /api/products  -> 200, array of 10+
2. GET /api/products/1 -> 200, one object
3. POST /api/products (Body > raw > JSON) -> 201, new record with id
4. PUT /api/products/<new id> (change price/name) -> 200, updated_at changes
5. DELETE /api/products/<new id> -> 200 {"message":"Product deleted"}
Show URL, method, body and JSON response for each. Repeat with your deployed URL.

## Deploy on Render (Web Service)
- Push this folder to GitHub.
- Root Directory: `backend` | Build: `npm install` | Start: `npm start`
- Env vars: `DB_PATH=./products.db` and `NODE_VERSION=22.22.0` (PORT is set by Render)
- Free-tier disk is ephemeral: the DB re-seeds itself on restart, so edits reset. Fine for this activity.
- Links to submit: https://<your-app>.onrender.com/api/products (and /api/products/:id for GET/PUT/DELETE)

## Postman
Import `postman/Products_CRUD.postman_collection.json`. Run requests 1 to 5 in order
(the POST request saves the new id automatically). To test the cloud version, change the
collection variable `baseUrl` to your Render URL (no trailing slash).

## Video script (about 2 minutes)
1. Say your name and theme (Tech Product Showcase).
2. Run requests 1 to 5 in order. For each, point at the URL, method, body and JSON response.
3. Open the live site, add, edit and delete a product to show the frontend.
=======
# CRUD-APP
This is a simple CRUD APP using node.js
>>>>>>> e31b45f8399b6f3b6382cc9ca0ea014f29a1a29a
