import {
  deleteBanner,
  deleteCoupon,
  deleteProduct,
  getAllBanners,
  getCoupons,
  getDashboardStats,
  getOrders,
  getProducts,
  logoutAdmin,
  saveBanner,
  saveCoupon,
  saveProduct,
  saveSiteSettings,
  updateOrderStatus,
  uploadBrandAsset,
  uploadProductImage,
  watchAdmin
} from "../firebase/firestore-service.js";
import { $, $$, formatMoney, labelFromSlug, slugify, toast } from "../js/utils.js";

let products = [];
let orders = [];
let coupons = [];
let banners = [];

watchAdmin(async (user, isAdmin) => {
  if (!user || !isAdmin) {
    $("#admin-guard").classList.remove("hidden");
    $("#admin-app").classList.add("hidden");
    return;
  }
  $("#admin-guard").classList.add("hidden");
  $("#admin-app").classList.remove("hidden");
  await refreshAll();
});

$("#logout-button").addEventListener("click", async () => {
  await logoutAdmin();
  window.location.href = "login.html";
});

$$(".admin-tab[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".admin-tab").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    $$("[data-panel]").forEach((panel) => panel.classList.toggle("hidden", panel.dataset.panel !== button.dataset.tab));
  });
});

$("#new-product").addEventListener("click", () => openProductModal());
$("#close-product").addEventListener("click", () => $("#product-modal").classList.remove("open"));

$("#product-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  try {
    const uploaded = await uploadFiles(data.getAll("imageFiles"), uploadProductImage);
    const existingImages = split(data.get("images"));
    const tags = split(data.get("tags"));
    const payload = {
      name: data.get("name"),
      slug: data.get("slug") || slugify(data.get("name")),
      category: data.get("category"),
      stock: data.get("stock"),
      price: data.get("price"),
      salePrice: data.get("salePrice"),
      sizes: split(data.get("sizes")),
      colors: split(data.get("colors")),
      tags,
      featured: data.get("featured") === "on" || tags.includes("featured"),
      images: existingImages.concat(uploaded),
      description: data.get("description")
    };
    await saveProduct(payload, data.get("id") || null);
    toast("Product saved");
    $("#product-modal").classList.remove("open");
    form.reset();
    await refreshProducts();
    await refreshStats();
  } catch (error) {
    toast(error.message || "Product save failed");
  }
});

$("#coupon-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  await saveCoupon({
    code: data.get("code"),
    type: data.get("type"),
    value: data.get("value"),
    minCart: data.get("minCart"),
    active: data.get("active") === "on"
  }, data.get("id") || null);
  toast("Coupon saved");
  event.currentTarget.reset();
  await refreshCoupons();
});

$("#banner-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const file = data.get("imageFile");
  const uploaded = file?.size ? await uploadBrandAsset(file, "banners") : "";
  await saveBanner({
    eyebrow: data.get("eyebrow"),
    title: data.get("title"),
    subtitle: data.get("subtitle"),
    cta: data.get("cta"),
    link: data.get("link"),
    position: data.get("position"),
    image: uploaded || data.get("image"),
    active: data.get("active") === "on"
  }, data.get("id") || null);
  toast("Banner saved");
  event.currentTarget.reset();
  await refreshBanners();
});

$("#branding-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const logo = data.get("logoFile");
  const favicon = data.get("faviconFile");
  const payload = {};
  if (logo?.size) payload.logoUrl = await uploadBrandAsset(logo, "branding");
  if (favicon?.size) payload.faviconUrl = await uploadBrandAsset(favicon, "branding");
  await saveSiteSettings(payload);
  toast("Branding updated");
  event.currentTarget.reset();
});

async function refreshAll() {
  await Promise.all([refreshStats(), refreshProducts(), refreshOrders(), refreshCoupons(), refreshBanners()]);
}

async function refreshStats() {
  const stats = await getDashboardStats();
  $("#stats-grid").innerHTML = stat("Revenue", formatMoney(stats.revenue)) + stat("Orders", stats.orders) + stat("Products", stats.products) + stat("Low stock", stats.lowStock);
}

async function refreshProducts() {
  products = await getProducts().catch(() => []);
  $("#products-table").innerHTML = `
    <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Tags</th><th></th></tr></thead>
    <tbody>${products.map((product) => `
      <tr>
        <td><strong>${product.name}</strong><br><span class="text-white/50">${product.slug}</span></td>
        <td>${labelFromSlug(product.category)}</td>
        <td>${formatMoney(product.salePrice || product.price)}<br><span class="text-white/50">${formatMoney(product.price)}</span></td>
        <td>${product.stock ?? 0}</td>
        <td>${(product.tags || []).join(", ")}</td>
        <td class="text-right"><button class="btn-soft" data-edit-product="${product.id}">Edit</button> <button class="btn-secondary" data-delete-product="${product.id}">Delete</button></td>
      </tr>`).join("")}</tbody>`;
  $$("[data-edit-product]").forEach((button) => button.addEventListener("click", () => openProductModal(products.find((product) => product.id === button.dataset.editProduct))));
  $$("[data-delete-product]").forEach((button) => button.addEventListener("click", async () => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(button.dataset.deleteProduct);
    await refreshProducts();
    toast("Product deleted");
  }));
}

