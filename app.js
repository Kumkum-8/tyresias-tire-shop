const state = {
  products: [],
  cart: [],
  user: null,
  currentSection: 'home'
};

const elements = {
  navButtons: [...document.querySelectorAll('.nav-btn')],
  loginToggle: document.getElementById('loginToggle'),
  logoutBtn: document.getElementById('logoutBtn'),
  productGrid: document.getElementById('productGrid'),
  cartItems: document.getElementById('cartItems'),
  cartTotal: document.getElementById('cartTotal'),
  brandFilter: document.getElementById('brandFilter'),
  typeFilter: document.getElementById('typeFilter'),
  priceFilter: document.getElementById('priceFilter'),
  priceLabel: document.getElementById('priceLabel'),
  revenueStat: document.getElementById('revenueStat'),
  profitStat: document.getElementById('profitStat'),
  stockStat: document.getElementById('stockStat'),
  avgPriceStat: document.getElementById('avgPriceStat'),
  brandChart: document.getElementById('brandChart'),
  typeChart: document.getElementById('typeChart'),
  ordersTable: document.getElementById('ordersTable'),
  aiQuery: document.getElementById('aiQuery'),
  aiSummary: document.getElementById('aiSummary'),
  aiRecommendations: document.getElementById('aiRecommendations'),
  adminInventory: document.getElementById('adminInventory'),
  authModal: document.getElementById('authModal'),
  authTitle: document.getElementById('authTitle'),
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
  productForm: document.getElementById('productForm'),
  toast: document.getElementById('toast')
};

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2600);
}

function updateUserUI() {
  const savedUser = JSON.parse(localStorage.getItem('tyresiasUser') || 'null');
  state.user = savedUser;

  if (savedUser) {
    elements.loginToggle.classList.add('hidden');
    elements.logoutBtn.classList.remove('hidden');
  } else {
    elements.loginToggle.classList.remove('hidden');
    elements.logoutBtn.classList.add('hidden');
  }
}

function switchSection(targetId) {
  state.currentSection = targetId;

  document.querySelectorAll('main section.panel').forEach((section) => {
    section.classList.toggle('hidden-section', section.id !== targetId);
  });

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
}

function renderCart() {
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  elements.cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;

  if (state.cart.length === 0) {
    elements.cartItems.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    return;
  }

  elements.cartItems.innerHTML = state.cart.map((item) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <small>Qty: ${item.quantity} · ₹${item.price.toLocaleString('en-IN')}</small>
      </div>
      <button class="outline-btn" data-remove-product="${item.id}">Remove</button>
    </div>
  `).join('');

  document.querySelectorAll('[data-remove-product]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-remove-product');
      state.cart = state.cart.filter((item) => item.id !== id);
      renderCart();
    });
  });
}

function addToCart(product) {
  const existing = state.cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added to cart.`);
}

function renderProducts(products) {
  if (!products.length) {
    elements.productGrid.innerHTML = '<p class="empty-state">No products match the selected filters.</p>';
    return;
  }

  elements.productGrid.innerHTML = products.map((product) => `
    <div class="product-card">
      <span class="badge">${product.brand}</span>
      <h4>${product.name}</h4>
      <div class="meta-row">
        <span>${product.type}</span>
        <span>${product.size}</span>
      </div>
      <div class="meta-row">
        <span>⭐ ${product.rating}</span>
        <span>${product.stock} in stock</span>
      </div>
      <p>${product.description}</p>
      <div class="price-tag">₹${product.price.toLocaleString('en-IN')}</div>
      <button class="primary-btn" data-add-product="${product.id}">Add to Cart</button>
    </div>
  `).join('');

  document.querySelectorAll('[data-add-product]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-add-product');
      const product = state.products.find((item) => item.id === id);
      addToCart(product);
    });
  });
}

async function loadProducts() {
  const brand = elements.brandFilter.value;
  const type = elements.typeFilter.value;
  const maxPrice = elements.priceFilter.value;

  const params = new URLSearchParams();
  if (brand !== 'All') params.set('brand', brand);
  if (type !== 'All') params.set('type', type);
  if (maxPrice) params.set('maxPrice', maxPrice);

  const response = await fetch(`/api/products?${params.toString()}`);
  const data = await response.json();
  state.products = data;
  renderProducts(data);
}

function populateBrandOptions(products) {
  const brands = ['All', ...new Set(products.map((item) => item.brand))];
  elements.brandFilter.innerHTML = brands.map((brand) => `
    <option value="${brand}">${brand}</option>
  `).join('');
}

async function fetchAnalytics() {
  const response = await fetch('/api/analytics');
  const data = await response.json();

  elements.revenueStat.textContent = `₹${data.summary.revenue.toLocaleString('en-IN')}`;
  elements.profitStat.textContent = `₹${data.summary.profit.toLocaleString('en-IN')}`;
  elements.stockStat.textContent = data.summary.stock;
  elements.avgPriceStat.textContent = `₹${data.summary.avgPrice.toLocaleString('en-IN')}`;

  renderBarChart(elements.brandChart, data.topBrands, 'brand');
  renderBarChart(elements.typeChart, Object.entries(data.typeTotals).map(([label, value]) => ({ label, value })), 'type');

  elements.ordersTable.innerHTML = data.recentOrders.map((order) => `
    <tr>
      <td>${order.id}</td>
      <td>${order.customer}</td>
      <td>₹${order.total.toLocaleString('en-IN')}</td>
      <td>₹${order.profit.toLocaleString('en-IN')}</td>
      <td>${order.status}</td>
    </tr>
  `).join('');
}

