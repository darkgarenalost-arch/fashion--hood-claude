import { toast } from "./utils.js";

const CART_KEY = "fashion_hood_cart";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

export function addToCart(product, options = {}) {
  const cart = getCart();
  const key = `${product.id}-${options.size || "default"}-${options.color || "default"}`;
  const existing = cart.find((item) => item.key === key);
  if (existing) {
    existing.quantity += options.quantity || 1;
  } else {
    cart.push({
      key,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.images?.[0] || "",
      price: product.salePrice || product.price,
      mrp: product.price,
      size: options.size || product.sizes?.[0] || "One Size",
      color: options.color || product.colors?.[0] || "Default",
      quantity: options.quantity || 1
    });
  }
  saveCart(cart);
  toast("Added to cart");
}

export function updateQuantity(key, quantity) {
  const next = getCart()
    .map((item) => item.key === key ? { ...item, quantity: Math.max(1, Number(quantity)) } : item)
    .filter((item) => item.quantity > 0);
  saveCart(next);
}

export function removeFromCart(key) {
  saveCart(getCart().filter((item) => item.key !== key));
  toast("Removed from cart");
}

export function clearCart() {
  saveCart([]);
}

export function cartSubtotal(cart = getCart()) {
  return cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
}

