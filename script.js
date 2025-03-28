// Load cart from localStorage or initialize empty
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in nav
function updateCartCount() {
    const cartCountEls = document.querySelectorAll('#cart-count');
    cartCountEls.forEach(el => (el.textContent = cart.length));
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);