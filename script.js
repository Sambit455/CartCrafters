const apiUrl = 'https://fakestoreapi.com/products';

// Fetch featured products on index.html
async function fetchFeaturedProducts() {
    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        const featuredProducts = products.slice(0, 3); // Get 3 featured products
        const featuredContainer = document.getElementById('featured-products');

        featuredProducts.forEach(product => {
            const productDiv = createProductCard(product);
            featuredContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error fetching featured products:', error);
    }
}

// Fetch all products on products.html
async function fetchAllProducts() {
    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        const productList = document.getElementById('product-list');

        products.forEach(product => {
            const productDiv = createProductCard(product);
            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Fetch single product details on product-details.html
async function fetchProductDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const response = await fetch(`${apiUrl}/${id}`);
        const product = await response.json();
        const productDetail = document.getElementById('product-detail');

        productDetail.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <div class="product-content">
                <h2>${product.title}</h2>
                <p><strong>Price:</strong> $${product.price}</p>
                <p>${product.description}</p>
                <button data-id="${product.id}">Add to Cart</button>
            </div>
        `;

        // Add event listener to the "Add to Cart" button
        const addButton = productDetail.querySelector('button');
        addButton.addEventListener('click', () => addToCart(product));
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}


// Create a product card element
function createProductCard(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
        <div class="product-content">
            <h3>${product.title}</h3>
            <img src="${product.image}" alt="${product.title}" />
            <p><strong>Price:</strong> $${product.price}</p>
            <div class="product-actions">
                <a href="product-details.html?id=${product.id}">View Details</a>
                <button data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;

    // Add event listener to the "Add to Cart" button
    const addButton = productDiv.querySelector('button');
    addButton.addEventListener('click', () => addToCart(product));

    return productDiv;
}

// Add product to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.title} has been added to your cart.`);
}

// Display cart items on cart.html
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const cartDiv = document.createElement('div');
        cartDiv.className = 'cart-item';
        cartDiv.innerHTML = `
            <div class="cart-item-content">
                <h3>${item.title}</h3>
                <img src="${item.image}" alt="${item.title}" />
                <p><strong>Price:</strong> $${item.price}</p>
                <p><strong>Quantity:</strong> ${item.quantity}</p>
                <button data-id="${item.id}">Remove</button>
            </div>
        `;
        cartContainer.appendChild(cartDiv);

        // Add event listener to the "Remove" button
        const removeButton = cartDiv.querySelector('button');
        removeButton.addEventListener('click', () => removeFromCart(item.id));
    });
}

// Remove product from cart
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}

// Handle checkout form submission
function handleCheckout() {
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();

        if (name === '' || address === '') {
            alert('Please fill in all fields.');
            return;
        }

        // Here you would typically send the order data to the server
        alert('Thank you for your order!');
        localStorage.removeItem('cart');
        form.reset();
        window.location.href = 'index.html';
    });
}

// Initialize functions based on the current page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('featured-products')) {
        fetchFeaturedProducts();
    }

    if (document.getElementById('product-list')) {
        fetchAllProducts();
    }

    if (document.getElementById('product-detail')) {
        fetchProductDetails();
    }

    if (document.getElementById('cart-items')) {
        displayCartItems();
    }

    if (document.getElementById('checkout-form')) {
        handleCheckout();
    }
});
