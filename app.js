/* ═══════════════════════════════════════════════════════
   FASHION HOOD — app.js
   Core utilities: particles, hero, navigation, search
═══════════════════════════════════════════════════════ */

// ── Product Card Template ─────────────────────────────
function productCard(p) {
  const isOnSale = p.salePrice && p.salePrice < p.price;
  const displayPrice = isOnSale ? p.salePrice : p.price;
  const discount = isOnSale ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
  const img = (p.images && p.images[0]) ? p.images[0] : 'assets/placeholder.jpg';

  return `
    <div class="product-card" onclick="window.location='product.html?id=${p.id}'">
      <div class="product-img">
        <img src="${img}" alt="${p.name}" loading="lazy" />
        ${isOnSale ? `<span class="sale-badge">-${discount}%</span>` : `<span class="new-badge">NEW</span>`}
        <button class="wishlist-btn ${isWishlisted(p.id) ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('${p.id}')" aria-label="Wishlist">
          <svg class="w-4 h-4" fill="${isWishlisted(p.id) ? 'white' : 'none'}" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
        </button>
        <button class="add-cart-btn" onclick="event.stopPropagation(); quickAddToCart('${p.id}', '${p.name}', ${displayPrice}, '${img}')">
          + Add to Cart
        </button>
      </div>
      <div class="product-info">
        <p class="product-name">${p.name}</p>
        <div class="flex items-center gap-1">
          <span class="product-price">₹${displayPrice}</span>
          ${isOnSale ? `<span class="product-price-original">₹${p.price}</span>` : ''}
        </div>
        ${p.colors && p.colors.length > 0 ? `
          <div class="flex gap-1.5 mt-2">
            ${p.colors.slice(0, 4).map(c => `<span style="width:10px;height:10px;border-radius:50%;background:${c};display:inline-block;border:1px solid rgba(255,255,255,0.2)"></span>`).join('')}
            ${p.colors.length > 4 ? `<span style="font-size:9px;color:#9ca3af">+${p.colors.length - 4}</span>` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ── Wishlist ──────────────────────────────────────────
function getWishlist() {
  return JSON.parse(localStorage.getItem('fh_wishlist') || '[]');
}
function isWishlisted(id) {
  return getWishlist().includes(id);
}
function toggleWishlist(id) {
  let wl = getWishlist();
  if (wl.includes(id)) {
    wl = wl.filter(i => i !== id);
    showToast('Removed from wishlist');
  } else {
    wl.push(id);
    showToast('Added to wishlist ♡');
  }
  localStorage.setItem('fh_wishlist', JSON.stringify(wl));
  // Refresh wishlist buttons
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const pid = btn.getAttribute('onclick')?.match(/toggleWishlist\('([^']+)'\)/)?.[1];
    if (pid === id) {
      btn.classList.toggle('active', wl.includes(id));
      btn.querySelector('svg').setAttribute('fill', wl.includes(id) ? 'white' : 'none');
    }
  });
}

// ── Toast ─────────────────────────────────────────────
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.remove('hidden', 'hide');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, duration);
}

// ── Quick Add to Cart ─────────────────────────────────
function quickAddToCart(id, name, price, image) {
  const cart = JSON.parse(localStorage.getItem('fh_cart') || '[]');
  const idx = cart.findIndex(i => i.id === id && !i.size);
  if (idx > -1) {
    cart[idx].qty++;
  } else {
    cart.push({ id, name, price, image, qty: 1, size: '', color: '' });
  }
  localStorage.setItem('fh_cart', JSON.stringify(cart));
  updateCartCount();
  showToast('Added to cart! 🛍️');
}

// ── Cart Count ────────────────────────────────────────
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('fh_cart') || '[]');
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cart-count, #cart-count-mobile').forEach(el => {
    if (el) el.textContent = count;
  });
}

// ── Hero Slider ───────────────────────────────────────
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slide-dot');

function goToSlide(n) {
  slides[currentSlide]?.classList.remove('active');
  dots[currentSlide]?.classList.remove('bg-brand-red', 'w-6');
  dots[currentSlide]?.classList.add('bg-white/30', 'w-2');
  currentSlide = n;
  slides[currentSlide]?.classList.add('active');
  dots[currentSlide]?.classList.add('bg-brand-red', 'w-6');
  dots[currentSlide]?.classList.remove('bg-white/30', 'w-2');
}

