import { getProductBySlug } from "../firebase/firestore-service.js";
import { addToCart } from "./cart-service.js";
import { $, formatMoney, getParam, labelFromSlug, renderShell, toast } from "./utils.js";

renderShell("shop");

const slug = getParam("slug");
const product = await getProductBySlug(slug);
const root = $("#product-detail");

if (!product) {
  root.innerHTML = `<div><h1 class="section-title">Product not found</h1><p class="muted mt-4">This item may be sold out or unpublished.</p><a class="btn-dark mt-6" href="index.html">Back to shop</a></div>`;
} else {
  document.title = `${product.name} | Fashion Hood`;
  const images = product.images?.length ? product.images : ["../assets/images/logo.svg"];
  root.innerHTML = `
    <div>
      <div class="gallery-main"><img id="main-image" src="${images[0]}" alt="${product.name}"></div>
      <div class="thumb-row">${images.map((image, index) => `<button class="${index === 0 ? "active" : ""}" data-image="${image}"><img src="${image}" alt=""></button>`).join("")}</div>
    </div>
    <div class="summary-card">
      <span class="eyebrow">${labelFromSlug(product.category)}</span>
      <h1 class="section-title mt-4">${product.name}</h1>
      <div class="price-row text-left mt-4">
        <strong class="text-3xl">${formatMoney(product.salePrice || product.price)}</strong>
        ${product.salePrice ? `<del>${formatMoney(product.price)}</del>` : ""}
      </div>
      <p class="muted mt-5">${product.description || "Premium Fashion Hood piece with a flattering fit and polished finish."}</p>
      <div class="mt-6">
        <h3 class="font-black mb-3">Size</h3>
        <div class="option-row">${(product.sizes || ["One Size"]).map((size, index) => option("size", size, index === 0)).join("")}</div>
      </div>
      <div class="mt-6">
        <h3 class="font-black mb-3">Color</h3>
        <div class="option-row">${(product.colors || ["Default"]).map((color, index) => option("color", color, index === 0)).join("")}</div>
      </div>
      <div class="mt-6 grid grid-cols-2 gap-3">
        <button class="btn-primary" id="add-cart">Add to cart</button>
        <button class="btn-dark" id="buy-now">Checkout</button>
      </div> 
      document.getElementById("buy-now")?.addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("fashion_hood_cart") || "[]");

  cart.length = 0;

  cart.push({
    id: product.id,
    name: product.name,
    price: product.salePrice || product.price,
    image: product.images?.[0] || "",
    quantity: 1
  });

  localStorage.setItem("fashion_hood_cart", JSON.stringify(cart));

  window.location.href = "../checkout.html";
});
      <div class="mt-5 text-sm muted">COD available · WhatsApp support · Stock: ${product.stock ?? "Live"}</div>
    </div>`;

  root.querySelectorAll(".thumb-row button").forEach((button) => {
    button.addEventListener("click", () => {
      $("#main-image").src = button.dataset.image;
      root.querySelectorAll(".thumb-row button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  $("#add-cart").addEventListener("click", () => {
    const size = root.querySelector("input[name=size]:checked")?.value;
    const color = root.querySelector("input[name=color]:checked")?.value;
    addToCart(product, { size, color, quantity: 1 });
  });
}

function option(name, value, checked) {
  return `<label><input type="radio" name="${name}" value="${value}" ${checked ? "checked" : ""}><span>${value}</span></label>`;
}

