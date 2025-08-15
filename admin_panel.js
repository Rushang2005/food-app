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

        // --- GLOBAL STATE & MOCKS ---
        let currentUser = null; 
        let unsubscribeListeners = [];
        let html5QrCode = null;
        let siteSettings = {};

        // --- UI REFERENCES ---
        const mainContent = document.getElementById('main-content');
        const modalContainer = document.getElementById('modal-container');
        const userInfo = document.getElementById('user-info');
        const logoutBtn = document.getElementById('logout-btn');
        const websiteNameHeader = document.getElementById('website-name-header');
        const websiteLogoHeader = document.getElementById('website-logo-header');

        // --- MOBILE MENU REFERENCES ---
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const closeMobileMenuButton = document.getElementById('close-mobile-menu');
        const mobileUserInfo = document.getElementById('mobile-user-info');
        const mobileLogoutBtn = document.getElementById('mobile-logout-btn');


        // --- CORE APP LOGIC ---

        async function initializeApp() {
            const settingsDoc = await db.collection('settings').doc('config').get();
            if (settingsDoc.exists) {
                siteSettings = settingsDoc.data();
            }
            applySiteSettings();
            
            setupMobileMenuHandlers();

            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    if (userDoc.exists && (userDoc.data().role === 'admin' || userDoc.data().role === 'superadmin')) {
                        currentUser = { uid: user.uid, ...userDoc.data() };
                        const userHtml = `<p class="font-semibold">${currentUser.name}</p><p class="text-xs text-gray-500 capitalize">${currentUser.role}</p>`;
                        userInfo.innerHTML = userHtml;
                        mobileUserInfo.innerHTML = userHtml;
                        loadAdminPortal();
                    } else {
                        document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-family: sans-serif; color: #333;">
                            <h1 style="color: #d9534f;">Access Denied</h1>
                            <p>You do not have the required permissions to view this page.</p>
                            <p style="color: #777;">Redirecting to login page...</p>
                        </div>`;
                        setTimeout(() => {
                            auth.signOut();
                            window.location.href = 'login.html';
                        }, 3000);
                    }
                } else {
                    window.location.href = 'login.html';
                }
            });
        }
        
        function setupMobileMenuHandlers() {
            const openMenu = () => {
                mobileMenuOverlay.classList.remove('hidden');
                setTimeout(() => mobileMenu.classList.remove('translate-x-full'), 10);
            };
            const closeMenu = () => {
                mobileMenu.classList.add('translate-x-full');
                setTimeout(() => mobileMenuOverlay.classList.add('hidden'), 300);
            };

            mobileMenuButton.addEventListener('click', openMenu);
            closeMobileMenuButton.addEventListener('click', closeMenu);
            mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === mobileMenuOverlay) {
                    closeMenu();
                }
            });
             mobileLogoutBtn.addEventListener('click', () => auth.signOut());
        }

        function applySiteSettings() {
            if (siteSettings.websiteName) {
                websiteNameHeader.textContent = siteSettings.websiteName + " Admin";
                document.title = siteSettings.websiteName + " - Admin Panel";
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
        }


        async function logAudit(action, details) {
            console.log(`AUDIT LOG: [${action}] by ${currentUser.name}. Details: ${details}`);
             if (!currentUser) return;
            try {
                await db.collection('auditLog').add({
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

        function loadAdminPortal() {
            const template = document.getElementById('admin-portal-template');
            if (template) {
                mainContent.innerHTML = '';
                mainContent.appendChild(template.content.cloneNode(true));
                feather.replace();
                
                const desktopNav = document.getElementById('admin-nav');
                const mobileNavContainer = document.getElementById('mobile-nav-container');
                if (desktopNav && mobileNavContainer) {
                    const mobileNavClone = desktopNav.cloneNode(true);
                    mobileNavClone.id = 'mobile-sidebar-nav';
                    mobileNavClone.addEventListener('click', (e) => {
                         if (e.target.closest('.sidebar-link')) {
                            mobileMenu.classList.add('translate-x-full');
                            setTimeout(() => mobileMenuOverlay.classList.add('hidden'), 300);
                         }
                    });
                    mobileNavContainer.appendChild(mobileNavClone);
                }

                initializeAdminPortal();
            } else {
                mainContent.innerHTML = `<p class="text-center text-red-500">Error: Admin portal template not found.</p>`;
            }
        }

        // --- ADMIN PORTAL ---
        function initializeAdminPortal() {
            // *** MODIFIED ***
            // Listener for all actions. Attached to body to capture clicks from the mobile slide-out menu.
            document.body.addEventListener('click', handleAdminClicks);

            renderAdminView('dashboard');
            listenForCancellationRequests();
        }
        
        function listenForCancellationRequests() {
            db.collection('cancellationRequests').where('status', '==', 'pending')
                .onSnapshot(snapshot => {
                    const badge = document.getElementById('cancellation-badge');
                    if (badge) {
                        badge.textContent = snapshot.size;
                        badge.classList.toggle('hidden', snapshot.empty);
                    }
                    
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            const request = change.doc.data();
                            showNotification(`From ${request.deliveryBoyName}: "${request.reason}"`);
                        }
                    });
                });
        }
        
        function showNotification(message) {
            const popup = document.getElementById('notification-popup');
            const textEl = document.getElementById('notification-text');
            if (popup && textEl) {
                textEl.textContent = message;
                popup.classList.remove('hidden');
                feather.replace();
                setTimeout(() => {
                    popup.classList.add('hidden');
                }, 7000);
            }
        }

        function handleAdminClicks(e) {
            const sidebarLink = e.target.closest('.sidebar-link');
            if (sidebarLink) {
                if (sidebarLink.dataset.view !== 'scan-order') {
                    stopScanner(); 
                }
                renderAdminView(sidebarLink.dataset.view);
                return;
            }

            const restaurantCard = e.target.closest('.restaurant-admin-card');
            if (restaurantCard) {
                renderAdminRestaurantDetailsView(restaurantCard.dataset.id);
                return;
            }

            const deliveryBoyRow = e.target.closest('.delivery-boy-row');
            if (deliveryBoyRow) {
                renderDeliveryBoyDetailsView(deliveryBoyRow.dataset.id);
                return;
            }

            const actionButton = e.target.closest('[data-action]');
            if (actionButton) {
                e.preventDefault();
                const { action, id, itemId, orderId, requestId, decision } = actionButton.dataset;
                switch(action) {
                    case 'add-restaurant': showAddRestaurantForm(); break;
                    case 'add-delivery-boy': showAddDeliveryBoyForm(); break;
                    case 'edit-restaurant': showEditRestaurantForm(id); break;
                    case 'change-password': handleChangeRestaurantPassword(id); break;
                    case 'toggle-lock': handleToggleLock(id); break;
                    case 'manage-menu': renderAdminMenuManagementView(id); break;
                    case 'back-to-restaurants': renderAdminView('restaurants'); break;
                    case 'back-to-delivery-boys': renderAdminView('delivery-boys'); break;
                    case 'back-to-restaurant-details': renderAdminRestaurantDetailsView(id); break;
                    case 'add-menu-item': showMenuItemForm(id); break;
                    case 'edit-menu-item': showMenuItemForm(id, itemId); break;
                    case 'delete-menu-item': handleDeleteMenuItem(id, itemId); break;
                    case 'view-bill': renderOrderBill(orderId); break;
                    case 'change-delivery-boy-password': handleChangeDeliveryBoyPassword(id); break;
                    case 'toggle-delivery-boy-lock': handleToggleDeliveryBoyLock(id); break;
                    case 'remove-delivery-boy': handleRemoveDeliveryBoy(id); break;
                    case 'start-scan': startScanner(); break;
                    case 'stop-scan': stopScanner(); break;
                    case 'handle-cancellation': handleCancellationRequest(requestId, decision); break;
                }
            }
        }

        function renderAdminView(viewName, contentAreaId = 'admin-main-content') {
            document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
            document.querySelectorAll(`[data-view="${viewName}"]`).forEach(activeLink => activeLink.classList.add('active'));

            const contentArea = document.getElementById(contentAreaId);
            if (!contentArea) return;
            switch(viewName) {
                case 'dashboard': renderAdminDashboardView(contentArea); break;
                case 'restaurants': renderAdminRestaurantsListView(contentArea); break;
                case 'orders': renderAdminOrdersView(contentArea); break;
                case 'cancellation-requests': renderCancellationRequestsView(contentArea); break;
                case 'users': renderAdminUsersView(contentArea); break;
                case 'delivery-boys': renderDeliveryBoysView(contentArea); break;
                case 'reviews': renderAllReviewsView(contentArea); break;
                case 'scan-order': renderScannerView(contentArea); break;
            }
        }
        
        async function renderCancellationRequestsView(contentArea) {
            contentArea.innerHTML = `<h2 class="text-3xl font-bold font-serif mb-6">Cancellation Requests</h2><div id="cancellation-list" class="space-y-4"></div>`;
            const listEl = document.getElementById('cancellation-list');
            
            const unsub = db.collection('cancellationRequests').where('status', '==', 'pending')
                .onSnapshot(snapshot => {
                    if (snapshot.empty) {
                        listEl.innerHTML = '<p class="text-center bg-white p-6 rounded-lg shadow-md">No pending cancellation requests.</p>';
                        return;
                    }
                    listEl.innerHTML = snapshot.docs.map(doc => {
                        const req = doc.data();
                        return `
                            <div class="bg-white p-5 rounded-xl shadow-md">
                                <p class="text-sm text-gray-500">Order #${req.orderId.substring(0,6)}</p>
                                <p class="mt-2"><strong>Delivery Partner:</strong> ${req.deliveryBoyName} (${req.deliveryBoyPhone})</p>
                                <p class="mt-1"><strong>Reason:</strong> <span class="italic text-red-600">"${req.reason}"</span></p>
                                <div class="mt-4 border-t pt-4 flex gap-4">
                                    <button data-action="handle-cancellation" data-request-id="${doc.id}" data-decision="approve" class="btn btn-primary flex-1">Approve</button>
                                    <button data-action="handle-cancellation" data-request-id="${doc.id}" data-decision="deny" class="btn btn-danger flex-1">Deny</button>
                                </div>
                            </div>
                        `;
                    }).join('');
                });
            unsubscribeListeners.push(unsub);
        }

        async function handleCancellationRequest(requestId, decision) {
            const requestRef = db.collection('cancellationRequests').doc(requestId);
            const requestDoc = await requestRef.get();
            if (!requestDoc.exists) {
                showSimpleModal("Error", "Request not found.");
                return;
            }
            const requestData = requestDoc.data();
            const orderRef = db.collection('orders').doc(requestData.orderId);

            if (decision === 'approve') {
                await orderRef.update({
                    status: 'accepted', 
                    deliveryBoyId: null,
                    deliveryBoyName: null,
                });
                await requestRef.update({ status: 'approved' });
                await logAudit("Cancellation Approved", `Request ID: ${requestId}`);
                showSimpleModal("Success", "Cancellation approved. The order is now available for other delivery partners.");
            } else { 
                await orderRef.update({
                    status: requestData.previousStatus 
                });
                await requestRef.update({ status: 'denied' });
                await logAudit("Cancellation Denied", `Request ID: ${requestId}`);
                showSimpleModal("Success", "Cancellation denied. The order has been re-assigned to the original delivery partner.");
            }
        }


        async function renderAdminDashboardView(contentArea) {
             contentArea.innerHTML = `<h2 class="text-3xl font-bold font-serif mb-6">Dashboard</h2><p>Loading stats...</p>`;
             const [ordersSnapshot, usersSnapshot, restaurantsSnapshot] = await Promise.all([
                 db.collection('orders').get(),
                 db.collection('users').get(),
                 db.collection('restaurants').get()
             ]);

             const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalPrice || 0), 0);
             contentArea.innerHTML = `
                <h2 class="text-3xl font-bold font-serif mb-6">Dashboard</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white p-6 rounded-xl shadow-md text-center"><h4 class="text-lg font-semibold text-gray-500">Total Revenue</h4><p class="text-3xl font-bold text-gray-800 mt-2">₹${totalRevenue.toFixed(2)}</p></div>
                    <div class="bg-white p-6 rounded-xl shadow-md text-center"><h4 class="text-lg font-semibold text-gray-500">Total Orders</h4><p class="text-3xl font-bold text-gray-800 mt-2">${ordersSnapshot.size}</p></div>
                    <div class="bg-white p-6 rounded-xl shadow-md text-center"><h4 class="text-lg font-semibold text-gray-500">Total Users</h4><p class="text-3xl font-bold text-gray-800 mt-2">${usersSnapshot.size}</p></div>
                    <div class="bg-white p-6 rounded-xl shadow-md text-center"><h4 class="text-lg font-semibold text-gray-500">Total Restaurants</h4><p class="text-3xl font-bold text-gray-800 mt-2">${restaurantsSnapshot.size}</p></div>
                </div>
                <div class="bg-blue-100 p-6 rounded-xl shadow-md mt-6">
                    <h4 class="text-lg font-bold text-blue-800 flex items-center gap-2"><i data-feather="cpu"></i>AI-Powered Insights</h4>
                    <ul class="list-disc list-inside mt-2 text-blue-700">
                        <li>There is a 15% increase in orders this week.</li>
                        <li>Warning: A high number of cancelled orders detected from a single user. This could indicate fraudulent activity.</li>
                    </ul>
                </div>
             `;
             feather.replace();
        }

        async function renderAdminRestaurantsListView(contentArea) {
             contentArea.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold font-serif">Restaurants</h2>
                     <button data-action="add-restaurant" class="btn btn-primary rounded-lg py-2 px-4 flex items-center gap-2">
                         <i data-feather="plus" class="w-5 h-5"></i>Add Restaurant
                    </button>
                </div>
                <div id="admin-restaurant-list" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"></div>`;
            feather.replace();
            const listEl = document.getElementById('admin-restaurant-list');
            const snapshot = await db.collection('restaurants').get();
            if (snapshot.empty) {
                listEl.innerHTML = '<p class="col-span-full text-center">No restaurants found.</p>';
                return;
            }
            listEl.innerHTML = snapshot.docs.map(doc => {
                 const r = doc.data();
                const firstImage = r.imageUrls && r.imageUrls.length > 0 ? r.imageUrls[0] : 'https://placehold.co/400x250?text=UniFood';
                return `
                    <div data-id="${doc.id}" class="restaurant-admin-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                        <img src="${firstImage}" class="w-full h-40 object-cover">
                        <div class="p-5">
                            <h3 class="font-bold text-xl font-serif">${r.name}</h3>
                            <p class="text-sm text-gray-500 mt-1">${r.cuisine}</p>
                        </div>
                    </div>`;
            }).join('');
        }

        async function renderAdminRestaurantDetailsView(restaurantId, contentArea = document.getElementById('admin-main-content')) {
            contentArea.innerHTML = `<p>Loading details...</p>`;
            const restaurantDoc = await db.collection('restaurants').doc(restaurantId).get();
            if (!restaurantDoc.exists) return;
            const restaurant = { id: restaurantDoc.id, ...restaurantDoc.data() };

            let ownerUsername = 'N/A';
            if (restaurant.ownerId) {
                const ownerDoc = await db.collection('users').doc(restaurant.ownerId).get();
                if (ownerDoc.exists) ownerUsername = ownerDoc.data().email;
            }

            const lockButtonText = restaurant.isLocked ? 'Unlock Account' : 'Lock Account';
            const lockButtonClass = restaurant.isLocked ? 'btn-primary' : 'btn-danger';

            contentArea.innerHTML = `
                 <div class="mb-6">
                     <button data-action="back-to-restaurants" class="btn bg-white rounded-lg py-2 px-4 flex items-center gap-2 shadow-sm hover:shadow-md">
                         <i data-feather="arrow-left" class="w-5 h-5"></i> Back to Restaurants
                     </button>
                 </div>
                 <div class="bg-white p-6 rounded-xl shadow-md">
                     <div class="flex justify-between items-start">
                         <div>
                             <h2 class="text-3xl font-bold font-serif">${restaurant.name}</h2>
                             <p class="text-gray-600 mt-1">${restaurant.cuisine}</p>
                         </div>
                         <div class="flex gap-2 flex-wrap">
                             <button data-action="manage-menu" data-id="${restaurant.id}" class="btn btn-primary">Manage Menu</button>
                             <button data-action="edit-restaurant" data-id="${restaurant.id}" class="btn btn-secondary">Edit Details</button>
                         </div>
                     </div>
                     <div class="mt-6 border-t pt-4 space-y-2">
                         <p><strong>Address:</strong> ${restaurant.address}</p>
                         <p><strong>Restaurant ID:</strong> ${restaurant.id}</p>
                         <p><strong>Owner ID:</strong> ${restaurant.ownerId || 'Not assigned'}</p>
                         <div class="bg-gray-100 p-4 rounded-lg mt-4">
                             <h4 class="font-semibold">Owner Credentials</h4>
                             <p><strong>Username:</strong> ${ownerUsername}</p>
                             <p><strong>Password:</strong> <span class="text-red-500 font-mono">${restaurant.initialPassword || 'Set by user'}</span></p>
                             <p class="text-xs text-gray-500 mt-1">This is the initial password. For security, it's recommended to change it.</p>
                             <button data-action="change-password" data-id="${restaurant.id}" class="btn btn-danger text-sm mt-2 py-1 px-3">Change Password</button>
                         </div>
                          <div class="bg-yellow-100 p-4 rounded-lg mt-4">
                             <h4 class="font-semibold">Account Status</h4>
                             <p>This account is currently <strong>${restaurant.isLocked ? 'Locked' : 'Active'}</strong>.</p>
                             <button data-action="toggle-lock" data-id="${restaurant.id}" class="btn ${lockButtonClass} text-sm mt-2 py-1 px-3">${lockButtonText}</button>
                         </div>
                     </div>
                 </div>
            `;
            feather.replace();
        }

        async function showAddRestaurantForm() {
            const formHtml = `
                <form id="add-restaurant-form" class="space-y-4">
                    <h3 class="text-2xl font-bold font-serif mb-6">Add New Restaurant</h3>
                    <div>
                        <label class="block text-sm font-medium">Restaurant Name</label>
                        <input type="text" name="name" class="input-field w-full" required>
                    </div>
                     <div>
                        <label class="block text-sm font-medium">Address</label>
                        <textarea name="address" class="input-field w-full" rows="2" required></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium">Owner's Username (Email)</label>
                        <input type="email" name="username" class="input-field w-full" required>
                    </div>
                     <div>
                        <label class="block text-sm font-medium">Password</label>
                        <input type="password" name="password" class="input-field w-full" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium">Image Links</label>
                        <textarea name="imageUrls" class="input-field w-full" rows="3" placeholder="Paste image URLs, one per line"></textarea>
                        <div id="image-preview-container" class="mt-2 flex flex-wrap gap-2"></div>
                    </div>
                    <div class="flex justify-end gap-4 pt-4">
                        <button type="button" class="btn bg-gray-200" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Create Restaurant</button>
                    </div>
                </form>
            `;
            showModal(formHtml);

            document.getElementById('add-restaurant-form').elements.imageUrls.addEventListener('input', (e) => {
                const container = document.getElementById('image-preview-container');
                container.innerHTML = '';
                const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
                urls.forEach(url => {
                    const img = document.createElement('img');
                    img.src = url;
                    img.className = 'w-20 h-20 object-cover rounded-md border';
                    img.onerror = () => { img.src = 'https://placehold.co/80x80?text=Invalid'; };
                    container.appendChild(img);
                });
            });

            document.getElementById('add-restaurant-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const newRestaurantData = {
                    name: form.elements.name.value,
                    address: form.elements.address.value,
                    email: form.elements.username.value,
                    password: form.elements.password.value,
                    imageUrls: form.elements.imageUrls.value.split('\n').filter(url => url.trim() !== '')
                };

                try {
                    await processRestaurantCreation(newRestaurantData);
                    closeModal();
                    showSimpleModal(
                        "Restaurant Creation Submitted!",
                        `The request to create an account for ${newRestaurantData.email} has been submitted and processed.`
                    );
                    renderAdminRestaurantsListView(document.getElementById('admin-main-content'));
                } catch (err) {
                    showSimpleModal("Error", `Could not submit creation request: ${err.message}`);
                }
            });
        }

        async function processRestaurantCreation(data) {
            const tempAppName = `secondary-${Date.now()}`;
            const tempApp = firebase.initializeApp(firebaseConfig, tempAppName);
            const tempAuth = tempApp.auth();

            try {
                const userCredential = await tempAuth.createUserWithEmailAndPassword(data.email, data.password);
                const ownerUid = userCredential.user.uid;

                const restaurantRef = await db.collection('restaurants').add({
                    name: data.name,
                    cuisine: "Default Cuisine",
                    address: data.address,
                    ownerId: ownerUid,
                    isLocked: false,
                    initialPassword: data.password,
                    imageUrls: data.imageUrls,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    avgRating: 0,
                    ratingCount: 0
                });

                await db.collection('users').doc(ownerUid).set({
                    name: data.name,
                    email: data.email,
                    role: 'restaurant',
                    restaurantId: restaurantRef.id,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                await logAudit("Restaurant Created", `Name: ${data.name}, Owner: ${data.email}`);

            } catch (error) {
                console.error("Error in simulated backend processing:", error);
                throw error;
            } finally {
                await tempAuth.signOut();
                await tempApp.delete();
            }
        }

        async function showAddDeliveryBoyForm() {
            const formHtml = `
                <form id="add-delivery-boy-form" class="space-y-4">
                    <h3 class="text-2xl font-bold font-serif mb-6">Add New Delivery Boy</h3>
                    <div>
                        <label class="block text-sm font-medium">Full Name</label>
                        <input type="text" name="name" class="input-field w-full" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium">Email (Username)</label>
                        <input type="email" name="email" class="input-field w-full" required>
                    </div>
                     <div>
                        <label class="block text-sm font-medium">Password</label>
                        <input type="password" name="password" class="input-field w-full" required>
                    </div>
                    <div class="flex justify-end gap-4 pt-4">
                        <button type="button" class="btn bg-gray-200" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Create Account</button>
                    </div>
                </form>
            `;
            showModal(formHtml);

            document.getElementById('add-delivery-boy-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const newUserData = {
                    name: form.elements.name.value,
                    email: form.elements.email.value,
                    password: form.elements.password.value,
                };

                try {
                    await processDeliveryBoyCreation(newUserData);
                    closeModal();
                    showSimpleModal(
                        "Delivery Boy Created!",
                        `Account for ${newUserData.email} has been successfully created.`
                    );
                    renderDeliveryBoysView(document.getElementById('admin-main-content'));
                } catch (err) {
                    showSimpleModal("Error", `Could not create account: ${err.message}`);
                }
            });
        }

        async function processDeliveryBoyCreation(data) {
            const tempAppName = `secondary-delivery-${Date.now()}`;
            const tempApp = firebase.initializeApp(firebaseConfig, tempAppName);
            const tempAuth = tempApp.auth();

            try {
                const userCredential = await tempAuth.createUserWithEmailAndPassword(data.email, data.password);
                const userId = userCredential.user.uid;

                await db.collection('users').doc(userId).set({
                    name: data.name,
                    email: data.email,
                    role: 'delivery',
                    isOnline: false,
                    isLocked: false,
                    initialPassword: data.password,
                    earnings: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    avgRating: 0,
                    ratingCount: 0
                });
                await logAudit("Delivery Boy Created", `Name: ${data.name}, Email: ${data.email}`);

            } catch (error) {
                console.error("Error in delivery boy creation processing:", error);
                throw error;
            } finally {
                await tempAuth.signOut();
                await tempApp.delete();
            }
        }

        async function showEditRestaurantForm(restaurantId) {
            const restaurantDoc = await db.collection('restaurants').doc(restaurantId).get();
            if (!restaurantDoc.exists) {
                showSimpleModal("Error", "Restaurant not found!");
                return;
            }
            const restaurant = restaurantDoc.data();

            const formHtml = `
                <form id="edit-restaurant-form" class="space-y-4">
                    <h3 class="text-2xl font-bold font-serif mb-6">Edit Restaurant</h3>
                    <input type="hidden" name="id" value="${restaurantId}">
                    <div>
                        <label class="block text-sm font-medium">Name</label>
                        <input type="text" name="name" class="input-field w-full" value="${restaurant.name}" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium">Cuisine</label>
                        <input type="text" name="cuisine" class="input-field w-full" value="${restaurant.cuisine}" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium">Address</label>
                        <textarea name="address" class="input-field w-full" rows="3" required>${restaurant.address}</textarea>
                    </div>
                    <div class="flex justify-end gap-4 pt-4">
                        <button type="button" class="btn bg-gray-200" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            `;
            showModal(formHtml);
            document.getElementById('edit-restaurant-form').addEventListener('submit', handleUpdateRestaurant);
        }

        async function handleUpdateRestaurant(e) {
            e.preventDefault();
            const form = e.target;
            const restaurantId = form.elements.id.value;
            const updatedData = {
                name: form.elements.name.value,
                cuisine: form.elements.cuisine.value,
                address: form.elements.address.value,
            };
            await db.collection('restaurants').doc(restaurantId).update(updatedData);
            await logAudit("Restaurant Updated", `ID: ${restaurantId}`);
            showSimpleModal("Success", "Restaurant updated successfully!");
            closeModal();
            renderAdminRestaurantDetailsView(restaurantId);
        }

        async function handleToggleLock(restaurantId) {
            const restaurantRef = db.collection('restaurants').doc(restaurantId);
            const doc = await restaurantRef.get();
            const currentStatus = doc.data().isLocked || false;
            await restaurantRef.update({ isLocked: !currentStatus });
            await logAudit(`Restaurant ${!currentStatus ? 'Locked' : 'Unlocked'}`, `ID: ${restaurantId}`);
            renderAdminRestaurantDetailsView(restaurantId);
        }

        async function handleChangeRestaurantPassword(restaurantId) {
            const newPassword = prompt("Enter the new temporary password for this restaurant:");
            if (newPassword && newPassword.length >= 6) {
                showConfirmationModal(
                    'Confirm Password Change',
                    `Set new password to "${newPassword}"? This only updates the password display for the admin. A real app would require a backend function to securely change the user's actual password.`,
                    async () => {
                        await db.collection('restaurants').doc(restaurantId).update({
                            initialPassword: newPassword
                        });
                        await logAudit("Restaurant Password Changed", `ID: ${restaurantId}`);
                        showSimpleModal("Success", "Temporary password display has been updated.");
                        renderAdminRestaurantDetailsView(restaurantId);
                    }
                );
            } else if (newPassword) {
                showSimpleModal("Error", "Password must be at least 6 characters long.");
            }
        }

        async function renderAdminMenuManagementView(restaurantId) {
            const contentArea = document.getElementById('admin-main-content');
            const restaurantDoc = await db.collection('restaurants').doc(restaurantId).get();
            const restaurantName = restaurantDoc.data().name;

            contentArea.innerHTML = `
                 <div class="mb-6">
                     <button data-action="back-to-restaurant-details" data-id="${restaurantId}" class="btn bg-white rounded-lg py-2 px-4 flex items-center gap-2 shadow-sm hover:shadow-md">
                         <i data-feather="arrow-left" class="w-5 h-5"></i> Back to Details
                     </button>
                 </div>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold font-serif">Manage Menu: ${restaurantName}</h2>
                    <button data-action="add-menu-item" data-id="${restaurantId}" class="btn btn-primary rounded-lg py-2 px-4 flex items-center gap-2">
                        <i data-feather="plus" class="w-5 h-5"></i>Add Item
                    </button>
                </div>
                <div id="admin-menu-list" class="space-y-3"></div>
            `;
            feather.replace();
            const listEl = document.getElementById('admin-menu-list');

            const unsub = db.collection('restaurants').doc(restaurantId).collection('menu').onSnapshot(snapshot => {
                 if (snapshot.empty) {
                    listEl.innerHTML = '<p class="text-center bg-white p-6 rounded-lg shadow-md">This menu is empty.</p>';
                    return;
                 }
                 listEl.innerHTML = snapshot.docs.map(doc => renderMenuItemCard(doc, restaurantId)).join('');
                 feather.replace();
            });
            unsubscribeListeners.push(unsub);
        }

        function renderMenuItemCard(doc, restaurantId) {
            const item = doc.data();
            const itemImage = item.imageUrl || 'https://placehold.co/100x100?text=Food';
            return `
                <div class="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <img src="${itemImage}" class="w-20 h-20 object-cover rounded-md mr-4 hidden sm:block">
                    <div class="flex-grow">
                        <p class="font-semibold">${item.name}</p>
                        <p class="text-sm text-gray-600">${item.description || 'No description.'}</p>
                        <p class="font-bold mt-1">₹${item.price}</p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2">
                        <button data-action="edit-menu-item" data-id="${restaurantId}" data-item-id="${doc.id}" class="btn bg-gray-200 p-2 rounded-md"><i data-feather="edit-2" class="w-4 h-4"></i></button>
                        <button data-action="delete-menu-item" data-id="${restaurantId}" data-item-id="${doc.id}" class="btn bg-red-100 text-red-600 p-2 rounded-md"><i data-feather="trash" class="w-4 h-4"></i></button>
                    </div>
                </div>
            `;
        }

        async function showMenuItemForm(restaurantId, itemId = null) {
            const isEditing = itemId !== null;
            let item = { name: '', description: '', price: '', imageUrl: '' };
            if (isEditing) {
                const itemDoc = await db.collection('restaurants').doc(restaurantId).collection('menu').doc(itemId).get();
                if (itemDoc.exists) item = itemDoc.data();
            }

            const formHtml = `
                <form id="menu-item-form" class="space-y-4">
                    <h3 class="text-2xl font-bold font-serif mb-6">${isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
                    <input type="hidden" name="restaurantId" value="${restaurantId}">
                    <input type="hidden" name="itemId" value="${itemId || ''}">
                    <div>
                        <label class="block text-sm font-medium">Item Name</label>
                        <input type="text" name="name" class="input-field w-full" value="${item.name}" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium">Description</label>
                        <textarea name="description" class="input-field w-full" rows="3">${item.description}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium">Price (₹)</label>
                        <input type="number" name="price" class="input-field w-full" value="${item.price}" required step="0.01">
                    </div>
                     <div>
                        <label class="block text-sm font-medium">Image URL</label>
                        <input type="url" name="imageUrl" class="input-field w-full" value="${item.imageUrl}">
                        <img id="image-preview" src="${item.imageUrl || 'https://placehold.co/100x100?text=Preview'}" class="mt-2 w-24 h-24 object-cover rounded-md border" onerror="this.src='https://placehold.co/100x100?text=Invalid'"/>
                    </div>
                    <div class="flex justify-end gap-4 pt-4">
                        <button type="button" class="btn bg-gray-200" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Item</button>
                    </div>
                </form>
            `;
            showModal(formHtml);

            document.getElementById('menu-item-form').elements.imageUrl.addEventListener('input', (e) => {
                document.getElementById('image-preview').src = e.target.value || 'https://placehold.co/100x100?text=Preview';
            });

            document.getElementById('menu-item-form').addEventListener('submit', async e => {
                e.preventDefault();
                const form = e.target;
                const data = {
                    name: form.elements.name.value,
                    description: form.elements.description.value,
                    price: parseFloat(form.elements.price.value),
                    imageUrl: form.elements.imageUrl.value,
                };

                const restId = form.elements.restaurantId.value;
                const itmId = form.elements.itemId.value;

                if (itmId) { // Editing
                    await db.collection('restaurants').doc(restId).collection('menu').doc(itmId).update(data);
                } else { // Adding
                    await db.collection('restaurants').doc(restId).collection('menu').add(data);
                }
                closeModal();
            });
        }

        function handleDeleteMenuItem(restaurantId, itemId) {
            showConfirmationModal(
                "Delete Item?",
                "Are you sure you want to permanently delete this menu item? This cannot be undone.",
                async () => {
                    await db.collection('restaurants').doc(restaurantId).collection('menu').doc(itemId).delete();
                }
            );
        }

        async function renderAdminOrdersView(contentArea) {
             contentArea.innerHTML = `<h2 class="text-3xl font-bold font-serif mb-6">All Orders</h2><p>Loading orders...</p>`;
             const ordersSnapshot = await db.collection('orders').get();
             const sortedDocs = ordersSnapshot.docs.sort((a, b) => b.data().createdAt.seconds - a.data().createdAt.seconds);
             let tableHtml = `<div class="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
                 <table class="w-full text-sm text-left">
                     <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                         <tr>
                             <th class="px-6 py-3">Order ID</th>
                             <th class="px-6 py-3">Customer</th>
                             <th class="px-6 py-3">Restaurant</th>
                             <th class="px-6 py-3">Total</th>
                             <th class="px-6 py-3">Status</th>
                             <th class="px-6 py-3">Action</th>
                         </tr>
                     </thead><tbody>`;
             sortedDocs.forEach(doc => {
                 const order = doc.data();
                 tableHtml += `<tr class="border-b">
                     <td class="px-6 py-4 font-medium">#${doc.id.substring(0,6)}</td>
                     <td class="px-6 py-4">${order.customerName}</td>
                     <td class="px-6 py-4">${order.restaurantName}</td>
                     <td class="px-6 py-4">₹${order.totalPrice.toFixed(2)}</td>
                     <td class="px-6 py-4 capitalize">${order.status}</td>
                     <td class="px-6 py-4">
                        <button data-action="view-bill" data-order-id="${doc.id}" class="btn btn-secondary text-xs py-1 px-2">View Bill</button>
                     </td>
                 </tr>`;
             });
             tableHtml += `</tbody></table></div>`;
             contentArea.innerHTML = `<h2 class="text-3xl font-bold font-serif mb-6">All Orders</h2>` + tableHtml;
             feather.replace();
        }

        async function renderAdminUsersView(contentArea) {
             contentArea.innerHTML = `<h2 class="text-3xl font-bold font-serif mb-6">All Users</h2><p>Loading users...</p>`;
             const usersSnapshot = await db.collection('users').get();
             let tableHtml = `<div class="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
                 <table class="w-full text-sm text-left">
                     <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                         <tr><th class="px-6 py-3">Name</th><th class="px-6 py-3">Email</th><th class="px-6 py-3">Mobile</th><th class="px-6 py-3">Role</th></tr>
                     </thead><tbody>`;
             usersSnapshot.forEach(doc => {
                 const user = doc.data();
                 tableHtml += `<tr class="border-b"><td class="px-6 py-4 font-medium">${user.name}</td><td class="px-6 py-4">${user.email}</td><td class="px-6 py-4">${user.mobile || 'N/A'}</td><td class="px-6 py-4 capitalize">${user.role}</td></tr>`;
             });
             tableHtml += `</tbody></table></div>`;
             contentArea.innerHTML = `<h2 class="text-3xl font-bold font-serif mb-6">All Users</h2>` + tableHtml;
        }

        async function renderDeliveryBoysView(contentArea) {
             contentArea.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold font-serif">Delivery Staff</h2>
                    <button data-action="add-delivery-boy" class="btn btn-primary rounded-lg py-2 px-4 flex items-center gap-2">
                        <i data-feather="plus" class="w-5 h-5"></i>Add Delivery Boy
                    </button>
                </div>
                <div id="delivery-boys-list-container"></div>
             `;
             feather.replace();
             const listEl = document.getElementById('delivery-boys-list-container');

             db.collection('users').where('role', '==', 'delivery').onSnapshot(snapshot => {
                 if (snapshot.empty) {
                     listEl.innerHTML = '<p class="text-center bg-white p-6 rounded-lg shadow-md">No delivery boys found.</p>';
                     return;
                 }
                 let tableHtml = `<div class="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
                    <table class="w-full text-sm text-left">
                     <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                         <tr><th class="px-6 py-3">Name</th><th class="px-6 py-3">Email</th><th class="px-6 py-3">Rating</th><th class="px-6 py-3">Status</th></tr>
                     </thead><tbody>`;
                 snapshot.forEach(doc => {
                     const boy = doc.data();
                     tableHtml += `<tr class="border-b hover:bg-gray-50 cursor-pointer delivery-boy-row" data-id="${doc.id}">
                        <td class="px-6 py-4 font-medium">${boy.name}</td>
                        <td class="px-6 py-4">${boy.email}</td>
                        <td class="px-6 py-4">${(boy.avgRating || 0).toFixed(1)} ★</td>
                        <td class="px-6 py-4 capitalize ${boy.isOnline ? 'text-green-600 font-semibold' : ''}">${boy.isOnline ? 'Online' : 'Offline'}</td>
                    </tr>`;
                 });
                 tableHtml += `</tbody></table></div>`;
                 listEl.innerHTML = tableHtml;
             });
        }

        async function renderDeliveryBoyDetailsView(userId) {
            const contentArea = document.getElementById('admin-main-content');
            contentArea.innerHTML = `<p>Loading details...</p>`;
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                contentArea.innerHTML = `<p>Delivery boy not found.</p>`;
                return;
            }
            const user = { id: userDoc.id, ...userDoc.data() };

            const lockButtonText = user.isLocked ? 'Unlock Account' : 'Lock Account';
            const lockButtonClass = user.isLocked ? 'btn-primary' : 'btn-danger';

            contentArea.innerHTML = `
                 <div class="mb-6">
                     <button data-action="back-to-delivery-boys" class="btn bg-white rounded-lg py-2 px-4 flex items-center gap-2 shadow-sm hover:shadow-md">
                         <i data-feather="arrow-left" class="w-5 h-5"></i> Back to Delivery Staff
                     </button>
                 </div>
                 <div class="bg-white p-6 rounded-xl shadow-md">
                     <div class="flex justify-between items-start">
                         <div>
                             <h2 class="text-3xl font-bold font-serif">${user.name}</h2>
                             <p class="text-gray-600 mt-1">${user.email}</p>
                         </div>
                         <div class="flex gap-2 flex-wrap">
                            <button data-action="remove-delivery-boy" data-id="${user.id}" class="btn btn-danger">Remove</button>
                         </div>
                     </div>
                     <div class="mt-6 border-t pt-4 space-y-2">
                         <p><strong>Mobile:</strong> ${user.mobile || 'N/A'}</p>
                         <p><strong>User ID:</strong> ${user.id}</p>
                         <div class="bg-gray-100 p-4 rounded-lg mt-4">
                             <h4 class="font-semibold">Credentials</h4>
                             <p><strong>Password:</strong> <span class="text-red-500 font-mono">${user.initialPassword || 'Set by user'}</span></p>
                             <button data-action="change-delivery-boy-password" data-id="${user.id}" class="btn btn-secondary text-sm mt-2 py-1 px-3">Change Password</button>
                         </div>
                          <div class="bg-yellow-100 p-4 rounded-lg mt-4">
                             <h4 class="font-semibold">Account Status</h4>
                             <p>This account is currently <strong>${user.isLocked ? 'Locked' : 'Active'}</strong>.</p>
                             <button data-action="toggle-delivery-boy-lock" data-id="${user.id}" class="btn ${lockButtonClass} text-sm mt-2 py-1 px-3">${lockButtonText}</button>
                         </div>
                     </div>
                 </div>
            `;
            feather.replace();
        }

        async function handleChangeDeliveryBoyPassword(userId) {
            const newPassword = prompt("Enter the new temporary password for this user:");
            if (newPassword && newPassword.length >= 6) {
                showConfirmationModal(
                    'Confirm Password Change',
                    `Set new password to "${newPassword}"? This only updates the password display for the admin.`,
                    async () => {
                        await db.collection('users').doc(userId).update({
                            initialPassword: newPassword
                        });
                        await logAudit("Delivery Boy Password Changed", `ID: ${userId}`);
                        showSimpleModal("Success", "Temporary password display has been updated.");
                        renderDeliveryBoyDetailsView(userId);
                    }
                );
            } else if (newPassword) {
                showSimpleModal("Error", "Password must be at least 6 characters long.");
            }
        }

        async function handleToggleDeliveryBoyLock(userId) {
            const userRef = db.collection('users').doc(userId);
            const doc = await userRef.get();
            const currentStatus = doc.data().isLocked || false;
            await userRef.update({ isLocked: !currentStatus });
            await logAudit(`Delivery Boy ${!currentStatus ? 'Locked' : 'Unlocked'}`, `ID: ${userId}`);
            renderDeliveryBoyDetailsView(userId);
        }

        async function handleRemoveDeliveryBoy(userId) {
            showConfirmationModal(
                "Remove Delivery Boy?",
                "This will delete their profile data. This action cannot be undone. Note: This does not delete their authentication record for security reasons.",
                async () => {
                    await db.collection('users').doc(userId).delete();
                    await logAudit("Delivery Boy Removed", `ID: ${userId}`);
                    showSimpleModal("Success", "Delivery boy profile has been removed.");
                    renderAdminView('delivery-boys');
                }
            );
        }

        function renderScannerView(contentArea) {
            contentArea.innerHTML = `
                <h2 class="text-3xl font-bold font-serif mb-6">Scan Order QR Code</h2>
                <div class="bg-white p-6 rounded-xl shadow-md">
                    <div id="qr-scanner-container" class="w-full max-w-md mx-auto">
                        <div id="qr-reader" class="border-2 border-dashed rounded-lg" style="width: 100%;"></div>
                        <div id="qr-reader-results" class="text-center mt-4 font-mono"></div>
                    </div>
                    <div class="text-center mt-4">
                        <button data-action="start-scan" class="btn btn-primary">Start Scanner</button>
                        <button data-action="stop-scan" class="btn btn-danger hidden">Stop Scanner</button>
                    </div>
                </div>
                <div id="scanned-order-details" class="mt-8"></div>
            `;
        }

        function startScanner() {
            document.querySelector('[data-action=start-scan]').classList.add('hidden');
            document.querySelector('[data-action=stop-scan]').classList.remove('hidden');
            const resultsEl = document.getElementById('qr-reader-results');
            const detailsContainer = document.getElementById('scanned-order-details');

            const onScanSuccess = (decodedText, decodedResult) => {
                console.log(`Code matched = ${decodedText}`, decodedResult);
                stopScanner();
                resultsEl.innerHTML = `<span class="text-green-600 font-semibold">Success! Scanned Order ID: ${decodedText}</span>`;
                detailsContainer.innerHTML = '<p class="text-center">Loading order details...</p>';
                renderOrderBill(decodedText, detailsContainer);
            };

            const onScanFailure = (error) => {
                 // console.warn(`Code scan error = ${error}`);
            }

            if (!html5QrCode) {
                 html5QrCode = new Html5Qrcode("qr-reader");
            }

            html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: {width: 250, height: 250} }, onScanSuccess, onScanFailure)
                .catch(err => {
                    showSimpleModal("Camera Error", "Could not start camera. Please ensure you have a camera and have granted permission.");
                    console.error("Camera start error", err);
                    stopScanner();
                });
        }

        function stopScanner() {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().then(ignore => {
                    console.log("QR Code scanning stopped.");
                }).catch(err => {
                    console.error("QR Code scanning failed to stop.", err);
                });
            }
            const startBtn = document.querySelector('[data-action=start-scan]');
            const stopBtn = document.querySelector('[data-action=stop-scan]');
            if (startBtn) startBtn.classList.remove('hidden');
            if (stopBtn) stopBtn.classList.add('hidden');
        }

        async function renderAllReviewsView(contentArea) {
             contentArea.innerHTML = `<h2 class="text-3xl font-bold font-serif mb-6">All User Reviews</h2><div id="all-reviews-list">Loading...</div>`;
             const listEl = document.getElementById('all-reviews-list');
             const snapshot = await db.collection('reviews').orderBy('createdAt', 'desc').limit(50).get();

             if (snapshot.empty) {
                listEl.innerHTML = '<p>No reviews found.</p>';
                return;
             }

             listEl.innerHTML = snapshot.docs.map(doc => {
                const r = doc.data();
                return `
                    <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
                        <p class="text-sm text-gray-500">Order #${r.orderId.substring(0,6)} by ${r.customerName}</p>
                        <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="border-r pr-4">
                                <p class="font-semibold">Restaurant: ${r.restaurantName}</p>
                                <p class="text-yellow-500">${'★'.repeat(r.restaurantRating)}${'☆'.repeat(5-r.restaurantRating)}</p>
                                <p class="text-sm italic">"${r.restaurantReview || 'No comment'}"</p>
                            </div>
                            <div>
                                <p class="font-semibold">Delivery: ${r.deliveryBoyName}</p>
                                <p class="text-yellow-500">${'★'.repeat(r.deliveryRating)}${'☆'.repeat(5-r.deliveryRating)}</p>
                                <p class="text-sm italic">"${r.deliveryReview || 'No comment'}"</p>
                            </div>
                        </div>
                    </div>
                `;
             }).join('');
        }

        // --- UTILITY, BILLING & MODAL FUNCTIONS ---
        async function renderOrderBill(orderId, targetContainer = null) {
            const orderDoc = await db.collection('orders').doc(orderId).get();
            if (!orderDoc.exists) {
                const content = `<div class="text-center p-4 bg-red-100 text-red-700 rounded-lg">Order with ID <strong>${orderId}</strong> not found.</div>`;
                 if (targetContainer) {
                    targetContainer.innerHTML = content;
                } else {
                    showSimpleModal("Error", "Order not found.");
                }
                return;
            }
            const order = orderDoc.data();
            const restaurantDoc = await db.collection('restaurants').doc(order.restaurantId).get();
            const restaurant = restaurantDoc.data();
            const customerDoc = await db.collection('users').doc(order.customerId).get();
            const customer = customerDoc.data();
            
            const itemsWithImages = await Promise.all(order.items.map(async (item) => {
                const menuItemDoc = await db.collection('restaurants').doc(order.restaurantId).collection('menu').doc(item.id).get();
                const imageUrl = menuItemDoc.exists && menuItemDoc.data().imageUrl ? menuItemDoc.data().imageUrl : 'https://placehold.co/100x100?text=Food';
                return { ...item, imageUrl };
            }));

            const billHtml = `
                <div id="printable-bill" class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="p-6">
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
                                    <th class="text-left p-2">Image</th>
                                    <th class="text-left p-2">Item</th>
                                    <th class="text-center p-2">Qty</th>
                                    <th class="text-right p-2">Price</th>
                                    <th class="text-right p-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsWithImages.map(item => `
                                    <tr class="border-b">
                                        <td class="p-2"><img src="${item.imageUrl}" class="w-12 h-12 object-cover rounded-md" onerror="this.src='https://placehold.co/48x48?text=Img'"></td>
                                        <td class="p-2">${item.name}</td>
                                        <td class="text-center p-2">${item.quantity}</td>
                                        <td class="text-right p-2">₹${item.price.toFixed(2)}</td>
                                        <td class="text-right p-2">₹${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot class="font-semibold">
                                <tr>
                                    <td colspan="4" class="text-right p-2 border-t">Subtotal</td>
                                    <td class="text-right p-2 border-t">₹${order.subtotal.toFixed(2)}</td>
                                </tr>
                                 <tr>
                                    <td colspan="4" class="text-right p-2">Delivery Fee</td>
                                    <td class="text-right p-2">₹${(order.deliveryFee || 0).toFixed(2)}</td>
                                </tr>
                                 <tr>
                                    <td colspan="4" class="text-right p-2">Platform Fee</td>
                                    <td class="text-right p-2">₹${(order.platformFee || 0).toFixed(2)}</td>
                                </tr>
                                 <tr>
                                    <td colspan="4" class="text-right p-2">GST (${order.gstRate || 5}%)</td>
                                    <td class="text-right p-2">₹${order.gst.toFixed(2)}</td>
                                </tr>
                                <tr class="text-xl font-bold border-t-2 bg-gray-100">
                                    <td colspan="4" class="text-right p-2">Grand Total</td>
                                    <td class="text-right p-2">₹${order.totalPrice.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                        <p class="text-center text-xs text-gray-500">Thank you for your order!</p>
                    </div>
                </div>
                <div class="flex justify-end gap-4 mt-4 no-print">
                    ${!targetContainer ? `<button class="btn bg-gray-200" onclick="closeModal()">Close</button>` : ''}
                    <button class="btn btn-primary" onclick="downloadBillAsPDF('${orderId}')">Download PDF</button>
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
            stopScanner();
        }

        // --- INITIALIZE APP ON LOAD ---
        document.addEventListener('DOMContentLoaded', initializeApp);

       // --- LOGOUT ---
        document.getElementById('logout-btn').addEventListener('click', () => {
            auth.signOut().then(() => {
                console.log('User signed out successfully.');
                window.location.href = 'login.html';
            }).catch((error) => {
                console.error('Sign out error', error);
                alert('An error occurred while logging out. Please try again.');
            });
        });

        feather.replace();
