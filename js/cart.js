import { cartSubtotal, getCart, removeFromCart, updateQuantity } from "./cart-service.js";
import { brandConfig } from "../firebase/firebase-config.js";
import { $, formatMoney, renderShell } from "./utils.js";

renderShell("cart");
renderCart();

window.addEventListener("cart:updated", renderCart);

function renderCart() {
  const cart = getCart();
  const subtotal = cartSubtotal(cart);
  const shipping = subtotal >= brandConfig.freeShippingAbove || subtotal === 0 ? 0 : brandConfig.standardShipping;
  const total = subtotal + shipping;

  $("#cart-items").innerHTML = cart.length ? `
    <h2 class="font-black text-2xl mb-3">Items</h2>
    ${cart.map((item) => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3 class="font-black">${item.name}</h3>
          <p class="muted text-sm">${item.size} · ${item.color}</p>
          <div class="qty-control mt-3">
            <button data-dec="${item.key}">−</button>
            <input value="${item.quantity}" readonly aria-label="Quantity">
            <button data-inc="${item.key}">+</button>
          </div>
          <button class="text-red-700 text-sm mt-3" data-remove="${item.key}">Remove</button>
        </div>
        <div class="price-row"><strong>${formatMoney(item.price * item.quantity)}</strong></div>
      </article>
    `).join("")}
  ` : `<h2 class="font-black text-2xl">Your cart is empty</h2><p class="muted mt-3">Add a fresh drop before checkout.</p><a class="btn-dark mt-5" href="products/">Shop products</a>`;

  $("#cart-summary").innerHTML = `
    <h2 class="font-black text-2xl mb-4">Summary</h2>
    ${line("Subtotal", formatMoney(subtotal))}
    ${line("Shipping", shipping ? formatMoney(shipping) : "Free")}
    ${line("Total", formatMoney(total), true)}
    <a class="btn-primary w-full mt-5" href="checkout.html">Checkout with COD</a>
    <a class="btn-soft w-full mt-3" href="products/">Continue shopping</a>
  `;

  document.querySelectorAll("[data-inc]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = String(button.dataset.inc);

    const item = cart.find((entry) => String(entry.key) === key);

    if (!item) return;

    updateQuantity(item.key, item.quantity + 1);
  });
});

document.querySelectorAll("[data-dec]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = String(button.dataset.dec);

    const item = cart.find((entry) => String(entry.key) === key);

    if (!item) return;

    if (item.quantity <= 1) {
      removeFromCart(item.key);
    } else {
      updateQuantity(item.key, item.quantity - 1);
    }
  });
});

document.querySelectorAll("[data-remove]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = String(button.dataset.remove);

    removeFromCart(key);
  });
});

} function line(label, value, strong = false) {
  return `<div class="flex justify-between py-3 border-b border-black/10 ${strong ? "font-black text-xl" : ""}"><span>${label}</span><span>${value}</span></div>`;
}

