// If the page is opened straight from disk (file://), talk to the local API.
// When served by Express (local or cloud) use same-origin relative URLs.
const API_BASE = location.protocol === 'file:' ? 'http://localhost:3000' : '';
const API = `${API_BASE}/api/products`;

const $ = (id) => document.getElementById(id);
const fields = ['product_name', 'brand', 'category', 'price', 'stock_quantity', 'rating', 'description'];

function show(msg, type = 'ok') {
  const el = $('message');
  el.textContent = msg;
  el.className = type;
  setTimeout(() => (el.className = ''), 3500);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function request(url, options = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data.errors && data.errors.join(', ')) || data.error || 'Request failed');
  return data;
}

async function loadProducts() {
  try {
    const products = await request(API);
    $('count').textContent = products.length;
    $('rows').innerHTML = products.map((p) => `
      <tr>
        <td>${p.id}</td>
        <td>${escapeHtml(p.product_name)}</td>
        <td>${escapeHtml(p.brand)}</td>
        <td>${escapeHtml(p.category)}</td>
        <td>$${Number(p.price).toFixed(2)}</td>
        <td>${p.stock_quantity}</td>
        <td>${p.rating}</td>
        <td>${escapeHtml(p.description)}</td>
        <td>${escapeHtml(p.updated_at)}</td>
        <td class="row-actions">
          <button class="edit" onclick="startEdit(${p.id})">Edit</button>
          <button class="del" onclick="removeProduct(${p.id})">Delete</button>
        </td>
      </tr>`).join('');
  } catch (e) {
    show('Could not load products: ' + e.message, 'err');
  }
}

function resetForm() {
  $('product-form').reset();
  $('id').value = '';
  $('form-title').textContent = 'Add a new product';
  $('save-btn').textContent = 'Add product';
  $('cancel-btn').hidden = true;
}

async function startEdit(id) {
  try {
    const p = await request(`${API}/${id}`);            // GET one
    $('id').value = p.id;
    fields.forEach((f) => ($(f).value = p[f] ?? ''));
    $('form-title').textContent = `Edit product #${p.id}`;
    $('save-btn').textContent = 'Save changes';
    $('cancel-btn').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    show(e.message, 'err');
  }
}

async function removeProduct(id) {
  if (!confirm(`Delete product #${id}?`)) return;
  try {
    await request(`${API}/${id}`, { method: 'DELETE' });
    show('Product deleted');
    if ($('id').value === String(id)) resetForm();
    loadProducts();
  } catch (e) {
    show(e.message, 'err');
  }
}

$('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = Object.fromEntries(fields.map((f) => [f, $(f).value]));
  const id = $('id').value;
  try {
    if (id) {
      await request(`${API}/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      show('Product updated');
    } else {
      await request(API, { method: 'POST', body: JSON.stringify(body) });
      show('Product created');
    }
    resetForm();
    loadProducts();
  } catch (err) {
    show(err.message, 'err');
  }
});

$('cancel-btn').addEventListener('click', resetForm);
loadProducts();
