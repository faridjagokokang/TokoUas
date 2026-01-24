import { initChat } from './chat.js';
const ADMIN_WA = '6287755466436';
/* ================= STATE ================= */
const state = {
  user: null,
  cart: [],
  orders: []
};

let allProducts = [];

/* ================= ELEMENTS ================= */
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('[data-nav]');
const sideMenu = document.getElementById('sideMenu');
const hamburger = document.getElementById('hamburger');
const cartCount = document.getElementById('cartCount');
const loginBanner = document.getElementById('loginBanner');

/* ================= BOOT ================= */
boot();

function boot() {
  // load storage
  state.user = safeJSON(localStorage.getItem('user'));
  state.cart = safeJSON(localStorage.getItem('cart')) || [];
  state.orders = safeJSON(localStorage.getItem('orders')) || [];

  initChat();
  bindNavigation();
  bindHamburger();

  loadDummyExclusiveTodayProducts();
  loadDummyProducts();
  loadProductCategories();

  bindSearch();
  bindHeroActions();
  bindCheckout();

  renderLoginState();
  updateCartCount();
  renderCart();
  renderOrderList();
}

function safeJSON(str) {
  try { return JSON.parse(str); } catch (e) { return null; }
}

/* ================= NAVIGATION ================= */
function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) page.classList.add('active');

  const hero = document.querySelector('.hero');
  if (hero) hero.style.display = (id === 'home') ? 'grid' : 'none';

  if (sideMenu) sideMenu.classList.add('hidden');

  if (id === 'cart') renderCart();
  if (id === 'orders') renderOrderList();
  if (id === 'profile') renderLoginState();
}


function bindNavigation() {
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.nav;
      if (!target) return;

      showPage(target);

      if (target === 'orders') renderOrderList();
      if (target === 'cart') renderCart();
      if (target === 'profile') renderLoginState();
    });
  });
}

function bindHamburger() {
  if (!hamburger || !sideMenu) return;
  hamburger.addEventListener('click', () => sideMenu.classList.toggle('hidden'));
}

/* ================= LOGIN ================= */
function renderLoginState() {
  const authArea = document.getElementById('authArea');
  if (!authArea) return;

  // refresh user dari storage biar update setelah login
  state.user = safeJSON(localStorage.getItem('user'));

  if (state.user && state.user.username) {
    if (loginBanner) loginBanner.style.display = 'none';
    authArea.innerHTML = `
  <div class="profile-card">
    <div class="profile-avatar">👤</div>
    <b>${state.user.username}</b>
    <p class="profile-role">Pelanggan DapoerUyut</p>
    <button id="logoutBtn">Logout</button>
  </div>
`;

    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('user');
      state.user = null;
      renderLoginState();
      showPage('home');
    });
  } else {
    if (loginBanner) loginBanner.style.display = 'block';
    authArea.innerHTML = `<a href="login.html">Login</a>`;
  }
}

/* ================= CART CORE ================= */
function syncCartFromStorage() {
  const raw = safeJSON(localStorage.getItem('cart')) || [];

  const clean = raw
    .map(r => {
      // kalau ada format lama { product: {...}, qty }
      if (r.product) {
        return {
          id: r.product.id,
          name: r.product.name,
          price: Number(r.product.price),
          img: r.product.img,
          qty: Number(r.qty)
        };
      }
      // format normal {id, name, price, img, qty}
      return {
        id: r.id,
        name: r.name,
        price: Number(r.price),
        img: r.img,
        qty: Number(r.qty)
      };
    })
    .filter(i =>
      i &&
      i.name &&
      Number.isFinite(i.price) &&
      Number.isFinite(i.qty) &&
      i.qty > 0
    );

  state.cart = clean; // 🔥 ini yang penting

  // simpan balik versi bersih biar gak error lagi
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartCount();
}

function updateCartCount() {
  if (!cartCount) return;
  const totalQty = state.cart.reduce((sum, i) => sum + (i.qty || 0), 0);
  cartCount.textContent = totalQty;
}

function addToCart(product) {
  syncCartFromStorage();

  const item = state.cart.find(i => i.id === product.id);
  if (item) item.qty += 1;
  else state.cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });

  saveCart();
  alert('Ditambahkan ke keranjang');
}