if (slides.length > 0) {
  setInterval(() => goToSlide((currentSlide + 1) % slides.length), 5000);
}

// ── Navigation Scroll Effect ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.style.top = '0';
    } else {
      navbar.classList.remove('scrolled');
      navbar.style.top = '2rem';
    }
  }
}, { passive: true });

// ── Mobile Menu ───────────────────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  menu.classList.toggle('hidden');
  document.body.style.overflow = menu.classList.contains('hidden') ? '' : 'hidden';
}

// ── Search ────────────────────────────────────────────
function toggleSearch() {
  const overlay = document.getElementById('search-overlay');
  if (!overlay) return;
  overlay.classList.toggle('hidden');
  if (!overlay.classList.contains('hidden')) {
    setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const search = document.getElementById('search-overlay');
    if (search && !search.classList.contains('hidden')) toggleSearch();
    const menu = document.getElementById('mobile-menu');
    if (menu && !menu.classList.contains('hidden')) toggleMobileMenu();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    toggleSearch();
  }
});

let _searchDebounce;
async function liveSearch(q) {
  clearTimeout(_searchDebounce);
  const resultsEl = document.getElementById('search-results');
  if (!resultsEl) return;
  if (!q || q.length < 2) { resultsEl.classList.add('hidden'); return; }
  _searchDebounce = setTimeout(async () => {
    if (!window._db) { resultsEl.innerHTML = '<p class="p-4 text-gray-500 text-sm">Searching…</p>'; return; }
    const { collection, getDocs, query, where, limit } = window._fbModules;
    try {
      const snap = await getDocs(query(collection(window._db, 'products'), where('active', '==', true), limit(20)));
      const matches = [];
      snap.forEach(doc => {
        const d = { id: doc.id, ...doc.data() };
        if (d.name?.toLowerCase().includes(q.toLowerCase()) || d.category?.toLowerCase().includes(q.toLowerCase()) || d.tags?.some(t => t.toLowerCase().includes(q.toLowerCase()))) {
          matches.push(d);
        }
      });
      if (matches.length === 0) {
        resultsEl.innerHTML = '<p class="p-4 text-gray-500 text-sm text-center">No results found for "' + q + '"</p>';
      } else {
        resultsEl.innerHTML = matches.slice(0, 6).map(p => `
          <a href="product.html?id=${p.id}" class="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors rounded-xl" onclick="toggleSearch()">
            <img src="${p.images?.[0] || 'assets/placeholder.jpg'}" class="w-10 h-10 rounded-lg object-cover bg-white/5" />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white truncate">${p.name}</p>
              <p class="text-xs text-gray-500">₹${p.salePrice || p.price}</p>
            </div>
          </a>
        `).join('');
      }
      resultsEl.classList.remove('hidden');
    } catch(e) {
      resultsEl.innerHTML = '<p class="p-4 text-gray-500 text-sm">Error searching products</p>';
      resultsEl.classList.remove('hidden');
    }
  }, 350);
}

// ── Newsletter ────────────────────────────────────────
async function subscribeNewsletter() {
  const emailEl = document.getElementById('newsletter-email');
  if (!emailEl) return;
  const email = emailEl.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address');
    return;
  }
  if (!window._db) { showToast('Subscribed! ✓'); emailEl.value = ''; return; }
  try {
    const { collection } = window._fbModules;
    const { addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    await addDoc(collection(window._db, 'newsletter'), { email, subscribedAt: serverTimestamp() });
    showToast('Subscribed! You\'re on the list ✓');
    emailEl.value = '';
  } catch(e) {
    showToast('Subscribed! ✓');
    emailEl.value = '';
  }
}

// ── Scroll Reveal ─────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Particle Canvas ───────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: -Math.random() * 0.4 - 0.1,
    alpha: Math.random() * 0.5 + 0.1,
    red: Math.random() > 0.7
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.red
        ? `rgba(200, 16, 46, ${p.alpha})`
        : `rgba(255, 255, 255, ${p.alpha * 0.4})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < 0 || p.x > W) p.dx *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Init ──────────────────────────────────────────────
updateCartCount();
