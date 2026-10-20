const $ = (selector) => document.querySelector(selector);

const defaultProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1800,
        condition: "Like New",
        description: "Comfortable headphones with excellent sound quality.",
        seller: "Arun",
        emoji: "🎧",
        image: ""
    },
    {
        id: 2,
        name: "Wooden Study Table",
        category: "Furniture",
        price: 2500,
        condition: "Good",
        description: "Strong wooden table suitable for studying or working.",
        seller: "Priya",
        emoji: "🪑",
        image: ""
    },
    {
        id: 3,
        name: "Denim Jacket",
        category: "Clothing",
        price: 650,
        condition: "Like New",
        description: "Stylish denim jacket in excellent condition.",
        seller: "Meena",
        emoji: "🧥",
        image: ""
    },
    {
        id: 4,
        name: "Vintage Camera",
        category: "Collectibles",
        price: 3200,
        condition: "Good",
        description: "Classic camera for collectors and photography lovers.",
        seller: "Rahul",
        emoji: "📷",
        image: ""
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 900,
        condition: "Good",
        description: "Portable speaker for music and entertainment.",
        seller: "Kavin",
        emoji: "🔊",
        image: ""
    },
    {
        id: 6,
        name: "Comfortable Sofa",
        category: "Furniture",
        price: 4500,
        condition: "Fair",
        description: "Pre-owned sofa with a comfortable seating area.",
        seller: "Divya",
        emoji: "🛋️",
        image: ""
    },
    {
        id: 7,
        name: "Running Shoes",
        category: "Clothing",
        price: 750,
        condition: "Good",
        description: "Lightweight shoes suitable for everyday activities.",
        seller: "Vijay",
        emoji: "👟",
        image: ""
    },
    {
        id: 8,
        name: "Collectible Figurine",
        category: "Collectibles",
        price: 1200,
        condition: "Like New",
        description: "Decorative collectible figurine for display.",
        seller: "Anu",
        emoji: "🏆",
        image: ""
    }
];

function readData(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

let products = readData("renew_products", defaultProducts);
let users = readData("renew_users", []);
let orders = readData("renew_orders", []);
let categories = readData("renew_categories", [
    "Electronics",
    "Furniture",
    "Clothing",
    "Collectibles"
]);
let feedback = readData("renew_feedback", []);

let currentUser = sessionStorage.getItem("renew_current_user") || "";
let isAdmin = sessionStorage.getItem("renew_admin") === "true";
let selectedCategory = "All";
let toastTimer;

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function money(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
}

function notify(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function persistAll() {
    saveData("renew_products", products);
    saveData("renew_users", users);
    saveData("renew_orders", orders);
    saveData("renew_categories", categories);
    saveData("renew_feedback", feedback);
}

function getFavorites() {
    return readData("renew_favorites_" + (currentUser || "guest"), []);
}

function setFavorites(favorites) {
    saveData("renew_favorites_" + (currentUser || "guest"), favorites);
    $("#favoriteCount").textContent = favorites.length;
}

function renderProducts() {
    const search = $("#searchInput").value.trim().toLowerCase();
    const category = $("#categoryFilter").value;
    const condition = $("#conditionFilter").value;
    const sort = $("#sortFilter").value;
    const favorites = getFavorites();

    let visible = products.filter(product => {
        const matchesSearch = [
            product.name,
            product.category,
            product.description,
            product.seller
        ].some(value => String(value || "").toLowerCase().includes(search));

        const matchesCategory =
            category === "All" || product.category === category;

        const matchesCondition =
            condition === "All" || product.condition === condition;

        const matchesSelectedCategory =
            selectedCategory === "All" || product.category === selectedCategory;

        return matchesSearch && matchesCategory &&
            matchesCondition && matchesSelectedCategory;
    });

    if (sort === "low") {
        visible.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        visible.sort((a, b) => b.price - a.price);
    } else {
        visible.sort((a, b) => b.id - a.id);
    }

    $("#resultCount").textContent =
        `${visible.length} item${visible.length === 1 ? "" : "s"} found`;

    $("#productStat").textContent = products.length + "+";

    if (visible.length === 0) {
        $("#productGrid").innerHTML = `
            <div class="empty-state">
                <h3>No items found</h3>
                <p>Try a different search or category.</p>
            </div>`;
        return;
    }

    $("#productGrid").innerHTML = visible.map(product => {
        const isSaved = favorites.includes(product.id);

        const imageContent = product.image
            ? `<img src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
               <span style="display:none">${escapeHTML(product.emoji || "📦")}</span>`
            : escapeHTML(product.emoji || "📦");

        return `
            <article class="product-card">
                <div class="product-image">
                    ${imageContent}
                    <span class="condition-label">
                        ${escapeHTML(product.condition)}
                    </span>
                    <button class="favorite-btn ${isSaved ? "saved" : ""}"
                        type="button"
                        aria-label="Toggle favorite"
                        onclick="toggleFavorite(${product.id})">
                        ${isSaved ? "♥" : "♡"}
                    </button>
                </div>

                <div class="product-info">
                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>
                    <h3>${escapeHTML(product.name)}</h3>
                    <p class="product-description">
                        ${escapeHTML(product.description)}
                    </p>
                    <p class="seller-info">
                        Seller: ${escapeHTML(product.seller)}
                    </p>
                    <div class="price-row">
                        <span class="price">${money(product.price)}</span>
                        <button class="small-btn" type="button"
                            onclick="buyProduct(${product.id})">
                            Buy Now
                        </button>
                    </div>
                    <button class="small-btn negotiate-btn" type="button"
                        onclick="negotiate(${product.id})">
                        💬 Negotiate Price
                    </button>
                </div>
            </article>`;
    }).join("");
}

function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(favoriteId => favoriteId !== id);
        notify("Removed from favorites.");
    } else {
        favorites.push(id);
        notify("Added to favorites.");
    }

    setFavorites(favorites);
    renderProducts();
}

