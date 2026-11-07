// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Business WhatsApp Number
const BUSINESS_WA_NUMBER = "919847283286";

// Initial Seed Data (Fallback if Firestore empty)
const initialProducts = [
  // Page 1 (Festive Specials)
  { id: "1", name: "Noor Jahan Kurva Rice", category: "Rice & Grains", price: 40, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", rating: 5, description: "Premium quality Noor Jahan Kurva rice for daily home cooking." },
  { id: "2", name: "Jocker BT Rice", category: "Rice & Grains", price: 90, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", rating: 4, description: "Fine grain BT Rice with excellent aroma and clean texture." },
  { id: "3", name: "Basmati Rice", category: "Rice & Grains", price: 110, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", rating: 5, description: "Long grain aromatic Basmati rice perfect for Biryani." },
  { id: "4", name: "Milma Ghee", category: "Snacks & Spices", price: 369, mrp: 407, unit: "500 ml", image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=400", rating: 5, description: "Pure Milma Cow Ghee with rich traditional taste." },
  { id: "5", name: "Green Peas", category: "Vegetables", price: 35, mrp: null, unit: "500 gm", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400", rating: 4, description: "Fresh high-grade green peas." },
  { id: "6", name: "Cheru Payar", category: "Vegetables", price: 60, mrp: null, unit: "500 gm", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400", rating: 4, description: "Clean green gram (Cheru payar) rich in protein." },
  { id: "7", name: "Malli Tip Top", category: "Snacks & Spices", price: 199, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400", rating: 5, description: "Top-quality coriander seeds." },
  { id: "8", name: "Vattal Mulak", category: "Snacks & Spices", price: 280, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400", rating: 4, description: "Sun-dried spicy red chillies." },
  { id: "9", name: "Every Day Milk Powder", category: "Beverages", price: 529, mrp: 580, unit: "1 kg", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", rating: 5, description: "Nestle Everyday dairy whitener." },
  { id: "10", name: "Boost Jar", category: "Beverages", price: 239, mrp: 264, unit: "500 gm", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", rating: 4, description: "Energy release health drink powder." },
  { id: "11", name: "Horlicks Jar", category: "Beverages", price: 239, mrp: 264, unit: "500 gm", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", rating: 4, description: "Nourishing malted health drink." },
  { id: "12", name: "Yippee Noodles 18-in-1", category: "Snacks & Spices", price: 199, mrp: 270, unit: "1260 gm", image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400", rating: 5, description: "Sunfeast Yippee magic masala family pack." },
  { id: "13", name: "Elite Chakki Atta", category: "Rice & Grains", price: 289, mrp: 347, unit: "5 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", rating: 5, description: "Whole wheat flour for soft rotis." },
  { id: "14", name: "Ajmi Puttu Podi", category: "Rice & Grains", price: 339, mrp: 447, unit: "5 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", rating: 4, description: "Traditional steamed rice flour for puttu." },
  { id: "15", name: "Ajmi Rice Powder", category: "Rice & Grains", price: 319, mrp: 447, unit: "5 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", rating: 4, description: "Fine roasted rice flour for appam/idiyappam." },
  { id: "16", name: "Swarnam Puttu Podi", category: "Rice & Grains", price: 59, mrp: 85, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", rating: 4, description: "Quality white rice puttu flour." },
  { id: "17", name: "Pureheart Spread", category: "Snacks & Spices", price: 269, mrp: 399, unit: "350 gm", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400", rating: 5, description: "Delicious chocolate nut spread with extra cocoa." },
  { id: "18", name: "Munch Pouch", category: "Snacks & Spices", price: 79, mrp: 100, unit: "1 Pouch", image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400", rating: 4, description: "Crunchy chocolate bites." },
  { id: "19", name: "Craze Cardamom Fresh", category: "Snacks & Spices", price: 99, mrp: 130, unit: "1 Pack", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400", rating: 5, description: "Aromatic green cardamom." },
  { id: "20", name: "Dark Fantasy Cream", category: "Snacks & Spices", price: 99, mrp: 133, unit: "Family Pack", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", rating: 5, description: "Rich choco filled biscuits." },

  // Page 3 (Fresh Veggies)
  { id: "21", name: "Tomato (തക്കാളി)", category: "Vegetables", price: 29, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", rating: 5, description: "Fresh juicy farm tomatoes." },
  { id: "22", name: "Potato (കിഴങ്ങ്)", category: "Vegetables", price: 29, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", rating: 4, description: "Clean fresh potatoes." },
  { id: "23", name: "Big Onion (വലിയ ഉള്ളി)", category: "Vegetables", price: 55, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400", rating: 4, description: "Quality red onions." },
  { id: "24", name: "Ladies Finger (വെണ്ട)", category: "Vegetables", price: 29, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400", rating: 4, description: "Tender fresh okra." },
  { id: "25", name: "Long Beans (പയർ)", category: "Vegetables", price: 39, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400", rating: 5, description: "Crispy green long beans." },
  { id: "26", name: "Ash Gourd (ഇളവൻ)", category: "Vegetables", price: 29, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400", rating: 4, description: "Fresh ash gourd melon." },
  { id: "27", name: "Cucumber (കക്കരി)", category: "Vegetables", price: 19, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400", rating: 4, description: "Cool green salad cucumbers." },
  { id: "28", name: "Cabbage (കാബേജ്)", category: "Vegetables", price: 19, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400", rating: 4, description: "Crisp leafy green cabbage." },
  { id: "29", name: "Pumpkin (മത്തൻ)", category: "Vegetables", price: 19, mrp: null, unit: "1 kg", image: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400", rating: 5, description: "Sweet ripe yellow pumpkin." },

  // Page 2 (Household & Cookware)
  { id: "30", name: "Ultron Infra Induction Cooktop", category: "Household", price: 2650, mrp: 7999, unit: "1 Pc", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400", rating: 5, description: "High efficiency induction stove." },
  { id: "31", name: "Sujata Supermix 3 Jar", category: "Household", price: 5799, mrp: 9630, unit: "1 Set", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400", rating: 5, description: "Heavy duty 900W mixer grinder." },
  { id: "32", name: "Mr Butler Mixer Grinder MC750", category: "Household", price: 2899, mrp: 4950, unit: "1 Set", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400", rating: 4, description: "750W durable kitchen mixer." },
  { id: "33", name: "Nolta Electric Kettle 1.5L", category: "Household", price: 699, mrp: 1390, unit: "1 Pc", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?w=400", rating: 4, description: "Stainless steel fast water kettle." },
  { id: "34", name: "Larah Silk 23 Pcs Dinner Set", category: "Household", price: 999, mrp: 3235, unit: "1 Box", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400", rating: 5, description: "Opalescent elegant dinnerware set." }
];

const initialBanners = [
  { id: "b1", title: "Diwali Offer - Festive Savings", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200" },
  { id: "2", title: "Fresh Veggie Melat (പച്ചക്കറി മേള)", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200" }
];

// App State
let products = [];
let banners = [];
let cart = [];
let selectedProduct = null;
let selectedQuantity = 1;
let checkoutType = 'single'; // 'single' or 'cart'

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

function loadData() {
  // Listen to products in Firestore
  db.collection("products").onSnapshot(snapshot => {
    if (snapshot.empty) {
      products = initialProducts;
    } else {
      products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    renderProducts(products);
    renderAdminProducts();
  }, err => {
    console.warn("Firestore access error, fallback to initial state:", err);
    products = initialProducts;
    renderProducts(products);
  });

  // Listen to banners in Firestore
  db.collection("banners").onSnapshot(snapshot => {
    if (snapshot.empty) {
      banners = initialBanners;
    } else {
      banners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    renderBanners(banners);
    renderAdminBanners();
  }, err => {
    banners = initialBanners;
    renderBanners(banners);
  });
}

// Render Products Grid
function renderProducts(items) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = items.map(prod => `
    <div class="product-card" onclick="openProductModal('${prod.id}')">
      <div class="product-img-wrapper">
        <img src="${prod.image}" alt="${prod.name}" onerror="this.src='https://via.placeholder.com/150'">
      </div>
      <div class="product-info">
        <h4>${prod.name}</h4>
        <div class="product-unit">${prod.unit}</div>
        <div class="rating-stars">${'★'.repeat(prod.rating || 5)}</div>
        <div class="price-row">
          <span class="current-price">₹${prod.price}</span>
          ${prod.mrp ? `<span class="mrp-price">₹${prod.mrp}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// Category Filter
function filterCategory(cat, btnElem) {
  document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
  if (btnElem) btnElem.classList.add("active");

  if (cat === 'All') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === cat);
    renderProducts(filtered);
  }
}

// Search Filter
function filterProducts() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.category.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}

// Render Banners Slider
function renderBanners(bannerList) {
  const slides = document.getElementById("banner-slides");
  const dots = document.getElementById("banner-dots");
  
  if (bannerList.length === 0) return;

  slides.innerHTML = bannerList.map(b => `
    <img src="${b.image}" class="slide-img" alt="${b.title}">
  `).join('');

  dots.innerHTML = bannerList.map((_, idx) => `
    <span class="dot ${idx === 0 ? 'active' : ''}" onclick="goToSlide(${idx})"></span>
  `).join('');

  startAutoSlide();
}

let slideIndex = 0;
let slideInterval = null;

function startAutoSlide() {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    slideIndex = (slideIndex + 1) % banners.length;
    updateSlidePosition();
  }, 3500);
}

function updateSlidePosition() {
  const slides = document.getElementById("banner-slides");
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("active", i === slideIndex);
  });
}

function goToSlide(idx) {
  slideIndex = idx;
  updateSlidePosition();
}

// Product Modal
function openProductModal(prodId) {
  selectedProduct = products.find(p => p.id === prodId);
  if (!selectedProduct) return;
  selectedQuantity = 1;

  document.getElementById("modal-img").src = selectedProduct.image;
  document.getElementById("modal-title").innerText = selectedProduct.name;
  document.getElementById("modal-unit").innerText = selectedProduct.unit;
  document.getElementById("modal-price").innerText = `₹${selectedProduct.price}`;
  document.getElementById("modal-mrp").innerText = selectedProduct.mrp ? `₹${selectedProduct.mrp}` : '';
  document.getElementById("modal-description").innerText = selectedProduct.description || "Fresh & guaranteed top quality product from Marhaba Hypermarket.";
  document.getElementById("modal-qty").innerText = selectedQuantity;

  document.getElementById("product-modal").style.display = "flex";
}

function closeProductModal() {
  document.getElementById("product-modal").style.display = "none";
}

function changeQty(delta) {
  if (selectedQuantity + delta >= 1) {
    selectedQuantity += delta;
    document.getElementById("modal-qty").innerText = selectedQuantity;
  }
}

// Cart Functionality
function addCurrentToCart() {
  if (!selectedProduct) return;
  const existing = cart.find(item => item.product.id === selectedProduct.id);
  if (existing) {
    existing.qty += selectedQuantity;
  } else {
    cart.push({ product: selectedProduct, qty: selectedQuantity });
  }
  updateCartBadge();
  closeProductModal();
  alert(`${selectedProduct.name} added to your cart!`);
}

function updateCartBadge() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cart-badge").innerText = totalItems;
}

function openCartModal() {
  const container = document.getElementById("cart-items-container");
  if (cart.length === 0) {
    container.innerHTML = "<p style='text-align:center; padding: 20px; color: var(--text-muted);'>Your cart is empty!</p>";
    document.getElementById("cart-total-price").innerText = "0";
  } else {
    let total = 0;
    container.innerHTML = cart.map((item, index) => {
      const itemTotal = item.product.price * item.qty;
      total += itemTotal;
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid var(--border-color);">
          <div>
            <strong>${item.product.name}</strong><br>
            <small>₹${item.product.price} x ${item.qty}</small>
          </div>
          <div>
            <strong>₹${itemTotal}</strong>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; margin-left:8px; cursor:pointer;"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `;
    }).join('');
    document.getElementById("cart-total-price").innerText = total;
  }
  document.getElementById("cart-modal").style.display = "flex";
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCartBadge();
  openCartModal();
}

function closeCartModal() {
  document.getElementById("cart-modal").style.display = "none";
}

// Order & WhatsApp Redirection
function openOrderModal(type) {
  checkoutType = type;
  if (type === 'cart' && cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  closeProductModal();
  closeCartModal();
  document.getElementById("order-modal").style.display = "flex";
}

function closeOrderModal() {
  document.getElementById("order-modal").style.display = "none";
}

function submitWhatsAppOrder(e) {
  e.preventDefault();
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();

  let orderDetailsText = "";
  let totalAmount = 0;

  if (checkoutType === 'single') {
    const itemTotal = selectedProduct.price * selectedQuantity;
    orderDetailsText = `1. *${selectedProduct.name}*
   - Qty: ${selectedQuantity} (${selectedProduct.unit})
   - Price: ₹${selectedProduct.price} x ${selectedQuantity} = ₹${itemTotal}
`;
    totalAmount = itemTotal;
  } else {
    cart.forEach((item, i) => {
      const itemTotal = item.product.price * item.qty;
      totalAmount += itemTotal;
      orderDetailsText += `${i+1}. *${item.product.name}*
   - Qty: ${item.qty} (${item.product.unit})
   - Price: ₹${item.product.price} x ${item.qty} = ₹${itemTotal}
`;
    });
  }

  const waMessage = `🛒 *NEW ORDER - MARHABA HYPERMARKET*
` +
    `--------------------------------------
` +
    `👤 *Customer Details:*
` +
    `• Name: ${name}
` +
    `• Phone: ${phone}
` +
    `• Address: ${address}

` +
    `📦 *Order Items:*
${orderDetailsText}
` +
    `💰 *Total Estimated Bill:* ₹${totalAmount}
` +
    `--------------------------------------
` +
    `Please confirm my order delivery time!`;

  const encodedUrl = `https://wa.me/${BUSINESS_WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;
  window.open(encodedUrl, '_blank');
  closeOrderModal();
}

// Dark/Light Theme Toggle
function toggleTheme() {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  const icon = document.querySelector("#theme-toggle i");
  icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

// Admin Portal Logic
function openAdminModal() {
  document.getElementById("admin-modal").style.display = "flex";
  if (auth.currentUser) {
    showAdminDashboard();
  } else {
    showAdminLogin();
  }
}

function closeAdminModal() {
  document.getElementById("admin-modal").style.display = "none";
}

function showAdminLogin() {
  document.getElementById("admin-login-view").style.display = "block";
  document.getElementById("admin-dashboard-view").style.display = "none";
}

function showAdminDashboard() {
  document.getElementById("admin-login-view").style.display = "none";
  document.getElementById("admin-dashboard-view").style.display = "block";
}

function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById("admin-email").value;
  const pass = document.getElementById("admin-password").value;

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      showAdminDashboard();
    })
    .catch(err => {
      alert("Login Failed: " + err.message);
    });
}

function handleAdminLogout() {
  auth.signOut().then(() => {
    showAdminLogin();
  });
}

function switchAdminTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  
  event.target.classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

function saveProduct(e) {
  e.preventDefault();
  const pid = document.getElementById("prod-id").value || db.collection("products").doc().id;
  const prodData = {
    name: document.getElementById("prod-name").value,
    category: document.getElementById("prod-category").value,
    price: Number(document.getElementById("prod-price").value),
    mrp: Number(document.getElementById("prod-mrp").value) || null,
    unit: document.getElementById("prod-unit").value,
    image: document.getElementById("prod-image").value,
    description: document.getElementById("prod-desc").value,
    rating: 5
  };

  db.collection("products").doc(pid).set(prodData)
    .then(() => {
      alert("Product saved successfully!");
      document.getElementById("product-form").reset();
      document.getElementById("prod-id").value = "";
    })
    .catch(err => alert("Error saving product: " + err.message));
}

function renderAdminProducts() {
  const container = document.getElementById("admin-product-list");
  container.innerHTML = products.map(p => `
    <div class="admin-item">
      <span><strong>${p.name}</strong> - ₹${p.price}</span>
      <div>
        <button class="btn btn-primary btn-sm" onclick="editProduct('${p.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function editProduct(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;
  document.getElementById("prod-id").value = p.id;
  document.getElementById("prod-name").value = p.name;
  document.getElementById("prod-category").value = p.category;
  document.getElementById("prod-price").value = p.price;
  document.getElementById("prod-mrp").value = p.mrp || '';
  document.getElementById("prod-unit").value = p.unit;
  document.getElementById("prod-image").value = p.image;
  document.getElementById("prod-desc").value = p.description || '';
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    db.collection("products").doc(id).delete()
      .then(() => alert("Product deleted!"))
      .catch(err => alert("Error deleting: " + err.message));
  }
}

function saveBanner(e) {
  e.preventDefault();
  const bid = db.collection("banners").doc().id;
  const bannerData = {
    title: document.getElementById("banner-title").value,
    image: document.getElementById("banner-image").value
  };

  db.collection("banners").doc(bid).set(bannerData)
    .then(() => {
      alert("Banner added!");
      document.getElementById("banner-form").reset();
    })
    .catch(err => alert("Error: " + err.message));
}

function renderAdminBanners() {
  const container = document.getElementById("admin-banner-list");
  container.innerHTML = banners.map(b => `
    <div class="admin-item">
      <span>${b.title}</span>
      <button class="btn btn-danger btn-sm" onclick="deleteBanner('${b.id}')">Delete</button>
    </div>
  `).join('');
}

function deleteBanner(id) {
  if (confirm("Delete this banner?")) {
    db.collection("banners").doc(id).delete()
      .then(() => alert("Banner deleted!"))
      .catch(err => alert("Error: " + err.message));
  }
}
