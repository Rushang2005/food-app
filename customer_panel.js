// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDDJ9kFtxZMJnI86_Il9ONDTvA-4tjLfZY",
  authDomain: "unifoods-18311.firebaseapp.com",
  projectId: "unifoods-18311",
  storageBucket: "unifoods-18311.firebasestorage.app",
  messagingSenderId: "1026250402862",
  appId: "1:1026250402862:web:a8a1526a162c682196c3bf",
  measurementId: "G-3RYMPMMES6"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- TRANSLATIONS ---
const translations = {
    en: {
        maintenanceTitle: "Under Maintenance",
        maintenanceText: "We are currently performing maintenance. Please check back later.",
        logout: "Logout",
        language: "Language",
        aiAssistant: "UniFood AI Assistant",
        aiGreeting: "Hello! How can I help you today?",
        askAnythingPlaceholder: "Ask me anything...",
        welcomeBack: "Welcome Back",
        signInPrompt: "Sign in to get your food.",
        emailLabel: "Email",
        passwordLabel: "Password",
        login: "Login",
        dontHaveAccount: "Don't have an account?",
        signUp: "Sign Up",
        createAccount: "Create Account",
        signUpPrompt: "Join us for a delicious journey.",
        fullNamePlaceholder: "Full Name",
        mobileNumberPlaceholder: "Mobile Number",
        emailPlaceholder: "Email Address",
        passwordPlaceholder: "Password (min. 6 characters)",
        alreadyHaveAccount: "Already have an account?",
        menu: "Menu",
        home: "Home",
        myOrders: "My Orders",
        profile: "Profile",
        findYourNextMeal: "Find Your Next Meal",
        heroSubtitle: "The best restaurants, delivered to your doorstep.",
        searchPlaceholder: "Search for restaurants or cuisines...",
        justForYou: "Just For You ✨",
        aiRecommendationsPlaceholder: "AI recommendations will appear here based on your order history.",
        backToRestaurants: "Back to Restaurants",
        addToCart: "Add to Cart",
        myProfile: "My Profile",
        updateProfile: "Update Profile",
        yourOrder: "Your Order",
        placeOrder: "Place Order",
        close: "Close",
        unavailable: "Unavailable"
    },
    gu: {
        maintenanceTitle: "જાળવણી હેઠળ",
        maintenanceText: "અમે હાલમાં જાળવણી કરી રહ્યા છીએ. કૃપા કરીને પછીથી ફરી તપાસ કરો.",
        logout: "લૉગઆઉટ",
        language: "ભાષા",
        aiAssistant: "યુનિફૂડ AI સહાયક",
        aiGreeting: "નમસ્તે! આજે હું તમારી શી રીતે મદદ કરી શકું?",
        askAnythingPlaceholder: "મને કંઈપણ પૂછો...",
        welcomeBack: "ફરી સ્વાગત છે",
        signInPrompt: "તમારું ભોજન મેળવવા માટે સાઇન ઇન કરો.",
        emailLabel: "ઈમેલ",
        passwordLabel: "પાસવર્ડ",
        login: "લૉગિન",
        dontHaveAccount: "ખાતું નથી?",
        signUp: "સાઇન અપ કરો",
        createAccount: "એકાઉન્ટ બનાવો",
        signUpPrompt: "એક સ્વાદિષ્ટ પ્રવાસ માટે અમારી સાથે જોડાઓ.",
        fullNamePlaceholder: "પૂરું નામ",
        mobileNumberPlaceholder: "મોબાઇલ નંબર",
        emailPlaceholder: "ઈમેલ સરનામું",
        passwordPlaceholder: "પાસવર્ડ (ઓછામાં ઓછા 6 અક્ષરો)",
        alreadyHaveAccount: "પહેલેથી એકાઉન્ટ છે?",
        menu: "મેનુ",
        home: "હોમ",
        myOrders: "મારા ઓર્ડર્સ",
        profile: "પ્રોફાઇલ",
        findYourNextMeal: "તમારું આગલું ભોજન શોધો",
        heroSubtitle: "શ્રેષ્ઠ રેસ્ટોરન્ટ્સ, તમારા ઘર સુધી પહોંચાડવામાં આવે છે.",
        searchPlaceholder: "રેસ્ટોરન્ટ્સ અથવા વાનગીઓ શોધો...",
        justForYou: "ફક્ત તમારા માટે ✨",
        aiRecommendationsPlaceholder: "તમારા ઓર્ડર ઇતિહાસના આધારે AI ભલામણો અહીં દેખાશે.",
        backToRestaurants: "રેસ્ટોરન્ટ્સ પર પાછા જાઓ",
        addToCart: "કાર્ટમાં ઉમેરો",
        myProfile: "મારી પ્રોફાઇલ",
        updateProfile: "પ્રોફાઇલ અપડેટ કરો",
        yourOrder: "તમારો ઓર્ડર",
        placeOrder: "ઓર્ડર આપો",
        close: "બંધ કરો",
        unavailable: "અનુપલબ્ધ"
    },
    hi: {
        maintenanceTitle: "रखरखाव હેઠળ",
        maintenanceText: "हम वर्तमान में रखरखाव का काम कर रहे हैं। कृपया बाद में वापस देखें।",
        logout: "लॉग आउट",
        language: "भाषा",
        aiAssistant: "यूनिफूड एआई सहायक",
        aiGreeting: "नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ?",
        askAnythingPlaceholder: "मुझसे कुछ भी पूछें...",
        welcomeBack: "वापसी पर स्वागत है",
        signInPrompt: "अपना भोजन पाने के लिए साइन इन करें।",
        emailLabel: "ईमेल",
        passwordLabel: "पासवर्ड",
        login: "लॉग इन करें",
        dontHaveAccount: "खाता नहीं है?",
        signUp: "साइन अप करें",
        createAccount: "खाता बनाएं",
        signUpPrompt: "एक स्वादिष्ट यात्रा के लिए हमसे जुड़ें।",
        fullNamePlaceholder: "पूरा नाम",
        mobileNumberPlaceholder: "मोबाइल नंबर",
        emailPlaceholder: "ईमेल पता",
        passwordPlaceholder: "पासवर्ड (न्यूनतम 6 अक्षर)",
        alreadyHaveAccount: "पहले से ही एक खाता है?",
        menu: "मेन्यू",
        home: "હોમ",
        myOrders: "मेरे आर्डर",
        profile: "प्रोफ़ाइल",
        findYourNextMeal: "अपना अगला भोजन खोजें",
        heroSubtitle: "सर्वश्रेष्ठ रेस्तरां, आपके दरवाजे पर पहुंचाए जाते हैं।",
        searchPlaceholder: "रेस्तरां या व्यंजन खोजें...",
        justForYou: "सिर्फ आपके लिए ✨",
        aiRecommendationsPlaceholder: "आपके ऑर्डर इतिहास के आधार पर एआई सिफारिशें यहां दिखाई देंगी।",
        backToRestaurants: "रेस्तरां पर वापस जाएं",
        addToCart: "कार्ट में जोड़ें",
        myProfile: "मेरी प्रोफाइल",
        updateProfile: "प्रोफ़ाइल अपडेट करें",
        yourOrder: "आपका ऑर्डर",
        placeOrder: "ऑर्डर दें",
        close: "बंद करें",
        unavailable: "अनुपલબ્ધ"
    }
};
let currentLanguage = 'en';


