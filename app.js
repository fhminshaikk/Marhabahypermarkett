// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPIKsBW12YUe6f-Dji-gUJPNlm1aHCUs8",
  authDomain: "marhabahypermarkett-406e1.firebaseapp.com",
  projectId: "marhabahypermarkett-406e1",
  storageBucket: "marhabahypermarkett-406e1.firebasestorage.app",
  messagingSenderId: "440934579028",
  appId: "1:440934579028:web:70afd288e0d3d931bfe6c1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// Business WhatsApp Number
const BUSINESS_WA_NUMBER = "919847283286";

// High quality photo seed catalog
const initialProducts = [
  { id: "1", name: "Noor Jahan Kurva Rice", category: "Rice & Grains", price: 40, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", description: "Premium quality Noor Jahan Kurva rice." },
  { id: "2", name: "Jocker BT Rice", category: "Rice & Grains", price: 90, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400", description: "Clean BT rice grain." },
  { id: "3", name: "Basmati Rice", category: "Rice & Grains", price: 110, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1626500155562-e1cb807753e8?w=400", description: "Aromatic long-grain Basmati rice." },
  { id: "4", name: "Milma Ghee", category: "Snacks & Spices", price: 369, mrp: 407, unit: "500 ml", image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=400", description: "Pure cow ghee." },
  { id: "5", name: "Green Peas", category: "Vegetables", price: 35, mrp: null, unit: "500 gm", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400", description: "Fresh green peas." },
  { id: "6", name: "Tomato (തക്കാളി)", category: "Vegetables", price: 29, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", description: "Fresh farm tomatoes." },
  { id: "7", name: "Potato (കിഴങ്ങ്)", category: "Vegetables", price: 29, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", description: "Fresh potatoes." },
  { id: "8", name: "Big Onion (വലിയ ഉള്ളി)", category: "Vegetables", price: 55, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400", description: "Quality red onions." },
  { id: "9", name: "Ultron Induction Cooktop", category: "Household", price: 2650, mrp: 7999, unit: "1 Pc", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400", description: "Fast electric induction stove." },
  { id: "10", name: "Every Day Milk Powder", category: "Beverages", price: 529, mrp: 580, unit: "1 kg", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", description: "Dairy whitener." }
];

const initialBanners = [
  { id: "b1", title: "Diwali Offer", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200" },
  { id: "b2", title: "Fresh Veggie Fest", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200" }
];

let products = [];
let banners = [];
let cart = [];
let selectedProduct = null;
let selectedQuantity = 1;
let checkoutType = 'single';

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(initialProducts);
  renderBanners(initialBanners);
  products = initialProducts;
  banners = initialBanners;
});

function renderProducts(items) {
  const grid = document.getElementById("products-grid");
  if(!grid) return;
  grid.innerHTML = items.map(prod => `
    <div class="product-card" onclick="openProductModal('${prod.id}')">
      <div class="product-img-wrapper">
        <img src="${prod.image}" alt="${prod.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/150'">
      </div>
      <div class="product-info">
        <h4>${prod.name}</h4>
        <div class="product-unit">${prod.unit}</div>
        <div class="price-row">
          <span class="current-price">₹${prod.price}</span>
          ${prod.mrp ? `<span class="mrp-price">₹${prod.mrp}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat, btnElem) {
  document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
  if (btnElem) btnElem.classList.add("active");

  if (cat === 'All') renderProducts(products);
  else renderProducts(products.filter(p => p.category === cat));
}

function filterProducts() {
  const query = document.getElementById("search-input").value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(query)));
}

function renderBanners(bannerList) {
  const slides = document.getElementById("banner-slides");
  const dots = document.getElementById("banner-dots");
  if(!slides || !dots) return;

  slides.innerHTML = bannerList.map(b => `<img src="${b.image}" class="slide-img" alt="${b.title}">`).join('');
  dots.innerHTML = bannerList.map((_, i) => `<span class="dot ${i===0?'active':''}" onclick="goToSlide(${i})"></span>`).join('');
}

let slideIndex = 0;
setInterval(() => {
  if (banners.length === 0) return;
  slideIndex = (slideIndex + 1) % banners.length;
  const slides = document.getElementById("banner-slides");
  if(slides) slides.style.transform = `translateX(-${slideIndex * 100}%)`;
}, 3500);

function openProductModal(id) {
  selectedProduct = products.find(p => p.id === id);
  if (!selectedProduct) return;
  selectedQuantity = 1;

  document.getElementById("modal-img").src = selectedProduct.image;
  document.getElementById("modal-title").innerText = selectedProduct.name;
  document.getElementById("modal-unit").innerText = selectedProduct.unit;
  document.getElementById("modal-price").innerText = `₹${selectedProduct.price}`;
  document.getElementById("modal-mrp").innerText = selectedProduct.mrp ? `₹${selectedProduct.mrp}` : '';
  document.getElementById("modal-description").innerText = selectedProduct.description || "Fresh quality product.";
  document.getElementById("modal-qty").innerText = selectedQuantity;
  document.getElementById("product-modal").style.display = "flex";
}

function closeProductModal() { document.getElementById("product-modal").style.display = "none"; }

function changeQty(d) {
  if (selectedQuantity + d >= 1) {
    selectedQuantity += d;
    document.getElementById("modal-qty").innerText = selectedQuantity;
  }
}

function addCurrentToCart() {
  const existing = cart.find(i => i.product.id === selectedProduct.id);
  if (existing) existing.qty += selectedQuantity;
  else cart.push({ product: selectedProduct, qty: selectedQuantity });

  updateCartBadge();
  closeProductModal();
}

function updateCartBadge() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cart-badge").innerText = count;
}

function openCartModal() {
  const container = document.getElementById("cart-items-container");
  if (cart.length === 0) {
    container.innerHTML = "<p style='text-align:center; padding: 20px; color: var(--text-muted);'>Your shopping cart is empty!</p>";
    document.getElementById("cart-total-price").innerText = "0";
  } else {
    let total = 0;
    container.innerHTML = cart.map((item, idx) => {
      const subtotal = item.product.price * item.qty;
      total += subtotal;
      return `
        <div class="cart-item-row">
          <div class="cart-item-info">
            <img src="${item.product.image}" class="cart-item-thumb">
            <div>
              <div class="cart-item-title">${item.product.name}</div>
              <div class="cart-item-sub">₹${item.product.price} × ${item.qty}</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <strong>₹${subtotal}</strong>
            <button class="cart-delete-btn" onclick="removeFromCart(${idx})" title="Remove item"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      `;
    }).join('');
    document.getElementById("cart-total-price").innerText = total;
  }
  document.getElementById("cart-modal").style.display = "flex";
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartBadge();
  openCartModal();
}

function closeCartModal() { document.getElementById("cart-modal").style.display = "none"; }

function openOrderModal(type) {
  checkoutType = type;
  if (type === 'cart' && cart.length === 0) return alert("Cart is empty!");
  closeProductModal();
  closeCartModal();
  document.getElementById("order-modal").style.display = "flex";
}

function closeOrderModal() { document.getElementById("order-modal").style.display = "none"; }

function handleBackdropClick(e, modalId) {
  if (e.target.id === modalId) {
    document.getElementById(modalId).style.display = "none";
  }
}

function submitWhatsAppOrder(e) {
  e.preventDefault();
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();

  let detailsText = "";
  let totalAmount = 0;

  if (checkoutType === 'single') {
    totalAmount = selectedProduct.price * selectedQuantity;
    detailsText = `1. *${selectedProduct.name}*\n   Qty: ${selectedQuantity} (${selectedProduct.unit}) = ₹${totalAmount}\n`;
  } else {
    cart.forEach((item, i) => {
      const sub = item.product.price * item.qty;
      totalAmount += sub;
      detailsText += `${i+1}. *${item.product.name}*\n   Qty: ${item.qty} (${item.product.unit}) = ₹${sub}\n`;
    });
  }

  const msg = `🛒 *NEW ORDER - MARHABA HYPERMARKET*\n` +
    `--------------------------------------\n` +
    `👤 *Customer Details:*\n` +
    `• Name: ${name}\n` +
    `• Phone: ${phone}\n` +
    `• Address: ${address}\n\n` +
    `📦 *Order List:*\n${detailsText}\n` +
    `💰 *Total Amount:* ₹${totalAmount}\n` +
    `--------------------------------------\n` +
    `Please process my order!`;

  window.open(`https://wa.me/${BUSINESS_WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  closeOrderModal();
}

function toggleTheme() {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  document.body.setAttribute("data-theme", isDark ? "light" : "dark");
  document.querySelector("#theme-toggle i").className = isDark ? "fas fa-moon" : "fas fa-sun";
}
