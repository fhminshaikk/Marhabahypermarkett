// ==========================================
// 1. FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCPIKsBW12YUe6f-Dji-gUJPNlm1aHCUs8",
  authDomain: "marhabahypermarkett-406e1.firebaseapp.com",
  projectId: "marhabahypermarkett-406e1",
  storageBucket: "marhabahypermarkett-406e1.firebasestorage.app'",
  messagingSenderId: "440934579028",
  appId: "440934579028:web:70afd288e0d3d931bfe6c1"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Business WhatsApp Details
const BUSINESS_WA_NUMBER = "919847283286";

// App State
let products = [];
let banners = [];
let cart = [];
let selectedProduct = null;
let selectedQuantity = 1;
let checkoutType = 'single';
let currentCategory = 'All';

// Seed catalog fallback if database is completely empty
const initialProducts = [
  { id: "1", name: "Noor Jahan Kurva Rice", category: "Rice & Grains", price: 42, mrp: 48, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500", inStock: true, description: "Premium local rice." },
  { id: "2", name: "Jocker BT Rice", category: "Rice & Grains", price: 39, mrp: 45, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500", inStock: true, description: "High quality grain rice." },
  { id: "3", name: "Basmati Rice", category: "Rice & Grains", price: 110, mrp: 130, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500", inStock: true, description: "Long grain aromatic basmati." },
  { id: "4", name: "Milma Ghee", category: "Beverages", price: 290, mrp: 310, unit: "500 ml", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500", inStock: true, description: "Pure fresh Milma ghee." },
  { id: "5", name: "Tomato (തക്കാളി)", category: "Vegetables", price: 28, mrp: 35, unit: "1 kg", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500", inStock: true, description: "Fresh local tomatoes." }
];

const initialBanners = [
  { id: "b1", title: "Daily Fresh Vegetables", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200" },
  { id: "b2", title: "Best Grocery Deals", image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200" }
];

// ==========================================
// 2. INITIALIZATION & REALTIME FIRESTORE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  setupRealtimeListeners();
  
  // Track Auth State for Admin Panel
  auth.onAuthStateChanged(user => {
    const authBox = document.getElementById('admin-auth-container');
    const dashBox = document.getElementById('admin-dashboard-container');
    if (user) {
      if (authBox) authBox.style.display = 'none';
      if (dashBox) dashBox.style.display = 'block';
      renderAdminProductsList();
      renderAdminBannersList();
    } else {
      if (authBox) authBox.style.display = 'block';
      if (dashBox) dashBox.style.display = 'none';
    }
  });
});

function setupRealtimeListeners() {
  // Listen to Products
  db.collection('products').onSnapshot(snapshot => {
    if (snapshot.empty) {
      products = [...initialProducts];
    } else {
      products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });
    }
    renderProducts();
    if (auth.currentUser) renderAdminProductsList();
  }, err => {
    console.warn("Firestore error, falling back to local dataset:", err);
    products = [...initialProducts];
    renderProducts();
  });

  // Listen to Banners
  db.collection('banners').onSnapshot(snapshot => {
    if (snapshot.empty) {
      banners = [...initialBanners];
    } else {
      banners = [];
      snapshot.forEach(doc => {
        banners.push({ id: doc.id, ...doc.data() });
      });
    }
    renderBanners();
    if (auth.currentUser) renderAdminBannersList();
  }, err => {
    banners = [...initialBanners];
    renderBanners();
  });
}

// ==========================================
// 3. STOREFRONT RENDERING LOGIC
// ==========================================
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const searchVal = (document.getElementById('search-input')?.value || '').toLowerCase();

  const filtered = products.filter(p => {
    const matchesCat = currentCategory === 'All' || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchVal) || (p.category && p.category.toLowerCase().includes(searchVal));
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-msg"><i class="fas fa-box-open"></i><p>No products found</p></div>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = `product-card ${p.inStock === false ? 'out-of-stock' : ''}`;
    card.onclick = () => openProductModal(p.id);

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${p.image || 'https://via.placeholder.com/300'}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300'">
        ${p.mrp && p.mrp > p.price ? `<span class="badge-off">SAVE ₹${Math.round(p.mrp - p.price)}</span>` : ''}
        ${p.inStock === false ? `<span class="badge-stock">Out of Stock</span>` : ''}
      </div>
      <div class="card-details">
        <span class="card-cat">${p.category || 'General'}</span>
        <h4 class="card-title">${p.name}</h4>
        <p class="card-unit">${p.unit || ''}</p>
        <div class="card-price-row">
          <span class="card-price">₹${p.price}</span>
          ${p.mrp ? `<span class="card-mrp">₹${p.mrp}</span>` : ''}
        </div>
        <button class="btn btn-add" ${p.inStock === false ? 'disabled' : ''} onclick="event.stopPropagation(); quickAddToCart('${p.id}')">
          <i class="fas fa-plus"></i> Add
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderBanners() {
  const slides = document.getElementById('banner-slides');
  const dots = document.getElementById('banner-dots');
  if (!slides || !dots) return;

  slides.innerHTML = '';
  dots.innerHTML = '';

  banners.forEach((b, idx) => {
    const slide = document.createElement('div');
    slide.className = `slide ${idx === 0 ? 'active' : ''}`;
    slide.style.backgroundImage = `url('${b.image}')`;
    slide.innerHTML = `<div class="banner-caption"><h3>${b.title || ''}</h3></div>`;
    slides.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = `dot ${idx === 0 ? 'active' : ''}`;
    dot.onclick = () => setBannerSlide(idx);
    dots.appendChild(dot);
  });
}

let activeBannerIdx = 0;
function setBannerSlide(idx) {
  const slideElements = document.querySelectorAll('.banner-slider .slide');
  const dotElements = document.querySelectorAll('.banner-slider .dot');
  if (!slideElements.length) return;

  slideElements.forEach(s => s.classList.remove('active'));
  dotElements.forEach(d => d.classList.remove('active'));

  activeBannerIdx = idx % slideElements.length;
  slideElements[activeBannerIdx]?.classList.add('active');
  dotElements[activeBannerIdx]?.classList.add('active');
}

setInterval(() => {
  if (banners.length > 1) setBannerSlide(activeBannerIdx + 1);
}, 4000);

function filterCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

function filterProducts() {
  renderProducts();
}

// ==========================================
// 4. CART & MODALS LOGIC
// ==========================================
function openProductModal(id) {
  selectedProduct = products.find(p => p.id === id);
  if (!selectedProduct) return;

  selectedQuantity = 1;
  document.getElementById('modal-img').src = selectedProduct.image || 'https://via.placeholder.com/300';
  document.getElementById('modal-title').innerText = selectedProduct.name;
  document.getElementById('modal-unit').innerText = selectedProduct.unit || '';
  document.getElementById('modal-price').innerText = `₹${selectedProduct.price}`;
  document.getElementById('modal-mrp').innerText = selectedProduct.mrp ? `₹${selectedProduct.mrp}` : '';
  document.getElementById('modal-description').innerText = selectedProduct.description || '';
  document.getElementById('modal-qty').innerText = selectedQuantity;

  document.getElementById('product-modal').style.display = 'flex';
}

function closeProductModal() {
  document.getElementById('product-modal').style.display = 'none';
}

function changeQty(delta) {
  selectedQuantity = Math.max(1, selectedQuantity + delta);
  document.getElementById('modal-qty').innerText = selectedQuantity;
}

function quickAddToCart(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;
  
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartBadge();
}

function addCurrentToCart() {
  if (!selectedProduct) return;
  const existing = cart.find(c => c.id === selectedProduct.id);
  if (existing) {
    existing.qty += selectedQuantity;
  } else {
    cart.push({ ...selectedProduct, qty: selectedQuantity });
  }
  updateCartBadge();
  closeProductModal();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) badge.innerText = count;
}

function openCartModal() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  container.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-msg">Your shopping cart is empty.</p>';
  } else {
    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price} x ${item.qty} = ₹${itemTotal}</p>
        </div>
        <div class="cart-item-actions">
          <button onclick="updateCartQty('${item.id}', -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
      `;
      container.appendChild(row);
    });
  }

  document.getElementById('cart-total-price').innerText = total;
  document.getElementById('cart-modal').style.display = 'flex';
}

function closeCartModal() {
  document.getElementById('cart-modal').style.display = 'none';
}

function updateCartQty(id, delta) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx !== -1) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
  }
  updateCartBadge();
  openCartModal();
}

function openOrderModal(type) {
  checkoutType = type;
  if (type === 'single') closeProductModal();
  if (type === 'cart') closeCartModal();
  document.getElementById('order-modal').style.display = 'flex';
}

function closeOrderModal() {
  document.getElementById('order-modal').style.display = 'none';
}

function submitWhatsAppOrder(e) {
  e.preventDefault();
  const name = document.getElementById('cust-name').value;
  const phone = document.getElementById('cust-phone').value;
  const address = document.getElementById('cust-address').value;

  let msg = `*NEW ORDER - MARHABA HYPERMARKET*\n\n`;
  msg += `*Customer:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}\n\n*Order Details:*\n`;

  let total = 0;
  if (checkoutType === 'single' && selectedProduct) {
    const sub = selectedProduct.price * selectedQuantity;
    total = sub;
    msg += `• ${selectedProduct.name} (${selectedProduct.unit || ''}) - ₹${selectedProduct.price} x ${selectedQuantity} = ₹${sub}\n`;
  } else {
    cart.forEach(item => {
      const sub = item.price * item.qty;
      total += sub;
      msg += `• ${item.name} - ₹${item.price} x ${item.qty} = ₹${sub}\n`;
    });
  }

  msg += `\n*Total Amount:* ₹${total}`;

  const waUrl = `https://wa.me/${BUSINESS_WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
  
  if (checkoutType === 'cart') {
    cart = [];
    updateCartBadge();
  }
  closeOrderModal();
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}