// --- GLOBAL STATE & EVENT HANDLERS ---
let currentUser = null;
let unsubscribeListeners = [];
let activePortalHandler = null;
let siteSettings = {};
let cart = [];
let html5QrCode = null;
let allRestaurantsCache = []; // Cache for search
let allMenuItemsCache = []; // Cache for search


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
const globalSearchContainer = document.getElementById('global-search-container');
const mobileSearchContainer = document.getElementById('mobile-search-container');
const mobileSearchButton = document.getElementById('mobile-search-button');

// Mobile Menu UI
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenuButton = document.getElementById('close-mobile-menu');
const mobileUserInfo = document.getElementById('mobile-user-info');
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');


// --- LANGUAGE & UI TEXT FUNCTIONS ---
function updateUIText() {
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        const translation = translations[currentLanguage]?.[key] || translations['en'][key];
        if (translation) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        }
    });
    feather.replace(); 
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('unifood-lang', lang);
        document.getElementById('language-switcher').value = lang;
        document.getElementById('mobile-language-switcher').value = lang;
        updateUIText();
    }
}


// --- CORE APP & AUTH LOGIC ---
// --- REPLACE THE ENTIRE initializeApp FUNCTION ---
async function initializeApp() {
    // 1. Fetch settings ONCE for the initial page load.
    const settingsDoc = await db.collection('settings').doc('config').get();
    if (settingsDoc.exists) {
        siteSettings = settingsDoc.data();
    }
    applySiteSettings();

    const savedLang = localStorage.getItem('unifood-lang') || 'en';
    setLanguage(savedLang);

    document.getElementById('language-switcher').addEventListener('change', (e) => setLanguage(e.target.value));
    document.getElementById('mobile-language-switcher').addEventListener('change', (e) => setLanguage(e.target.value));

    // 2. The onAuthStateChanged will now handle the real-time listener.
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
                
                if (currentUser.role === 'restaurant' && (await db.collection('restaurants').doc(currentUser.restaurantId).get()).data().isLocked) {
                    showSimpleModal("Account Locked", "Your restaurant account is currently locked. Please contact support."); auth.signOut(); return;
                }

                if (currentUser.role === 'delivery' && currentUser.isLocked) {
                     showSimpleModal("Account Locked", "Your delivery account is currently locked. Please contact support."); auth.signOut(); return;
                }
                
                const userHtml = `<p class="font-semibold">${currentUser.name}</p><p class="text-xs text-gray-500 capitalize">${currentUser.role}</p>`;
                userInfo.innerHTML = userHtml;
                mobileUserInfo.innerHTML = userHtml;
                
                showView('app');
                loadPortal(currentUser);

                // +++ 3. ADD THE REAL-TIME LISTENER HERE, AFTER THE PORTAL IS LOADED +++
                const settingsListener = db.collection('settings').doc('config').onSnapshot(doc => {
                    console.log("Customer Panel: Real-time settings received!"); // For debugging
                    if (doc.exists) {
                        siteSettings = doc.data();
                        applySiteSettings(); // This now works on the correct UI
                    }
                });
                unsubscribeListeners.push(settingsListener); // Add to cleanup queue

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
        updateUIText();
    });
}

function logAudit(action, details) {
    if (!currentUser) return;
    db.collection('auditLog').add({
        action: action, details: details, performedBy: currentUser.name,
        role: currentUser.role, userId: currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(error => console.error("Failed to write audit log:", error));
}

function applySiteSettings() {
    // Safely access the nested theme object
    const theme = siteSettings.theme || {};
    const globalTheme = theme.global || {};

    if (siteSettings.websiteName) {
        websiteNameHeader.textContent = siteSettings.websiteName;
        document.title = siteSettings.websiteName;
    }
    if (siteSettings.logoUrl) websiteLogoHeader.src = siteSettings.logoUrl;
    
    // Read colors from the correct nested globalTheme object
    document.documentElement.style.setProperty('--primary-color', globalTheme.primaryColor || '#1a202c');
    document.documentElement.style.setProperty('--secondary-color', globalTheme.secondaryColor || '#D4AF37');
    document.documentElement.style.setProperty('--background-color', globalTheme.backgroundColor || '#F8F9FA');
    document.documentElement.style.setProperty('--text-color', globalTheme.textColor || '#1f2937');
    document.documentElement.style.setProperty('--button-text-color', globalTheme.buttonTextColor || '#ffffff');
    
    // Gradient logic for header
    if (globalTheme.useGradient) {
        const gradient = `linear-gradient(to right, ${globalTheme.gradientStart || '#4c51bf'}, ${globalTheme.gradientEnd || '#6b46c1'})`;
        document.documentElement.style.setProperty('--header-bg', gradient);
        websiteNameHeader.classList.add('text-white');
    } else {
        document.documentElement.style.setProperty('--header-bg', '#ffffff');
        websiteNameHeader.classList.remove('text-white');
    }

    if (siteSettings.heroBgImage) authContainer.style.backgroundImage = `url('${siteSettings.heroBgImage}')`;
    
    announcementContainer.innerHTML = ''; 
    db.collection('announcements').where('isActive', '==', true).limit(1).get().then(snapshot => {
        if (!snapshot.empty) {
            const announcement = snapshot.docs[0].data();
            announcementContainer.innerHTML = `<div class="bg-yellow-200 text-yellow-800 p-3 text-center text-sm"><strong>${announcement.title || 'Announcement'}:</strong> ${announcement.text}</div>`;
        }
    });
}


function showView(view) {
    const header = document.querySelector('header');
    cartButton.classList.add('hidden');
    mobileSearchContainer.classList.add('hidden');


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
    const template = document.getElementById(`${user.role}-portal-template`);
    if (template) {
        mainContent.appendChild(template.content.cloneNode(true));
        feather.replace();
        if (user.role === 'customer') initializeCustomerPortal();
    } else {
        mainContent.innerHTML = `<p class="text-center text-red-500">Error: Portal template for role "${user.role}" not found.</p>`;
    }
    updateUIText();
}

function renderAuthForm(formType) {
    const authCard = authContainer.querySelector('.auth-card');
    authCard.innerHTML = '';
    const template = document.getElementById(`${formType}-form-template`);
    if (template) {
        authCard.appendChild(template.content.cloneNode(true));
    }
    updateUIText();

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
    
    // Set up global search
    const desktopSearch = document.getElementById('global-search-bar');
    const mobileSearch = document.getElementById('mobile-global-search-bar');
    desktopSearch.addEventListener('input', handleGlobalSearch);
    mobileSearch.addEventListener('input', (e) => {
        desktopSearch.value = e.target.value;
        handleGlobalSearch(e);
    });
    
    mobileSearchButton.addEventListener('click', () => {
        mobileSearchContainer.classList.toggle('hidden');
        feather.replace();
    });

    const desktopNav = document.getElementById('customer-nav');
    const mobileNavContainer = document.getElementById('mobile-nav-links');
    if (desktopNav && mobileNavContainer) {
        mobileNavContainer.innerHTML = desktopNav.innerHTML;
        mobileNavContainer.addEventListener('click', handleCustomerClicks);
    }
    
    modalContainer.addEventListener('click', (e) => {
        const actionButton = e.target.closest('[data-action]');
        if (actionButton) {
            const { action, itemId, itemName, itemPrice, restaurantId, restaurantName } = actionButton.dataset;
            switch(action) {
                case 'remove-from-cart':
                    removeFromCart(itemId);
                    break;
                case 'add-to-cart':
                    addToCart(itemId, itemName, parseFloat(itemPrice), restaurantId, restaurantName);
                    break;
            }
        }
    });

    cartButton.addEventListener('click', renderCartView);
    renderCustomerView('home');
}

function handleCustomerClicks(e) {
    const navLink = e.target.closest('[data-view]');
    if (navLink) {
        renderCustomerView(navLink.dataset.view);
        if (!mobileMenuOverlay.classList.contains('hidden')) {
            closeMobileMenu();
        }
        return;
    }

    const restaurantCard = e.target.closest('.restaurant-card');
    if (restaurantCard) {
        renderCustomerRestaurantView(restaurantCard.dataset.id);
        return;
    }
    
    const cuisineCard = e.target.closest('[data-cuisine-filter]');
    if (cuisineCard) {
        const cuisine = cuisineCard.dataset.cuisineFilter;
        const searchInput = document.getElementById('global-search-bar');
        searchInput.value = cuisine;
        searchInput.dispatchEvent(new Event('input'));
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
            case 'view-item-details': renderMenuItemDetailView(itemId, restaurantId); break;
        }
    }
}

function renderCustomerView(viewName) {
    document.querySelectorAll('#customer-nav .sidebar-link, #mobile-nav-links .sidebar-link').forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewName);
    });

    const contentArea = document.getElementById('customer-main-content');
    cartButton.classList.add('hidden');

    switch(viewName) {
        case 'home': renderCustomerHomepage(contentArea); break;
        case 'orders': renderCustomerOrdersView(contentArea); break;
        case 'profile': renderCustomerProfile(contentArea); break;
    }
    updateUIText();
}

