// Product Details

let products = JSON.parse(localStorage.getItem("agriProducts")) || [
    { id: 1, name: "Tomato Seeds", category: "Seeds", price: 120, emoji: "🍅", stock: 20 },
    { id: 2, name: "Wheat Seeds", category: "Seeds", price: 150, emoji: "🌾", stock: 25 },
    { id: 3, name: "Organic Fertilizer", category: "Fertilizers", price: 250, emoji: "🌿", stock: 30 },
    { id: 4, name: "Plant Growth Fertilizer", category: "Fertilizers", price: 300, emoji: "🧪", stock: 15 },
    { id: 5, name: "Garden Tools Set", category: "Tools", price: 450, emoji: "🛠️", stock: 10 },
    { id: 6, name: "Water Sprayer", category: "Equipment", price: 800, emoji: "💧", stock: 12 },
    { id: 7, name: "Crop Protection Spray", category: "Pesticides", price: 350, emoji: "🛡️", stock: 18 },
    { id: 8, name: "Hand Tractor", category: "Equipment", price: 1200, emoji: "🚜", stock: 5 }
];

let cart = JSON.parse(localStorage.getItem("agriCart")) || [];
let orders = JSON.parse(localStorage.getItem("agriOrders")) || [];
let wallet = Number(localStorage.getItem("agriWallet")) || 5000;
let currentUser = "";
let otp = "";


// Save Products

function saveProducts() {
    localStorage.setItem("agriProducts", JSON.stringify(products));
}


// Display Products