/* ================= SEARCH ================= */
function bindSearch() {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) || (p.Desc || '').toLowerCase().includes(q)
    );
    renderCardList('productGrid', filtered);
  });
}

/* ================= PRODUCTS ================= */
function loadDummyExclusiveTodayProducts() {
  const products = [
    { id:1001, img:'gambar/crispy-hemat.jpg', name:'Paket Crispy Hemat', price:25000, Desc:'1 pcs ayam + nasi' },
    { id:1002, img:'gambar/keluarga-cuan.jpg', name:'Paket Keluarga', price:75000, Desc:'4 pcs ayam + nasi' },
    { id:1003, img:'gambar/lezat.jpg', name:'Paket Lezat', price:20000, Desc:'1 pcs ayam + nasi + Red Velvet Coffee 1 + Yakult Mangga 1' },
    { id:1004, img:'gambar/segar-gigit.jpg', name:'Paket Segar Gigit', price:40000, Desc:'1 pcs burger + 1 Green Tea Lemon' },
    { id:1005, img:'gambar/paket-frozeen-food.jpg', name:'Paket Frozen Food', price:60000, Desc:'paket frozen mix' },
  ];
  renderCardList('productToday', products);
}

function loadDummyProducts() {
  const products = [
    { id: 1, img: 'gambar/ayam-penuts-sauce.jpg', name: 'Ayam Penuts Sauce', price: 15000, Desc: 'Ayam dengan saus kacang', category: 'makanan' },
    { id: 2, img: 'gambar/ayam-bakar.jpg', name: 'Ayam Bakar', price: 80000, Desc: 'Ayam bakar dengan bumbu khas.', category: 'makanan' },
    { id: 3, img: 'gambar/ayam-katsu.jpg', name: 'Ayam Katsu', price: 25000, Desc: 'Ayam goreng tepung ala Jepang.', category: 'makanan' },
    { id: 4, img: 'gambar/berger.jpg', name: 'Burger', price: 30000, Desc: 'Burger dengan daging sapi dan sayuran segar.', category: 'makanan' },
    { id: 5, img: 'gambar/kentang-goreng.jpg', name: 'Kentang Goreng', price: 15000, Desc: 'Kentang goreng renyah dan gurih.', category: 'makanan' },
    { id: 6, img: 'gambar/americano.jpg', name: 'Americano', price: 20000, Desc: 'Kopi Americano dengan rasa khas.', category: 'minuman' },
    { id: 7, img: 'gambar/cappucino.jpg', name: 'Cappucino', price: 25000, Desc: 'Cappucino dengan busa susu lembut.', category: 'minuman' },
    { id: 8, img: 'gambar/caramel-coffee-milk.jpg', name: 'Caramel Coffee Milk', price: 28000, Desc: 'Kopi karamel dengan susu yang lembut.', category: 'minuman' },
    { id: 9, img: 'gambar/sushi-garing-keranjang.jpg', name: 'Ikan Asin Keranjangan', price: 10000, Desc: 'Asin, Gurih, dan Maknyus', category: 'frozen' },
    { id: 10, img: 'gambar/sushi-garing-lendra.jpg', name: 'Ikan Asin lendra', price: 20000, Desc: 'Gurih dan mantap', category: 'frozen' },
    { id: 11, img: 'gambar/sushi-garing-teri.jpg', name: 'Ikan Asin Teri', price: 20000, Desc: 'Gurih dan mantap', category: 'frozen' },
    { id: 12, img: 'gambar/sushi-garing-peda.jpg', name: 'Ikan Asin peda', price: 30000, Desc: 'Gurih dan mantap', category: 'frozen' },
    { id: 13, img: 'gambar/teh-tarik-bakar.jpg', name: 'Teh Tarik Bakar', price: 15000, Desc: 'Seger dan cihuy', category: 'minuman' },
    { id: 14, img: 'gambar/teh-tarik.jpg', name: 'Teh Tarik', price: 5000, Desc: 'Seger dan cihuy', category: 'minuman' },
    { id: 15, img: 'gambar/vietnam-drip.jpg', name: 'Vietnam Drip', price: 20000, Desc: 'Seger dan cihuy', category: 'minuman' },
    { id: 16, img: 'gambar/red-velvet-coffee.jpg', name: 'Red Velvet Coffee', price: 20000, Desc: 'Seger dan cihuy', category: 'minuman' },
    { id: 17, img: 'gambar/yakult-light-1-pack.jpg', name: 'Yakult Light 1 Pack', price: 12000, Desc: 'Seger dan cihuy', category: 'minuman' },
    { id: 18, img: 'gambar/yakult-mangga.jpg', name: 'Yakult Mangga 1 Pack', price: 12000, Desc: 'Seger dan cihuy', category: 'minuman' },
    { id: 19, img: 'gambar/yakult-original.jpg', name: 'Yakult Original 1 Pack', price: 12000, Desc: 'Seger dan cihuy', category: 'minuman' },
    { id: 20, img: 'gambar/green-tea-with-lemon.jpg', name: 'Green Tea With Lemon', price: 10000, Desc: 'Seger dan cihuy', category: 'minuman' },
    { id: 21, img: 'gambar/lemon-tea.jpg', name: 'Lemon Tea', price: 10000, Desc: 'Seger dan cihuy', category: 'minuman' },
    { id: 22, img: 'gambar/lychee-tea.jpg', name: 'Lychee Tea', price: 15000, Desc: 'Seger dan cihuy', category: 'minuman' },
    { id: 23, img: 'gambar/ayam-potong-kiloan.jpg', name: 'Ayam Potong Kiloan', price: 25000, Desc: 'Ayam potong kualitas terbaik', category: 'frozen' },
    { id: 24, img: 'gambar/ayam-potong-utuh.jpg', name: 'Ayam Potong Utuh', price: 50000, Desc: 'Ayam potong utuh segar', category: 'frozen' },
    { id: 25, img: 'gambar/sayap-ayam-beku.jpg', name: 'Sayap Ayam Beku', price: 15000, Desc: 'Sayap ayam beku segar', category: 'frozen' }
  ];

  allProducts = products;
  renderCardList('productGrid', products);
}