async function renderCustomerHomepage(contentArea) {
     cartButton.classList.remove('hidden');
     
     const cuisines = [
        { name: 'Pizza', icon: 'disc' }, { name: 'Burger', icon: 'minus-circle' },
        { name: 'Indian', icon: 'sunrise' }, { name: 'Chinese', icon: 'wind' },
        { name: 'Italian', icon: 'flag' }, { name: 'Mexican', icon: 'hash' }
     ];
     
     const cuisineHtml = cuisines.map(c => `
        <div data-cuisine-filter="${c.name}" class="text-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer">
            <i data-feather="${c.icon}" class="w-8 h-8 mx-auto text-gray-600"></i>
            <p class="mt-2 font-semibold text-sm">${c.name}</p>
        </div>
     `).join('');
     
     contentArea.innerHTML = `
        <div id="homepage-content" class="space-y-12">
            <div>
                <h3 class="text-2xl font-bold font-serif mb-4">Categories</h3>
                <div class="grid grid-cols-3 md:grid-cols-6 gap-4">${cuisineHtml}</div>
            </div>
            
            <div id="featured-restaurants-container">
                <h3 class="text-2xl font-bold font-serif mb-4">Top Rated Restaurants</h3>
                <div id="featured-restaurants-list" class="flex overflow-x-auto gap-6 pb-4"></div>
            </div>

            <div>
                <h3 class="text-2xl font-bold font-serif mb-4">All Restaurants</h3>
                <div id="all-restaurants-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
            </div>
        </div>
        <div id="search-results-container" class="hidden"></div>`;

     const allListEl = document.getElementById('all-restaurants-list');
     const featuredListEl = document.getElementById('featured-restaurants-list');
     
    allRestaurantsCache = [];
    allMenuItemsCache = [];

    const snapshot = await db.collection('restaurants').where("isLocked", "==", false).get();
    
    if (snapshot.empty) {
        allListEl.innerHTML = '<p>No restaurants available right now.</p>';
        featuredListEl.innerHTML = '<p>No featured restaurants.</p>';
        feather.replace();
        return;
    }
    
    const menuPromises = [];
    snapshot.docs.forEach(doc => {
        const restaurantData = { id: doc.id, ...doc.data() };
        allRestaurantsCache.push(restaurantData);
        
        const menuPromise = db.collection('restaurants').doc(doc.id).collection('menu').get().then(menuSnapshot => {
            menuSnapshot.forEach(menuDoc => {
                allMenuItemsCache.push({
                    ...menuDoc.data(),
                    id: menuDoc.id,
                    restaurantId: doc.id,
                    restaurantName: restaurantData.name
                });
            });
        });
        menuPromises.push(menuPromise);
    });

    await Promise.all(menuPromises);
    
    const sortedRestaurants = [...allRestaurantsCache].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    const featuredRestaurants = sortedRestaurants.slice(0, 5);
    
    featuredListEl.innerHTML = featuredRestaurants.map(r => renderFeaturedRestaurantCard({ id: r.id, data: () => r })).join('');
    allListEl.innerHTML = allRestaurantsCache.map(r => renderRestaurantCard({ id: r.id, data: () => r })).join('');
    
    feather.replace();
    updateUIText();
}

function renderFeaturedRestaurantCard(doc) {
    const r = doc.data();
    const firstImage = r.imageUrls && r.imageUrls.length > 0 ? r.imageUrls[0] : 'https://placehold.co/400x250?text=UniFood';
    
    return `
        <div data-id="${doc.id}" data-name="${r.name}" data-cuisine="${r.cuisine}" class="restaurant-card group bg-white overflow-hidden cursor-pointer flex-shrink-0 w-80">
            <div class="overflow-hidden">
                <img src="${firstImage}" class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out">
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg font-serif truncate">${r.name}</h3>
                <p class="text-sm text-gray-500 mt-1">${r.cuisine}</p>
                <p class="text-xs text-gray-600 truncate mt-1 flex items-center"><i data-feather="map-pin" class="inline-block w-3 h-3 mr-1 flex-shrink-0"></i>${r.address || ''}</p>
                <div class="flex items-center mt-2 text-xs text-gray-700">
                   <i data-feather="star" class="w-4 h-4 fill-current text-yellow-500"></i>
                   <span class="ml-1 font-bold">${(r.avgRating || 0).toFixed(1)}</span>
                   <span class="mx-2">|</span>
                   <span>30-40 min</span>
                </div>
            </div>
        </div>`;
}


function renderRestaurantCard(doc) {
    const r = doc.data();
    const firstImage = r.imageUrls && r.imageUrls.length > 0 ? r.imageUrls[0] : 'https://placehold.co/400x250?text=UniFood';
    const cardClasses = 'restaurant-card group bg-white overflow-hidden cursor-pointer';

    return `
        <div data-id="${doc.id}" data-name="${r.name}" data-cuisine="${r.cuisine}" class="${cardClasses}">
            <div class="overflow-hidden">
                <img src="${firstImage}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out">
            </div>
            <div class="p-5">
                <h3 class="font-bold text-xl font-serif">${r.name}</h3>
                <p class="text-sm text-gray-500 mt-1">${r.cuisine}</p>
                <p class="text-sm text-gray-600 truncate mt-1 flex items-center"><i data-feather="map-pin" class="inline-block w-4 h-4 mr-1 flex-shrink-0"></i>${r.address || ''}</p>
                <div class="flex items-center mt-2 text-sm text-gray-700">
                   <i data-feather="star" class="w-4 h-4 fill-current text-yellow-500"></i>
                   <span class="ml-1 font-bold">${(r.avgRating || 0).toFixed(1)}</span>
                   <span class="mx-2">|</span>
                   <span>30-40 min</span>
                </div>
            </div>
        </div>`;
}

