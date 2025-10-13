// =========================
// Eden Beads Jewelry Studio ☕🤎
// Cart, Coupon, WhatsApp Order
// =========================

// Get DOM Elements
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const coupons = JSON.parse(localStorage.getItem("coupons")) || [];
const whatsappNumber = localStorage.getItem("whatsappNumber") || "+92XXXXXXXXXX";
const businessName = localStorage.getItem("businessName") || "Eden Beads Jewelry Studio";

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart();
  alert(`${name} added to cart!`);
}

function removeFromCart(name) {
  const index = cart.findIndex(item => item.name === name);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }
}

function clearCart() {
  localStorage.removeItem("cart");
  location.reload();
}

function applyCoupon(code, total) {
  const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
  if (!coupon) return total;
  const discount = (total * coupon.discount) / 100;
  return total - discount;
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalBox = document.getElementById("cart-total");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>Rs. ${item.price * item.quantity}</span>
      <button onclick="removeFromCart('${item.name}')">❌</button>
    `;
    container.appendChild(div);
    total += item.price * item.quantity;
  });

  const couponCode = document.getElementById("coupon-code")?.value || "";
  const discountedTotal = applyCoupon(couponCode, total);
  totalBox.textContent = `Total: Rs. ${discountedTotal}`;
}

function placeOrder() {
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();
  const payment = document.getElementById("cust-payment").value;

  if (!name || !phone || !address) {
    alert("Please fill in all fields!");
    return;
  }

  let message = `Hi! I placed an order.%0A%0A`;
  message += `Name: ${name}%0APhone: ${phone}%0AAddress: ${address}%0A%0AItems:%0A`;

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    message += `- ${item.name} × ${item.quantity} — Rs. ${item.price * item.quantity}%0A`;
  });

  const couponCode = document.getElementById("coupon-code")?.value || "";
  const discountedTotal = applyCoupon(couponCode, total);

  message += `%0ATotal: Rs. ${discountedTotal}%0APayment method: ${payment}`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// Render cart automatically
document.addEventListener("DOMContentLoaded", renderCart);
