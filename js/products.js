import { getProducts } from "../firebase/firestore-service.js";
import { categories, fallbackProducts } from "./data.js";
import { $, getParam, initReveal, productCard, renderShell } from "./utils.js";

renderShell("shop");

const category = getParam("category");
const tag = getParam("tag");
const filters = [{ label: "All", href: "index.html", active: !category && !tag }]
  .concat(categories.map((item) => ({ label: item.name, href: `index.html?category=${item.slug}`, active: category === item.slug })))
  .concat([
    { label: "New In", href: "index.html?tag=new-arrival", active: tag === "new-arrival" },
    { label: "Best Sellers", href: "index.html?tag=best-seller", active: tag === "best-seller" }
  ]);

$("#filter-bar").innerHTML = filters.map((filter) => `<a class="chip ${filter.active ? "active" : ""}" href="${filter.href}">${filter.label}</a>`).join("");

let products = [];
try {
  products = await getProducts({ category, tag });
} catch {
  products = fallbackProducts.filter((item) => (!category || item.category === category) && (!tag || item.tags.includes(tag)));
}
if (!products.length) products = fallbackProducts;

$("#product-grid").innerHTML = products.map(productCard).join("");
initReveal();