// ==========================================
// 5. ADMIN AUTHENTICATION & DASHBOARD CRUD
// ==========================================
function openAdminModal() {
  document.getElementById('admin-modal').style.display = 'flex';
}

function closeAdminModal() {
  document.getElementById('admin-modal').style.display = 'none';
}

function adminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const pass = document.getElementById('admin-password').value;

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      alert("Successfully logged into Admin Dashboard!");
    })
    .catch(err => {
      alert("Login Error: " + err.message);
    });
}

function logoutAdmin() {
  auth.signOut().then(() => {
    alert("Logged out of Admin Dashboard.");
  });
}

function switchAdminTab(tab) {
  document.getElementById('admin-tab-products').style.display = tab === 'products' ? 'block' : 'none';
  document.getElementById('admin-tab-banners').style.display = tab === 'banners' ? 'block' : 'none';
  
  document.getElementById('tab-btn-products').classList.toggle('active', tab === 'products');
  document.getElementById('tab-btn-banners').classList.toggle('active', tab === 'banners');
}

// Products CRUD
function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('admin-prod-id').value;
  const name = document.getElementById('admin-prod-name').value;
  const category = document.getElementById('admin-prod-category').value;
  const price = parseFloat(document.getElementById('admin-prod-price').value);
  const mrp = parseFloat(document.getElementById('admin-prod-mrp').value) || null;
  const unit = document.getElementById('admin-prod-unit').value;
  const image = document.getElementById('admin-prod-image').value || 'https://via.placeholder.com/300';
  const description = document.getElementById('admin-prod-desc').value;

  const payload = {
    name, category, price, mrp, unit, image, description,
    inStock: true,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (id) {
    db.collection('products').doc(id).update(payload).then(() => {
      alert("Product updated successfully!");
      resetProductForm();
    }).catch(err => alert("Error updating: " + err.message));
  } else {
    db.collection('products').add(payload).then(() => {
      alert("Product added successfully!");
      resetProductForm();
    }).catch(err => alert("Error adding: " + err.message));
  }
}