// --- ADVANCED SEARCH LOGIC ---

function handleGlobalSearch(e) {
    const searchTerm = e.target.value.trim().toLowerCase();
    const activeNav = document.querySelector('#customer-nav .sidebar-link.active');
    
    if (!activeNav) return;
    const currentView = activeNav.dataset.view;

    if (currentView === 'home') {
        searchRestaurantsAndFood(searchTerm);
    } else if (currentView === 'orders') {
        searchOrders(searchTerm);
    }
}

function searchOrders(searchTerm) {
    const ordersList = document.getElementById('customer-orders-list');
    if (!ordersList) return;

    ordersList.querySelectorAll('.order-card').forEach(card => {
        const orderId = card.dataset.orderId.toLowerCase();
        const restaurantName = card.dataset.restaurantName.toLowerCase();
        const itemNames = card.dataset.itemNames.toLowerCase();

        if (orderId.includes(searchTerm) || restaurantName.includes(searchTerm) || itemNames.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchRestaurantsAndFood(searchTerm) {
    const homepageContent = document.getElementById('homepage-content');
    const resultsContainer = document.getElementById('search-results-container');

    if (!searchTerm) {
        homepageContent.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
        return;
    }

    homepageContent.classList.add('hidden');
    resultsContainer.classList.remove('hidden');

    const priceRegex = /(.*?)\s*(?:under|<|less than)\s*(\d+)/;
    const priceMatch = searchTerm.match(priceRegex);
    let query = searchTerm;
    let priceLimit = null;

    if (priceMatch) {
        query = priceMatch[1].trim();
        priceLimit = parseFloat(priceMatch[2]);
    }
    
    const matchingRestaurants = allRestaurantsCache.filter(r => 
        r.name.toLowerCase().includes(query) || r.cuisine.toLowerCase().includes(query)
    );

    let matchingItems = allMenuItemsCache.filter(item => 
        item.name.toLowerCase().includes(query)
    );
    if (priceLimit !== null) {
        matchingItems = matchingItems.filter(item => item.price < priceLimit);
    }
    
    let resultsHtml = '';
    
    if (matchingRestaurants.length > 0) {
        resultsHtml += '<h3 class="text-2xl font-bold font-serif mb-4">Matching Restaurants</h3>';
        resultsHtml += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
        resultsHtml += matchingRestaurants.map(r => renderRestaurantCard({ id: r.id, data: () => r })).join('');
        resultsHtml += '</div>';
    }

    if (matchingItems.length > 0) {
        resultsHtml += '<h3 class="text-2xl font-bold font-serif mt-8 mb-4">Matching Dishes</h3>';
        resultsHtml += '<div class="space-y-4">';
        resultsHtml += matchingItems.map(item => `
            <div class="bg-white rounded-xl shadow-md p-4 flex items-center justify-between gap-4">
                <div>
                    <p class="font-semibold">${item.name}</p>
                    <p class="text-sm text-gray-600">From: <a href="#" class="restaurant-link text-blue-600" data-id="${item.restaurantId}">${item.restaurantName}</a></p>
                </div>
                <p class="font-bold text-lg">₹${item.price}</p>
            </div>
        `).join('');
        resultsHtml += '</div>';
    }

    if (resultsHtml === '') {
        resultsHtml = '<p class="text-center text-gray-500 py-8">No results found.</p>';
    }

    resultsContainer.innerHTML = resultsHtml;
    feather.replace();
    
    resultsContainer.querySelectorAll('.restaurant-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            renderCustomerRestaurantView(e.target.dataset.id);
        });
    });
}


// REPLACE the existing renderCustomerRestaurantView function in customer_panel.js with this one:

async function renderCustomerRestaurantView(restaurantId) {
    const contentArea = document.getElementById('customer-main-content');
    contentArea.innerHTML = `<p>Loading restaurant...</p>`;
    const restaurantDoc = await db.collection('restaurants').doc(restaurantId).get();
    if (!restaurantDoc.exists) {
        contentArea.innerHTML = `<p>Restaurant not found.</p>`;
        return;
    }
    const restaurant = restaurantDoc.data();
    const menuSnapshot = await db.collection('restaurants').doc(restaurantId).collection('menu').get();

    let callButtonHtml = '';
    if (restaurant.mobile) {
        callButtonHtml = `
            <a href="tel:${restaurant.mobile}" title="Call Restaurant" class="ml-4 p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
                <i data-feather="phone-call" class="w-5 h-5"></i>
            </a>`;
    } else {
        callButtonHtml = `
            <span title="Phone number not available" class="ml-4 p-2 bg-gray-100 text-gray-400 rounded-full cursor-not-allowed">
                <i data-feather="phone-call" class="w-5 h-5"></i>
            </span>`;
    }

    let menuHtml = 'No menu items found.';
    if (!menuSnapshot.empty) {
        menuHtml = menuSnapshot.docs.map(doc => {
            const item = doc.data();
            const isAvailable = item.isAvailable !== false;
            const itemImage = item.imageUrl || 'https://placehold.co/400x300?text=Food';
            const variants = item.variants && item.variants.length > 0 ? item.variants : [{ name: '', price: item.price }];

            let mobilePricingHtml;
            if (variants.length > 1) {
                mobilePricingHtml = `<div class="mt-2 text-sm text-center text-gray-700">Multiple options</div>`;
            } else {
                mobilePricingHtml = `
                    <div class="flex items-center justify-between mt-3">
                         <p class="font-bold text-lg text-gray-800">₹${variants[0].price}</p>
                         <button 
                            data-action="add-to-cart" data-item-id="${doc.id}" data-item-name="${item.name}" data-item-price="${variants[0].price}" data-restaurant-id="${restaurantId}" data-restaurant-name="${restaurant.name}" 
                            class="btn btn-secondary py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2" 
                            ${!isAvailable ? 'disabled' : ''}>
                            <i data-feather="plus" class="w-5 h-5"></i>
                        </button>
                    </div>`;
            }
            const mobileCard = `
                <div class="block md:hidden bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg flex flex-col cursor-pointer ${!isAvailable ? 'opacity-60 bg-gray-50 cursor-not-allowed' : ''}"
                    data-action="view-item-details" data-item-id="${doc.id}" data-restaurant-id="${restaurantId}">
                    <img src="${itemImage}" class="w-full h-32 object-cover">
                    <div class="p-3 flex flex-col flex-grow">
                        <p class="font-bold font-serif flex-grow">${item.name}</p>
                        ${mobilePricingHtml}
                    </div>
                </div>`;

            let desktopPricingHtml;
            const desktopButtonClasses = "btn btn-secondary py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 w-full md:w-auto md:py-3 md:px-6";
            if (variants.length > 1) {
                desktopPricingHtml = variants.map(v => {
                    const variantDisplayName = v.name ? ` (${v.name})` : '';
                    const cartItemName = `${item.name}${variantDisplayName}`;
                    return `
                    <div class="flex justify-between items-center py-2 border-t mt-2">
                        <div><p class="font-semibold">${v.name || item.name}</p><p class="font-bold text-lg">₹${v.price}</p></div>
                        <button data-action="add-to-cart" data-item-id="${doc.id}-${v.name}" data-item-name="${cartItemName}" data-item-price="${v.price}" data-restaurant-id="${restaurantId}" data-restaurant-name="${restaurant.name}" class="${desktopButtonClasses}" ${!isAvailable ? 'disabled' : ''}>
                            <i data-feather="plus" class="w-5 h-5 hidden md:inline-block"></i><span data-translate-key="addToCart">Add to Cart</span></button>
                    </div>`;
                }).join('');
            } else {
                desktopPricingHtml = `
                    <div class="flex items-center justify-between mt-2">
                         <p class="font-bold text-xl text-gray-800">₹${variants[0].price}</p>
                         <button data-action="add-to-cart" data-item-id="${doc.id}" data-item-name="${item.name}" data-item-price="${variants[0].price}" data-restaurant-id="${restaurantId}" data-restaurant-name="${restaurant.name}" class="${desktopButtonClasses}" ${!isAvailable ? 'disabled' : ''}>
                            <i data-feather="plus" class="w-5 h-5 hidden md:inline-block"></i><span data-translate-key="addToCart">Add to Cart</span></button>
                    </div>`;
            }
            const desktopCard = `
                <div class="hidden md:flex bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg items-center gap-4 p-4 cursor-pointer ${!isAvailable ? 'opacity-60 bg-gray-50 cursor-not-allowed' : ''}"
                    data-action="view-item-details" data-item-id="${doc.id}" data-restaurant-id="${restaurantId}">
                    <img src="${itemImage}" class="w-24 h-24 object-cover rounded-lg flex-shrink-0">
                    <div class="flex-grow text-left w-full">
                        <p class="font-bold text-lg font-serif">${item.name}</p>
                        <p class="text-sm text-gray-500 mt-1 mb-2">${item.description || ''}</p>
                        <div>${desktopPricingHtml}</div>
                    </div>
                </div>`;

            return mobileCard + desktopCard;
        }).join('');
    }

    contentArea.innerHTML = `
        <div>
            <button data-action="back-to-home" class="btn bg-white mb-4 flex items-center gap-2"><i data-feather="arrow-left"></i><span data-translate-key="backToRestaurants">Back to Restaurants</span></button>
            <div class="bg-white rounded-xl shadow-md p-6">
                <div class="flex items-center">
                    <h2 class="text-3xl md:text-4xl font-bold font-serif">${restaurant.name}</h2>
                    ${callButtonHtml}
                </div>
                <p class="text-gray-600 mt-1">${restaurant.cuisine}</p>
                <p class="text-gray-500 mt-2 flex items-center"><i data-feather="map-pin" class="w-4 h-4 mr-2 flex-shrink-0"></i><span>${restaurant.address || ''}</span></p>
                <div class="mt-6">
                    <h3 class="text-2xl font-bold font-serif mb-4" data-translate-key="menu">Menu</h3>
                    <div class="grid grid-cols-2 md:grid-cols-1 gap-4">${menuHtml}</div>
                </div>
            </div>
        </div>`;
    feather.replace();
    updateUIText();
}

async function renderMenuItemDetailView(itemId, restaurantId) {
    const restaurantDoc = await db.collection('restaurants').doc(restaurantId).get();
    const itemDoc = await db.collection('restaurants').doc(restaurantId).collection('menu').doc(itemId).get();

    if (!restaurantDoc.exists || !itemDoc.exists) {
        showSimpleModal("Error", "Item details could not be found.");
        return;
    }

    const restaurant = restaurantDoc.data();
    const item = itemDoc.data();
    const isAvailable = item.isAvailable !== false;
    const itemImage = item.imageUrl || 'https://placehold.co/600x400?text=Food';

    let pricingHtml;
    const variants = item.variants && item.variants.length > 0 ? item.variants : [{ name: '', price: item.price }];
    const buttonClasses = "btn btn-secondary py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2";

    if (variants.length > 1) {
        pricingHtml = variants.map(v => `
            <div class="flex flex-col text-center items-center gap-2 md:text-left md:flex-row md:justify-between py-3 border-t">
                <div>
                    <p class="font-semibold">${v.name}</p>
                    <p class="font-bold text-xl">₹${v.price}</p>
                </div>
                <button 
                    data-action="add-to-cart" data-item-id="${itemId}-${v.name}" data-item-name="${item.name} (${v.name})" data-item-price="${v.price}" data-restaurant-id="${restaurantId}" data-restaurant-name="${restaurant.name}" 
                    class="${buttonClasses}" ${!isAvailable ? 'disabled' : ''}>
                    <i data-feather="plus" class="w-5 h-5"></i><span data-translate-key="addToCart">Add to Cart</span></button>
            </div>`).join('');
    } else {
        pricingHtml = `
            <div class="flex flex-col items-center gap-4 md:flex-row md:justify-between mt-4 pt-4 border-t">
                 <p class="font-bold text-2xl text-gray-800">₹${variants[0].price}</p>
                 <button 
                    data-action="add-to-cart" data-item-id="${itemId}" data-item-name="${item.name}" data-item-price="${variants[0].price}" data-restaurant-id="${restaurantId}" data-restaurant-name="${restaurant.name}" 
                    class="${buttonClasses} py-3 px-6" ${!isAvailable ? 'disabled' : ''}>
                    <i data-feather="plus" class="w-5 h-5"></i><span data-translate-key="addToCart">Add to Cart</span></button>
            </div>`;
    }

    const modalHtml = `
      <div class="relative">
        <button onclick="closeModal()" class="absolute top-2 right-2 bg-white/75 backdrop-blur-sm rounded-full p-1 text-gray-800 hover:text-black z-10">
            <i data-feather="x" class="w-6 h-6"></i>
        </button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
                <img src="${itemImage}" class="w-full h-auto object-cover rounded-lg shadow-lg aspect-square">
            </div>
            <div class="flex flex-col h-full">
                <h2 class="text-3xl font-bold font-serif">${item.name}</h2>
                ${!isAvailable ? '<p class="text-red-500 font-semibold mt-2" data-translate-key="unavailable">Currently Unavailable</p>' : ''}
                <p class="text-gray-600 mt-2 flex-grow">${item.description || 'No description available.'}</p>
                <div class="mt-4">
                    ${pricingHtml}
                </div>
            </div>
        </div>
      </div>
    `;
    
    showModal(modalHtml);
}


async function renderCustomerOrdersView(contentArea) {
    contentArea.innerHTML = `
        <h2 class="text-3xl font-bold font-serif mb-6" data-translate-key="myOrders">My Orders</h2>
        <div id="customer-orders-list" class="space-y-4"></div>`;
    const listEl = document.getElementById('customer-orders-list');
    const unsub = db.collection('orders').where('customerId', '==', currentUser.uid)
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
    updateUIText();
}

function renderCustomerOrderCard(orderId, orderData) {
    const statusMap = {
        'placed': { text: 'Order Placed', color: 'bg-gray-500', progress: '20%' },
        'accepted': { text: 'Preparing Food', color: 'bg-blue-500', progress: '40%' },
        'ready-for-pickup': { text: 'Ready for Pickup', color: 'bg-purple-500', progress: '90%' },
        'picked-up': { text: 'On The Way', color: 'bg-yellow-500', progress: '70%' },
        'delivered': { text: 'Delivered', color: 'bg-green-500', progress: '100%' },
        'completed': { text: 'Completed', color: 'bg-green-500', progress: '100%' },
        'cancelled': { text: 'Cancelled', color: 'bg-red-500', progress: '100%' },
    };
    const currentStatus = statusMap[orderData.status] || statusMap['placed'];

    let actionButtons = `<button data-action="view-bill" data-order-id="${orderId}" class="btn btn-primary py-2 px-4">View Bill</button>`;
    if ((orderData.status === 'delivered' || orderData.status === 'completed') && !orderData.isReviewed) {
        actionButtons += `<button data-action="rate-order" data-order-id="${orderId}" class="btn btn-secondary ml-2 py-2 px-4">Rate Order</button>`;
    }

    const itemNames = orderData.items.map(i => i.name).join(' ');

    return `
        <div class="bg-white p-5 rounded-xl shadow-md order-card" 
             data-order-id="${orderId}" 
             data-restaurant-name="${orderData.restaurantName}" 
             data-item-names="${itemNames}">
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
                <div class="w-full bg-gray-200 rounded-full h-2.5"><div class="${currentStatus.color} h-2.5 rounded-full" style="width: ${currentStatus.progress}"></div></div>
            </div>
            <div class="mt-4 text-right">${actionButtons}</div>
        </div>`;
}

function renderCustomerProfile(contentArea) {
    contentArea.innerHTML = `
        <h2 class="text-3xl font-bold font-serif mb-6" data-translate-key="myProfile">My Profile</h2>
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
                <button type="submit" class="btn btn-primary py-3 px-6 rounded-lg" data-translate-key="updateProfile">Update Profile</button>
            </form>
        </div>`;
    updateUIText();

    document.getElementById('customer-profile-form').addEventListener('submit', async e => {
        e.preventDefault();
        const { name, mobile, address } = { 
            name: document.getElementById('profile-name').value, 
            mobile: document.getElementById('profile-mobile').value, 
            address: document.getElementById('profile-address').value 
        };
        await db.collection('users').doc(currentUser.uid).update({ name, mobile, address });
        Object.assign(currentUser, { name, mobile, address });
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
                cart = [{ id: itemId, name: itemName, price: itemPrice, quantity: 1, restaurantId, restaurantName }];
                updateCartButton();
                showToast(`${itemName} added to cart!`);
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
    showToast(`${itemName} added to cart!`);
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        if (--cart[itemIndex].quantity === 0) cart.splice(itemIndex, 1);
    }
    updateCartButton();
    cart.length === 0 ? closeModal() : renderCartView();
}

function updateCartButton() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    cartButton.classList.toggle('hidden', totalItems === 0);
}

async function renderCartView() {
    if (cart.length === 0) {
        showSimpleModal("Empty Cart", "Your shopping cart is empty.");
        return;
    }

    const restaurantDoc = await db.collection('restaurants').doc(cart[0].restaurantId).get();
    const restaurantData = restaurantDoc.exists ? restaurantDoc.data() : { supportsDelivery: true };
    const supportsDelivery = restaurantData.supportsDelivery !== false;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let deliveryFee = (siteSettings.deliveryChargeType === 'fixed') ? siteSettings.deliveryCharge : subtotal * (siteSettings.deliveryCharge / 100);
    const gst = subtotal * (siteSettings.gstRate / 100);
    let platformFee = (siteSettings.platformFeeType === 'fixed') ? siteSettings.platformFee : subtotal * (siteSettings.platformFee / 100);
    let total = subtotal + deliveryFee + gst + platformFee;
    if (!supportsDelivery) {
        total -= deliveryFee;
    }

    const deliveryOptionsHtml = `
        <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700">Service Type</label>
            <div class="mt-2 flex gap-x-6" id="delivery-type-container">
                <label class="flex items-center ${!supportsDelivery ? 'opacity-50 cursor-not-allowed' : ''}">
                    <input type="radio" name="deliveryType" value="delivery" class="form-radio" ${supportsDelivery ? 'checked' : 'disabled'}>
                    <span class="ml-2 text-sm text-gray-700">Delivery ${!supportsDelivery ? '(Not Available)' : ''}</span>
                </label>
                <label class="flex items-center">
                    <input type="radio" name="deliveryType" value="takeaway" class="form-radio" ${!supportsDelivery ? 'checked' : ''}>
                    <span class="ml-2 text-sm text-gray-700">Takeaway</span>
                </label>
            </div>
        </div>
    `;

    const cartHtml = `
        <form id="order-form">
            <h3 class="text-2xl font-bold font-serif mb-4" data-translate-key="yourOrder">Your Order</h3>
            <p class="font-semibold mb-4">${cart[0].restaurantName}</p>
            <div class="space-y-3 mb-4 max-h-60 overflow-y-auto">
                ${cart.map(item => `<div class="flex justify-between items-center"><div><p class="font-medium">${item.name}</p><p class="text-sm text-gray-500">Qty: ${item.quantity}</p></div><div class="flex items-center gap-4"><p>₹${(item.price * item.quantity).toFixed(2)}</p><button type="button" data-action="remove-from-cart" data-item-id="${item.id}" class="btn btn-danger p-1 rounded-full"><i data-feather="trash-2" class="w-4 h-4"></i></button></div></div>`).join('')}
            </div>
            <div class="border-t pt-4 space-y-2">
                <div class="flex justify-between"><p>Subtotal</p><p>₹${subtotal.toFixed(2)}</p></div>
                <div id="delivery-fee-line" class="flex justify-between ${!supportsDelivery ? 'hidden' : ''}"><p>Delivery Fee</p><p>₹${deliveryFee.toFixed(2)}</p></div>
                <div class="flex justify-between"><p>Platform Fee</p><p>₹${platformFee.toFixed(2)}</p></div>
                <div class="flex justify-between"><p>GST (${siteSettings.gstRate}%)</p><p>₹${gst.toFixed(2)}</p></div>
                <div class="flex justify-between font-bold text-lg"><p>Grand Total</p><p id="grand-total">₹${total.toFixed(2)}</p></div>
            </div>
            
            ${deliveryOptionsHtml}
            
            <div id="delivery-address-container" class="mt-6 ${!supportsDelivery ? 'hidden' : ''}">
                <label for="delivery-address" class="block text-sm font-medium text-gray-700">Delivery Address</label>
                <textarea id="delivery-address" name="deliveryAddress" class="input-field mt-1 block w-full" rows="3" required>${currentUser.address || ''}</textarea>
            </div>
            <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700">Payment Method</label>
                <div class="mt-2 flex gap-x-6">
                    <label class="flex items-center">
                        <input type="radio" name="paymentType" value="cod" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" checked>
                        <span class="ml-2 text-sm text-gray-700">Cash on Delivery</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="paymentType" value="online" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                        <span class="ml-2 text-sm text-gray-700">Online Payment</span>
                    </label>
                </div>
            </div>
            <div class="mt-6">
                <button type="submit" data-action="place-order" class="btn btn-primary w-full py-3 rounded-lg" data-translate-key="placeOrder">Place Order</button>
                <button type="button" class="btn bg-gray-200 w-full py-3 rounded-lg mt-2" onclick="closeModal()" data-translate-key="close">Close</button>
            </div>
        </form>`;
    showModal(cartHtml);
    
    document.getElementById('delivery-type-container').addEventListener('change', (e) => {
        const deliveryFeeLine = document.getElementById('delivery-fee-line');
        const deliveryAddressContainer = document.getElementById('delivery-address-container');
        const grandTotalEl = document.getElementById('grand-total');
        
        let newTotal = subtotal + gst + platformFee;
        
        if (e.target.value === 'delivery') {
            deliveryFeeLine.classList.remove('hidden');
            deliveryAddressContainer.classList.remove('hidden');
            document.getElementById('delivery-address').required = true;
            newTotal += deliveryFee;
        } else { // takeaway
            deliveryFeeLine.classList.add('hidden');
            deliveryAddressContainer.classList.add('hidden');
            document.getElementById('delivery-address').required = false;
        }
        grandTotalEl.textContent = `₹${newTotal.toFixed(2)}`;
    });
    
    document.querySelector('input[name="deliveryType"]:checked').dispatchEvent(new Event('change', { 'bubbles': true }));
    
    document.getElementById('order-form').addEventListener('submit', e => { e.preventDefault(); handlePlaceOrder(e.target); });
}


async function handlePlaceOrder(form) {
    const deliveryType = form.elements.deliveryType.value;
    const deliveryAddress = form.elements.deliveryAddress.value;

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
        showSimpleModal("Address Required", "Delivery address is required for delivery orders.");
        return;
    }

    const paymentMethod = form.elements.paymentType.value;
    if (!paymentMethod) {
        showSimpleModal("Payment Method Required", "Please select a payment method.");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = deliveryType === 'delivery' ? ((siteSettings.deliveryChargeType === 'fixed') ? siteSettings.deliveryCharge : subtotal * (siteSettings.deliveryCharge / 100)) : 0;
    const gst = subtotal * (siteSettings.gstRate / 100);
    const platformFee = (siteSettings.platformFeeType === 'fixed') ? siteSettings.platformFee : subtotal * (siteSettings.platformFee / 100);
    const totalPrice = subtotal + deliveryFee + gst + platformFee;

    const orderData = {
        customerId: currentUser.uid, customerName: currentUser.name, 
        restaurantId: cart[0].restaurantId, restaurantName: cart[0].restaurantName,
        items: cart.map(item => ({...item})),
        subtotal, deliveryFee, platformFee, gst, gstRate: siteSettings.gstRate,
        deliveryPayout: 30.00, totalPrice, status: 'placed',
        deliveryType: deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : 'Takeaway Order',
        paymentMethod: paymentMethod,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        deliveryBoyId: null, isReviewed: false
    };

    try {
        const docRef = await db.collection('orders').add(orderData);
        await logAudit("Order Placed", `Order ID: ${docRef.id}`);
        showSimpleModal('Order Placed!', 'Your order has been placed successfully.');
        cart = []; updateCartButton(); closeModal(); renderCustomerView('orders');
    } catch (error) {
        console.error("Error placing order: ", error);
        showSimpleModal('Order Error', 'There was an error placing your order. Please try again.');
    }
}

// --- UTILITY, BILLING & RATING FUNCTIONS ---
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    toast.className = `flex items-center gap-3 ${colors[type]} text-white py-3 px-5 rounded-lg shadow-lg toast-enter`;
    toast.innerHTML = `
        <i data-feather="check-circle" class="w-6 h-6"></i>
        <span class="font-semibold">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    feather.replace();
    
    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => {
            toast.remove();
        }, 500); // Match animation duration
    }, 3000); // How long the toast stays visible
}


async function renderOrderBill(orderId, targetContainer = null) {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) { showSimpleModal("Error", "Order not found."); return; }
    const order = orderDoc.data();
    const restaurant = (await db.collection('restaurants').doc(order.restaurantId).get()).data();
    const customer = (await db.collection('users').doc(order.customerId).get()).data();

    const billHtml = `
        <div id="printable-bill"><div class="p-6 bg-white">
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
                <p>${order.customerName}</p><p>${order.deliveryAddress}</p>
                <p>Email: ${customer.email}</p><p>Mobile: ${customer.mobile || 'N/A'}</p>
                <p class="mt-2"><strong>Payment Method:</strong> <span class="capitalize">${order.paymentMethod || 'N/A'}</span></p>
                <p><strong>Service Type:</strong> <span class="capitalize">${order.deliveryType || 'Delivery'}</span></p>
            </div>
            <table class="w-full text-sm my-6">
                <thead class="border-b bg-gray-50"><tr><th class="text-left p-2">Item</th><th class="text-center p-2">Qty</th><th class="text-right p-2">Price</th><th class="text-right p-2">Total</th></tr></thead>
                <tbody>${order.items.map(item => `<tr class="border-b"><td class="p-2">${item.name}</td><td class="text-center p-2">${item.quantity}</td><td class="text-right p-2">₹${item.price.toFixed(2)}</td><td class="text-right p-2">₹${(item.price * item.quantity).toFixed(2)}</td></tr>`).join('')}</tbody>
                <tfoot class="font-semibold">
                    <tr><td colspan="3" class="text-right p-2 border-t">Subtotal</td><td class="text-right p-2 border-t">₹${order.subtotal.toFixed(2)}</td></tr>
                    <tr><td colspan="3" class="text-right p-2">Delivery Fee</td><td class="text-right p-2">₹${(order.deliveryFee || 0).toFixed(2)}</td></tr>
                    <tr><td colspan="3" class="text-right p-2">Platform Fee</td><td class="text-right p-2">₹${(order.platformFee || 0).toFixed(2)}</td></tr>
                    <tr><td colspan="3" class="text-right p-2">GST (${order.gstRate || siteSettings.gstRate}%)</td><td class="text-right p-2">₹${order.gst.toFixed(2)}</td></tr>
                    <tr class="text-xl font-bold border-t-2 bg-gray-100"><td colspan="3" class="text-right p-2">Grand Total</td><td class="text-right p-2">₹${order.totalPrice.toFixed(2)}</td></tr>
                </tfoot>
            </table>
            <p class="text-center text-xs text-gray-500">Thank you for your order!</p>
        </div></div>
        <div class="flex justify-end gap-4 mt-4"><button class="btn bg-gray-200" onclick="closeModal()">Close</button><button class="btn btn-primary" onclick="downloadBillAsPDF('${orderId}')">Download Bill</button></div>`;
    
    targetContainer ? targetContainer.innerHTML = billHtml : showModal(billHtml);
    new QRCode(document.getElementById("qrcode-container"), { text: orderId, width: 80, height: 80 });
}

function downloadBillAsPDF(orderId) {
    const element = document.getElementById('printable-bill');
    const opt = { margin: 0.5, filename: `UniFood_Invoice_${orderId.substring(0,8)}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
    html2pdf().from(element).set(opt).save();
}
        
