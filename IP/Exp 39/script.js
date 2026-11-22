let cart = [];

// Add Products to Cart
function addToCart(name, price) {
    let item = cart.find(product => product.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    displayCart();
    alert(name + " added to cart!");
}

// Display Cart
function displayCart() {
    let cartItems = document.getElementById("cartItems");
    let total = 0;

    cartItems.innerHTML = "";

    cart.forEach(function(item, index) {
        let subtotal = item.price * item.quantity;
        total += subtotal;

        cartItems.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>
                    <button onclick="changeQuantity(${index},-1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${index},1)">+</button>
                </td>
                <td>₹${subtotal}</td>
                <td>
                    <button onclick="removeItem(${index})">Remove</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("total").innerHTML = "Total: ₹" + total;
}

// Change Quantity
function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    displayCart();
}

// Remove Item
function removeItem(index) {
    cart.splice(index, 1);
    displayCart();
}

// Clear Cart
function clearCart() {
    cart = [];
    displayCart();
}

// Search Products
function searchProducts() {
    let search = document.getElementById("search").value.toLowerCase();
    let products = document.querySelectorAll(".card[data-category]");

    products.forEach(function(product) {
        let name = product.querySelector("h3").innerText.toLowerCase();

        if (name.includes(search)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// Filter Products
function filterProducts() {
    let category = document.getElementById("category").value;
    let products = document.querySelectorAll(".card[data-category]");

    products.forEach(function(product) {
        if (category === "all" || product.dataset.category === category) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// Sort Products
function sortProducts() {
    let sort = document.getElementById("sort").value;
    let container = document.querySelector(".products");
    let products = Array.from(container.children);

    if (sort === "low") {
        products.sort((a, b) => a.dataset.price - b.dataset.price);
    } else if (sort === "high") {
        products.sort((a, b) => b.dataset.price - a.dataset.price);
    }

    products.forEach(product => container.appendChild(product));
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        document.getElementById("checkout").scrollIntoView();
    }
}

// Place Order
document.getElementById("checkoutForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Please add products to your cart first!");
        return;
    }

    let name = document.getElementById("customerName").value;
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    document.getElementById("orderMessage").innerHTML = `
        <h3>Order Placed Successfully!</h3>
        <p>Thank you, ${name}.</p>
        <p>Order Total: ₹${total}</p>
        <p>Status: Order Confirmed</p>
    `;

    alert("Your order has been placed successfully!");

    cart = [];
    displayCart();
    this.reset();
});