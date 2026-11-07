# Marhaba Hypermarket - E-Commerce Web Application

A lightweight, modern, responsive e-commerce web platform designed for **Marhaba Hypermarket**. It features product browsing, category filtering, a banner carousel, modal-based product inspection, shopping cart capabilities, direct WhatsApp checkout with custom user address details, and a Firebase-authenticated Admin Management Portal.

---

## 🌟 Key Features

1. **Storefront & Navigation (UI Matched to Wireframe)**:
   - Header with Logo, Store Locations (Othukkungal & Karuvarakkund), Dark/Light Mode Switcher, and Direct Call Button.
   - Interactive Search Bar for quick product filtering.
   - Promotional Banner Slider with auto-carousel.
   - Category Filter Chips (`Veg`, `Rice`, `Bev`, `Snacks`, `Household`).
   - Grid layout of products displaying ratings, unit sizes, offer prices, and MRP discounts.

2. **Product Detail & WhatsApp Checkout Modal**:
   - Dynamic popup view when clicking any product card.
   - Quantity adjuster (`+` / `-`).
   - "Add to Cart" and "Buy via WhatsApp" actions.
   - Customer details prompt (Name, Phone, Address) appended cleanly to the WhatsApp message text directed to `9847283286`.

3. **Firebase Backend Integration**:
   - Realtime Firestore database for dynamic sync of products and promotional banners.
   - Protected Admin Dashboard accessible via email/password authentication.
   - Ability to add, edit, and delete products, prices, and banners.

---

## 📁 Repository File Structure

```
├── index.html         # Main web page layout and modals
├── style.css          # Full responsive CSS stylesheet & dark mode tokens
├── app.js             # Core JS, Firebase config, UI state & WhatsApp logic
├── logo.png           # Store Logo (from upload)
├── firebase.json      # Firebase hosting configuration
├── firestore.rules    # Firebase security rules (Public Read, Admin Write)
└── README.md          # Project documentation and setup guide
```

---

## 🚀 Deployment Procedure

### Step 1: GitHub Setup
1. Open [GitHub](https://github.com) and create a new repository named `marhaba-hypermarket`.
2. Push all project files (`index.html`, `style.css`, `app.js`, `logo.png`, `README.md`, etc.) to your repository.
3. Enable GitHub Pages:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, set Source to `Deploy from a branch`.
   - Select `main` branch and `/ (root)` folder, then click **Save**.

### Step 2: Firebase Setup & Authentication
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project named `Marhaba-Hypermarket`.
2. Navigate to **Build > Authentication** > **Get Started**. Enable **Email/Password** sign-in method.
3. Create an admin account under the **Users** tab (e.g., `admin@marhabahypermarket.com`).
4. Go to **Build > Firestore Database** and click **Create Database** (Start in production mode).
5. Paste the provided rules into the **Rules** tab in Firestore:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
6. Copy your Firebase project config settings from **Project Settings > General > Your apps (Web App)** and replace the `firebaseConfig` object in `app.js`.
