export function showPopup(productId, images) {
    console.log('showPopup called with:', productId, images);
    
    const popupOverlay = document.querySelector('.popup-overlay');
    if (!popupOverlay) {
        console.error('Popup overlay element not found!');
        return;
    }
    
    const popupImagesContainer = document.querySelector('.popup-images');
    const addButton = document.querySelector('.btn-add');
    
    if (!popupImagesContainer || !addButton) {
        console.error('Popup elements are missing in the DOM.');
        return;
    }

    popupImagesContainer.innerHTML = '';
    images.forEach((img, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = img;
        imgElement.alt = `Style ${index + 1}`;
        imgElement.dataset.index = index;
        imgElement.addEventListener('click', function() {
            popupImagesContainer.querySelectorAll('img').forEach(i => 
                i.classList.remove('selected'));
            this.classList.add('selected');
        });
        popupImagesContainer.appendChild(imgElement);
    });

    addButton.onclick = () => {
        const selectedImage = popupImagesContainer.querySelector('img.selected');
        if (selectedImage) {
            const event = new CustomEvent('addToCart', {
                detail: { productId, styleIndex: parseInt(selectedImage.dataset.index) }
            });
            document.dispatchEvent(event);
            hidePopup();
        } else {
            alert('Please select a style before adding to cart.');
        }
    };

    popupOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => popupOverlay.classList.add('active'), 10);
}

export function hidePopup() {
    console.log('hidePopup called');
    const popupOverlay = document.querySelector('.popup-overlay');
    if (!popupOverlay) {
        console.error('Popup overlay element not found in hidePopup');
        return;
    }

    popupOverlay.classList.remove('active');
    setTimeout(() => {
        if (!popupOverlay.classList.contains('active')) {
            popupOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }, 300);
}