async function showRatingForm(orderId) {
    const order = (await db.collection('orders').doc(orderId).get()).data();
    const formHtml = `
        <form id="rating-form" class="space-y-6">
            <h3 class="text-2xl font-bold font-serif mb-4">Rate Your Order</h3>
            <div class="p-4 border rounded-lg"><p class="font-semibold">Rate the Restaurant: ${order.restaurantName}</p><div class="rating flex items-center text-3xl" data-type="restaurant">${[...Array(5)].map((_,i)=>`<span class="star" data-value="${i+1}"><i data-feather="star"></i></span>`).join('')}</div><textarea name="restaurantReview" class="input-field w-full mt-2" rows="2" placeholder="Tell us about the food..."></textarea></div>
            <div class="p-4 border rounded-lg"><p class="font-semibold">Rate the Delivery by: ${order.deliveryBoyName || 'UniFood'}</p><div class="rating flex items-center text-3xl" data-type="delivery">${[...Array(5)].map((_,i)=>`<span class="star" data-value="${i+1}"><i data-feather="star"></i></span>`).join('')}</div><textarea name="deliveryReview" class="input-field w-full mt-2" rows="2" placeholder="How was the delivery experience?"></textarea></div>
            <input type="hidden" name="restaurantRating" value="0"><input type="hidden" name="deliveryRating" value="0">
            <div class="flex justify-end gap-4 pt-4"><button type="button" class="btn bg-gray-200" onclick="closeModal()">Skip</button><button type="submit" class="btn btn-primary">Submit Review</button></div>
        </form>`;
    showModal(formHtml);
    
    document.querySelectorAll('.rating .star').forEach(star => {
        star.addEventListener('click', () => {
            const container = star.parentElement; const type = container.dataset.type; const value = parseInt(star.dataset.value);
            document.querySelector(`input[name="${type}Rating"]`).value = value;
            container.querySelectorAll('.star').forEach(s => {
                const sValue = parseInt(s.dataset.value);
                s.classList.toggle('selected', sValue <= value); s.querySelector('i').style.fill = sValue <= value ? '#f59e0b' : 'none';
            });
        });
    });
    document.getElementById('rating-form').addEventListener('submit', e => handlePostReview(e, orderId, order));
}

