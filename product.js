// Import products array from the separate file
import { products } from './products-data.js';
import { showPopup, hidePopup } from './scripts/popup.js';

document.addEventListener('DOMContentLoaded', () => {
    // Immediately check if the popup overlay exists
    const popupOverlayCheck = document.querySelector('.popup-overlay');
    console.log('Initial popup overlay check:', popupOverlayCheck);
    
    // Log the HTML structure to see if the popup exists in the DOM
    console.log('Body HTML:', document.body.innerHTML);
    
    try {
        // Debugging: Log products to ensure they are imported correctly
        console.log('Imported products:', products);

        const productContainer = document.querySelector(".product-grid");
        const categoryFilter = document.querySelector("#category-filter");
        const priceFilter = document.querySelector("#price-filter");
        const priceValue = document.querySelector("#price-value");
        const sliderTrack = document.querySelector("#slider-track");
        const prevButton = document.querySelector(".slider-prev");
        const nextButton = document.querySelector(".slider-next");

        if (!productContainer || !sliderTrack || !categoryFilter || !priceFilter) {
            console.error('One or more DOM elements are missing.');
            return;
        }

        let filteredProducts = [...products];
        let currentIndex = 0;
        const slidesToShow = 3;
        const cart = [];
        let autoMoveInterval;
        let debounceTimer;

        // Render slider
        function renderSlider() {
            console.log('Rendering slider with products:', filteredProducts);
            sliderTrack.innerHTML = filteredProducts.map(product => `
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-details">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-footer">
                            <span class="product-price">LKR ${product.price.toFixed(2)}</span>
                            <button class="btn btn-primary">
                                <i data-feather="shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            feather.replace();
            updateSliderPosition();
            addCartEventListeners();
        }

        // Render products in grid
        function renderProducts(productsToRender) {
            console.log('Rendering products in grid:', productsToRender);
            const categories = [...new Set(productsToRender.map(p => p.category))];
            let html = '';

            categories.forEach(category => {
                html += `<h2 class="category-title">${category}</h2>`;
                html += productsToRender
                    .filter(product => product.category === category)
                    .map(product => `
                        <div class="product-card" data-id="${product.id}">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <div class="product-details">
                                <h3 class="product-name">${product.name}</h3>
                                <p class="product-description">${product.description}</p>
                                <div class="product-footer">
                                    <span class="product-price">LKR ${product.price.toFixed(2)}</span>
                                    <button class="btn btn-primary">
                                        <i data-feather="shopping-cart"></i> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('');
            });

            productContainer.innerHTML = html || '<p>No products match your filters.</p>';
            feather.replace();
            addCartEventListeners();
        }

        // Add cart button event listeners
        function addCartEventListeners() {
            console.log('Adding cart event listeners');
            document.querySelectorAll('.btn-primary').forEach(button => {
                button.removeEventListener('click', handleCartClick); // Remove existing listeners to prevent duplicates
                button.addEventListener('click', handleCartClick);
            });
        }

        // Separate handler function for the click event
        function handleCartClick(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Cart button clicked', e.target);
            
            // Find the product card regardless of where inside the button was clicked
            const card = e.target.closest('.product-card');
            if (!card) {
                console.error('Could not find product card');
                return;
            }
            
            const productId = parseInt(card.dataset.id);
            console.log('Product ID:', productId);
            
            const product = products.find(p => p.id === productId);
            if (product) {
                if (product.styles && product.styles.length > 0) {
                    // Product has styles available
                    console.log('Opening popup for product:', product.name);
                    showPopup(productId, product.styles);
                } else {
                    // No styles available
                    showNotification(`No available styles for ${product.name} at this moment`, true);
                }
            } else {
                console.error('Product not found:', productId);
            }
        }

        // Add to cart functionality
        function addToCart(productId, styleIndex = null) {
            const product = products.find(p => p.id === productId);
            if (product) {
                // Create a copy of the product with style information if available
                const cartItem = { 
                    ...product,
                    selectedStyle: styleIndex !== null && product.styles ? product.styles[styleIndex] : null
                };
                cart.push(cartItem);
                updateCartCount();
                showNotification(`${product.name} added to cart`);
            }
        }

        // Update cart count
        function updateCartCount() {
            const cartCount = document.getElementById('cart-count');
            cartCount.textContent = cart.length;
        }

        // Show notification
        function showNotification(message, isWarning = false) {
            const notification = document.createElement('div');
            notification.className = isWarning ? 'notification notification-warning' : 'notification';
            notification.innerHTML = `
                <i data-feather="${isWarning ? 'alert-circle' : 'check-circle'}"></i>
                ${message}
            `;
            document.body.appendChild(notification);
            feather.replace();
            setTimeout(() => notification.remove(), 3000);
        }

        // Apply filters - adjusted for direct LKR values
        function applyFilters() {
            const selectedCategory = categoryFilter.value;
            const maxPriceLKR = parseFloat(priceFilter.value);

            filteredProducts = products.filter(product => {
                const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
                const priceMatch = product.price <= maxPriceLKR;
                return categoryMatch && priceMatch;
            });

            renderProducts(filteredProducts);
        }

        // Update slider position
        function updateSliderPosition() {
            const cardWidth = sliderTrack.querySelector(".product-card").offsetWidth + 16;
            const offset = -currentIndex * cardWidth;
            sliderTrack.style.transform = `translateX(${offset}px)`;
            updateSliderButtons();
        }

        // Update slider button states
        function updateSliderButtons() {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= products.length - slidesToShow;
        }

        // Auto-move slider
        function startAutoMove() {
            autoMoveInterval = setInterval(() => {
                const maxIndex = products.length - slidesToShow;
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSliderPosition();
            }, 3000);
        }

        function stopAutoMove() {
            clearInterval(autoMoveInterval);
        }

        // Function to ensure popup element exists
        function ensurePopupExists() {
            let popupOverlay = document.querySelector('.popup-overlay');
            if (!popupOverlay) {
                console.log('Creating popup elements as they do not exist');
                popupOverlay = document.createElement('div');
                popupOverlay.className = 'popup-overlay';
                popupOverlay.innerHTML = `
                    <div class="popup">
                        <div class="popup-content">
                            <h2>Select Style</h2>
                            <div class="style-options"></div>
                            <div class="popup-buttons">
                                <button class="btn btn-cancel">Cancel</button>
                                <button class="btn btn-primary btn-confirm">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(popupOverlay);
            }
        }

        // Move popup event listeners inside the DOMContentLoaded event
        function setupPopupListeners() {
            console.log('Setting up popup listeners');
            const popupOverlay = document.querySelector('.popup-overlay');
            const cancelButton = document.querySelector('.btn-cancel');
            const addButton = document.querySelector('.btn-add');
        
            if (popupOverlay) {
                popupOverlay.addEventListener('click', (e) => {
                    if (e.target === popupOverlay) {
                        console.log('Overlay clicked, hiding popup');
                        hidePopup();
                    }
                });
            } else {
                console.error('Popup overlay element not found');
            }
        
            if (cancelButton) {
                cancelButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Cancel button clicked');
                    hidePopup();
                });
            } else {
                console.error('Cancel button element not found');
            }
        
            if (!addButton) {
                console.error('Add button element not found');
            }
        }

        // Initialize price filter with direct LKR values
        function initializePriceFilter() {
            const maxPrice = Math.max(...products.map(p => p.price));
            priceFilter.max = maxPrice.toFixed(0);
            priceFilter.value = maxPrice.toFixed(0);
            priceValue.textContent = `LKR ${priceFilter.value}`;
        }

        // Event Listeners
        prevButton.addEventListener('click', () => {
            stopAutoMove();
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
            }
        });

        nextButton.addEventListener('click', () => {
            stopAutoMove();
            const maxIndex = products.length - slidesToShow;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSliderPosition();
            }
        });

        sliderTrack.addEventListener('mouseenter', stopAutoMove);
        sliderTrack.addEventListener('mouseleave', startAutoMove);

        priceFilter.addEventListener('input', () => {
            priceValue.textContent = `LKR ${priceFilter.value}`;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyFilters, 300);
        });

        categoryFilter.addEventListener('change', applyFilters);

        // Initial setup
        renderSlider();
        initializePriceFilter();
        renderProducts(filteredProducts);
        startAutoMove();
        ensurePopupExists();
        setupPopupListeners();
        
        // Listen for the custom addToCart event
        document.addEventListener('addToCart', (event) => {
            const { productId, styleIndex } = event.detail;
            console.log('addToCart event received:', productId, styleIndex);
            addToCart(productId, styleIndex);
        });

        // Cleanup function
        const cleanup = () => {
            sliderTrack.removeEventListener('mouseenter', stopAutoMove);
            sliderTrack.removeEventListener('mouseleave', startAutoMove);
            prevButton.removeEventListener('click', stopAutoMove);
            nextButton.removeEventListener('click', stopAutoMove);
        };

        // Cleanup on page unload
        window.addEventListener('unload', cleanup);

    } catch (error) {
        console.error('Error initializing product page:', error);
    }
});