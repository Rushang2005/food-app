// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyAl16jGICR3WNOPMm_11SNsZ92YEowT-j8",
  authDomain: "unifood-fb223.firebaseapp.com",
  projectId: "unifood-fb223",
  storageBucket: "unifood-fb223.appspot.com",
  messagingSenderId: "307382508139",
  appId: "1:307382508139:web:509ab3c0254321c40e2f2e",
  measurementId: "G-J72XMB24GM"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- GLOBAL STATE & EVENT HANDLERS ---
let currentUser = null;
let unsubscribeListeners = [];
let activePortalHandler = null;
let siteSettings = {};
let cart = [];
let html5QrCode = null; // For QR Code Scanner

// --- UI REFERENCES ---
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const mainContent = document.getElementById('main-content');
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');
const modalContainer = document.getElementById('modal-container');
const maintenanceOverlay = document.getElementById('maintenance-overlay');
const websiteNameHeader = document.getElementById('website-name-header');
const websiteLogoHeader = document.getElementById('website-logo-header');
const announcementContainer = document.getElementById('announcement-banner-container');
const cartButton = document.getElementById('cart-button');
const cartCountEl = document.getElementById('cart-count');

// Mobile Menu UI
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenuButton = document.getElementById('close-mobile-menu');
const mobileUserInfo = document.getElementById('mobile-user-info');
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');


// --- CORE APP & AUTH LOGIC ---

async function initializeApp() {
    // Fetch site settings first
    const settingsDoc = await db.collection('settings').doc('config').get();
    if (settingsDoc.exists) {
        siteSettings = settingsDoc.data();
    } else { // Set default charges if not present
        siteSettings = {
            deliveryCharge: 40,
            deliveryChargeType: 'fixed', // 'fixed' or 'percentage'
            gstRate: 5, // percentage
            platformFee: 0,
            platformFeeType: 'fixed'
        };
        await db.collection('settings').doc('config').set(siteSettings);
    }
    applySiteSettings();

    // Listen for auth changes
    auth.onAuthStateChanged(async (user) => {
        cleanupListeners();
        if (activePortalHandler) {
            mainContent.removeEventListener('click', activePortalHandler);
            activePortalHandler = null;
        }
        cart = [];
        updateCartButton();

        if (user) {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                currentUser = { uid: user.uid, ...userDoc.data() };
                 if (siteSettings.maintenanceMode && currentUser.role !== 'superadmin') {
                    maintenanceOverlay.style.display = 'flex';
                    if(auth.currentUser) auth.signOut();
                    return;
                }

                if (currentUser.role === 'restaurant') {
                    const restaurantDoc = await db.collection('restaurants').doc(currentUser.restaurantId).get();
                    if (restaurantDoc.exists && restaurantDoc.data().isLocked) {
                        showSimpleModal("Account Locked", "Your restaurant account is currently locked. Please contact support.");
                        auth.signOut();
                        return;
                    }
                }

                if (currentUser.role === 'delivery' && currentUser.isLocked) {
                     showSimpleModal("Account Locked", "Your delivery account is currently locked. Please contact support.");
                     auth.signOut();
                     return;
                }
                
                const userHtml = `<p class="font-semibold">${currentUser.name}</p><p class="text-xs text-gray-500 capitalize">${currentUser.role}</p>`;
                userInfo.innerHTML = userHtml;
                mobileUserInfo.innerHTML = userHtml;
                
                showView('app');
                loadPortal(currentUser);
            } else {
                showSimpleModal("Error", "Your user data could not be found. You have been logged out.");
                if(auth.currentUser) auth.signOut();
            }
        } else {
            currentUser = null;
            if (siteSettings.maintenanceMode) {
                maintenanceOverlay.style.display = 'flex';
                feather.replace();
            } else {
                showView('auth');
            }
        }
    });
}

