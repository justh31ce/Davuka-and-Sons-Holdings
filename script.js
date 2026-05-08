/* ================= UI TOGGLES ================= */
function toggleMenu() {
  const panel = document.querySelector('.menu-panel');
  panel.classList.toggle('active');
}

function toggleCartDrawer(e) {
  if(e) e.preventDefault();
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('show');
}

/* ================= CART LOGIC ================= */
let cart = JSON.parse(localStorage.getItem("kings_cart")) || [];

function addItem(name, price) {
  // Add item with a unique ID for accurate removal
  cart.push({ id: Date.now(), name, price: Number(price) });
  
  if (window.navigator.vibrate) window.navigator.vibrate(50); // Haptic feedback
  
  saveCart();
  flashAdded(name);
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function saveCart() {
  localStorage.setItem("kings_cart", JSON.stringify(cart));
  renderCart();
  renderCartOnOrder();
  updateCartCounts();
  updateDeliveryFee();
}

function cartTotalRaw() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function updateCartCounts() {
  const count = cart.length;
  // Update both desktop/mobile badge instances if they exist
  ['nav-cart-count', 'nav-cart-count-2'].forEach(id => {
    const badge = document.getElementById(id);
    if (badge) {
      badge.innerText = count;
      badge.classList.add('pulse');
      setTimeout(() => badge.classList.remove('pulse'), 300);
    }
  });
}

/* ================= RENDER CART ================= */
function renderCart() {
  const list = document.getElementById("cartList");
  const total = document.getElementById("total");
  if (!list || !total) return;
  
  list.innerHTML = "";
  if(cart.length === 0) {
      list.innerHTML = "<p style='text-align:center; color:#888; margin-top:20px;'>Your cart is empty.</p>";
  } else {
      cart.forEach((item) => {
        list.innerHTML += `
          <li>
            <div class="cart-item-info">
              <strong>${item.name}</strong><br>
              <span style="color:var(--gold)">R${item.price.toFixed(2)}</span>
            </div>
            <button class="remove-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
          </li>`;
      });
  }
  total.innerText = cartTotalRaw().toFixed(2);
}

function renderCartOnOrder() {
  const list = document.getElementById("cartListOrder");
  if (!list) return;
  list.innerHTML = "";
  cart.forEach((item) => {
    list.innerHTML += `
      <li style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span>${item.name}</span>
        <span style="color:var(--gold)">R${item.price.toFixed(2)}</span>
      </li>`;
  });
}

/* ================= TOAST FEEDBACK ================= */
function flashAdded(itemName) {
  const toast = document.createElement("div");
  toast.innerText = `${itemName} added!`;
  toast.style.cssText = `
    position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
    background: var(--gold-gradient); color: #000; padding: 12px 24px;
    border-radius: 30px; font-weight: 700; z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    animation: fadeInOut 2s forwards; pointer-events: none;
  `;
  
  // Add quick keyframe animation if it doesn't exist
  if(!document.getElementById('toastStyles')) {
      const style = document.createElement('style');
      style.id = 'toastStyles';
      style.innerHTML = `@keyframes fadeInOut { 0% {opacity:0; top:80px;} 15% {opacity:1; top:100px;} 80% {opacity:1; top:100px;} 100% {opacity:0; top:80px;} }`;
      document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

/* ================= ORDER PROCESSING ================= */
function handleOrderType() {
  const type = document.getElementById("orderType").value;
  const isDelivery = type === "Delivery";
  document.getElementById("address").style.display = isDelivery ? "block" : "none";
  document.getElementById("area").style.display = isDelivery ? "block" : "none";
}

function getDeliveryFee() {
  const type = document.getElementById("orderType");
  const area = document.getElementById("area");
  if (!type || type.value !== "Delivery") return 0;
  switch (area.value) {
    case "Eden Park": return 10;
    case "Katlehong": return 15;
    case "Thokoza": return 15;
    case "Other": return 50;
    default: return 0;
  }
}

function updateDeliveryFee() {
  const itemsTotalEl = document.getElementById("totalOrder");
  const deliveryFeeEl = document.getElementById("deliveryFee");
  const grandTotalEl = document.getElementById("grandTotal");
  if (!itemsTotalEl) return;
  
  const itemsTotal = cartTotalRaw();
  const fee = getDeliveryFee();
  const grand = itemsTotal + fee;
  
  itemsTotalEl.innerText = itemsTotal.toFixed(2);
  deliveryFeeEl.innerText = fee.toFixed(2);
  grandTotalEl.innerText = grand.toFixed(2);
}

function sendOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please select food from the menu first.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const orderType = document.getElementById("orderType").value;
  const address = document.getElementById("address").value.trim();
  const area = document.getElementById("area").value;
  
  // Replace with your actual business WhatsApp number (Include Country Code, no plus)
  const whatsappNumber = "27712345678"; 

  if (!name || !phone) {
    alert("Please enter your name and phone number.");
    return;
  }
  
  if (orderType === "Delivery" && (!area || !address)) {
    alert("Please fill in your delivery area and address.");
    return;
  }

  const fee = getDeliveryFee();
  const itemsTotal = cartTotalRaw();
  const grand = itemsTotal + fee;

  // Premium Markdown Formatted Message
  let msg = `👑 *KING'S FOOD - NEW ORDER* 👑\n`;
  msg += `────────────────────\n`;
  msg += `👤 *Customer:* ${name}\n`;
  msg += `📞 *Phone:* ${phone}\n`;
  msg += `📍 *Type:* ${orderType}\n`;
  
  if (orderType === "Delivery") {
    msg += `🏠 *Address:* ${address}, ${area}\n`;
  }
  
  msg += `────────────────────\n`;
  msg += `🍴 *ITEMS:* \n`;
  cart.forEach(item => {
    msg += `• ${item.name} (*R${item.price.toFixed(2)}*)\n`;
  });

  msg += `────────────────────\n`;
  if (orderType === "Delivery") {
    msg += `🛵 Delivery Fee: R${fee.toFixed(2)}\n`;
  }
  msg += `💰 *GRAND TOTAL:* R${grand.toFixed(2)}\n`;
  msg += `────────────────────\n`;

  // Save basic info for next time
  localStorage.setItem("kings_user_name", name);
  localStorage.setItem("kings_user_phone", phone);

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ================= INITIALIZE ================= */
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  renderCartOnOrder();
  updateCartCounts();
  
  // Auto-fill form if user has ordered before
  const savedName = localStorage.getItem("kings_user_name");
  const savedPhone = localStorage.getItem("kings_user_phone");
  if(document.getElementById("name") && savedName) document.getElementById("name").value = savedName;
  if(document.getElementById("phone") && savedPhone) document.getElementById("phone").value = savedPhone;
});
