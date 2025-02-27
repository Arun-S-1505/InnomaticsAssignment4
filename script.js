// Product data
const products = [
  { id: 1, name: "iPhone 15 Pro", price: 999, category: "Mobiles", image: "https://images.unsplash.com/photo-1696446702183-be9a86e34460?auto=format&fit=crop&q=80&w=500" },
  { id: 2, name: "MacBook Air M2", price: 1199, category: "Laptops", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=500" },
  { id: 3, name: "AirPods Pro", price: 249, category: "Audio", image: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&q=80&w=500" },
  { id: 4, name: "iPad Air", price: 599, category: "Tablets", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=500" },
  { id: 5, name: "Apple Watch Series 9", price: 399, category: "Wearables", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=500" },
  { id: 6, name: "Samsung Galaxy S23", price: 799, category: "Mobiles", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=500" },
  { id: 7, name: "Dell XPS 13", price: 1299, category: "Laptops", image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=500" },
  { id: 8, name: "Sony WH-1000XM5", price: 349, category: "Audio", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500" },
  { id: 9, name: "Fitbit Versa 4", price: 229, category: "Wearables", image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&q=80&w=500" }
];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartItems = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon');
const closeCart = document.querySelector('.close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartContainer = document.getElementById('cart-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const emptyCartBtn = document.querySelector('.empty-cart-btn');
const checkoutBtn = document.querySelector('.checkout-btn');
const categoryLinks = document.querySelectorAll('.categories a');

// Cart state
let cart = [];
let activeCategory = 'All';

// Initialize the application
function init() {
  loadCartFromLocalStorage();
  renderProducts();
  updateCartCount();
  setupEventListeners();
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Render products based on active category
function renderProducts() {
  productsContainer.innerHTML = '';
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          Add to Cart
        </button>
      </div>
    `;
    productsContainer.appendChild(productCard);
  });
}

// Render cart items
function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="empty-cart-message">Your cart is empty</div>`;
    return;
  }
  
  cartItems.innerHTML = '';
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        <div class="cart-item-actions">
          <button class="quantity-btn decrease-quantity" data-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
            </svg>
          </button>
          <span class="cart-item-quantity">${item.quantity}</span>
          <button class="quantity-btn increase-quantity" data-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
          </button>
        </div>
      </div>
      <button class="remove-item" data-id="${item.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    `;
    cartItems.appendChild(cartItem);
  });
  
  updateCartTotal();
}

// Update cart count badge
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  if (totalItems > 0) {
    cartCount.style.display = 'flex';
  } else {
    cartCount.style.display = 'none';
  }
}

// Update cart total price
function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// Add item to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  // Add animation effect
  document.body.classList.add('cart-active');
  setTimeout(() => {
    document.body.classList.remove('cart-active');
  }, 1000);
  
  saveCartToLocalStorage();
  renderCart();
  updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToLocalStorage();
  renderCart();
  updateCartCount();
}

// Update item quantity
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  saveCartToLocalStorage();
  renderCart();
  updateCartCount();
}

// Empty the cart
function emptyCart() {
  cart = [];
  saveCartToLocalStorage();
  renderCart();
  updateCartCount();
}

// Toggle cart visibility
function toggleCart() {
  document.body.classList.toggle('cart-active');
}

// Set up event listeners
function setupEventListeners() {
  // Add to cart buttons
  productsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart')) {
      const button = e.target.closest('.add-to-cart');
      const productId = parseInt(button.dataset.id);
      addToCart(productId);
    }
  });
  
  // Cart item quantity and remove buttons
  cartItems.addEventListener('click', (e) => {
    if (e.target.closest('.increase-quantity')) {
      const button = e.target.closest('.increase-quantity');
      const productId = parseInt(button.dataset.id);
      updateQuantity(productId, 1);
    } else if (e.target.closest('.decrease-quantity')) {
      const button = e.target.closest('.decrease-quantity');
      const productId = parseInt(button.dataset.id);
      updateQuantity(productId, -1);
    } else if (e.target.closest('.remove-item')) {
      const button = e.target.closest('.remove-item');
      const productId = parseInt(button.dataset.id);
      removeFromCart(productId);
    }
  });
  
  // Empty cart button
  emptyCartBtn.addEventListener('click', emptyCart);
  
  // Checkout button
  checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
      alert('Thank you for your purchase! This is a demo, so no actual purchase was made.');
      emptyCart();
    }
  });
  
  // Toggle cart
  cartIcon.addEventListener('click', toggleCart);
  closeCart.addEventListener('click', toggleCart);
  cartOverlay.addEventListener('click', toggleCart);
  
  // Category filtering
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active category
      categoryLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      activeCategory = link.dataset.category;
      renderProducts();
    });
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