function logAudit(action, details) {
    if (!currentUser) return;
    try {
        db.collection('auditLog').add({
            action: action,
            details: details,
            performedBy: currentUser.name,
            role: currentUser.role,
            userId: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Failed to write audit log:", error);
    }
}

function applySiteSettings() {
    if (siteSettings.websiteName) {
        websiteNameHeader.textContent = siteSettings.websiteName;
        document.title = siteSettings.websiteName;
    }
    if (siteSettings.logoUrl) {
        websiteLogoHeader.src = siteSettings.logoUrl;
    }
    if (siteSettings.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', siteSettings.primaryColor);
    }
    if (siteSettings.secondaryColor) {
        document.documentElement.style.setProperty('--secondary-color', siteSettings.secondaryColor);
    }
    if (siteSettings.heroBgImage) {
         authContainer.style.backgroundImage = `url('${siteSettings.heroBgImage}')`;
    }
    // Display active announcement
    announcementContainer.innerHTML = ''; // Clear previous
    db.collection('announcements').where('isActive', '==', true).limit(1).get().then(snapshot => {
        if (!snapshot.empty) {
            const announcement = snapshot.docs[0].data();
            announcementContainer.innerHTML = `
                <div class="bg-yellow-200 text-yellow-800 p-3 text-center text-sm">
                    <strong>${announcement.title || 'Announcement'}:</strong> ${announcement.text}
                </div>
            `;
        }
    });
}

function showView(view) {
    const header = document.querySelector('header');
    cartButton.classList.add('hidden');

    if (view === 'app') {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
        header.style.display = 'flex';
        appContainer.classList.add('fade-in');
    } else { 
        appContainer.style.display = 'block';
        header.style.display = 'none';
        authContainer.style.display = 'flex';
        renderAuthForm('login');
    }
}

function loadPortal(user) {
    mainContent.innerHTML = '';
    cleanupListeners();
    if (activePortalHandler) {
        mainContent.removeEventListener('click', activePortalHandler);
        activePortalHandler = null;
    }

    const role = user.role;
    const template = document.getElementById(`${role}-portal-template`);

    if (template) {
        mainContent.appendChild(template.content.cloneNode(true));
        feather.replace();

        switch (role) {
            case 'admin': initializeAdminPortal(); break;
            case 'superadmin': initializeSuperAdminPortal(); break;
            case 'restaurant': initializeRestaurantPortal(); break;
            case 'delivery': initializeDeliveryPortal(); break;
            case 'customer': initializeCustomerPortal(); break;
        }
    } else {
        mainContent.innerHTML = `<p class="text-center text-red-500">Error: Portal template for role "${role}" not found.</p>`;
    }
}

function renderAuthForm(formType) {
    const authCard = authContainer.querySelector('.auth-card');
    authCard.innerHTML = '';
    const template = document.getElementById(`${formType}-form-template`);
    if (template) {
        authCard.appendChild(template.content.cloneNode(true));
    }

    if (formType === 'login') {
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('show-signup-link').addEventListener('click', (e) => { e.preventDefault(); renderAuthForm('signup'); });
    } else {
        document.getElementById('signup-form').addEventListener('submit', handleSignup);
        document.getElementById('show-login-link').addEventListener('click', (e) => { e.preventDefault(); renderAuthForm('login'); });
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';
    auth.signInWithEmailAndPassword(email, password)
        .catch(err => { errorEl.textContent = err.message; });
}

function handleSignup(e) {
    e.preventDefault();
    const errorEl = document.getElementById('signup-error');
    errorEl.textContent = '';
    const userData = {
        name: document.getElementById('signup-name').value,
        mobile: document.getElementById('signup-mobile').value,
        email: document.getElementById('signup-email').value,
        role: 'customer',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    const password = document.getElementById('signup-password').value;
    auth.createUserWithEmailAndPassword(userData.email, password)
        .then(cred => db.collection('users').doc(cred.user.uid).set(userData))
        .catch(err => { errorEl.textContent = err.message; });
}

// --- CUSTOMER PORTAL ---
function initializeCustomerPortal() {
    activePortalHandler = handleCustomerClicks;
    mainContent.addEventListener('click', activePortalHandler);
    
    // Also listen for clicks on the mobile nav
    const mobileNav = document.getElementById('mobile-customer-nav');
    if(mobileNav) {
        mobileNav.addEventListener('click', handleCustomerClicks);
    }
    
    modalContainer.addEventListener('click', (e) => {
        const actionButton = e.target.closest('[data-action]');
        if (actionButton && actionButton.dataset.action === 'remove-from-cart') {
            removeFromCart(actionButton.dataset.itemId);
        }
    });
    cartButton.addEventListener('click', renderCartView);
    renderCustomerView('home');
}

function handleCustomerClicks(e) {
    const navLink = e.target.closest('[data-view]');
    if (navLink) {
        renderCustomerView(navLink.dataset.view);
        return;
    }

    const restaurantCard = e.target.closest('.restaurant-card');
    if (restaurantCard) {
        renderCustomerRestaurantView(restaurantCard.dataset.id);
        return;
    }

    const actionButton = e.target.closest('[data-action]');
    if(actionButton) {
        const { action, restaurantId, restaurantName, itemId, itemName, itemPrice, orderId } = actionButton.dataset;
        switch(action) {
            case 'back-to-home': renderCustomerView('home'); break;
            case 'add-to-cart': addToCart(itemId, itemName, parseFloat(itemPrice), restaurantId, restaurantName); break;
            case 'place-order': handlePlaceOrder(actionButton.form); break;
            case 'view-bill': renderOrderBill(orderId); break;
            case 'rate-order': showRatingForm(orderId); break;
        }
    }
}

function renderCustomerView(viewName) {
    // Update active state for both desktop and mobile navs
    document.querySelectorAll('#customer-nav .sidebar-link, #mobile-customer-nav .mobile-nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewName);
    });

    const contentArea = document.getElementById('customer-main-content');
    cartButton.classList.add('hidden');

    switch(viewName) {
        case 'home': renderCustomerHomepage(contentArea); break;
        case 'orders': renderCustomerOrdersView(contentArea); break;
        case 'profile': renderCustomerProfile(contentArea); break;
    }
}

async function renderCustomerHomepage(contentArea) {
     cartButton.classList.remove('hidden');
     contentArea.innerHTML = `
        <div class="space-y-8">
            <div class="text-center p-6 md:p-8 bg-white rounded-xl shadow-md">
                 <h2 class="text-3xl md:text-4xl font-bold font-serif">${siteSettings.heroTitle || 'Find Your Next Meal'}</h2>
                 <p class="text-gray-600 mt-2">${siteSettings.heroSubtitle || 'The best restaurants, delivered to your doorstep.'}</p>
                 <div class="mt-6 max-w-lg mx-auto relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i data-feather="search" class="w-5 h-5 text-gray-400"></i>
                    </div>
                    <input type="search" id="restaurant-search" class="input-field w-full p-3 pl-12 rounded-full" placeholder="Search for restaurants or cuisines...">
                 </div>
            </div>
            <div id="ai-recommendations" class="mb-8">
                <h3 class="text-2xl font-bold font-serif mb-4">Just For You ✨</h3>
                <p class="text-gray-500">AI recommendations will appear here based on your order history.</p>
            </div>
            <div id="all-restaurants-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </div>
     `;
    feather.replace();
     const allListEl = document.getElementById('all-restaurants-list');
     db.collection('restaurants').where("isLocked", "==", false).get().then(snapshot => {
         if(snapshot.empty) {
              allListEl.innerHTML = '<p>No restaurants available right now.</p>';
              return;
         }
         allListEl.innerHTML = snapshot.docs.map(doc => renderRestaurantCard(doc)).join('');
         feather.replace();
     });

     document.getElementById('restaurant-search').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('#all-restaurants-list .restaurant-card').forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const cuisine = card.dataset.cuisine.toLowerCase();
            card.style.display = (name.includes(searchTerm) || cuisine.includes(searchTerm)) ? 'block' : 'none';
        });
     });
}