function showFavorites() {
    const favorites = getFavorites();

    if (favorites.length === 0) {
        notify("You have no favorite items yet.");
        return;
    }

    selectedCategory = "All";
    $("#categoryFilter").value = "All";
    $("#conditionFilter").value = "All";
    $("#searchInput").value = "";

    const favoriteProducts = products.filter(product =>
        favorites.includes(product.id)
    );

    $("#resultCount").textContent =
        `${favoriteProducts.length} favorite item(s)`;

    $("#productGrid").innerHTML = favoriteProducts.map(product => `
        <article class="product-card">
            <div class="product-image">
                ${product.image
                    ? `<img src="${escapeHTML(product.image)}"
                            alt="${escapeHTML(product.name)}">`
                    : escapeHTML(product.emoji || "📦")}
                <span class="condition-label">${escapeHTML(product.condition)}</span>
            </div>
            <div class="product-info">
                <span class="product-category">${escapeHTML(product.category)}</span>
                <h3>${escapeHTML(product.name)}</h3>
                <p class="product-description">${escapeHTML(product.description)}</p>
                <div class="price-row">
                    <span class="price">${money(product.price)}</span>
                    <button class="small-btn" type="button"
                        onclick="buyProduct(${product.id})">Buy Now</button>
                </div>
                <button class="small-btn negotiate-btn" type="button"
                    onclick="toggleFavorite(${product.id})">
                    Remove Favorite
                </button>
            </div>
        </article>
    `).join("");

    $("#market").scrollIntoView({ behavior: "smooth" });
}

function buyProduct(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    if (!currentUser) {
        notify("Please register or log in before placing an order.");
        $("#account").scrollIntoView({ behavior: "smooth" });
        return;
    }

    if (product.seller.toLowerCase() === currentUser.toLowerCase()) {
        notify("You cannot buy your own listing.");
        return;
    }

    const confirmed = confirm(
        `Place a demo order for "${product.name}" at ${money(product.price)}?`
    );

    if (!confirmed) return;

    const order = {
        id: Date.now(),
        productId: product.id,
        item: product.name,
        buyer: currentUser,
        seller: product.seller,
        amount: product.price,
        status: "Shipped",
        feedback: false,
        date: new Date().toISOString()
    };

    orders.push(order);
    saveData("renew_orders", orders);
    renderOrders();
    renderAdmin();

    notify("Demo order placed successfully!");
    $("#orders").scrollIntoView({ behavior: "smooth" });
}