function loadProductCategories() {
  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'makanan', name: 'Makanan' },
    { id: 'minuman', name: 'Minuman' },
    { id: 'frozen', name: 'Frozen Food' }
  ];

  const el = document.getElementById('productCategories');
  if (!el) return;
  el.innerHTML = '';

  categories.forEach(cat => {
    const d = document.createElement('div');
    d.className = 'category' + (cat.id === 'all' ? ' active' : '');
    d.dataset.category = cat.id;
    d.textContent = cat.name;
    el.appendChild(d);
  });

  el.addEventListener('click', e => {
    const cat = e.target?.dataset?.category;
    if (!cat) return;

    document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');

    const filtered = (cat === 'all') ? allProducts : allProducts.filter(p => p.category === cat);
    renderCardList('productGrid', filtered);
  });
}

function renderCardList(targetId, products) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  grid.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}">
      <div class="content">
        <h4>${p.name}</h4>
        <p class="price">Rp ${p.price.toLocaleString()}</p>
        <p>${p.Desc || ''}</p>
        <div class="actions">
          <button class="btn-cart">Keranjang</button>
          <button class="btn-buy">Beli</button>
        </div>
      </div>
    `;

    card.querySelector('.btn-cart').addEventListener('click', () => addToCart(p));
    card.querySelector('.btn-buy').addEventListener('click', () => {
      addToCart(p);
      showPage('cart');
      renderCart();
    });

    grid.appendChild(card);
  });
}

/* ================= CART RENDER ================= */
function renderCart() {
  const wrap = document.getElementById('cartItems');
  const totalEl = document.getElementById('total');
  if (!wrap || !totalEl) return;

  syncCartFromStorage();
  let cart = state.cart;

  wrap.innerHTML = '';
  let total = 0;

  // 🧹 FILTER ITEM RUSAK
  cart = cart
    .map(raw => {
      if (raw.product) {
        return {
          id: raw.product.id,
          name: raw.product.name,
          price: Number(raw.product.price),
          img: raw.product.img,
          qty: Number(raw.qty)
        };
      }
      return {
        id: raw.id,
        name: raw.name,
        price: Number(raw.price),
        img: raw.img,
        qty: Number(raw.qty)
      };
    })
    .filter(item =>
      item &&
      item.name &&
      Number.isFinite(item.price) &&
      Number.isFinite(item.qty) &&
      item.qty > 0
    );

  // simpan cart bersih
  localStorage.setItem('cart', JSON.stringify(cart));

  if (cart.length === 0) {
    wrap.innerHTML = `<p style="text-align:center;opacity:.6">Keranjang kosong</p>`;
    totalEl.textContent = '0';
    return;
  }

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'cart-card';
    div.innerHTML = `
      <img src="${item.img}" class="cart-img">
      <div class="cart-info">
        <b>${item.name}</b>
        <div>Rp ${item.price.toLocaleString()}</div>
        <div class="cart-actions">
          <button class="dec">−</button>
          <span>${item.qty}</span>
          <button class="inc">+</button>
        </div>
      </div>
    `;

    div.querySelector('.inc').onclick = () => {
      cart[index].qty++;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateCartCount();
    };

    div.querySelector('.dec').onclick = () => {
      cart[index].qty--;
      if (cart[index].qty <= 0) cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateCartCount();
    };

    wrap.appendChild(div);
  });

  totalEl.textContent = total.toLocaleString();
}



/* ================= CHECKOUT ================= */
function bindCheckout() {
  const checkoutBtn = document.getElementById('submitOrder');
  if (!checkoutBtn) return;

  const checkoutName = document.getElementById('checkoutName');
  const checkoutAddress = document.getElementById('checkoutAddress');
  const checkoutPhone = document.getElementById('checkoutPhone');
  const checkoutNote = document.getElementById('checkoutNote');
  const paymentMethod = document.getElementById('paymentMethod');
  const shippingMethod = document.getElementById('shippingMethod');

  checkoutBtn.addEventListener('click', () => {
    // refresh user dari storage
    state.user = safeJSON(localStorage.getItem('user'));
    if (!state.user) {
      alert('Login dulu sebelum checkout!');
      window.location.href = 'login.html';
      return;
    }

    // validasi keranjang
    if (!state.cart || state.cart.length === 0) {
      return alert('Keranjang kosong!');
    }

    // ambil data input
    const name = checkoutName.value.trim();
    const address = checkoutAddress.value.trim();
    const phone = checkoutPhone.value.trim();
if (!phone) return alert('Nomor WhatsApp wajib diisi');
    const note = checkoutNote.value.trim();
    const payment = paymentMethod.value;
    const shipping = shippingMethod.value;

    // validasi input
    if (!name || !address || !phone || !payment || !shipping) {
      return alert('Lengkapi semua data sebelum checkout!');
    }

    // biaya ongkir
    const shippingCost = shipping === 'JNE' ? 10000 : shipping === 'TIKI' ? 12000 : 8000;

    // siapkan items
    const items = state.cart.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      qty: i.qty,
      subtotal: i.price * i.qty
    }));

    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    const total = subtotal + shippingCost;

    const now = new Date();
    const invoice = `INV-${now.getTime()}`;

    // buat order object
    const order = {
      invoice,
      customer: { name, address, phone },
      note,
      items,
      subtotal,
      payment,
      shipping,
      shippingCost,
      total,
      status: 'Menunggu konfirmasi',
      date: now.toLocaleString()
    };

    // simpan order
    state.orders.push(order);
    localStorage.setItem('orders', JSON.stringify(state.orders));

    // kosongkan cart
    state.cart = [];
    saveCart();
    renderCart();
    renderOrderList();

    alert('Pesanan berhasil dibuat!');

    // kirim WA ke admin
    sendInvoiceToWA(order);

    // kirim WA ke pelanggan
    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(
      `Halo ${name} 👋\nPesanan kamu berhasil dibuat!\nInvoice: ${invoice}\nTotal: Rp ${total.toLocaleString()}`
    )}`;
    window.open(waLink, '_blank');


    // kembali ke halaman home
    showPage('home');
  });
}

