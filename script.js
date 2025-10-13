/* =========================
   Eden Beads — script.js
   Cart / Products / Coupons / WhatsApp
   ========================= */

/* STORAGE KEYS */
const CART_KEY = 'eden_cart';
const COUPONS_KEY = 'eden_coupons'; // expects object {CODE: {type:'percent', value:10}}
const ACTIVE_COUPON_KEY = 'eden_active_coupon';
const WA_NUMBER_KEY = 'eden_whatsapp_number';

/* SAMPLE CATEGORIES & auto-generate 15 placeholders per category */
const CATEGORIES = [
  { id: 'bracelets', title: 'Bracelets 🤎' },
  { id: 'pendants', title: 'Pendants & Lockets 🕊️' },
  { id: 'keychains', title: 'Keychains 🍂' },
  { id: 'accessories', title: 'Accessories ☕🦋' }
];

/* create 15 sample products per category */
const PRODUCTS = [];
CATEGORIES.forEach(cat => {
  for (let i = 1; i <= 15; i++) {
    PRODUCTS.push({
      id: `${cat.id}-${i}`,
      title: `${cat.title.split(' ')[0]} ${i}`,
      desc: `Handmade ${cat.title.split(' ')[0]} — cozy & cute ☕`,
      price: 500 + (i * 25), // sample prices: 525,550,...
      category: cat.id,
      img: `https://via.placeholder.com/420x300?text=${encodeURIComponent(cat.title.split(' ')[0] + '+' + i)}`
    });
  }
});

