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
// Render product grid with Dual Action Buttons (Cart + Direct Buy)
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
        ${p.mrp && p.mrp > p.price ? `<span class="badge-off"><i class="fas fa-tag"></i> SAVE ₹${Math.round(p.mrp - p.price)}</span>` : ''}
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
        <div class="card-actions-dual">
          <button class="btn-card-action btn-add-cart liquid-ripple" ${p.inStock === false ? 'disabled' : ''} onclick="event.stopPropagation(); quickAddToCart('${p.id}')">
            <i class="fas fa-cart-plus"></i> + Cart
          </button>
          <button class="btn-card-action btn-quick-buy liquid-ripple" ${p.inStock === false ? 'disabled' : ''} onclick="event.stopPropagation(); quickBuyNow('${p.id}')">
            <i class="fas fa-bolt"></i> Buy
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Quick Direct Buy action from product card
function quickBuyNow(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;
  selectedProduct = item;
  selectedQuantity = 1;
  openOrderModal('single');
}

      

