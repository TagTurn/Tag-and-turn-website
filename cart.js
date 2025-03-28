document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.querySelector(".cart-items");
    const cartSubtotalEl = document.querySelector("#cart-subtotal");
    const cartTotalEl = document.querySelector("#cart-total");
    const shippingCostEl = document.querySelector("#shipping-cost");
    const checkoutBtn = document.getElementById("checkout-btn");
    const promoInput = document.getElementById("promo-code");
    const applyPromoBtn = document.getElementById("apply-promo");

    const SHIPPING_COST = 5.00;
    const PROMO_CODES = {
        'WELCOME10': 0.1,  // 10% off
        'SCHOLAR20': 0.2   // 20% off for students
    };

    let promoDiscount = 0;

    function displayCart() {
        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i data-feather="shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="product.html" class="btn btn-primary">Explore Products</a>
                </div>
            `;
            cartSubtotalEl.textContent = "$0.00";
            cartTotalEl.textContent = "$5.00";
            shippingCostEl.textContent = "$5.00";
        } else {
            cartContainer.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="cart-item-actions">
                        <button onclick="removeFromCart(${index})" class="btn-remove">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </div>
            `).join("");

            const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
            const total = subtotal + SHIPPING_COST - (subtotal * promoDiscount);

            cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            shippingCostEl.textContent = `$${SHIPPING_COST.toFixed(2)}`;
            cartTotalEl.textContent = `$${total.toFixed(2)}`;
        }

        // Reinitialize Feather icons
        feather.replace();
    }

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartCount();
        displayCart();
    };

    applyPromoBtn.addEventListener("click", () => {
        const promoCode = promoInput.value.toUpperCase();
        
        if (PROMO_CODES[promoCode]) {
            promoDiscount = PROMO_CODES[promoCode];
            
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <i data-feather="tag"></i>
                Promo code applied successfully!
            `;
            document.body.appendChild(notification);
            feather.replace();

            setTimeout(() => {
                notification.remove();
            }, 3000);

            displayCart();
        } else {
            const notification = document.createElement('div');
            notification.className = 'notification notification-warning';
            notification.innerHTML = `
                <i data-feather="alert-circle"></i>
                Invalid promo code
            `;
            document.body.appendChild(notification);
            feather.replace();

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    });

    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            // Show empty cart notification
            const notification = document.createElement('div');
            notification.className = 'notification notification-warning';
            notification.innerHTML = `
                <i data-feather="alert-circle"></i>
                Your cart is empty
            `;
            document.body.appendChild(notification);
            feather.replace();

            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        } else {
            // Placeholder for future checkout process
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <i data-feather="check-circle"></i>
                Checkout coming soon!
            `;
            document.body.appendChild(notification);
            feather.replace();

            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    });

    // Initial cart display
    displayCart();
});