function negotiate(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    const offer = prompt(
        `Current price: ${money(product.price)}\nEnter your offer in rupees:`
    );

    if (offer === null) return;

    const amount = Number(offer);

    if (!Number.isFinite(amount) || amount <= 0) {
        notify("Please enter a valid offer amount.");
        return;
    }

    notify(
        `Your offer of ${money(amount)} is ready to share with ${product.seller}.`
    );

    alert(
        "Negotiation demo\n\n" +
        `Item: ${product.name}\n` +
        `Seller: ${product.seller}\n` +
        `Your offer: ${money(amount)}\n\n` +
        "This demonstration does not send messages to a real seller."
    );
}

function publishListing() {
    const name = $("#itemName").value.trim();
    const category = $("#itemCategory").value;
    const price = Number($("#itemPrice").value);
    const condition = $("#itemCondition").value;
    const image = $("#itemImage").value.trim();
    const description = $("#itemDescription").value.trim();
    const seller = $("#sellerName").value.trim();

    if (!name || !description || !seller || !Number.isFinite(price) || price <= 0) {
        notify("Enter the item name, description, seller and a valid price.");
        return;
    }

    products.push({
        id: Date.now(),
        name,
        category,
        price,
        condition,
        image,
        description,
        seller,
        emoji: categoryEmoji(category)
    });

    persistAll();
    renderProducts();
    renderAdmin();

    $("#itemName").value = "";
    $("#itemPrice").value = "";
    $("#itemImage").value = "";
    $("#itemDescription").value = "";
    $("#sellerName").value = "";

    notify("Your listing has been published!");
    $("#market").scrollIntoView({ behavior: "smooth" });
}

function categoryEmoji(category) {
    const emojis = {
        Electronics: "💻",
        Furniture: "🪑",
        Clothing: "👕",
        Collectibles: "🎨"
    };

    return emojis[category] || "📦";
}

function registerUser() {
    const username = $("#username").value.trim();
    const password = $("#password").value;

    if (username.length < 3 || password.length < 4) {
        $("#accountMessage").textContent =
            "Use a username of at least 3 characters and password of at least 4 characters.";
        return;
    }

    const exists = users.some(user =>
        user.username.toLowerCase() === username.toLowerCase()
    );

    if (exists) {
        $("#accountMessage").textContent = "This username already exists.";
        return;
    }

    // Demo only: never store real passwords in browser localStorage.
    users.push({ username, demoPassword: password });

    saveData("renew_users", users);

    $("#accountMessage").textContent =
        "Registration successful. You can now log in.";
    $("#password").value = "";

    renderAdmin();
}

function loginUser() {
    const username = $("#username").value.trim();
    const password = $("#password").value;

    const user = users.find(account =>
        account.username.toLowerCase() === username.toLowerCase() &&
        account.demoPassword === password
    );

    if (!user) {
        $("#accountMessage").textContent =
            "Invalid login details. Register first if you are a new user.";
        return;
    }

    currentUser = user.username;
    sessionStorage.setItem("renew_current_user", currentUser);

    $("#accountMessage").textContent = `Welcome, ${currentUser}!`;
    $("#password").value = "";

    setFavorites(getFavorites());
    notify("Login successful.");
    renderProducts();
    renderOrders();
    renderAdmin();
}

function logoutUser() {
    currentUser = "";
    sessionStorage.removeItem("renew_current_user");

    $("#accountMessage").textContent = "You have logged out.";
    setFavorites([]);
    renderProducts();
    renderOrders();
}

function submitFeedback() {
    if (!currentUser) {
        notify("Please log in before submitting feedback.");
        return;
    }

    const item = $("#feedbackItem").value.trim();
    const rating = Number($("#feedbackRating").value);
    const comment = $("#feedbackText").value.trim();

    if (!item || !comment) {
        notify("Enter the product name and your feedback.");
        return;
    }

    feedback.push({
        id: Date.now(),
        user: currentUser,
        item,
        rating,
        comment
    });

    saveData("renew_feedback", feedback);

    $("#feedbackItem").value = "";
    $("#feedbackText").value = "";

    renderAdmin();
    notify("Thank you for your feedback!");
}