async function refreshOrders() {
  orders = await getOrders().catch(() => []);
  $("#orders-table").innerHTML = `
    <thead><tr><th>Customer</th><th>Address</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
    <tbody>${orders.map((order) => `
      <tr>
        <td><strong>${order.customer?.name || ""}</strong><br>${order.customer?.phone || ""}<br>${order.customer?.whatsapp || ""}</td>
        <td>${order.customer?.address || ""}<br>${order.customer?.city || ""} ${order.customer?.pincode || ""}</td>
        <td>${(order.items || []).map((item) => `${item.name} × ${item.quantity}`).join("<br>")}</td>
        <td>${order.paymentMethod}<br><span class="text-white/50">${order.paymentStatus || ""}</span></td>
        <td>${formatMoney(order.total)}</td>
        <td><select data-order-status="${order.id}">${["Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map((status) => `<option ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td>
        <td>${order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-IN") : "New"}</td>
      </tr>`).join("")}</tbody>`;
  $$("[data-order-status]").forEach((select) => select.addEventListener("change", async () => {
    await updateOrderStatus(select.dataset.orderStatus, select.value);
    toast("Order status updated");
  }));
}

async function refreshCoupons() {
  coupons = await getCoupons();
  $("#coupons-table").innerHTML = `
    <thead><tr><th>Code</th><th>Value</th><th>Min cart</th><th>Status</th><th></th></tr></thead>
    <tbody>${coupons.map((coupon) => `
      <tr>
        <td><strong>${coupon.code}</strong></td>
        <td>${coupon.type === "flat" ? formatMoney(coupon.value) : `${coupon.value}%`}</td>
        <td>${formatMoney(coupon.minCart || 0)}</td>
        <td>${coupon.active ? "Enabled" : "Disabled"}</td>
        <td><button class="btn-soft" data-edit-coupon="${coupon.id}">Edit</button> <button class="btn-secondary" data-delete-coupon="${coupon.id}">Delete</button></td>
      </tr>`).join("")}</tbody>`;
  $$("[data-edit-coupon]").forEach((button) => button.addEventListener("click", () => fillCoupon(coupons.find((coupon) => coupon.id === button.dataset.editCoupon))));
  $$("[data-delete-coupon]").forEach((button) => button.addEventListener("click", async () => {
    if (!confirm("Delete this coupon?")) return;
    await deleteCoupon(button.dataset.deleteCoupon);
    await refreshCoupons();
  }));
}

async function refreshBanners() {
  banners = await getAllBanners();
  $("#banners-table").innerHTML = `
    <thead><tr><th>Banner</th><th>Position</th><th>Status</th><th></th></tr></thead>
    <tbody>${banners.map((banner) => `
      <tr>
        <td><strong>${banner.title}</strong><br><span class="text-white/50">${banner.link || ""}</span></td>
        <td>${banner.position || 1}</td>
        <td>${banner.active === false ? "Hidden" : "Active"}</td>
        <td><button class="btn-soft" data-edit-banner="${banner.id || ""}">Edit</button> ${banner.id ? `<button class="btn-secondary" data-delete-banner="${banner.id}">Delete</button>` : ""}</td>
      </tr>`).join("")}</tbody>`;
  $$("[data-edit-banner]").forEach((button) => button.addEventListener("click", () => fillBanner(banners.find((banner) => banner.id === button.dataset.editBanner))));
  $$("[data-delete-banner]").forEach((button) => button.addEventListener("click", async () => {
    if (!confirm("Delete this banner?")) return;
    await deleteBanner(button.dataset.deleteBanner);
    await refreshBanners();
  }));
}

function openProductModal(product = null) {
  const form = $("#product-form");
  form.reset();
  if (product) {
    form.elements.id.value = product.id;
    form.elements.name.value = product.name || "";
    form.elements.slug.value = product.slug || "";
    form.elements.category.value = product.category || "kurtis";
    form.elements.stock.value = product.stock || 0;
    form.elements.price.value = product.price || 0;
    form.elements.salePrice.value = product.salePrice || "";
    form.elements.sizes.value = (product.sizes || []).join(", ");
    form.elements.colors.value = (product.colors || []).join(", ");
    form.elements.tags.value = (product.tags || []).join(", ");
    form.elements.images.value = (product.images || []).join(", ");
    form.elements.description.value = product.description || "";
    form.elements.featured.checked = Boolean(product.featured || product.tags?.includes("featured"));
  }
  $("#product-modal").classList.add("open");
}

function fillCoupon(coupon) {
  const form = $("#coupon-form");
  form.elements.id.value = coupon.id;
  form.elements.code.value = coupon.code;
  form.elements.type.value = coupon.type;
  form.elements.value.value = coupon.value;
  form.elements.minCart.value = coupon.minCart || 0;
  form.elements.active.checked = coupon.active !== false;
}

function fillBanner(banner) {
  if (!banner) return;
  const form = $("#banner-form");
  form.elements.id.value = banner.id || "";
  form.elements.eyebrow.value = banner.eyebrow || "";
  form.elements.title.value = banner.title || "";
  form.elements.subtitle.value = banner.subtitle || "";
  form.elements.cta.value = banner.cta || "Shop now";
  form.elements.link.value = banner.link || "products/";
  form.elements.position.value = banner.position || 1;
  form.elements.image.value = banner.image || "";
  form.elements.active.checked = banner.active !== false;
}

function stat(label, value) {
  return `<div class="admin-card"><p class="text-white/50">${label}</p><strong class="text-3xl">${value}</strong></div>`;
}

function split(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

async function uploadFiles(files, uploadFn) {
  const realFiles = files.filter((file) => file && file.size);
  return Promise.all(realFiles.map(uploadFn));
}