function renderRestaurantCard(doc) {
    const r = doc.data();
    const firstImage = r.imageUrls && r.imageUrls.length > 0 ? r.imageUrls[0] : 'https://placehold.co/400x250?text=UniFood';
    return `
        <div data-id="${doc.id}" data-name="${r.name}" data-cuisine="${r.cuisine}" class="restaurant-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
            <img src="${firstImage}" class="w-full h-48 object-cover">
            <div class="p-5">
                <h3 class="font-bold text-xl font-serif">${r.name}</h3>
                <p class="text-sm text-gray-500 mt-1">${r.cuisine}</p>
                <div class="flex items-center mt-2 text-sm text-gray-700">
                   <i data-feather="star" class="w-4 h-4 fill-current text-yellow-500"></i>
                   <span class="ml-1 font-bold">${(r.avgRating || 0).toFixed(1)}</span>
                   <span class="mx-2">|</span>
                   <span>30-40 min</span>
                </div>
            </div>
        </div>`;
}

async function renderCustomerRestaurantView(restaurantId) {
    const contentArea = document.getElementById('customer-main-content');
    contentArea.innerHTML = `<p>Loading restaurant...</p>`;
    const restaurantDoc = await db.collection('restaurants').doc(restaurantId).get();
    if(!restaurantDoc.exists) {
        contentArea.innerHTML = `<p>Restaurant not found.</p>`;
        return;
    }
    const restaurant = restaurantDoc.data();
    const menuSnapshot = await db.collection('restaurants').doc(restaurantId).collection('menu').get();

    let menuHtml = 'No menu items found.';
    if(!menuSnapshot.empty) {
        menuHtml = menuSnapshot.docs.map(doc => {
            const item = doc.data();
            const itemImage = item.imageUrl || 'https://placehold.co/100x100?text=Food';
            return `
                <div class="flex items-start md:items-center justify-between p-4 border rounded-lg flex-col md:flex-row gap-4">
                     <div class="flex items-center w-full">
                        <img src="${itemImage}" class="w-20 h-20 object-cover rounded-md mr-4">
                        <div class="flex-grow">
                            <p class="font-semibold">${item.name}</p>
                            <p class="text-sm text-gray-600">${item.description}</p>
                            <p class="font-bold mt-1">₹${item.price}</p>
                        </div>
                     </div>
                    <button data-action="add-to-cart" data-item-id="${doc.id}" data-item-name="${item.name}" data-item-price="${item.price}" data-restaurant-id="${restaurantId}" data-restaurant-name="${restaurant.name}" class="btn btn-secondary whitespace-nowrap w-full md:w-auto">Add to Cart</button>
                </div>
            `;
        }).join('');
    }

    contentArea.innerHTML = `
        <div>
            <button data-action="back-to-home" class="btn bg-white mb-4 flex items-center gap-2"><i data-feather="arrow-left"></i>Back to Restaurants</button>
            <div class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-3xl md:text-4xl font-bold font-serif">${restaurant.name}</h2>
                <p class="text-gray-600 mt-1">${restaurant.cuisine}</p>
                <div class="mt-6">
                    <h3 class="text-2xl font-bold font-serif mb-4">Menu</h3>
                    <div class="space-y-4">${menuHtml}</div>
                </div>
            </div>
        </div>
    `;
    feather.replace();
}

