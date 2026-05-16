import { brandConfig } from "../firebase/firebase-config.js";
import { createOrder, validateCoupon } from "../firebase/firestore-service.js";
import { cartSubtotal, clearCart, getCart } from "./cart-service.js";
import { $, formatMoney, renderShell, toast } from "./utils.js";

renderShell("cart");

let appliedCoupon = null;
renderSummary();

document.querySelectorAll("input[name=paymentMethod]").forEach((input) => {
  input.addEventListener("change", () => {
    $("#place-order").textContent = input.value === "COD" ? "Place COD order" : "Pay with Razorpay";
  });
});

$("#checkout-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const cart = getCart();
  if (!cart.length) return toast("Your cart is empty", "error");

  const form = new FormData(event.currentTarget);
  const totals = calculateTotals();
  const order = {
    customer: Object.fromEntries(form.entries()),
    items: cart,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    discount: totals.discount,
    total: totals.total,
    couponCode: appliedCoupon?.code || "",
    paymentMethod: form.get("paymentMethod"),
    paymentStatus: form.get("paymentMethod") === "COD" ? "Pending COD" : "Pending"
  };

  if (order.paymentMethod === "Razorpay") {
    return startRazorpay(order);
  }

  try {
    const id = await createOrder(order);
    rememberOrder(id);
    clearCart();
    window.location.href = `order-confirmation.html?id=${id}&method=COD`;
  } catch (error) {
    toast(error.message || "Could not place order");
  }
});

async function startRazorpay(order) {
  if (!window.Razorpay) return toast("Razorpay script did not load");
  const options = {
    key: brandConfig.razorpayKeyId,
    amount: order.total * 100,
    currency: "INR",
    name: "Fashion Hood",
    description: "Fashion Hood order",
    image: "assets/images/logo.svg",
    prefill: {
      name: order.customer.name,
      email: order.customer.email,
      contact: order.customer.phone
    },
    notes: {
      brand: "Fashion Hood",
      payment_mode_note: "Client-side static checkout"
    },
    theme: { color: "#9b0714" },
    handler: async (response) => {
      const id = await createOrder({
        ...order,
        paymentStatus: "Paid - Razorpay response received",
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id || "",
        razorpaySignature: response.razorpay_signature || ""
      });
      rememberOrder(id);
      clearCart();
      window.location.href = `order-confirmation.html?id=${id}&method=Razorpay`;
    }
  };
  new Razorpay(options).open();
}

function renderSummary() {
  const cart = getCart();
  const totals = calculateTotals();
  $("#checkout-summary").innerHTML = `
    <h2 class="font-black text-2xl mb-4">Order summary</h2>
    <div class="grid gap-3">
      ${cart.map((item) => `<div class="flex gap-3"><img class="w-16 h-20 object-cover rounded" src="${item.image}" alt=""><div class="flex-1"><strong>${item.name}</strong><p class="muted text-sm">${item.size} · ${item.color} · Qty ${item.quantity}</p></div><strong>${formatMoney(item.price * item.quantity)}</strong></div>`).join("") || `<p class="muted">Your cart is empty.</p>`}
    </div>
    <div class="mt-5 flex gap-2">
      <input id="coupon-input" class="flex-1 min-h-12 rounded border border-black/10 px-3" placeholder="Coupon code">
      <button class="btn-dark" id="apply-coupon" type="button">Apply</button>
    </div>
    <div class="mt-5">
      ${line("Subtotal", formatMoney(totals.subtotal))}
      ${line("Discount", totals.discount ? `− ${formatMoney(totals.discount)}` : "—")}
      ${line("Shipping", totals.shipping ? formatMoney(totals.shipping) : "Free")}
      ${line("Total", formatMoney(totals.total), true)}
    </div>
    <p class="muted text-sm mt-4">Free shipping above ${formatMoney(brandConfig.freeShippingAbove)}. COD is highlighted because most Fashion Hood customers prefer pay-on-delivery.</p>
  `;
  $("#apply-coupon").addEventListener("click", applyCoupon);
}

async function applyCoupon() {
  const code = $("#coupon-input").value.trim();
  const subtotal = cartSubtotal();
  const coupon = await validateCoupon(code, subtotal).catch(() => null);
  if (!coupon) return toast("Coupon is invalid or not eligible");
  appliedCoupon = coupon;
  toast(`${coupon.code} applied`);
  renderSummary();
}

function calculateTotals() {
  const subtotal = cartSubtotal();
  const discount = appliedCoupon?.discount || 0;
  const shipping = subtotal - discount >= brandConfig.freeShippingAbove || subtotal === 0 ? 0 : brandConfig.standardShipping;
  return { subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping) };
}

function line(label, value, strong = false) {
  return `<div class="flex justify-between py-3 border-b border-black/10 ${strong ? "font-black text-xl" : ""}"><span>${label}</span><span>${value}</span></div>`;
}

function rememberOrder(id) {
  const orders = JSON.parse(localStorage.getItem("fashion_hood_orders") || "[]");
  localStorage.setItem("fashion_hood_orders", JSON.stringify([id, ...orders].slice(0, 8)));
}