/* ================= ORDER HISTORY ================= */
function renderOrderList() {
  const wrap = document.getElementById('orderList');
  if (!wrap) return;

  wrap.innerHTML = '';
  if (state.orders.length === 0) {
    wrap.innerHTML = '(Belum ada pesanan)';
    return;
  }

  state.orders.slice().reverse().forEach(order => {
    const div = document.createElement('div');
    div.className = 'cart-card';
    div.innerHTML = `
      <b>Invoice: ${order.invoice}</b>
      <div>${order.date}</div>
      <div>Status: ${order.status}</div>
      <div>Total: Rp ${order.total.toLocaleString()}</div>
      <button class="btn-inv">Lihat Invoice</button>
      ${order.status === 'Menunggu konfirmasi'
    ? `<button class="btn-confirm">Konfirmasi</button>`
    : ''}
    `;
    div.querySelector('.btn-inv').addEventListener('click', () => showInvoice(order.invoice));
    wrap.appendChild(div);
    div.querySelector('.btn-inv').onclick = () =>
  showInvoice(order.invoice);

const confirmBtn = div.querySelector('.btn-confirm');
if (confirmBtn) {
  confirmBtn.onclick = () => confirmOrder(order.invoice);
}

  });
}

function confirmOrder(invoice) {
  if (!confirm('Konfirmasi pesanan ini?')) return;

  const order = state.orders.find(o => o.invoice === invoice);
  if (!order) return;

  order.status = 'Dikonfirmasi';
  localStorage.setItem('orders', JSON.stringify(state.orders));
  renderOrderList();

  const buyerWA = order.customer.phone;

  const msg = `
Halo ${order.customer.name} 👋
Pesanan kamu sudah *DIKONFIRMASI* ✅

Invoice: ${order.invoice}
Total: Rp ${order.total.toLocaleString()}

Pesanan sedang diproses 🍽️
Terima kasih 🙏
  `.trim();

  window.open(
  `https://wa.me/${order.customer.wa}?text=${encodeURIComponent(msg)}`,
  '_blank'
);
}



