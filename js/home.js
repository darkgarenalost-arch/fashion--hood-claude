import { getBanners, getProducts } from "../firebase/firestore-service.js";
import { categories, fallbackProducts, reviews } from "./data.js";
import { $, initReveal, productCard, renderShell } from "./utils.js";

renderShell("home");

const banners = await getBanners();
const heroBg = $("#hero-bg");
const heroEyebrow = $("#hero-eyebrow");
const heroTitle = $("#hero-title");
const heroSubtitle = $("#hero-subtitle");
const heroCta = $("#hero-cta");

heroBg.innerHTML = banners.map((banner, index) => `<img class="${index === 0 ? "active" : ""}" src="${banner.image}" alt="${banner.title}">`).join("");
let activeBanner = 0;
function setBanner(index) {
  const banner = banners[index];
  heroBg.querySelectorAll("img").forEach((img, imgIndex) => img.classList.toggle("active", imgIndex === index));
  heroEyebrow.textContent = banner.eyebrow || "Fashion Hood";
  heroTitle.textContent = banner.title || "Fashion Hood";
  heroSubtitle.textContent = banner.subtitle || "";
  heroCta.textContent = banner.cta || "Shop now";
  heroCta.href = banner.link || "products/";
}
setInterval(() => {
  activeBanner = (activeBanner + 1) % banners.length;
  setBanner(activeBanner);
}, 5200);

$("#category-grid").innerHTML = categories.map((category) => `
  <a class="category-card reveal" href="products/?category=${category.slug}">
    <img src="${category.image}" alt="${category.name}" loading="lazy">
    <span>${category.name}</span>
  </a>
`).join("");

const [newArrivals, bestSellers, featured] = await Promise.all([
  getProducts({ tag: "new-arrival", limit: 4 }).catch(() => fallbackProducts.filter((item) => item.tags.includes("new-arrival")).slice(0, 4)),
  getProducts({ tag: "best-seller", limit: 4 }).catch(() => fallbackProducts.filter((item) => item.tags.includes("best-seller")).slice(0, 4)),
  getProducts({ featured: true, limit: 4 }).catch(() => fallbackProducts.slice(0, 4))
]);

$("#new-arrivals").innerHTML = newArrivals.map(productCard).join("");
$("#best-sellers").innerHTML = bestSellers.map(productCard).join("");
$("#reel-row").innerHTML = featured.map((product) => `
  <a class="reel-card reveal" href="products/details.html?slug=${product.slug}">
    <img src="${product.images?.[0]}" alt="${product.name}" loading="lazy">
    <span>${product.name}</span>
  </a>
`).join("");

$("#review-grid").innerHTML = reviews.map((review) => `
  <article class="review-card reveal">
    <strong>${"★".repeat(review.rating)}</strong>
    <p>"${review.text}"</p>
    <div class="mt-5 font-black">${review.name}</div>
    <div class="text-white/50 text-sm">${review.city}</div>
  </article>
`).join("");

initReveal();