/* util: load/save cart */
function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){ return []; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

/* coupons: load (fallback defaults) */
function loadCoupons(){
  try{
    const raw = localStorage.getItem(COUPONS_KEY);
    if(!raw){
      const defaults = { 'COFFEE10': {type:'percent', value:10}, 'EDEN20': {type:'percent', value:20} };
      localStorage.setItem(COUPONS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  }catch(e){
    return {};
  }
}

/* render categories and 15 product cards each (on index) */
function renderShopIndex(){
  const container = document.getElementById('categoriesContainer');
  if(!container) return;
  container.innerHTML = '';
  CATEGORIES.forEach(cat=>{
    const section = document.createElement('section');
    section.className = 'category';
    section.innerHTML = `<h3>${cat.title}</h3><div class="card-grid" id="grid-${cat.id}"></div>`;
    container.appendChild(section);

    const grid = section.querySelector(`#grid-${cat.id}`);
    const items = PRODUCTS.filter(p=>p.category === cat.id);
    items.forEach(p=>{
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="thumb"><img src="${p.img}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;border-radius:8px" /></div>
        <div class="pname">${p.title}</div>
        <div class="desc">${p.desc}</div>
        <div class="price">Rs. ${p.price}</div>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      `;
      grid.appendChild(card);
    });
  });
}

/* search products by name/desc (simple) */
function setupSearch(){
  const input = document.getElementById('searchInput');
  if(!input) return;
  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    CATEGORIES.forEach(cat=>{
      const grid = document.getElementById(`grid-${cat.id}`);
      if(!grid) return;
      Array.from(grid.children).forEach(card=>{
        const title = card.querySelector('.pname').innerText.toLowerCase();
        const desc = card.querySelector('.desc').innerText.toLowerCase();
        const visible = !q || title.includes(q) || desc.includes(q);
        card.style.display = visible ? '' : 'none';
      });
    });
  });
}

/* add product to cart (by product id) */
function addToCart(productId){
  const product = PRODUCTS.find(p=>p.id===productId);
  if(!product) return alert('Product not found');
  const cart = loadCart();
  const existing = cart.find(i=>i.id === productId);
  if(existing){ existing.qty += 1; }
  else{ cart.push({ id: product.id, title: product.title, price: product.price, qty: 1 }); }
  saveCart(cart);
  updateCartBadge();
  alert(`${product.title} added to cart ✓`);
}

/* update small cart badge (nav) — optional: we'll update document title with count too */
function updateCartBadge(){
  const cart = loadCart();
  const count = cart.reduce((s,i)=>s + (i.qty||0), 0);
  // set title
  if(count > 0) document.title = `(${count}) Eden Beads Jewelry Studio`;
  else document.title = `Eden Beads Jewelry Studio`;
}

/* Coupon apply on index page */
function applyCouponFromIndex(){
  const codeInput = document.getElementById('couponInput');
  if(!codeInput) return;
  const code = (codeInput.value||'').trim().toUpperCase();
  if(!code){ showCouponMessage('Please enter a coupon code.'); return; }
  const coupons = loadCoupons();
  if(coupons[code]){
    localStorage.setItem(ACTIVE_COUPON_KEY, code);
    const c = coupons[code];
    showCouponMessage(`Yay! Your coupon code applied successfully 🤎 Discount: ${c.type==='percent'? c.value + '%':'' + 'Rs ' + c.value}`);
    // update cart totals if on cart page
    renderCartPage();
  } else {
    showCouponMessage('Invalid coupon code.');
  }
}
function showCouponMessage(msg){
  const el = document.getElementById('couponMessage');
  if(el){ el.innerText = msg; setTimeout(()=>{ if(el) el.innerText=''; }, 4000); }
}

/* Cart page rendering */
function calcTotals(cart, activeCouponCode){
  // careful arithmetic: compute integers
  let subtotal = 0;
  for (let i=0;i<cart.length;i++){
    const it = cart[i];
    subtotal += Number(it.price) * Number(it.qty);
  }
  let discount = 0;
  const coupons = loadCoupons();
  if(activeCouponCode && coupons[activeCouponCode]){
    const c = coupons[activeCouponCode];
    if(c.type === 'percent'){
      discount = Math.round(subtotal * (Number(c.value) / 100));
    } else if(c.type === 'amount'){
      discount = Number(c.value);
    }
  }
  const total = Math.max(0, subtotal - discount);
  return { subtotal, discount, total };
}

function renderCartPage(){
  const box = document.getElementById('cartItemsBox');
  if(!box) return;
  const cart = loadCart();
  box.innerHTML = '';
  if(cart.length === 0){
    box.innerHTML = `<p class="muted">Your cart is empty.</p><p><a class="btn" href="index.html">Continue Shopping</a></p>`;
    updateSummaryUI(0,0,0);
    return;
  }
  cart.forEach((it, idx)=>{
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:700">${it.title}</div>
        <div class="muted">Rs. ${it.price} × ${it.qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <div style="font-weight:800">Rs. ${it.price * it.qty}</div>
        <div style="display:flex;gap:6px">
          <button class="btn ghost" onclick="changeQty('${it.id}', -1)">-</button>
          <div style="padding:6px 10px;border-radius:8px;background:var(--bg);min-width:36px;text-align:center">${it.qty}</div>
          <button class="btn" onclick="changeQty('${it.id}', 1)">+</button>
          <button class="btn ghost" onclick="removeItem('${it.id}')">❌</button>
        </div>
      </div>
    `;
    box.appendChild(row);
  });
  const activeCoupon = localStorage.getItem(ACTIVE_COUPON_KEY) || null;
  const totals = calcTotals(cart, activeCoupon);
  updateSummaryUI(totals.subtotal, totals.discount, totals.total);
}

function updateSummaryUI(sub, disc, total){
  const s = document.getElementById('subTotal'); if(s) s.innerText = `Rs. ${sub}`;
  const d = document.getElementById('discountAmt'); if(d) d.innerText = `Rs. ${disc}`;
  const t = document.getElementById('tot
/* =========================
   Initialize Home Page
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  renderShopIndex();   // renders all categories & products
  setupSearch();       // activates search bar
  updateCartBadge();   // updates cart count in title
});

