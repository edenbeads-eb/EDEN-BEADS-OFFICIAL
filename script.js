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
const PRODUCTS = Array.from({length: 30}).map((_, i) => ({
  id: `prod-${i+1}`,
  title: `Coffee Charm ${i+1}`,
  desc: `Handcrafted cozy bead jewelry ☕`,
  price: 400 + i * 25,
  img: `https://via.placeholder.com/420x300?text=Coffee+Charm+${i+1}`
}));

/* ==== Utility Load/Save ==== */
const load = key => JSON.parse(localStorage.getItem(key) || '[]');
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

/* ==== Toast ==== */
function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2500);
}

/* ==== Cart ==== */
function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  let cart = load(CART_KEY);
  const ex = cart.find(x=>x.id===id);
  ex ? ex.qty++ : cart.push({...p, qty:1});
  save(CART_KEY, cart);
  updateCartBadge();
  showToast(`${p.title} added to cart 🤎`);
}

/* ==== Wishlist ==== */
function addToWishlist(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  let wish = load(WISHLIST_KEY);
  if(wish.find(x=>x.id===id)) {
    showToast('Already in wishlist ☕');
    return;
  }
  wish.push(p);
  save(WISHLIST_KEY, wish);
  showToast(`${p.title} added to wishlist 💕`);
}

function removeFromWishlist(id){
  let wish = load(WISHLIST_KEY).filter(x=>x.id!==id);
  save(WISHLIST_KEY, wish);
  renderWishlistPage();
  showToast('Removed from wishlist 🤎');
}

/* ==== Render Products on Home ==== */
function renderProducts(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = '';
  PRODUCTS.forEach(p=>{
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

/* ==== Wishlist Page ==== */
function renderWishlistPage(){
  const box = document.getElementById('wishlistContainer');
  if(!box) return;
  const wish = load(WISHLIST_KEY);
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

// ===== CART PAGE LOGIC =====
function loadCart() {
  return JSON.parse(localStorage.getItem('eden_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('eden_cart', JSON.stringify(cart));
}

function renderCartPage() {
  const cartItemsBox = document.getElementById('cartItemsBox');
  if (!cartItemsBox) return; // only run on cart page

  const cart = loadCart();
  const subTotalEl = document.getElementById('subTotal');
  const discountEl = document.getElementById('discountAmt');
  const totalEl = document.getElementById('totalAmt');
  const orderMsg = document.getElementById('orderMsg');

  cartItemsBox.innerHTML = '';

  if (cart.length === 0) {
    cartItemsBox.innerHTML = `<p class="muted">🛍️ Your cart is empty. Let's grab a coffee and shop something cute! ☕</p>`;
    subTotalEl.textContent = 'Rs. 0';
    discountEl.textContent = 'Rs. 0';
    totalEl.textContent = 'Rs. 0';
    return;
  }

  let subtotal = 0;
  cart.forEach((item, index) => {
    subtotal += item.price * item.qty;

    const card = document.createElement('div');
    card.className = 'cart-item-card';
    card.innerHTML = `
      <img src="${item.img || 'https://via.placeholder.com/80x80?text=EB'}" alt="${item.title}">
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>Rs. ${item.price} × ${item.qty}</p>
        <div class="cart-item-controls">
          <button class="btn ghost minus" data-idx="${index}">−</button>
          <span>${item.qty}</span>
          <button class="btn ghost plus" data-idx="${index}">+</button>
          <button class="btn ghost remove" data-idx="${index}">🗑️ Remove</button>
        </div>
      </div>
    `;
    cartItemsBox.appendChild(card);
  });

  subTotalEl.textContent = `Rs. ${subtotal}`;
  discountEl.textContent = 'Rs. 0';
  totalEl.textContent = `Rs. ${subtotal}`;

  // quantity and remove handlers
  cartItemsBox.querySelectorAll('.plus').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.dataset.idx;
      cart[idx].qty++;
      saveCart(cart);
      renderCartPage();
    });
  });
  cartItemsBox.querySelectorAll('.minus').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.dataset.idx;
      if (cart[idx].qty > 1) cart[idx].qty--;
      else cart.splice(idx, 1);
      saveCart(cart);
      renderCartPage();
    });
  });
  cartItemsBox.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.dataset.idx;
      cart.splice(idx, 1);
      saveCart(cart);
      renderCartPage();
    });
  });

  document.getElementById('clearCartBtn')?.addEventListener('click', () => {
    localStorage.removeItem('eden_cart');
    renderCartPage();
  });

  // Checkout WhatsApp
  document.getElementById('placeOrderBtn')?.addEventListener('click', () => {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!name || !phone || !address) {
      orderMsg.textContent = '⚠️ Please fill all fields before checkout.';
      return;
    }

    let msg = `Hi! I placed an order.\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nItems:\n`;
    cart.forEach(item => {
      msg += `- ${item.title} × ${item.qty} — Rs. ${item.price * item.qty}\n`;
    });
    msg += `\nTotal: Rs. ${subtotal}\n\nPayment method: ${document.getElementById('paymentMethod').value}\n\nNote: DC charges will be applied later ☕`;

    const waNum = localStorage.getItem('eden_wa') || '92300xxxxxxx';
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

document.addEventListener('DOMContentLoaded', renderCartPage);