async function handlePostReview(e, orderId, orderData) {
    e.preventDefault(); const form = e.target;
    const restaurantRating = parseInt(form.elements.restaurantRating.value);
    const deliveryRating = parseInt(form.elements.deliveryRating.value);
    if (restaurantRating === 0 || deliveryRating === 0) { showSimpleModal("Rating Required", "Please select a star rating for both."); return; }

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

    const updateAvgRating = async (collection, docId, newRating) => {
        if (!docId) return;
        const ref = db.collection(collection).doc(docId);
        db.runTransaction(async (transaction) => {
            const doc = await transaction.get(ref); const data = doc.data();
            const newAvg = ((data.avgRating || 0) * (data.ratingCount || 0) + newRating) / ((data.ratingCount || 0) + 1);
            transaction.update(ref, { avgRating: newAvg, ratingCount: firebase.firestore.FieldValue.increment(1) });
        });
    };
    await updateAvgRating('restaurants', orderData.restaurantId, restaurantRating);
    await updateAvgRating('users', orderData.deliveryBoyId, deliveryRating);
    
    await logAudit("Review Submitted", `Order ID: ${orderId}`);
    showSimpleModal("Thank You!", "Your review has been submitted."); closeModal();
}

function showModal(contentHtml) {
    modalContainer.innerHTML = `<div class="modal-content">${contentHtml}</div>`;
    modalContainer.classList.add('active');
    feather.replace();
    updateUIText();
}

