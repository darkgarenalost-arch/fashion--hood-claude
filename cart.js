/* ═══════════════════════════════════════════════════════
   FASHION HOOD — cart.js
   Cart management, persistence, rendering
═══════════════════════════════════════════════════════ */

const CART_KEY = 'fh_cart';
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 79;

// ── Get / Save Cart ───────────────────────────────────
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCartPage();
}

// ── Add to Cart ───────────────────────────────────────
function addToCart({ id, name, price, image, size = '', color = '', qty = 1 }) {
  const cart = getCart();
  const key = `${id}-${size}-${color}`;
  const idx = cart.findIndex(i => `${i.id}-${i.size}-${i.color}` === key);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id, name, price, image, size, color, qty });
  }
  saveCart(cart);
}

// ── Remove Item ───────────────────────────────────────
function removeFromCart(id, size, color) {
  let cart = getCart();
  cart = cart.filter(i => !(i.id === id && i.size === size && i.color === color));
  saveCart(cart);
}

// ── Update Quantity ───────────────────────────────────
function updateQty(id, size, color, delta) {
  const cart = getCart();
  const key = `${id}-${size}-${color}`;
  const idx = cart.findIndex(i => `${i.id}-${i.size}-${i.color}` === key);
  if (idx > -1) {
    cart[idx].qty = Math.max(1, cart[idx].qty + delta);
    if (cart[idx].qty === 0) {
      cart.splice(idx, 1);
    }
  }
  saveCart(cart);
}

// ── Cart Totals ───────────────────────────────────────
function getCartTotals(couponDiscount = 0) {
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || cart.length === 0 ? 0 : SHIPPING_CHARGE;
  const discount = couponDiscount;
  const total = Math.max(0, subtotal - discount + shipping);
  return { subtotal, shipping, discount, total, count: cart.reduce((s, i) => s + i.qty, 0) };
}

// ── Render Cart Page ──────────────────────────────────
function renderCartPage() {
  const cartEl = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');
  if (!cartEl) return;

  const cart = getCart();
  const coupon = JSON.parse(sessionStorage.getItem('fh_coupon') || 'null');
  const totals = getCartTotals(coupon ? coupon.discount : 0);

  if (cart.length === 0) {
    cartEl.innerHTML = `
      <div class="text-center py-20">
        <div class="text-6xl mb-4">🛍️</div>
        <h3 class="font-display text-3xl font-semibold mb-3">Your cart is empty</h3>
        <p class="text-gray-500 mb-8 text-sm">Looks like you haven't added anything yet.</p>
        <a href="products.html" class="btn-red inline-block px-8 py-4 rounded-2xl text-sm font-medium">Start Shopping</a>
      </div>
    `;
    if (summaryEl) summaryEl.innerHTML = '';
    return;
  }

  cartEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image || 'assets/placeholder.jpg'}" class="w-24 h-32 rounded-xl object-cover bg-white/5 flex-shrink-0" alt="${item.name}" />
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-sm mb-1 truncate">${item.name}</h4>
        <div class="flex gap-2 text-xs text-gray-500 mb-2">
          ${item.size ? `<span>Size: ${item.size}</span>` : ''}
          ${item.color ? `<span>• Color: ${item.color}</span>` : ''}
        </div>
        <p class="font-display text-lg font-semibold mb-3">₹${item.price}</p>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button class="qty-btn" onclick="updateQty('${item.id}','${item.size}','${item.color}',-1)">−</button>
            <span class="w-8 text-center text-sm font-medium">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.id}','${item.size}','${item.color}',1)">+</button>
          </div>
          <button onclick="removeFromCart('${item.id}','${item.size}','${item.color}')" class="text-xs text-gray-600 hover:text-red-400 transition-colors">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  if (summaryEl) {
    const freeShippingLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);
    summaryEl.innerHTML = `
      ${freeShippingLeft > 0 ? `
        <div class="bg-brand-red/10 border border-brand-red/20 rounded-xl p-3 mb-4 text-xs text-center">
          Add ₹${freeShippingLeft} more for <strong>FREE shipping!</strong>
        </div>
      ` : `
        <div class="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4 text-xs text-center text-green-400">
          🎉 You've unlocked free shipping!
        </div>
      `}
      <div class="space-y-3 mb-4">
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">Subtotal (${totals.count} items)</span>
          <span>₹${totals.subtotal}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">Shipping</span>
          <span class="${totals.shipping === 0 ? 'text-green-400' : ''}">${totals.shipping === 0 ? 'FREE' : '₹' + totals.shipping}</span>
        </div>
        ${totals.discount > 0 ? `
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Coupon discount</span>
            <span class="text-green-400">−₹${totals.discount}</span>
          </div>
        ` : ''}
      </div>

      <!-- Coupon -->
      <div class="mb-4" id="coupon-section">
        ${coupon ? `
          <div class="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5 text-sm">
            <span class="text-green-400 font-medium">✓ ${coupon.code} applied (−₹${coupon.discount})</span>
            <button onclick="removeCoupon()" class="text-xs text-gray-500 hover:text-red-400">Remove</button>
          </div>
        ` : `
          <div class="flex gap-2">
            <input id="coupon-input" type="text" placeholder="Coupon code" class="input-field flex-1 py-2.5 text-sm" style="border-radius:10px" />
            <button onclick="applyCoupon()" class="btn-outline px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap">Apply</button>
          </div>
        `}
      </div>

      <div class="flex justify-between items-center font-semibold border-t border-white/10 pt-4 mb-6">
        <span>Total</span>
        <span class="font-display text-2xl">₹${totals.total}</span>
      </div>

      <a href="checkout.html" class="btn-red w-full py-4 rounded-2xl text-sm font-medium text-center block">
        Proceed to Checkout →
      </a>
      <a href="products.html" class="block text-center mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">← Continue Shopping</a>
    `;
  }
}

// ── Coupon Logic ──────────────────────────────────────
async function applyCoupon() {
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (!code) return;

  if (!window._db) {
    showToast('Firebase not configured');
    return;
  }
  const { collection, getDocs, query, where } = window._fbModules;
  try {
    const snap = await getDocs(query(collection(window._db, 'coupons'),
      where('code', '==', code),
      where('active', '==', true)
    ));
    if (snap.empty) { showToast('Invalid or expired coupon code'); return; }
    const coupon = { id: snap.docs[0].id, ...snap.docs[0].data() };
    const totals = getCartTotals();
    if (coupon.minOrder && totals.subtotal < coupon.minOrder) {
      showToast(`Minimum order ₹${coupon.minOrder} required`);
      return;
    }
    const discount = coupon.type === 'percent'
      ? Math.round(totals.subtotal * coupon.value / 100)
      : coupon.value;
    sessionStorage.setItem('fh_coupon', JSON.stringify({ code, discount, id: coupon.id }));
    showToast(`Coupon applied! You saved ₹${discount}`);
    renderCartPage();
  } catch(e) {
    showToast('Error applying coupon');
  }
}

function removeCoupon() {
  sessionStorage.removeItem('fh_coupon');
  renderCartPage();
  showToast('Coupon removed');
}

// Init
renderCartPage();
updateCartCount();