async function renderCustomerOrdersView(contentArea) {
    contentArea.innerHTML = `
        <h2 class="text-3xl font-bold font-serif mb-6">My Orders</h2>
        <div id="customer-orders-list" class="space-y-4"></div>
    `;
    const listEl = document.getElementById('customer-orders-list');
    const unsub = db.collection('orders')
        .where('customerId', '==', currentUser.uid)
        .onSnapshot(snapshot => {
            if (snapshot.empty) {
                listEl.innerHTML = '<p class="text-center bg-white p-6 rounded-lg shadow-md">You have no orders.</p>';
                return;
            }
            const sortedDocs = snapshot.docs.sort((a, b) => b.data().createdAt.seconds - a.data().createdAt.seconds);
            listEl.innerHTML = sortedDocs.map(doc => renderCustomerOrderCard(doc.id, doc.data())).join('');
            feather.replace();
        });
    unsubscribeListeners.push(unsub);
}

function renderCustomerOrderCard(orderId, orderData) {
    const statusMap = {
        'placed': { text: 'Order Placed', color: 'bg-gray-500', progress: '20%' },
        'accepted': { text: 'Preparing Food', color: 'bg-blue-500', progress: '40%' },
        'picked-up': { text: 'On The Way', color: 'bg-yellow-500', progress: '70%' },
        'delivered': { text: 'Delivered', color: 'bg-green-500', progress: '100%' },
        'cancelled': { text: 'Cancelled', color: 'bg-red-500', progress: '100%' },
    };
    const currentStatus = statusMap[orderData.status] || statusMap['placed'];

    let actionButtons = `<button data-action="view-bill" data-order-id="${orderId}" class="btn btn-primary">View Bill</button>`;
    if (orderData.status === 'delivered' && !orderData.isReviewed) {
        actionButtons += `<button data-action="rate-order" data-order-id="${orderId}" class="btn btn-secondary ml-2">Rate Order</button>`;
    }

    return `
        <div class="bg-white p-5 rounded-xl shadow-md">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-bold text-lg">${orderData.restaurantName}</p>
                    <p class="text-sm text-gray-500">Order #${orderId.substring(0,6)}</p>
                </div>
                <p class="font-bold">₹${orderData.totalPrice.toFixed(2)}</p>
            </div>
             <div class="mt-4 border-t pt-4">
                <p class="font-semibold mb-2">Items:</p>
                ${orderData.items.map(item => `<p class="text-sm text-gray-600">${item.quantity} x ${item.name}</p>`).join('')}
            </div>
            <div class="mt-4">
                <p class="font-semibold text-sm mb-1">${currentStatus.text}</p>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="${currentStatus.color} h-2.5 rounded-full" style="width: ${currentStatus.progress}"></div>
                </div>
            </div>
            <div class="mt-4 text-right">
                ${actionButtons}
            </div>
        </div>
    `;
}

function renderCustomerProfile(contentArea) {
    contentArea.innerHTML = `
        <h2 class="text-3xl font-bold font-serif mb-6">My Profile</h2>
        <div class="bg-white p-6 rounded-xl shadow-md">
            <form id="customer-profile-form" class="space-y-4">
                <div>
                    <label for="profile-name" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="profile-name" class="input-field mt-1 block w-full" value="${currentUser.name}" required>
                </div>
                <div>
                    <label for="profile-mobile" class="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input type="tel" id="profile-mobile" class="input-field mt-1 block w-full" value="${currentUser.mobile}" required>
                </div>
                 <div>
                    <label for="profile-address" class="block text-sm font-medium text-gray-700">Default Delivery Address</label>
                    <textarea id="profile-address" class="input-field mt-1 block w-full" rows="3">${currentUser.address || ''}</textarea>
                </div>
                <button type="submit" class="btn btn-primary py-3 px-6 rounded-lg">Update Profile</button>
            </form>
        </div>
    `;

    document.getElementById('customer-profile-form').addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('profile-name').value;
        const mobile = document.getElementById('profile-mobile').value;
        const address = document.getElementById('profile-address').value;
        await db.collection('users').doc(currentUser.uid).update({ name, mobile, address });
        currentUser.name = name;
        currentUser.mobile = mobile;
        currentUser.address = address;
        showSimpleModal('Success', 'Profile updated successfully!');
    });
}

