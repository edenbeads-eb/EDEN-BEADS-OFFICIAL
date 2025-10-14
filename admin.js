// Admin JS — Eden Beads ☕

// ===== Default password =====
const ADMIN_PASSWORD = "coffeequeen"; // you can change this anytime

// ===== DOM Elements =====
const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const loginBtn = document.getElementById("loginBtn");
const adminPass = document.getElementById("adminPass");
const loginMsg = document.getElementById("loginMsg");

const couponCode = document.getElementById("couponCode");
const couponValue = document.getElementById("couponValue");
const addCouponBtn = document.getElementById("addCouponBtn");
const couponList = document.getElementById("couponList");

const whatsappNum = document.getElementById("whatsappNum");
const businessName = document.getElementById("businessName");
const saveWaBtn = document.getElementById("saveWaBtn");
const showDataBtn = document.getElementById("showDataBtn");
const waMsg = document.getElementById("waMsg");

const viewCartStorage = document.getElementById("viewCartStorage");
const clearCartStorage = document.getElementById("clearCartStorage");
const viewWishlist = document.getElementById("viewWishlist");
const clearWishlist = document.getElementById("clearWishlist");
const adminOutput = document.getElementById("adminOutput");
const logoutBtn = document.getElementById("logoutBtn");

// ===== Admin Login =====
loginBtn.addEventListener("click", () => {
  if (adminPass.value === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    loginBox.style.display = "none";
    adminPanel.style.display = "block";
    renderCoupons();
    loadSettings();
  } else {
    loginMsg.textContent = "❌ Incorrect password! Try again.";
  }
});

// Auto login check
if (localStorage.getItem("isAdmin") === "true") {
  loginBox.style.display = "none";
  adminPanel.style.display = "block";
  renderCoupons();
  loadSettings();
}

// ===== Logout =====
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("isAdmin");
  location.reload();
});

// ===== Coupon System =====
addCouponBtn.addEventListener("click", () => {
  const code = couponCode.value.trim();
  const value = parseFloat(couponValue.value);

  if (!code || isNaN(value)) {
    alert("⚠️ Please enter a valid coupon code and discount value!");
    return;
  }

  let coupons = JSON.parse(localStorage.getItem("coupons") || "[]");
  const existing = coupons.find(c => c.code === code);

  if (existing) {
    existing.value = value;
  } else {
    coupons.push({ code, value });
  }

  localStorage.setItem("coupons", JSON.stringify(coupons));
  renderCoupons();
  couponCode.value = "";
  couponValue.value = "";
});

function renderCoupons() {
  const coupons = JSON.parse(localStorage.getItem("coupons") || "[]");
  couponList.innerHTML = "";

  if (coupons.length === 0) {
    couponList.innerHTML = "<li class='muted'>No coupons added yet.</li>";
    return;
  }

  coupons.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.code} — ${c.value}% off`;
    li.style.margin = "4px 0";
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑";
    delBtn.style.marginLeft = "8px";
    delBtn.style.border = "none";
    delBtn.style.cursor = "pointer";
    delBtn.onclick = () => {
      const updated = coupons.filter(x => x.code !== c.code);
      localStorage.setItem("coupons", JSON.stringify(updated));
      renderCoupons();
    };
    li.appendChild(delBtn);
    couponList.appendChild(li);
  });
}

// ===== WhatsApp & Business Info =====
saveWaBtn.addEventListener("click", () => {
  const wa = whatsappNum.value.trim();
  const name = businessName.value.trim();

  if (!wa || !name) {
    waMsg.textContent = "⚠️ Please fill both fields.";
    return;
  }

  localStorage.setItem("whatsappNum", wa);
  localStorage.setItem("businessName", name);
  waMsg.textContent = "✅ Saved successfully!";
  setTimeout(() => (waMsg.textContent = ""), 2500);
});

showDataBtn.addEventListener("click", () => {
  const wa = localStorage.getItem("whatsappNum") || "Not set";
  const name = localStorage.getItem("businessName") || "Not set";
  alert(`📱 WhatsApp: ${wa}\n🏷 Business: ${name}`);
});

function loadSettings() {
  whatsappNum.value = localStorage.getItem("whatsappNum") || "";
  businessName.value = localStorage.getItem("businessName") || "";
}

// ===== Admin Utilities =====
viewCartStorage.addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  adminOutput.textContent = JSON.stringify(cart, null, 2) || "Cart empty.";
});

clearCartStorage.addEventListener("click", () => {
  localStorage.removeItem("cart");
  adminOutput.textContent = "🗑 Cart cleared.";
});

viewWishlist.addEventListener("click", () => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  adminOutput.textContent = JSON.stringify(wishlist, null, 2) || "Wishlist empty.";
});

clearWishlist.addEventListener("click", () => {
  localStorage.removeItem("wishlist");
  adminOutput.textContent = "🗑 Wishlist cleared.";
});

// ===== Helper: Display all localStorage =====
function showAllStorage() {
  console.log("💾 Local Storage Snapshot:");
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      console.log(`${key}:`, localStorage.getItem(key));
    }
  }
}