function renderOrders() {
    const visibleOrders = currentUser
        ? orders.filter(order =>
            order.buyer.toLowerCase() === currentUser.toLowerCase() ||
            order.seller.toLowerCase() === currentUser.toLowerCase()
        )
        : [];

    if (visibleOrders.length === 0) {
        $("#ordersTable").innerHTML = `
            <tr>
                <td colspan="6">Log in to view your transactions.</td>
            </tr>`;
        return;
    }

    $("#ordersTable").innerHTML = visibleOrders.map(order => `
        <tr>
            <td>#${order.id.toString().slice(-6)}</td>
            <td>${escapeHTML(order.item)}</td>
            <td>${escapeHTML(order.buyer)}</td>
            <td>${money(order.amount)}</td>
            <td><span class="status ${order.status.toLowerCase()}">
                ${escapeHTML(order.status)}
            </span></td>
            <td>
                ${order.feedback
                    ? "Submitted"
                    : `<button class="small-btn" type="button"
                        onclick="orderFeedback(${order.id})">
                        Leave Feedback
                       </button>`}
            </td>
        </tr>
    `).join("");
}

function orderFeedback(orderId) {
    const order = orders.find(item => item.id === orderId);
    if (!order || !currentUser) return;

    $("#feedbackItem").value = order.item;
    $("#feedbackText").focus();

    $("#feedbackButton").onclick = function () {
        const comment = $("#feedbackText").value.trim();
        const rating = Number($("#feedbackRating").value);

        if (!comment) {
            notify("Please enter your feedback.");
            return;
        }

        feedback.push({
            id: Date.now(),
            user: currentUser,
            item: order.item,
            rating,
            comment
        });

        order.feedback = true;

        saveData("renew_orders", orders);
        saveData("renew_feedback", feedback);

        $("#feedbackItem").value = "";
        $("#feedbackText").value = "";

        $("#feedbackButton").onclick = submitFeedback;

        renderOrders();
        renderAdmin();
        notify("Feedback submitted successfully.");
    };

    $("#account").scrollIntoView({ behavior: "smooth" });
}

function adminLogin() {
    const username = $("#adminUsername").value.trim();
    const password = $("#adminPassword").value;

    // Demo credentials. Replace with a secure server-side login in production.
    if (username === "admin" && password === "Renew123") {
        isAdmin = true;
        sessionStorage.setItem("renew_admin", "true");
        $("#adminMessage").textContent = "Administrator login successful.";
        $("#adminDashboard").hidden = false;
        renderAdmin();
        notify("Welcome, Administrator!");
    } else {
        $("#adminMessage").textContent =
            "Invalid admin credentials. Please try again.";
    }
}

function adminLogout() {
    isAdmin = false;
    sessionStorage.removeItem("renew_admin");
    $("#adminDashboard").hidden = true;
    $("#adminMessage").textContent = "Administrator logged out.";
}

function requireAdmin() {
    if (!isAdmin) {
        notify("Please log in as an administrator first.");
        $("#adminUsername").focus();
        return false;
    }

    return true;
}

function addCategory() {
    if (!requireAdmin()) return;

    const name = $("#newCategory").value.trim();

    if (!name) {
        notify("Enter a category name.");
        return;
    }

    if (categories.some(category =>
        category.toLowerCase() === name.toLowerCase()
    )) {
        notify("This category already exists.");
        return;
    }

    categories.push(name);
    saveData("renew_categories", categories);
    $("#newCategory").value = "";

    renderAdmin();
    notify("Category added successfully.");
}

function deleteCategory(name) {
    if (!requireAdmin()) return;

    const inUse = products.some(product => product.category === name);

    if (inUse) {
        notify("Cannot delete a category that contains products.");
        return;
    }

    categories = categories.filter(category => category !== name);
    saveData("renew_categories", categories);

    renderAdmin();
    notify("Category deleted.");
}

