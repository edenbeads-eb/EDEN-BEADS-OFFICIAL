/* =========================
   Eden Beads — script.js
   Cart / Wishlist / Coupons / WhatsApp / Toasts
   ========================= */

const CART_KEY = 'eden_cart';
const WISHLIST_KEY = 'eden_wishlist';
const COUPONS_KEY = 'eden_coupons';
const ACTIVE_COUPON_KEY = 'eden_active_coupon';
const WA_NUMBER_KEY = 'eden_whatsapp_number';

/* ==== Product Samples ==== */
const PRODUCTS = Array.from({ length: 30 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  title: `Coffee Charm ${i + 1}`,
  desc: `Handcrafted cozy bead jewelry ☕`,
  price: 400 + i * 25,
  img: `https://via.placeholder.com/420x300?text=Coffee+Charm+${i + 1}`
}));

/* ==== LocalStorage Helpers ==== */
const load = (k) => JSON.parse(localStorage.getItem(k) || '[]');
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* ==== Toast ==== */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

/* ==== CART ==== */
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  let cart = load(CART_KEY);
  const ex = cart.find(x => x.id === id);
  ex ? ex.qty++ : cart.push({ ...p, qty: 1 });
  save(CART_KEY, cart);
  updateCartBadge();
  showToast(`${p.title} added to cart 🤎`);
}

/* ==== WISHLIST ==== */
function addToWishlist(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  let wish = load(WISHLIST_KEY);
  if (wish.find(x => x.id === id)) return showToast('Already in wishlist ☕');
  wish.push(p);
  save(WISHLIST_KEY, wish);
  showToast(`${p.title} added to wishlist 💕`);
}

/* ==== Render Home Products ==== */
function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt="${p.title}"></div>
      <div class="pname">${p.title}</div>
      <div class="desc">${p.desc}</div>
      <div class="price">Rs. ${p.price}</div>
      <div class="card-actions">
        <button class="btn small" onclick="addToCart('${p.id}')">Add to Cart</button>
        <button class="btn ghost small" onclick="addToWishlist('${p.id}')">♡ Wishlist</button>
      </div>`;
    grid.appendChild(card);
  });
}

/* ==== CART PAGE ==== */
function renderCartPage() {
  const box = document.getElementById('cartItemsBox');
  if (!box) return;
  const cart = load(CART_KEY);
  const subEl = document.getElementById('subTotal');
  const totalEl = document.getElementById('totalAmt');

  box.innerHTML = '';

  if (!cart.length) {
    box.innerHTML = `<p class="muted">🛍️ Your cart is empty. Let's grab coffee ☕</p>`;
    subEl.textContent = 'Rs. 0';
    totalEl.textContent = 'Rs. 0';
    return;
  }

  let subtotal = 0;
  cart.forEach((item, i) => {
    subtotal += item.price * item.qty;
    const c = document.createElement('div');
    c.className = 'cart-item-card';
    c.innerHTML = `
      <img src="${item.img}" width="80" height="80">
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>Rs. ${item.price} × ${item.qty}</p>
        <div class="cart-item-controls">
          <button class="btn ghost minus" data-i="${i}">−</button>
          <span>${item.qty}</span>
          <button class="btn ghost plus" data-i="${i}">+</button>
          <button class="btn ghost remove" data-i="${i}">🗑️ Remove</button>
        </div>
      </div>`;
    box.appendChild(c);
  });

  subEl.textContent = `Rs. ${subtotal}`;
  totalEl.textContent = `Rs. ${subtotal}`;

  box.querySelectorAll('.plus').forEach(btn => btn.onclick = e => {
    const i = e.target.dataset.i;
    cart[i].qty++;
    save(CART_KEY, cart);
    renderCartPage();
    updateCartBadge();
  });

  box.querySelectorAll('.minus').forEach(btn => btn.onclick = e => {
    const i = e.target.dataset.i;
    if (cart[i].qty > 1) cart[i].qty--; else cart.splice(i, 1);
    save(CART_KEY, cart);
    renderCartPage();
    updateCartBadge();
  });

  box.querySelectorAll('.remove').forEach(btn => btn.onclick = e => {
    cart.splice(e.target.dataset.i, 1);
    save(CART_KEY, cart);
    renderCartPage();
    updateCartBadge();
  });
}

/* ==== Cart Badge ==== */
function updateCartBadge() {
  const badge = document.getElementById('navCartCount');
  if (!badge) return;
  const cart = load(CART_KEY);
  badge.textContent = cart.reduce((a, b) => a + (b.qty || 1), 0);
}

/* ==== INIT ==== */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCartPage();
  updateCartBadge();
});

function renderWishlistPage(){
  const box = document.getElementById('wishlistContainer');
  if(!box) return;
  const wish = JSON.parse(localStorage.getItem('eden_wishlist') || '[]');
  const emptyMsg = document.getElementById('emptyWishlistMsg');
  box.innerHTML = '';
  if(!wish.length){
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';
  wish.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt="${p.title}"></div>
      <div class="pname">${p.title}</div>
      <div class="desc">${p.desc}</div>
      <div class="price">Rs. ${p.price}</div>
      <div class="card-actions">
        <button class="btn small" onclick="addToCart('${p.id}')">Move to Cart</button>
        <button class="btn ghost small" onclick="removeFromWishlist('${p.id}')">Remove</button>
      </div>`;
    box.appendChild(card);
  });
}

/* ==== Run when page loads ==== */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  // if product grid exists → render shop products
  if (document.getElementById('productGrid')) {
    renderProducts();
  }

  // if wishlist container exists → render wishlist
  if (document.getElementById('wishlistContainer')) {
    renderWishlistPage();
  }

  // if cart page → render cart
  if (document.getElementById('cartItemsBox')) {
    renderCartPage();
  }
});
/* ==== Checkout WhatsApp Logic ==== */
document.addEventListener('DOMContentLoaded', () => {
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  if (!placeOrderBtn) return;

  placeOrderBtn.addEventListener('click', () => {
    const name = document.getElementById('custName')?.value.trim();
    const phone = document.getElementById('custPhone')?.value.trim();
    const address = document.getElementById('custAddress')?.value.trim();
    const payment = document.getElementById('paymentMethod')?.value;
    const orderMsg = document.getElementById('orderMsg');

    const cart = JSON.parse(localStorage.getItem('eden_cart') || '[]');
    if (!cart.length) {
      orderMsg.textContent = '🛍️ Your cart is empty!';
      return;
    }
    if (!name || !phone || !address) {
      orderMsg.textContent = '⚠️ Please fill all required fields.';
      return;
    }

    let subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    // ✅ WhatsApp message
    let msg = `Hi! I placed an order.\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nItems:\n`;
    cart.forEach(it => {
      msg += `- ${it.title} × ${it.qty} — Rs. ${it.price * it.qty}\n`;
    });
    msg += `\nTotal: Rs. ${subtotal}\nPayment Method: ${payment}\n\nNote: DC (Delivery Charges) will be applied later ☕`;

    // ✅ Check WhatsApp number
    const waNum = localStorage.getItem('eden_wa') || '923248037329';
    if (waNum.includes('x')) {
      alert('⚠️ WhatsApp number not set! Please add it in Admin Panel.');
      return;
    }

    // ✅ Open WhatsApp chat
    const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  });
});