function showSimpleModal(title, message, onOk) {
    showModal(`<div class="text-center"><h3 class="text-2xl font-bold font-serif mb-2">${title}</h3><p class="text-gray-600 mb-6">${message}</p><button id="simple-modal-ok" class="btn btn-primary rounded-lg py-2 px-12">OK</button></div>`);
    document.getElementById('simple-modal-ok').addEventListener('click', () => { if (onOk) onOk(); closeModal(); });
}

function showConfirmationModal(title, message, onConfirm, onCancel) {
    showModal(`<div class="text-center"><h3 class="text-2xl font-bold font-serif mb-2">${title}</h3><p class="text-gray-600 mb-6">${message}</p><div class="flex justify-center gap-4"><button id="confirm-cancel" class="btn bg-gray-200 rounded-lg py-2 px-8">Cancel</button><button id="confirm-ok" class="btn btn-danger rounded-lg py-2 px-8">Confirm</button></div></div>`);
    document.getElementById('confirm-ok').addEventListener('click', () => { if (onConfirm) onConfirm(); closeModal(); });
    document.getElementById('confirm-cancel').addEventListener('click', () => { if (onCancel) onCancel(); closeModal(); });
}

function closeModal() {
    if (document.getElementById('qr-reader') && html5QrCode && html5QrCode.isScanning) stopScanner();
    modalContainer.classList.remove('active');
    modalContainer.innerHTML = '';
}