function editUser(username) {
    if (!requireAdmin()) return;

    const newUsername = prompt("Enter the new username:", username);

    if (newUsername === null) return;

    const updated = newUsername.trim();

    if (updated.length < 3) {
        notify("Username must contain at least 3 characters.");
        return;
    }

    if (users.some(user =>
        user.username.toLowerCase() === updated.toLowerCase() &&
        user.username !== username
    )) {
        notify("That username already exists.");
        return;
    }

    const user = users.find(account => account.username === username);
    if (!user) return;

    user.username = updated;

    // Update references in demo records.
    orders.forEach(order => {
        if (order.buyer === username) order.buyer = updated;
        if (order.seller === username) order.seller = updated;
    });

    feedback.forEach(entry => {
        if (entry.user === username) entry.user = updated;
    });

    if (currentUser === username) {
        currentUser = updated;
        sessionStorage.setItem("renew_current_user", updated);
    }

    persistAll();
    renderAdmin();
    renderOrders();
    notify("Username updated.");
}

function deleteUser(username) {
    if (!requireAdmin()) return;

    if (!confirm(`Delete user "${username}"?`)) return;

    users = users.filter(user => user.username !== username);
    persistAll();

    if (currentUser === username) logoutUser();

    renderAdmin();
    notify("User deleted.");
}

function editProduct(id) {
    if (!requireAdmin()) return;

    const product = products.find(item => item.id === id);
    if (!product) return;

    const newName = prompt("Product name:", product.name);
    if (newName === null) return;

    const newPrice = prompt("Product price:", product.price);
    if (newPrice === null) return;

    const price = Number(newPrice);

    if (!newName.trim() || !Number.isFinite(price) || price <= 0) {
        notify("Enter a valid name and positive price.");
        return;
    }

    product.name = newName.trim();
    product.price = price;

    persistAll();
    renderProducts();
    renderAdmin();
    notify("Product updated.");
}

function deleteProduct(id) {
    if (!requireAdmin()) return;

    const product = products.find(item => item.id === id);
    if (!product) return;

    if (!confirm(`Delete "${product.name}" from the marketplace?`)) return;

    products = products.filter(item => item.id !== id);
    persistAll();

    renderProducts();
    renderAdmin();
    notify("Product deleted.");
}

function changeOrderStatus(id, status) {
    if (!requireAdmin()) return;

    const order = orders.find(item => item.id === id);
    if (!order) return;

    if (!["Shipped", "Received"].includes(status)) {
        notify("Invalid delivery status.");
        return;
    }

    order.status = status;
    saveData("renew_orders", orders);

    renderOrders();
    renderAdmin();
    notify(`Order status changed to ${status}.`);
}

function deleteOrder(id) {
    if (!requireAdmin()) return;

    if (!confirm("Delete this order record?")) return;

    orders = orders.filter(order => order.id !== id);
    saveData("renew_orders", orders);

    renderOrders();
    renderAdmin();
    notify("Order record deleted.");
}