function editProduct(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  document.getElementById('admin-prod-id').value = p.id;
  document.getElementById('admin-prod-name').value = p.name;
  document.getElementById('admin-prod-category').value = p.category || 'Rice & Grains';
  document.getElementById('admin-prod-price').value = p.price;
  document.getElementById('admin-prod-mrp').value = p.mrp || '';
  document.getElementById('admin-prod-unit').value = p.unit || '';
  document.getElementById('admin-prod-image').value = p.image || '';
  document.getElementById('admin-prod-desc').value = p.description || '';

  document.getElementById('product-form-title').innerText = "Edit Product: " + p.name;
}

function resetProductForm() {
  document.getElementById('product-form').reset();
  document.getElementById('admin-prod-id').value = '';
  document.getElementById('product-form-title').innerText = "Add New Product";
}

function toggleStockStatus(id, currentStatus) {
  db.collection('products').doc(id).update({ inStock: !currentStatus })
    .then(() => alert("Stock status updated!"))
    .catch(err => alert("Error: " + err.message));
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    db.collection('products').doc(id).delete()
      .then(() => alert("Product deleted!"))
      .catch(err => alert("Error deleting: " + err.message));
  }
}

function renderAdminProductsList() {
  const list = document.getElementById('admin-products-list');
  if (!list) return;
  list.innerHTML = '';

  products.forEach(p => {
    const item = document.createElement('div');
    item.className = 'admin-list-item';
    item.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/80'}" class="admin-item-thumb">
      <div class="admin-item-info">
        <strong>${p.name}</strong>
        <span>₹${p.price} | ${p.category || 'General'} | Stock: ${p.inStock !== false ? 'In Stock' : 'Out of Stock'}</span>
      </div>
      <div class="admin-item-actions">
        <button class="btn-sm btn-edit" onclick="editProduct('${p.id}')"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn-sm btn-stock" onclick="toggleStockStatus('${p.id}', ${p.inStock !== false})"><i class="fas fa-sync"></i> Toggle Stock</button>
        <button class="btn-sm btn-delete" onclick="deleteProduct('${p.id}')"><i class="fas fa-trash"></i> Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

// Banners CRUD
function saveBanner(e) {
  e.preventDefault();
  const title = document.getElementById('admin-banner-title').value;
  const image = document.getElementById('admin-banner-image').value;

  db.collection('banners').add({ title, image }).then(() => {
    alert("Banner added successfully!");
    document.getElementById('banner-form').reset();
  }).catch(err => alert("Error adding banner: " + err.message));
}

function deleteBanner(id) {
  if (confirm("Delete this banner?")) {
    db.collection('banners').doc(id).delete()
      .then(() => alert("Banner deleted!"))
      .catch(err => alert("Error: " + err.message));
  }
}

function renderAdminBannersList() {
  const list = document.getElementById('admin-banners-list');
  if (!list) return;
  list.innerHTML = '';

  banners.forEach(b => {
    const item = document.createElement('div');
    item.className = 'admin-list-item';
    item.innerHTML = `
      <img src="${b.image}" class="admin-banner-thumb">
      <div class="admin-item-info">
        <strong>${b.title || 'Untitled Banner'}</strong>
      </div>
      <div class="admin-item-actions">
        <button class="btn-sm btn-delete" onclick="deleteBanner('${b.id}')"><i class="fas fa-trash"></i> Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
                                       }
        
