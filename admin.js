// Simple password (you can change this!)
const ADMIN_PASSWORD = "EdenAdmin2025";

const loginSection = document.getElementById("login-section");
const adminPanel = document.getElementById("admin-panel");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const passwordInput = document.getElementById("admin-password");

const couponList = document.getElementById("coupon-list");
const addCouponBtn = document.getElementById("add-coupon-btn");
const couponCodeInput = document.getElementById("coupon-code");
const couponDiscountInput = document.getElementById("coupon-discount");

const whatsappInput = document.getElementById("whatsapp-number");
const businessNameInput = document.getElementById("business-name");
const saveWhatsappBtn = document.getElementById("save-whatsapp-btn");
const saveStatus = document.getElementById("save-status");

// --- LOGIN SYSTEM ---
loginBtn.addEventListener("click", () => {
  const entered = passwordInput.value.trim();
  if (entered === ADMIN_PASSWORD) {
    loginSection.style.display = "none";
    adminPanel.style.display = "block";
    loadCoupons();
    loadWhatsAppSettings();
  } else {
    alert("Incorrect password!");
  }
});

logoutBtn.addEventListener("click", () => {
  adminPanel.style.display = "none";
  loginSection.style.display = "block";
  passwordInput.value = "";
});

// --- COUPON MANAGEMENT ---
function loadCoupons() {
  couponList.innerHTML = "";
  const coupons = JSON.parse(localStorage.getItem("coupons")) || [];
  coupons.forEach((coupon, index) => {
    const li = document.createElement("li");
    li.textContent = `${coupon.code} — ${coupon.discount}% off`;
    const del = document.createElement("button");
    del.textContent = "❌";
    del.style.marginLeft = "10px";
    del.onclick = () => {
      coupons.splice(index, 1);
      localStorage.setItem("coupons", JSON.stringify(coupons));
      loadCoupons();
    };
    li.appendChild(del);
    couponList.appendChild(li);
  });
}

addCouponBtn.addEventListener("click", () => {
  const code = couponCodeInput.value.trim();
  const discount = parseFloat(couponDiscountInput.value);
  if (!code || isNaN(discount) || discount <= 0) {
    alert("Enter valid coupon details!");
    return;
  }

  const coupons = JSON.parse(localStorage.getItem("coupons")) || [];
  coupons.push({ code, discount });
  localStorage.setItem("coupons", JSON.stringify(coupons));
  couponCodeInput.value = "";
  couponDiscountInput.value = "";
  loadCoupons();
});

// --- WHATSAPP SETTINGS ---
function loadWhatsAppSettings() {
  whatsappInput.value = localStorage.getItem("whatsappNumber") || "";
  businessNameInput.value = localStorage.getItem("businessName") || "Eden Beads Jewelry Studio";
}

saveWhatsappBtn.addEventListener("click", () => {
  localStorage.setItem("whatsappNumber", whatsappInput.value.trim());
  localStorage.setItem("businessName", businessNameInput.value.trim());
  saveStatus.style.display = "block";
  setTimeout(() => (saveStatus.style.display = "none"), 2000);
});