function renderAdmin() {
    if (!isAdmin) {
        $("#adminDashboard").hidden = true;
        return;
    }

    $("#adminDashboard").hidden = false;

    $("#adminUserCount").textContent = users.length;
    $("#adminProductCount").textContent = products.length;
    $("#adminOrderCount").textContent = orders.length;

    $("#adminCategories").innerHTML = categories.map(category => `
        <div class="admin-list-item">
            <span>${escapeHTML(category)}</span>
            <button class="small-btn danger-btn" type="button"
                onclick="deleteCategory(${JSON.stringify(category)})">
                Delete
            </button>
        </div>
    `).join("") || "<p>No categories available.</p>";

    $("#adminUsers").innerHTML = users.map(user => `
        <tr>
            <td>${escapeHTML(user.username)}</td>
            <td>
                <div class="action-row">
                    <button class="small-btn" type="button"
                        onclick="editUser(${JSON.stringify(user.username)})">
                        Edit
                    </button>
                    <button class="small-btn danger-btn" type="button"
                        onclick="deleteUser(${JSON.stringify(user.username)})">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join("") || `<tr><td colspan="2">No registered users.</td></tr>`;

    $("#adminProducts").innerHTML = products.map(product => `
        <tr>
            <td>${escapeHTML(product.name)}</td>
            <td>${escapeHTML(product.category)}</td>
            <td>${money(product.price)}</td>
            <td>${escapeHTML(product.seller)}</td>
            <td>
                <div class="action-row">
                    <button class="small-btn" type="button"
                        onclick="editProduct(${product.id})">Edit</button>
                    <button class="small-btn danger-btn" type="button"
                        onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join("") || `<tr><td colspan="5">No listings available.</td></tr>`;

    $("#adminOrders").innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id.toString().slice(-6)}</td>
            <td>${escapeHTML(order.item)}</td>
            <td><span class="status ${order.status.toLowerCase()}">
                ${escapeHTML(order.status)}
            </span></td>
            <td>
                <select onchange="changeOrderStatus(${order.id}, this.value)">
                    <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>
                        Shipped
                    </option>
                    <option value="Received" ${order.status === "Received" ? "selected" : ""}>
                        Received
                    </option>
                </select>
            </td>
            <td>
                <button class="small-btn danger-btn" type="button"
                    onclick="deleteOrder(${order.id})">Delete</button>
            </td>
        </tr>
    `).join("") || `<tr><td colspan="5">No orders available.</td></tr>`;

    $("#adminFeedback").innerHTML = feedback.map(entry => `
        <div class="admin-list-item">
            <div>
                <strong>${escapeHTML(entry.item)}</strong>
                <p>${escapeHTML(entry.user)} · ${"★".repeat(entry.rating)}</p>
                <p>${escapeHTML(entry.comment)}</p>
            </div>
        </div>
    `).join("") || "<p>No feedback submitted yet.</p>";
}

function renderCategoryOptions() {
    const filter = $("#categoryFilter");
    const selectedValue = filter.value || "All";

    filter.innerHTML = `
        <option value="All">All Categories</option>
        ${categories.map(category => `
            <option value="${escapeHTML(category)}">${escapeHTML(category)}</option>
        `).join("")}
    `;

    filter.value = categories.includes(selectedValue) ? selectedValue : "All";

    const listingCategory = $("#itemCategory");
    const oldListingCategory = listingCategory.value;

    listingCategory.innerHTML = categories.map(category => `
        <option value="${escapeHTML(category)}">${escapeHTML(category)}</option>
    `).join("");

    if (categories.includes(oldListingCategory)) {
        listingCategory.value = oldListingCategory;
    }

    $("#categoryButtons").innerHTML = `
        <button class="category-card ${selectedCategory === "All" ? "active" : ""}"
            type="button" data-category="All">
            <span>🛍️</span>All Items
        </button>
        ${categories.map(category => `
            <button class="category-card ${selectedCategory === category ? "active" : ""}"
                type="button" data-category="${escapeHTML(category)}">
                <span>${escapeHTML(categoryEmoji(category))}</span>
                ${escapeHTML(category)}
            </button>
        `).join("")}
    `;

    document.querySelectorAll(".category-card").forEach(button => {
        button.addEventListener("click", () => {
            selectedCategory = button.dataset.category;

            document.querySelectorAll(".category-card").forEach(card => {
                card.classList.toggle("active", card === button);
            });

            renderProducts();
            $("#market").scrollIntoView({ behavior: "smooth" });
        });
    });
}

$("#searchButton").addEventListener("click", renderProducts);
$("#searchInput").addEventListener("input", renderProducts);
$("#categoryFilter").addEventListener("change", renderProducts);
$("#conditionFilter").addEventListener("change", renderProducts);
$("#sortFilter").addEventListener("change", renderProducts);

$("#listItemButton").addEventListener("click", publishListing);
$("#registerButton").addEventListener("click", registerUser);
$("#loginButton").addEventListener("click", loginUser);
$("#logoutButton").addEventListener("click", logoutUser);
$("#feedbackButton").addEventListener("click", submitFeedback);

$("#adminLoginButton").addEventListener("click", adminLogin);
$("#adminLogoutButton").addEventListener("click", adminLogout);
$("#addCategoryButton").addEventListener("click", addCategory);

renderCategoryOptions();
renderProducts();
renderOrders();
setFavorites(getFavorites());
renderAdmin();