function displayProducts(list = products) {

    let container = document.getElementById("productList");
    container.innerHTML = "";

    list.forEach(function(product) {

        container.innerHTML += `
            <div class="product-card">
                <div class="product-image">${product.emoji}</div>
                <h3>${product.name}</h3>
                <p>Category: ${product.category}</p>
                <p>Price: ₹${product.price}</p>
                <p>Stock: ${product.stock}</p>

                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}


// Search Products

function searchProducts() {

    let search = document.getElementById("searchInput").value.toLowerCase();
    let category = document.getElementById("categoryFilter").value;

    let filtered = products.filter(function(product) {

        let nameMatch = product.name.toLowerCase().includes(search);

        let categoryMatch = category === "All" ||
            product.category === category;

        return nameMatch && categoryMatch;
    });

    displayProducts(filtered);
}


// Show All Products

function showAllProducts() {
    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "All";
    displayProducts();
}


// Category Filter

function filterCategory(category) {
    document.getElementById("categoryFilter").value = category;
    document.getElementById("searchInput").value = "";
    searchProducts();

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}


// Scroll to Products

function scrollToProducts() {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}


// Add to Cart

function addToCart(id) {

    let product = products.find(function(item) {
        return item.id === id;
    });

    if (!product || product.stock <= 0) {
        alert("Product is out of stock!");
        return;
    }

    let item = cart.find(function(cartItem) {
        return cartItem.id === id;
    });

    if (item) {
        if (item.quantity >= product.stock) {
            alert("Maximum available stock reached.");
            return;
        }
        item.quantity++;
    } else {
        cart.push({
            id: id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    displayCart();
}


// Save Cart

function saveCart() {
    localStorage.setItem("agriCart", JSON.stringify(cart));
}


// Display Cart

function displayCart() {

    let container = document.getElementById("cartList");
    container.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach(function(item) {

        total += item.price * item.quantity;

        container.innerHTML += `
            <div class="cart-item">
                <div>
                    <h3>${item.name}</h3>
                    <p>Price: ₹${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>

                <div>
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeCartItem(${item.id})">Delete</button>
                </div>
            </div>
        `;
    });

    document.getElementById("cartTotal").innerText = total;
}


// Change Cart Quantity

function changeQuantity(id, amount) {

    let item = cart.find(function(cartItem) {
        return cartItem.id === id;
    });

    let product = products.find(function(product) {
        return product.id === id;
    });

    if (!item || !product) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(function(cartItem) {
            return cartItem.id !== id;
        });
    } else if (item.quantity > product.stock) {
        item.quantity = product.stock;
        alert("Available stock limit reached.");
    }

    saveCart();
    displayCart();
}


// Delete Cart Item

function removeCartItem(id) {
    cart = cart.filter(function(item) {
        return item.id !== id;
    });

    saveCart();
    displayCart();
}


// Wallet

function displayWallet() {
    document.getElementById("walletBalance").innerText = wallet;
}

function addMoney() {

    let amount = Number(document.getElementById("walletAmount").value);

    if (!amount || amount <= 0) {
        document.getElementById("walletMessage").innerText =
            "Enter a valid amount.";
        return;
    }

    wallet += amount;

    localStorage.setItem("agriWallet", wallet);

    displayWallet();

    document.getElementById("walletMessage").innerText =
        "Money added successfully!";

    document.getElementById("walletAmount").value = "";
}


// Shipping Address

function saveAddress() {

    let name = document.getElementById("addressName").value.trim();
    let phone = document.getElementById("addressPhone").value.trim();
    let address = document.getElementById("addressDetails").value.trim();

    if (!name || !phone || !address) {
        document.getElementById("addressMessage").innerText =
            "Please fill all address details.";
        return;
    }

    let shipping = {
        name: name,
        phone: phone,
        address: address
    };

    localStorage.setItem("agriShipping", JSON.stringify(shipping));

    document.getElementById("addressMessage").innerText =
        "Shipping address saved successfully!";
}


// Checkout

function checkout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let shipping = JSON.parse(localStorage.getItem("agriShipping"));

    if (!shipping) {
        alert("Please save your shipping address first.");
        document.getElementById("address-section").scrollIntoView();
        return;
    }

    let total = cart.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    if (total > wallet) {
        alert("Insufficient wallet balance!");
        return;
    }

    // Check available stock
    for (let item of cart) {
        let product = products.find(function(p) {
            return p.id === item.id;
        });

        if (!product || item.quantity > product.stock) {
            alert("Insufficient stock for " + item.name);
            return;
        }
    }

    wallet -= total;
    localStorage.setItem("agriWallet", wallet);

    // Update stock
    cart.forEach(function(item) {
        let product = products.find(function(p) {
            return p.id === item.id;
        });

        product.stock -= item.quantity;
    });

    saveProducts();

    let order = {
        id: "ORD" + Date.now(),
        items: cart,
        total: total,
        address: shipping,
        status: "Order Placed"
    };

    orders.push(order);

    localStorage.setItem("agriOrders", JSON.stringify(orders));

    cart = [];
    saveCart();

    displayCart();
    displayWallet();
    displayProducts();
    displayOrders();
    displayFarmerOrders();

    alert("Order placed successfully!");
}


// Display Orders

function displayOrders() {

    let container = document.getElementById("orderList");
    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders placed yet.</p>";
        return;
    }

    orders.forEach(function(order) {

        container.innerHTML += `
            <div class="order-card">
                <h3>Order ID: ${order.id}</h3>
                <p>Total: ₹${order.total}</p>
                <p>Status: ${order.status}</p>
                <p>Shipping Address: ${order.address.address}</p>
            </div>
        `;
    });
}


// LOGIN

function showLogin() {
    document.getElementById("login").scrollIntoView({
        behavior: "smooth"
    });
}

function loginUser() {

    let username = document.getElementById("loginUser").value.trim();
    let password = document.getElementById("loginPassword").value;

    if (!username || !password) {
        document.getElementById("loginMessage").innerText =
            "Enter username and password.";
        return;
    }

    currentUser = username;

    otp = String(Math.floor(1000 + Math.random() * 9000));

    document.getElementById("loginMessage").innerText =
        "Demo OTP: " + otp + " (Enter this OTP to verify)";
}


// OTP Verification

function verifyOTP() {

    let enteredOTP = document.getElementById("loginOTP").value;

    if (enteredOTP === otp && otp !== "") {

        document.getElementById("loginMessage").innerText =
            "Login successful! Welcome " + currentUser;

        otp = "";

    } else {

        document.getElementById("loginMessage").innerText =
            "Invalid OTP. Try again.";

    }
}


// REGISTER

function registerUser() {

    let name = document.getElementById("registerName").value.trim();
    let username = document.getElementById("registerUser").value.trim();
    let password = document.getElementById("registerPassword").value;
    let type = document.getElementById("userType").value;

    if (!name || !username || !password) {
        document.getElementById("registerMessage").innerText =
            "Please fill all fields.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("agriUsers")) || [];

    if (users.some(function(user) {
        return user.username === username;
    })) {
        document.getElementById("registerMessage").innerText =
            "Username already exists.";
        return;
    }

    users.push({
        name: name,
        username: username,
        password: password,
        type: type
    });

    localStorage.setItem("agriUsers", JSON.stringify(users));

    document.getElementById("registerMessage").innerText =
        "Registration successful!";

    document.getElementById("registerName").value = "";
    document.getElementById("registerUser").value = "";
    document.getElementById("registerPassword").value = "";
}


// FARMER ADD PRODUCT

function addProduct() {

    let name = document.getElementById("newProductName").value.trim();
    let category = document.getElementById("newProductCategory").value;
    let price = Number(document.getElementById("newProductPrice").value);
    let emoji = document.getElementById("newProductEmoji").value || "🌱";
    let stock = Number(document.getElementById("newProductStock").value);

    if (!name || !category || price <= 0 || stock < 0) {
        document.getElementById("farmerMessage").innerText =
            "Enter valid product details.";
        return;
    }

    products.push({
        id: Date.now(),
        name: name,
        category: category,
        price: price,
        emoji: emoji,
        stock: stock
    });

    saveProducts();
    displayProducts();
    displayFarmerProducts();

    document.getElementById("farmerMessage").innerText =
        "Product added successfully!";

    document.getElementById("newProductName").value = "";
    document.getElementById("newProductCategory").value = "";
    document.getElementById("newProductPrice").value = "";
    document.getElementById("newProductEmoji").value = "";
    document.getElementById("newProductStock").value = "";
}


// FARMER PRODUCT MANAGEMENT

function displayFarmerProducts() {

    let container = document.getElementById("farmerProductList");
    container.innerHTML = "";

    products.forEach(function(product) {

        container.innerHTML += `
            <div class="farmer-item">
                <h4>${product.emoji} ${product.name}</h4>
                <p>Category: ${product.category}</p>
                <p>Price: ₹${product.price}</p>
                <p>Stock: ${product.stock}</p>

                <button onclick="updateProduct(${product.id})">Update</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        `;
    });
}


// UPDATE PRODUCT

function updateProduct(id) {

    let product = products.find(function(item) {
        return item.id === id;
    });

    let newPrice = prompt("Enter new product price:", product.price);
    let newStock = prompt("Enter new stock:", product.stock);

    if (newPrice !== null && newStock !== null) {

        newPrice = Number(newPrice);
        newStock = Number(newStock);

        if (newPrice > 0 && newStock >= 0) {

            product.price = newPrice;
            product.stock = newStock;

            saveProducts();
            displayProducts();
            displayFarmerProducts();

            alert("Product updated successfully!");
        }
    }
}


// DELETE PRODUCT

function deleteProduct(id) {

    if (confirm("Are you sure you want to delete this product?")) {

        products = products.filter(function(item) {
            return item.id !== id;
        });

        saveProducts();
        displayProducts();
        displayFarmerProducts();
    }
}


// FARMER ORDER MANAGEMENT

function displayFarmerOrders() {

    let container = document.getElementById("farmerOrderList");
    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders received.</p>";
        return;
    }

    orders.forEach(function(order) {

        container.innerHTML += `
            <div class="farmer-item">
                <h4>Order ID: ${order.id}</h4>
                <p>Total: ₹${order.total}</p>
                <p>Status: ${order.status}</p>

                <button onclick="updateOrderStatus('${order.id}')">
                    Update Shipping Status
                </button>
            </div>
        `;
    });
}


// UPDATE ORDER STATUS

function updateOrderStatus(id) {

    let order = orders.find(function(item) {
        return item.id === id;
    });

    let status = prompt(
        "Enter status:\nOrder Placed\nProcessing\nShipped\nDelivered",
        order.status
    );

    if (status) {
        order.status = status;

        localStorage.setItem("agriOrders", JSON.stringify(orders));

        displayOrders();
        displayFarmerOrders();

        alert("Shipping status updated!");
    }
}


// MY SALES

function displaySales() {

    let container = document.getElementById("salesList");

    let totalSales = orders.reduce(function(total, order) {
        return total + order.total;
    }, 0);

    container.innerHTML = `
        <div class="farmer-item">
            <h3>Total Orders: ${orders.length}</h3>
            <h3>Total Sales: ₹${totalSales}</h3>
        </div>
    `;
}


// INITIAL DISPLAY

displayProducts();
displayCart();
displayWallet();
displayOrders();
displayFarmerProducts();
displayFarmerOrders();
displaySales();