function cleanupListeners() {
    unsubscribeListeners.forEach(unsub => unsub());
    unsubscribeListeners = [];
    if (html5QrCode && html5QrCode.isScanning) stopScanner();
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
    setTimeout(() => { mobileMenuOverlay.classList.add('hidden'); }, 300);
}

mobileMenuButton.addEventListener('click', openMobileMenu);
closeMobileMenuButton.addEventListener('click', closeMobileMenu);
mobileMenuOverlay.addEventListener('click', (e) => { if (e.target === mobileMenuOverlay) closeMobileMenu(); });

// --- INITIALIZE APP ON LOAD ---
document.addEventListener('DOMContentLoaded', initializeApp);

const handleLogout = () => {
    cleanupListeners();
    auth.signOut().then(() => { window.location.reload(); });
};

logoutBtn.addEventListener('click', handleLogout);
mobileLogoutBtn.addEventListener('click', handleLogout);

// --- AI CHATBOT SCRIPT ---
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

chatbotToggle.addEventListener('click', () => chatbotWindow.classList.toggle('hidden'));
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
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getAiResponse(message) {
    const lowerCaseMessage = message.toLowerCase();
    let response = "I'm not sure how to answer that. Try asking about orders, restaurants, or your profile.";
    if (lowerCaseMessage.includes("track my order")) response = "Sure! Can you please provide the order ID?";
    else if (lowerCaseMessage.includes("help")) response = `I can help with tracking orders, finding restaurants, and answering questions about your account. What do you need assistance with?`;
    else if (lowerCaseMessage.includes("best restaurants")) response = "Based on your recent orders, I recommend trying 'The Pizza Palace' or 'Curry Kingdom'.";
    else if (lowerCaseMessage.includes("how to add menu item") && currentUser?.role === 'restaurant') response = "Go to 'Menu Management' in your portal and click the 'Add Item' button. I can guide you through the steps if you'd like!";
    setTimeout(() => { appendMessage(response, 'ai'); }, 500);
}

feather.replace();
