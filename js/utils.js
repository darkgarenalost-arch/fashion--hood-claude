import { brandConfig } from "../firebase/firebase-config.js";

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export function productUrl(product) {
  return `${pathPrefix()}products/details.html?slug=${encodeURIComponent(product.slug || product.id)}`;
}

export function pathPrefix() {
  const path = window.location.pathname.replace(/\\/g, "/");
  if (path.includes("/admin/") || path.includes("/products/")) return "../";
  return "";
}

export function toast(message, tone = "dark") {
  const el = document.createElement("div");
  el.className = `toast toast-${tone}`;
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  }, 2600);
}

export function renderShell(active = "home") {
  const prefix = pathPrefix();
  const header = $("#site-header");
  const footer = $("#site-footer");
  const mobile = $("#mobile-nav");
  const whatsapp = $("#whatsapp-float");

  if (header) {
    header.innerHTML = `
      <nav class="nav-shell">
        <a href="${prefix}index.html" class="brand-lockup" aria-label="Fashion Hood home">
          <img src="${prefix}assets/images/logo.svg" alt="Fashion Hood" class="brand-mark">
          <span>Fashion Hood</span>
        </a>
        <button class="nav-toggle lg:hidden" id="nav-toggle" aria-label="Open menu">
          <span></span><span></span>
        </button>
        <div class="nav-links" id="nav-links">
          ${navLink(prefix, "index.html", "Home", active === "home")}
          ${navLink(prefix, "products/index.html", "Shop", active === "shop")}
          ${navLink(prefix, "products/index.html?tag=new-arrival", "New In", false)}
          ${navLink(prefix, "products/index.html?tag=best-seller", "Best Sellers", false)}
          ${navLink(prefix, "cart.html", "Cart", active === "cart")}
      </div>
      </nav>`;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="footer-grid">
        <div>
          <div class="brand-lockup mb-4">
            <img src="${prefix}assets/images/logo.svg" alt="" class="brand-mark">
            <span>Fashion Hood</span>
          </div>
          <p class="muted max-w-md">Premium, trend-led fashion for Indian girls and young women. Luxe mood, friendly prices, COD-first shopping.</p>
        </div>
        <div>
          <h3>Shop</h3>
          <a href="${prefix}products/index.html?category=kurtis">Kurtis</a>
          <a href="${prefix}products/index.html?category=co-ord-sets">Co-ord Sets</a>
          <a href="${prefix}products/index.html?category=denims">Denims</a>
          <a href="${prefix}products/index.html?category=handbags">Handbags</a>
        </div>
        <div>
          <h3>Support</h3>
          <a href="${prefix}checkout.html">Checkout</a>
          <a href="${prefix}account.html">My Orders</a>
          <a href="mailto:${brandConfig.supportEmail}">${brandConfig.supportEmail}</a>
          <a href="https://wa.me/${brandConfig.supportPhone}">WhatsApp Support</a>
        </div>
        <div>
          <h3>Newsletter</h3>
          <p class="muted">Drop your email for early access to new drops and private sale alerts.</p>
          <form class="newsletter-form" id="newsletter-form">
            <input type="email" required placeholder="Email address">
            <button type="submit">Join</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Fashion Hood. All rights reserved.</span>
        <span>COD available · Free shipping over ${formatMoney(brandConfig.freeShippingAbove)}</span>
      </div>`;
  }

  if (mobile) {
    mobile.innerHTML = `
      ${mobileLink(prefix, "index.html", `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="nav-icon">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>
`, "Home", active === "home")}
      ${mobileLink(prefix, "<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
</svg>
", "Shop", active === "shop")}
      ${mobileLink(prefix, "cart.html", "<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>
", "Cart", active === "cart")}
      ${mobileLink(prefix, "account.html", "<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
</svg>
", "Orders", active === "account")}`;
  }

  if (whatsapp) {
    whatsapp.href = `https://wa.me/${brandConfig.supportPhone}?text=${encodeURIComponent("Hi Fashion Hood, I need help with shopping.")}`;
  }

  $("#nav-toggle")?.addEventListener("click", () => $("#nav-links")?.classList.toggle("open"));
  $("#newsletter-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    toast("You are on the Fashion Hood list.");
    event.target.reset();
  });

  import("./brand-runtime.js")
    .then((module) => module.applyBrandRuntime())
    .catch(() => {});
}

function navLink(prefix, href, label, active) {
  return `<a class="${active ? "active" : ""}" href="${prefix}${href}">${label}</a>`;
}

function mobileLink(prefix, href, icon, label, active) {
  return `<a class="${active ? "active" : ""}" href="${prefix}${href}"><span>${icon}</span>${label}</a>`;
}

export function initReveal() {
  const items = $$(".reveal");
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

export function productCard(product) {
  const price = product.salePrice || product.price;
  const badge = product.tags?.includes("best-seller") ? "Best Seller" : product.tags?.includes("new-arrival") ? "New In" : "Fresh";
  return `
    <article class="product-card reveal">
      <a href="${productUrl(product)}" class="product-media">
        <img src="${product.images?.[0] || "../assets/images/logo.svg"}" alt="${product.name}" loading="lazy">
        <span>${badge}</span>
      </a>
      <div class="product-info">
        <div>
          <a href="${productUrl(product)}" class="product-title">${product.name}</a>
          <p>${labelFromSlug(product.category)}</p>
        </div>
        <div class="price-row">
          <strong>${formatMoney(price)}</strong>
          ${product.salePrice ? `<del>${formatMoney(product.price)}</del>` : ""}
        </div>
      </div>
    </article>`;
}

export function labelFromSlug(slug) {
  return String(slug || "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