// --- CART LOGIC ---
function addToCart(itemId, itemName, itemPrice, restaurantId, restaurantName) {
    if (cart.length > 0 && cart[0].restaurantId !== restaurantId) {
        showConfirmationModal(
            "Start New Order?",
            "Your cart has items from another restaurant. Clear the cart to add items from this restaurant?",
            () => {
                cart = []; // Clear cart
                cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1, restaurantId, restaurantName });
                updateCartButton();
            }
        );
        return;
    }

    const existingItem = cart.find(item => item.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1, restaurantId, restaurantName });
    }
    updateCartButton();
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity--;
        if (cart[itemIndex].quantity === 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartButton();
    if (cart.length === 0) {
        closeModal();
    } else {
        renderCartView(); // Re-render the cart modal
    }
}

function updateCartButton() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    if (totalItems > 0) {
        cartButton.classList.remove('hidden');
    } else {
        cartButton.classList.add('hidden');
    }
}

function renderCartView() {
    if (cart.length === 0) {
        showSimpleModal("Empty Cart", "Your shopping cart is empty.");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let deliveryFee = (siteSettings.deliveryChargeType === 'fixed') ? siteSettings.deliveryCharge : subtotal * (siteSettings.deliveryCharge / 100);
    const gst = subtotal * (siteSettings.gstRate / 100);
    let platformFee = (siteSettings.platformFeeType === 'fixed') ? siteSettings.platformFee : subtotal * (siteSettings.platformFee / 100);
    const total = subtotal + deliveryFee + gst + platformFee;

    const cartHtml = `
        <form id="order-form">
            <h3 class="text-2xl font-bold font-serif mb-4">Your Order</h3>
            <p class="font-semibold mb-4">${cart[0].restaurantName}</p>
            <div class="space-y-3 mb-4 max-h-60 overflow-y-auto">
                ${cart.map(item => `
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-medium">${item.name}</p>
                            <p class="text-sm text-gray-500">Qty: ${item.quantity}</p>
                        </div>
                        <div class="flex items-center gap-4">
                            <p>₹${(item.price * item.quantity).toFixed(2)}</p>
                            <button type="button" data-action="remove-from-cart" data-item-id="${item.id}" class="btn btn-danger p-1 rounded-full">
                                <i data-feather="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="border-t pt-4 space-y-2">
                <div class="flex justify-between"><p>Subtotal</p><p>₹${subtotal.toFixed(2)}</p></div>
                <div class="flex justify-between"><p>Delivery Fee</p><p>₹${deliveryFee.toFixed(2)}</p></div>
                <div class="flex justify-between"><p>Platform Fee</p><p>₹${platformFee.toFixed(2)}</p></div>
                <div class="flex justify-between"><p>GST (${siteSettings.gstRate}%)</p><p>₹${gst.toFixed(2)}</p></div>
                <div class="flex justify-between font-bold text-lg"><p>Grand Total</p><p>₹${total.toFixed(2)}</p></div>
            </div>
            <div class="mt-6">
                <label for="delivery-address" class="block text-sm font-medium text-gray-700">Delivery Address</label>
                <textarea id="delivery-address" name="deliveryAddress" class="input-field mt-1 block w-full" rows="3" required>${currentUser.address || ''}</textarea>
            </div>
            <div class="mt-6">
                <button type="submit" data-action="place-order" class="btn btn-primary w-full py-3 rounded-lg">Place Order</button>
                <button type="button" class="btn bg-gray-200 w-full py-3 rounded-lg mt-2" onclick="closeModal()">Close</button>
            </div>
        </form>
    `;
    showModal(cartHtml);
    document.getElementById('order-form').addEventListener('submit', e => {
        e.preventDefault();
        handlePlaceOrder(e.target);
    });
}

async function handlePlaceOrder(form) {
    const deliveryAddress = form.elements.deliveryAddress.value;
    if (!deliveryAddress) {
        showSimpleModal("Address Required", "Delivery address is required to place an order.");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let deliveryFee = (siteSettings.deliveryChargeType === 'fixed') ? siteSettings.deliveryCharge : subtotal * (siteSettings.deliveryCharge / 100);
    const gst = subtotal * (siteSettings.gstRate / 100);
    let platformFee = (siteSettings.platformFeeType === 'fixed') ? siteSettings.platformFee : subtotal * (siteSettings.platformFee / 100);
    const totalPrice = subtotal + deliveryFee + gst + platformFee;
    const deliveryPayout = 30.00;

    const orderData = {
        customerId: currentUser.uid,
        customerName: currentUser.name,
        deliveryAddress: deliveryAddress,
        restaurantId: cart[0].restaurantId,
        restaurantName: cart[0].restaurantName,
        items: cart.map(item => ({...item})),
        subtotal, deliveryFee, platformFee, gst,
        gstRate: siteSettings.gstRate,
        deliveryPayout, totalPrice,
        status: 'placed',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        deliveryBoyId: null,
        isReviewed: false
    };

    try {
        const docRef = await db.collection('orders').add(orderData);
        await logAudit("Order Placed", `Order ID: ${docRef.id}`);
        showSimpleModal('Order Placed!', 'Your order has been placed successfully.');
        cart = [];
        updateCartButton();
        closeModal();
        renderCustomerView('orders');
    } catch (error) {
        console.error("Error placing order: ", error);
        showSimpleModal('Order Error', 'There was an error placing your order. Please try again.');
    }
}

// --- UTILITY, BILLING & RATING FUNCTIONS ---
async function renderOrderBill(orderId, targetContainer = null) {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
        showSimpleModal("Error", "Order not found.");
        return;
    }
    const order = orderDoc.data();
    const restaurantDoc = await db.collection('restaurants').doc(order.restaurantId).get();
    const restaurant = restaurantDoc.data();
    const customerDoc = await db.collection('users').doc(order.customerId).get();
    const customer = customerDoc.data();

    const billHtml = `
        <div id="printable-bill">
            <div class="p-6 bg-white">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold font-serif">${siteSettings.websiteName || 'UniFood'}</h2>
                    <p class="text-lg font-semibold">${order.restaurantName}</p>
                    <p class="text-sm text-gray-600">${restaurant.address}</p>
                </div>
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h3 class="text-2xl font-bold font-serif">Tax Invoice</h3>
                        <p class="text-sm text-gray-500">Invoice #: <strong>${orderId.substring(0, 8).toUpperCase()}</strong></p>
                        <p class="text-sm text-gray-500">Date: ${new Date(order.createdAt.seconds * 1000).toLocaleString()}</p>
                    </div>
                    <div id="qrcode-container" class="p-1 bg-white border rounded-lg"></div>
                </div>
                <div class="border-y py-4 mb-6">
                    <p class="font-bold">Billed To:</p>
                    <p>${order.customerName}</p>
                    <p>${order.deliveryAddress}</p>
                    <p>Email: ${customer.email}</p>
                    <p>Mobile: ${customer.mobile || 'N/A'}</p>
                </div>
                <table class="w-full text-sm my-6">
                    <thead class="border-b bg-gray-50">
                        <tr>
                            <th class="text-left p-2">Item</th>
                            <th class="text-center p-2">Qty</th>
                            <th class="text-right p-2">Price</th>
                            <th class="text-right p-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr class="border-b">
                                <td class="p-2">${item.name}</td>
                                <td class="text-center p-2">${item.quantity}</td>
                                <td class="text-right p-2">₹${item.price.toFixed(2)}</td>
                                <td class="text-right p-2">₹${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot class="font-semibold">
                        <tr>
                            <td colspan="3" class="text-right p-2 border-t">Subtotal</td>
                            <td class="text-right p-2 border-t">₹${order.subtotal.toFixed(2)}</td>
                        </tr>
                         <tr>
                            <td colspan="3" class="text-right p-2">Delivery Fee</td>
                            <td class="text-right p-2">₹${(order.deliveryFee || 0).toFixed(2)}</td>
                        </tr>
                         <tr>
                            <td colspan="3" class="text-right p-2">Platform Fee</td>
                            <td class="text-right p-2">₹${(order.platformFee || 0).toFixed(2)}</td>
                        </tr>
                         <tr>
                            <td colspan="3" class="text-right p-2">GST (${order.gstRate || siteSettings.gstRate}%)</td>
                            <td class="text-right p-2">₹${order.gst.toFixed(2)}</td>
                        </tr>
                        <tr class="text-xl font-bold border-t-2 bg-gray-100">
                            <td colspan="3" class="text-right p-2">Grand Total</td>
                            <td class="text-right p-2">₹${order.totalPrice.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                <p class="text-center text-xs text-gray-500">Thank you for your order!</p>
            </div>
        </div>
        <div class="flex justify-end gap-4 mt-4">
            <button class="btn bg-gray-200" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="downloadBillAsPDF('${orderId}')">Download Bill</button>
        </div>
    `;
    if(targetContainer) {
        targetContainer.innerHTML = billHtml;
    } else {
        showModal(billHtml);
    }
    new QRCode(document.getElementById("qrcode-container"), {
        text: orderId,
        width: 80,
        height: 80,
    });
}

function downloadBillAsPDF(orderId) {
    const element = document.getElementById('printable-bill');
    const opt = {
      margin:       0.5,
      filename:     `UniFood_Invoice_${orderId.substring(0,8)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
}
        
async function showRatingForm(orderId) {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    const order = orderDoc.data();

    const formHtml = `
        <form id="rating-form" class="space-y-6">
            <h3 class="text-2xl font-bold font-serif mb-4">Rate Your Order</h3>
            
            <div class="p-4 border rounded-lg">
                <p class="font-semibold">Rate the Restaurant: ${order.restaurantName}</p>
                <div class="rating flex items-center text-3xl" data-type="restaurant">
                    <span class="star" data-value="1"><i data-feather="star"></i></span>
                    <span class="star" data-value="2"><i data-feather="star"></i></span>
                    <span class="star" data-value="3"><i data-feather="star"></i></span>
                    <span class="star" data-value="4"><i data-feather="star"></i></span>
                    <span class="star" data-value="5"><i data-feather="star"></i></span>
                </div>
                <textarea name="restaurantReview" class="input-field w-full mt-2" rows="2" placeholder="Tell us about the food..."></textarea>
            </div>

            <div class="p-4 border rounded-lg">
                <p class="font-semibold">Rate the Delivery by: ${order.deliveryBoyName || 'UniFood'}</p>
                <div class="rating flex items-center text-3xl" data-type="delivery">
                    <span class="star" data-value="1"><i data-feather="star"></i></span>
                    <span class="star" data-value="2"><i data-feather="star"></i></span>
                    <span class="star" data-value="3"><i data-feather="star"></i></span>
                    <span class="star" data-value="4"><i data-feather="star"></i></span>
                    <span class="star" data-value="5"><i data-feather="star"></i></span>
                </div>
                <textarea name="deliveryReview" class="input-field w-full mt-2" rows="2" placeholder="How was the delivery experience?"></textarea>
            </div>
            
            <input type="hidden" name="restaurantRating" value="0">
            <input type="hidden" name="deliveryRating" value="0">
            
            <div class="flex justify-end gap-4 pt-4">
                <button type="button" class="btn bg-gray-200" onclick="closeModal()">Skip</button>
                <button type="submit" class="btn btn-primary">Submit Review</button>
            </div>
        </form>
    `;
    showModal(formHtml);
    
    document.querySelectorAll('.rating .star').forEach(star => {
        star.addEventListener('click', () => {
            const ratingContainer = star.parentElement;
            const ratingType = ratingContainer.dataset.type;
            const value = parseInt(star.dataset.value);
            document.querySelector(`input[name="${ratingType}Rating"]`).value = value;
            
            ratingContainer.querySelectorAll('.star').forEach(s => {
                s.classList.toggle('selected', parseInt(s.dataset.value) <= value);
                s.querySelector('i').style.fill = parseInt(s.dataset.value) <= value ? '#f59e0b' : 'none';
            });
        });
    });

    document.getElementById('rating-form').addEventListener('submit', e => handlePostReview(e, orderId, order));
}

async function handlePostReview(e, orderId, orderData) {
    e.preventDefault();
    const form = e.target;
    const restaurantRating = parseInt(form.elements.restaurantRating.value);
    const deliveryRating = parseInt(form.elements.deliveryRating.value);

    if (restaurantRating === 0 || deliveryRating === 0) {
        showSimpleModal("Rating Required", "Please select a star rating for both the restaurant and the delivery.");
        return;
    }

    const reviewData = {
        orderId, customerId: currentUser.uid, customerName: currentUser.name,
        restaurantId: orderData.restaurantId, restaurantName: orderData.restaurantName,
        deliveryBoyId: orderData.deliveryBoyId, deliveryBoyName: orderData.deliveryBoyName,
        restaurantRating, restaurantReview: form.elements.restaurantReview.value,
        deliveryRating, deliveryReview: form.elements.deliveryReview.value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('reviews').add(reviewData);
    await db.collection('orders').doc(orderId).update({ isReviewed: true });

    // Update restaurant average rating
    const restRef = db.collection('restaurants').doc(orderData.restaurantId);
    db.runTransaction(async (transaction) => {
        const restDoc = await transaction.get(restRef);
        const data = restDoc.data();
        const newAvgRating = ((data.avgRating || 0) * (data.ratingCount || 0) + restaurantRating) / ((data.ratingCount || 0) + 1);
        transaction.update(restRef, {
            avgRating: newAvgRating,
            ratingCount: firebase.firestore.FieldValue.increment(1)
        });
    });

    // Update delivery boy average rating
    if (orderData.deliveryBoyId) {
        const deliveryRef = db.collection('users').doc(orderData.deliveryBoyId);
        db.runTransaction(async (transaction) => {
            const deliveryDoc = await transaction.get(deliveryRef);
            const data = deliveryDoc.data();
            const newAvgRating = ((data.avgRating || 0) * (data.ratingCount || 0) + deliveryRating) / ((data.ratingCount || 0) + 1);
            transaction.update(deliveryRef, {
                avgRating: newAvgRating,
                ratingCount: firebase.firestore.FieldValue.increment(1)
            });
        });
    }
    
    await logAudit("Review Submitted", `Order ID: ${orderId}`);
    showSimpleModal("Thank You!", "Your review has been submitted.");
    closeModal();
}

function showModal(contentHtml) {
    modalContainer.innerHTML = `<div class="modal-content">${contentHtml}</div>`;
    modalContainer.classList.add('active');
    feather.replace();
}

function showSimpleModal(title, message, onOk) {
    const modalHtml = `
        <div class="text-center">
            <h3 class="text-2xl font-bold font-serif mb-2">${title}</h3>
            <p class="text-gray-600 mb-6">${message}</p>
            <button id="simple-modal-ok" class="btn btn-primary rounded-lg py-2 px-12">OK</button>
        </div>
    `;
    showModal(modalHtml);
    document.getElementById('simple-modal-ok').addEventListener('click', () => {
        if (onOk) onOk();
        closeModal();
    });
}

function showConfirmationModal(title, message, onConfirm, onCancel) {
    const modalHtml = `
        <div class="text-center">
            <h3 class="text-2xl font-bold font-serif mb-2">${title}</h3>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="flex justify-center gap-4">
                <button id="confirm-cancel" class="btn bg-gray-200 rounded-lg py-2 px-8">Cancel</button>
                <button id="confirm-ok" class="btn btn-danger rounded-lg py-2 px-8">Confirm</button>
            </div>
        </div>
    `;
    showModal(modalHtml);

    document.getElementById('confirm-ok').addEventListener('click', () => {
        if (onConfirm) onConfirm();
        closeModal();
    });
    document.getElementById('confirm-cancel').addEventListener('click', () => {
        if (onCancel) onCancel();
        closeModal();
    });
}

function closeModal() {
    if (document.getElementById('qr-reader')) {
        stopScanner();
    }
    modalContainer.classList.remove('active');
    modalContainer.innerHTML = '';
}

function cleanupListeners() {
    unsubscribeListeners.forEach(unsub => unsub());
    unsubscribeListeners = [];
     if (html5QrCode && html5QrCode.isScanning) {
        stopScanner();
    }
}

// --- MOBILE MENU LOGIC ---
function openMobileMenu() {
    mobileMenuOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        mobileMenuOverlay.classList.remove('opacity-0');
        mobileMenu.classList.remove('translate-x-full');
    }, 10);
}

function closeMobileMenu() {
    mobileMenuOverlay.classList.add('opacity-0');
    mobileMenu.classList.add('translate-x-full');
    document.body.style.overflow = '';
    setTimeout(() => {
        mobileMenuOverlay.classList.add('hidden');
    }, 300);
}

mobileMenuButton.addEventListener('click', openMobileMenu);
closeMobileMenuButton.addEventListener('click', closeMobileMenu);
mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
    }
});


