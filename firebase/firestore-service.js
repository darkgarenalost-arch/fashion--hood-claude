import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { auth, db, firebaseReady, storage, brandConfig } from "./firebase-config.js";
import { fallbackBanners, fallbackProducts } from "../js/data.js";
import { slugify } from "../js/utils.js";

const byCreatedDesc = (items) => items.sort((a, b) => Number(b.createdAt?.seconds || 0) - Number(a.createdAt?.seconds || 0));

export async function getProducts(filters = {}) {
  if (!firebaseReady) return filterFallbackProducts(filters);
  const snapshot = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
  let products = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  if (filters.category) products = products.filter((item) => item.category === filters.category);
  if (filters.featured) products = products.filter((item) => item.featured || item.tags?.includes("featured"));
  if (filters.tag) products = products.filter((item) => item.tags?.includes(filters.tag));
  if (filters.limit) products = products.slice(0, filters.limit);
  return products;
}

export async function getProductBySlug(slug) {
  if (!firebaseReady) return fallbackProducts.find((product) => product.slug === slug || product.id === slug);
  const snapshot = await getDocs(query(collection(db, "products"), where("slug", "==", slug), limit(1)));
  if (!snapshot.empty) return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  const direct = await getDoc(doc(db, "products", slug));
  return direct.exists() ? { id: direct.id, ...direct.data() } : null;
}

export async function saveProduct(payload, id = null) {
  ensureFirebase();
  const product = {
    ...payload,
    slug: payload.slug || slugify(payload.name),
    price: Number(payload.price || 0),
    salePrice: Number(payload.salePrice || 0),
    stock: Number(payload.stock || 0),
    featured: Boolean(payload.featured),
    updatedAt: serverTimestamp()
  };
  if (id) {
    await updateDoc(doc(db, "products", id), product);
    return id;
  }
  const created = await addDoc(collection(db, "products"), { ...product, createdAt: serverTimestamp() });
  return created.id;
}

export async function deleteProduct(id) {
  ensureFirebase();
  await deleteDoc(doc(db, "products", id));
}

export async function uploadProductImage(file) {
  ensureFirebase();
  const safeName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "-").toLowerCase()}`;
  const imageRef = ref(storage, `products/${safeName}`);
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
}

export async function deleteImageByUrl(url) {
  ensureFirebase();
  await deleteObject(ref(storage, url));
}

export async function getBanners() {
  if (!firebaseReady) return fallbackBanners;
  const snapshot = await getDocs(query(collection(db, "banners"), orderBy("position", "asc")));
  const banners = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).filter((banner) => banner.active !== false);
  return banners.length ? banners : fallbackBanners;
}

export async function getAllBanners() {
  if (!firebaseReady) return fallbackBanners;
  const snapshot = await getDocs(query(collection(db, "banners"), orderBy("position", "asc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function saveBanner(payload, id = null) {
  ensureFirebase();
  const data = { ...payload, position: Number(payload.position || 1), active: payload.active !== false, updatedAt: serverTimestamp() };
  if (id) {
    await updateDoc(doc(db, "banners", id), data);
    return id;
  }
  const created = await addDoc(collection(db, "banners"), { ...data, createdAt: serverTimestamp() });
  return created.id;
}

export async function deleteBanner(id) {
  ensureFirebase();
  await deleteDoc(doc(db, "banners", id));
}

export async function createOrder(order) {
  ensureFirebase();
  const created = await addDoc(collection(db, "orders"), {
    ...order,
    status: "Placed",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return created.id;
}

export async function getOrders() {
  ensureFirebase();
  const snapshot = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function updateOrderStatus(id, status) {
  ensureFirebase();
  await updateDoc(doc(db, "orders", id), { status, updatedAt: serverTimestamp() });
}

export async function getCoupons() {
  if (!firebaseReady) return [];
  const snapshot = await getDocs(query(collection(db, "coupons"), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function deleteCoupon(id) {
  ensureFirebase();
  await deleteDoc(doc(db, "coupons", id));
}

export async function saveCoupon(payload, id = null) {
  ensureFirebase();
  const data = {
    code: String(payload.code || "").toUpperCase(),
    type: payload.type || "percent",
    value: Number(payload.value || 0),
    minCart: Number(payload.minCart || 0),
    active: payload.active !== false,
    updatedAt: serverTimestamp()
  };
  if (id) {
    await updateDoc(doc(db, "coupons", id), data);
    return id;
  }
  const created = await addDoc(collection(db, "coupons"), { ...data, createdAt: serverTimestamp() });
  return created.id;
}

export async function validateCoupon(code, subtotal) {
  if (!firebaseReady || !code) return null;
  const snapshot = await getDocs(query(collection(db, "coupons"), where("code", "==", String(code).toUpperCase()), limit(1)));
  if (snapshot.empty) return null;
  const coupon = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  if (!coupon.active || subtotal < Number(coupon.minCart || 0)) return null;
  const discount = coupon.type === "flat" ? Number(coupon.value || 0) : Math.round(subtotal * Number(coupon.value || 0) / 100);
  return { ...coupon, discount: Math.min(discount, subtotal) };
}

export async function getSiteSettings() {
  if (!firebaseReady) return {};
  const snapshot = await getDoc(doc(db, "settings", "site"));
  return snapshot.exists() ? snapshot.data() : {};
}

export async function saveSiteSettings(payload) {
  ensureFirebase();
  await setDoc(doc(db, "settings", "site"), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export async function uploadBrandAsset(file, folder = "branding") {
  ensureFirebase();
  const safeName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "-").toLowerCase()}`;
  const imageRef = ref(storage, `${folder}/${safeName}`);
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
}

export function loginAdmin(email, password) {
  ensureFirebase();
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutAdmin() {
  if (!auth) return Promise.resolve();
  return signOut(auth);
}

export function watchAdmin(callback) {
  if (!auth) {
    callback(null, false);
    return () => {};
  }
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return callback(null, false);
    const configuredAdmin = brandConfig.adminUids.includes(user.uid);
    let firestoreAdmin = false;
    try {
      firestoreAdmin = (await getDoc(doc(db, "admins", user.uid))).exists();
    } catch {
      firestoreAdmin = false;
    }
    callback(user, configuredAdmin || firestoreAdmin);
  });
}

export async function getDashboardStats() {
  if (!firebaseReady) return { revenue: 0, orders: 0, products: fallbackProducts.length, lowStock: 0 };
  const [orders, products] = await Promise.all([getOrders(), getProducts()]);
  return {
    revenue: orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    orders: orders.length,
    products: products.length,
    lowStock: products.filter((product) => Number(product.stock || 0) <= 5).length
  };
}

function filterFallbackProducts(filters) {
  let products = [...fallbackProducts];
  if (filters.category) products = products.filter((item) => item.category === filters.category);
  if (filters.featured) products = products.filter((item) => item.tags?.includes("featured"));
  if (filters.tag) products = products.filter((item) => item.tags?.includes(filters.tag));
  if (filters.limit) products = products.slice(0, filters.limit);
  return byCreatedDesc(products);
}

function ensureFirebase() {
  if (!firebaseReady) {
    throw new Error("Add Firebase config in firebase/firebase-config.js before using live admin or checkout features.");
  }
}