function renderBarChart(container, items, mode) {
  const max = Math.max(...items.map((item) => item.value || item.units || 0), 1);

  container.innerHTML = items.map((item) => {
    const value = item.value || item.units || 0;
    const width = (value / max) * 100;
    return `
      <div class="bar-row">
        <span>${mode === 'brand' ? item.brand : item.label}</span>
        <div class="bar-track"><span class="bar-fill" style="width:${width}%"></span></div>
        <strong>${value}</strong>
      </div>
    `;
  }).join('');
}

async function searchAi() {
  const query = elements.aiQuery.value.trim() || 'best tyre for highway';
  const brand = elements.brandFilter.value || 'All';

  const response = await fetch(`/api/ai?query=${encodeURIComponent(query)}&brand=${encodeURIComponent(brand)}`);
  const data = await response.json();

  elements.aiSummary.textContent = data.summary;

  elements.aiRecommendations.innerHTML = data.recommendations.map((product) => `
    <div class="recommendation-item">
      <strong>${product.name}</strong>
      <div class="meta-row">
        <span>${product.brand}</span>
        <span>₹${product.price.toLocaleString('en-IN')}</span>
      </div>
    </div>
  `).join('');

  showToast('AI recommendation refreshed.');
}

async function loadInventoryForAdmin() {
  const response = await fetch('/api/products');
  const products = await response.json();

  elements.adminInventory.innerHTML = products.map((product) => `
    <div class="inventory-item">
      <div>
        <strong>${product.name}</strong>
        <small>${product.brand} · ${product.size}</small>
      </div>
      <div>
        <small>₹${product.price.toLocaleString('en-IN')}</small>
      </div>
    </div>
  `).join('');
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const result = await response.json();
  if (!response.ok) {
    showToast(result.message || 'Login failed.');
    return;
  }

  localStorage.setItem('tyresiasToken', result.token);
  localStorage.setItem('tyresiasUser', JSON.stringify(result.user));
  updateUserUI();
  elements.authModal.classList.add('hidden');
  showToast('Login successful.');
}

async function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const result = await response.json();
  if (!response.ok) {
    showToast(result.message || 'Registration failed.');
    return;
  }

  localStorage.setItem('tyresiasToken', result.token);
  localStorage.setItem('tyresiasUser', JSON.stringify(result.user));
  updateUserUI();
  elements.authModal.classList.add('hidden');
  showToast('Registration successful.');
}

async function handleProductSubmit(event) {
  event.preventDefault();
  const token = localStorage.getItem('tyresiasToken');

  if (!token) {
    showToast('Please login as admin first.');
    return;
  }

  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (!response.ok) {
    showToast(result.message || 'Product upload failed.');
    return;
  }

  showToast('Product added successfully.');
  event.target.reset();
  await loadProducts();
  await loadInventoryForAdmin();
}

async function placeOrder() {
  const token = localStorage.getItem('tyresiasToken');

  if (!token) {
    elements.authModal.classList.remove('hidden');
    showToast('Please login to place order.');
    return;
  }

  if (!state.cart.length) {
    showToast('Add tyres to your cart first.');
    return;
  }

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ cart: state.cart })
  });

  const result = await response.json();
  if (!response.ok) {
    showToast(result.message || 'Order failed.');
    return;
  }

  showToast('Order placed successfully.');
  state.cart = [];
  renderCart();
  fetchAnalytics();
}

function attachEvents() {
  elements.navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      switchSection(button.dataset.target);
    });
  });

  document.querySelectorAll('[data-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-target');
      if (target) switchSection(target);
    });
  });

  elements.loginToggle.addEventListener('click', () => {
    elements.authModal.classList.remove('hidden');
    elements.authTitle.textContent = 'Login';
    document.querySelectorAll('.tab-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.mode === 'login');
    });
    elements.loginForm.classList.remove('hidden');
    elements.registerForm.classList.add('hidden');
  });

  elements.logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('tyresiasToken');
    localStorage.removeItem('tyresiasUser');
    updateUserUI();
    showToast('Logged out successfully.');
  });

  document.getElementById('closeAuthModal').addEventListener('click', () => {
    elements.authModal.classList.add('hidden');
  });

  document.querySelectorAll('.tab-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.mode;
      const isLogin = mode === 'login';
      elements.authTitle.textContent = isLogin ? 'Login' : 'Register';
      elements.loginForm.classList.toggle('hidden', !isLogin);
      elements.registerForm.classList.toggle('hidden', isLogin);
      document.querySelectorAll('.tab-btn').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
      });
    });
  });

  elements.loginForm.addEventListener('submit', handleLogin);
  elements.registerForm.addEventListener('submit', handleRegister);
  elements.productForm.addEventListener('submit', handleProductSubmit);
  document.getElementById('aiSearchBtn').addEventListener('click', searchAi);
  document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);

  elements.brandFilter.addEventListener('change', loadProducts);
  elements.typeFilter.addEventListener('change', loadProducts);
  elements.priceFilter.addEventListener('input', () => {
    elements.priceLabel.textContent = `₹${elements.priceFilter.value}`;
    loadProducts();
  });
}

async function initializeApp() {
  updateUserUI();
  attachEvents();
  switchSection('home');

  const response = await fetch('/api/products');
  const data = await response.json();
  state.products = data;
  populateBrandOptions(data);
  renderProducts(data);
  await fetchAnalytics();
  await loadInventoryForAdmin();
}

initializeApp();