/* ================= INVOICE ================= */
function showInvoice(invoiceNumber) {
  const order = state.orders.find(o => o.invoice === invoiceNumber);
  if (!order) return alert('Invoice tidak ditemukan');

  const modal = document.getElementById('invoiceModal');
  const body = document.getElementById('invoiceBody');
  if (!modal || !body) return;

  const waText = `
INVOICE ${order.invoice}
Nama: ${order.customer.name}
Alamat: ${order.customer.address}

Total: Rp ${order.total.toLocaleString()}
  `.trim();

  body.innerHTML = `
    <h2>INVOICE</h2>
    <p>No: ${order.invoice}</p>
    <p>Nama: ${order.customer.name}</p>
    <p>Alamat: ${order.customer.address}</p>
    <hr>
    ${order.items.map(i => `
      <div style="display:flex;justify-content:space-between">
        <span>${i.name} x${i.qty}</span>
        <span>Rp ${i.subtotal.toLocaleString()}</span>
      </div>
    `).join('')}
    <hr>
    <h3>Total: Rp ${order.total.toLocaleString()}</h3>

    <a 
      href="https://wa.me/?text=${encodeURIComponent(waText)}"
      target="_blank"
      style="display:block;margin-top:12px"
    >
      📲 Kirim Invoice ke WhatsApp Saya
    </a>

    <button onclick="window.print()">Print</button>
  `;

  modal.classList.remove('hidden');
}


/* ================= WHATSAPP ================= */
function sendInvoiceToWA(order) {
  const itemsText = order.items.map(i =>
    `- ${i.name} x${i.qty} = Rp ${i.subtotal.toLocaleString()}`
  ).join('\n');

  const message = `
*INVOICE DAPOERUYUT*
No: ${order.invoice}

Nama: ${order.customer.name}
Alamat: ${order.customer.address}

Pesanan:
${itemsText}

Total: Rp ${order.total.toLocaleString()}
  `.trim();

  // ✅ ADMIN
  window.open(
    `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(
      message + '\n\n🔔 ORDER BARU'
    )}`,
    '_blank'
  );
}


/* ================= HERO ================= */
function bindHeroActions() {
  document.getElementById('heroOrderBtn')?.addEventListener('click', () => showPage('products'));
  document.getElementById('heroMenuBtn')?.addEventListener('click', () => showPage('home'));
}