// --- INITIALIZE APP ON LOAD ---
document.addEventListener('DOMContentLoaded', initializeApp);

const handleLogout = () => {
    cleanupListeners();
    auth.signOut().then(() => {
        window.location.reload();
    });
};

logoutBtn.addEventListener('click', handleLogout);
mobileLogoutBtn.addEventListener('click', handleLogout);

// --- AI CHATBOT SCRIPT ---
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('hidden');
    feather.replace();
});

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        const userMessage = e.target.value.trim();
        appendMessage(userMessage, 'user');
        e.target.value = '';
        getAiResponse(userMessage);
    }
});

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `text-sm p-2 rounded-lg mb-2 ${sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-100'}`;
    messageDiv.style.maxWidth = '80%';
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll
}

function getAiResponse(message) {
    const lowerCaseMessage = message.toLowerCase();
    let response = "I'm not sure how to answer that. Try asking about orders, restaurants, or your profile.";

    if (lowerCaseMessage.includes("track my order")) {
        response = "Sure! Can you please provide the order ID?";
    } else if (lowerCaseMessage.includes("help")) {
        response = `I can help with tracking orders, finding restaurants, and answering questions about your account. What do you need assistance with?`;
    } else if (lowerCaseMessage.includes("best restaurants")) {
        response = "Based on your recent orders, I recommend trying 'The Pizza Palace' or 'Curry Kingdom'.";
    } else if (lowerCaseMessage.includes("how to add menu item") && currentUser?.role === 'restaurant') {
        response = "Go to 'Menu Management' in your portal and click the 'Add Item' button. I can guide you through the steps if you'd like!";
    }

    setTimeout(() => {
        appendMessage(response, 'ai');
    }, 500);
}

feather.replace();
// --- END OF AI CHATBOT SCRIPT ---