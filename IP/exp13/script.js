document.addEventListener("DOMContentLoaded", function () {
    const $ = selector => document.querySelector(selector);

    function read(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || "[]");
        } catch {
            return [];
        }
    }

    function write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function show(id, text) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    }

    function money(value) {
        return "₹" + Number(value).toLocaleString("en-IN");
    }

    const defaultProducts = [
        {
            id: 1,
            name: "Classic Red Roses",
            category: "Bouquets",
            price: 799,
            occasion: "Anniversary",
            description: "A beautiful bouquet of red roses.",
            emoji: "🌹"
        },
        {
            id: 2,
            name: "Sunshine Lily Bouquet",
            category: "Bouquets",
            price: 999,
            occasion: "Congratulations",
            description: "Fresh lilies for a cheerful surprise.",
            emoji: "💐"
        },
        {
            id: 3,
            name: "Birthday Surprise Basket",
            category: "Gift Baskets",
            price: 1499,
            occasion: "Birthday",
            description: "A delightful collection of birthday gifts.",
            emoji: "🎁"
        },
        {
            id: 4,
            name: "Chocolate Delight Box",
            category: "Chocolates",
            price: 499,
            occasion: "Thank You",
            description: "A sweet chocolate gift box.",
            emoji: "🍫"
        },
        {
            id: 5,
            name: "Personalized Photo Frame",
            category: "Personalized",
            price: 699,
            occasion: "Birthday",
            description: "A keepsake for a special memory.",
            emoji: "🖼️"
        },
        {
            id: 6,
            name: "Wedding Floral Collection",
            category: "Bouquets",
            price: 1899,
            occasion: "Wedding",
            description: "Elegant flowers for a beautiful wedding.",
            emoji: "💐"
        },
        {
            id: 7,
            name: "Premium Gift Hamper",
            category: "Gift Baskets",
            price: 1799,
            occasion: "Anniversary",
            description: "A premium gift collection for loved ones.",
            emoji: "🧺"
        },
        {
            id: 8,
            name: "Sweetheart Chocolate Box",
            category: "Chocolates",
            price: 899,
            occasion: "Anniversary",
            description: "A sweet treat for someone special.",
            emoji: "🍫"
        },
        {
            id: 9,
            name: "Customized Name Mug",
            category: "Personalized",
            price: 399,
            occasion: "Thank You",
            description: "A personalized mug with a name or message.",
            emoji: "☕"
        }
    ];

    if (localStorage.getItem("bgProducts") === null) {
        write("bgProducts", defaultProducts);
    }

    let activeCoupon = false;

    function getProducts() {
        return read("bgProducts");
    }

    function getCurrentUser() {
        const email = sessionStorage.getItem("bgCurrentUser");
        return read("bgUsers").find(user => user.email === email) || null;
    }

    // 1. DISPLAY PRODUCTS
    function renderProducts() {
        const container = $("#productList");
        container.replaceChildren();

        const search = $("#productSearch").value.trim().toLowerCase();
        const category = $("#categoryFilter").value;
        const occasion = $("#occasionFilter").value;
        const maxPrice = $("#priceFilter").value;

        const products = getProducts().filter(product => {
            const matchesSearch =
                (product.name + " " + product.description)
                    .toLowerCase().includes(search);

            const matchesCategory = !category || product.category === category;
            const matchesOccasion = !occasion || product.occasion === occasion;
            const matchesPrice = !maxPrice || product.price < Number(maxPrice);

            return matchesSearch && matchesCategory &&
                matchesOccasion && matchesPrice;
        });

        show("productCount", products.length + " gifts found.");

        if (!products.length) {
            container.textContent = "No products match your search.";
            return;
        }

        products.forEach(product => {
            const card = document.createElement("article");
            card.className = "product-card";

            const art = document.createElement("div");
            art.className = "product-art";
            art.textContent = product.emoji || "🎁";

            const info = document.createElement("div");
            info.className = "product-info";

            const categoryText = document.createElement("p");
            categoryText.className = "product-category";
            categoryText.textContent = product.category;

            const title = document.createElement("h3");
            title.textContent = product.name;

            const description = document.createElement("p");
            description.textContent = product.description;

            const occasionText = document.createElement("p");
            occasionText.textContent = "Occasion: " + product.occasion;

            const price = document.createElement("p");
            price.className = "product-price";
            price.textContent = money(product.price);

            const add = document.createElement("button");
            add.type = "button";
            add.textContent = "Add to Cart";

            add.addEventListener("click", function () {
                addToCart(product.id);
            });

            info.append(
                categoryText,
                title,
                description,
                occasionText,
                price,
                add
            );

            card.append(art, info);
            container.appendChild(card);
        });
    }

    $("#productSearch").addEventListener("input", renderProducts);
    $("#categoryFilter").addEventListener("change", renderProducts);
    $("#occasionFilter").addEventListener("change", renderProducts);
    $("#priceFilter").addEventListener("change", renderProducts);

    document.querySelectorAll(".category-card").forEach(button => {
        button.addEventListener("click", function () {
            $("#categoryFilter").value = this.dataset.category;
            renderProducts();
            $("#products").scrollIntoView({ behavior: "smooth" });
        });
    });

    document.querySelectorAll(".occasion-btn").forEach(button => {
        button.addEventListener("click", function () {
            $("#occasionFilter").value = this.dataset.occasion;
            renderProducts();
            $("#products").scrollIntoView({ behavior: "smooth" });
        });
    });

    // 2. SHOPPING CART
    function addToCart(productId) {
        const product = getProducts().find(item => item.id === productId);
        if (!product) return;

        const cart = read("bgCart");
        const existing = cart.find(item => item.productId === productId);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ productId, quantity: 1 });
        }

        write("bgCart", cart);
        renderCart();

        show("productMessage", product.name + " added to your cart.");
    }

    function calculateSubtotal(cart) {
        const products = getProducts();

        return cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
    }

    function renderCart() {
        const container = $("#cartItems");
        container.replaceChildren();

        let cart = read("bgCart");
        const products = getProducts();

        cart = cart.filter(item =>
            products.some(product => product.id === item.productId)
        );

        write("bgCart", cart);

        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        $("#cartCount").textContent = count;

        if (!cart.length) {
            container.textContent = "Your cart is waiting for something beautiful!";
        }

        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return;

            const row = document.createElement("div");
            row.className = "cart-row";

            const details = document.createElement("div");
            const title = document.createElement("strong");
            title.textContent = product.name;

            const price = document.createElement("p");
            price.textContent = money(product.price) + " each";

            details.append(title, price);

            const quantity = document.createElement("input");
            quantity.type = "number";
            quantity.min = "1";
            quantity.max = "99";
            quantity.value = item.quantity;
            quantity.setAttribute("aria-label", "Quantity for " + product.name);

            quantity.addEventListener("change", function () {
                const amount = Number(this.value);

                if (!Number.isInteger(amount) || amount < 1 || amount > 99) {
                    this.value = item.quantity;
                    return;
                }

                const updated = read("bgCart");
                const target = updated.find(i => i.productId === item.productId);

                if (target) target.quantity = amount;

                write("bgCart", updated);
                renderCart();
            });

            const lineTotal = document.createElement("strong");
            lineTotal.textContent = money(product.price * item.quantity);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "Remove";
            remove.className = "secondary-btn";

            remove.addEventListener("click", function () {
                write(
                    "bgCart",
                    read("bgCart").filter(i => i.productId !== item.productId)
                );
                renderCart();
            });

            row.append(details, quantity, lineTotal, remove);
            container.appendChild(row);
        });

        updateTotals();
    }

    // 3. DISCOUNT COUPON
    function updateTotals() {
        const subtotal = calculateSubtotal(read("bgCart"));
        const discountAmount = activeCoupon ? Math.round(subtotal * 0.10) : 0;

        show("subtotal", money(subtotal));
        show("discount", money(discountAmount));
        show("total", money(Math.max(0, subtotal - discountAmount)));
    }

    $("#applyCouponBtn").addEventListener("click", function () {
        const code = $("#couponCode").value.trim().toUpperCase();

        if (code === "BLOOM10") {
            activeCoupon = true;
            show("couponMessage", "10% demo discount applied!");
        } else {
            activeCoupon = false;
            show("couponMessage", "Invalid code. Try BLOOM10.");
        }

        updateTotals();
    });

    $("#clearCartBtn").addEventListener("click", function () {
        write("bgCart", []);
        activeCoupon = false;
        $("#couponCode").value = "";
        show("couponMessage", "");
        renderCart();
    });

    $("#checkoutBtn").addEventListener("click", function () {
        if (!read("bgCart").length) {
            show("checkoutMessage", "Add products to your cart before checkout.");
            return;
        }

        $("#checkout").scrollIntoView({ behavior: "smooth" });
    });

    // 4. CUSTOMER REGISTRATION
    $("#registerBtn").addEventListener("click", function () {
        const name = $("#registerName").value.trim();
        const email = $("#registerEmail").value.trim().toLowerCase();
        const password = $("#registerPassword").value;

        if (!name || !email || !password) {
            show("registerMessage", "Please complete all registration fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            show("registerMessage", "Enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            show("registerMessage", "Password must contain at least 6 characters.");
            return;
        }

        const users = read("bgUsers");

        if (users.some(user => user.email === email)) {
            show("registerMessage", "This email is already registered.");
            return;
        }

        // Demo only: never save passwords in browser storage.
        users.push({ id: Date.now(), name, email });
        write("bgUsers", users);

        show(
            "registerMessage",
            "Demo account created. Secure login requires a backend."
        );
    });

    // 5. CUSTOMER LOGIN DEMO
    $("#loginBtn").addEventListener("click", function () {
        const email = $("#loginEmail").value.trim().toLowerCase();
        const password = $("#loginPassword").value;

        if (!email || !password) {
            show("loginMessage", "Enter your email and password.");
            return;
        }

        const user = read("bgUsers").find(item => item.email === email);

        if (!user) {
            show("loginMessage", "Account not found. Please register first.");
            return;
        }

        // This demo does not verify the password.
        sessionStorage.setItem("bgCurrentUser", email);

        show("loginMessage", "Demo login successful.");
        updateAccountStatus();
        renderOrders();
    });

    $("#logoutBtn").addEventListener("click", function () {
        sessionStorage.removeItem("bgCurrentUser");
        show("loginMessage", "You have logged out.");
        updateAccountStatus();
        renderOrders();
    });

    function updateAccountStatus() {
        const user = getCurrentUser();

        show(
            "accountStatus",
            user ? "Welcome, " + user.name + "!" : "Browsing as a guest."
        );
    }

    // 6. CHECKOUT AND ORDER CREATION
    $("#placeOrderBtn").addEventListener("click", function () {
        const user = getCurrentUser();
        const cart = read("bgCart");

        const name = $("#customerName").value.trim();
        const email = $("#customerEmail").value.trim().toLowerCase();
        const phone = $("#customerPhone").value.trim();
        const address = $("#deliveryAddress").value.trim();
        const date = $("#deliveryDate").value;
        const time = $("#deliveryTime").value;
        const payment = $("#paymentMethod").value;
        const giftMessage = $("#giftMessage").value.trim();

        if (!cart.length) {
            show("checkoutMessage", "Your cart is empty.");
            return;
        }

        if (!name || !email || !phone || !address || !date || !time || !payment) {
            show("checkoutMessage", "Please complete all required delivery and payment fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            show("checkoutMessage", "Enter a valid email address.");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            show("checkoutMessage", "Enter a valid 10-digit phone number.");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (new Date(date + "T00:00:00") < today) {
            show("checkoutMessage", "Delivery date cannot be in the past.");
            return;
        }

        const subtotal = calculateSubtotal(cart);
        const discountAmount = activeCoupon ? Math.round(subtotal * 0.10) : 0;
        const total = subtotal - discountAmount;

        const products = getProducts();

        const items = cart.map(item => {
            const product = products.find(p => p.id === item.productId);

            return {
                name: product.name,
                price: product.price,
                quantity: item.quantity
            };
        });

        const order = {
            id: "BG" + Date.now().toString().slice(-8),
            customerName: name,
            customerEmail: email,
            phone: phone,
            address: address,
            deliveryDate: date,
            deliveryTime: time,
            giftMessage: giftMessage,
            paymentMethod: payment,
            items: items,
            total: total,
            status: "Order Received",
            accountEmail: user ? user.email : null,
            createdAt: new Date().toLocaleString()
        };

        const orders = read("bgOrders");
        orders.push(order);
        write("bgOrders", orders);

        const records = read("bgCustomerRecords");
        records.push({
            name,
            email,
            phone,
            address,
            orderId: order.id,
            total,
            date: order.createdAt
        });
        write("bgCustomerRecords", records);

        write("bgCart", []);
        activeCoupon = false;
        $("#couponCode").value = "";
        show("couponMessage", "");
        renderCart();
        renderOrders();
        renderAdmin();

        show(
            "checkoutMessage",
            "Demo order placed successfully! Order ID: " + order.id +
            ". No payment was collected and no delivery notification was sent."
        );

        $("#orders").scrollIntoView({ behavior: "smooth" });
    });

    // 7. ORDER TRACKING
    function renderOrders() {
        const container = $("#orderList");
        container.replaceChildren();

        const user = getCurrentUser();

        if (!user) {
            container.textContent =
                "Log in to view orders linked to your account. Guest checkout orders are still recorded for the admin demo.";
            return;
        }

        const orders = read("bgOrders").filter(
            order => order.accountEmail === user.email
        );

        if (!orders.length) {
            container.textContent = "No orders found for your account.";
            return;
        }

        orders.forEach(order => {
            const card = document.createElement("div");
            card.className = "order-card";

            const title = document.createElement("h3");
            title.textContent = "Order " + order.id;

            const products = document.createElement("p");
            products.textContent = order.items.map(
                item => item.name + " × " + item.quantity
            ).join(", ");

            const total = document.createElement("p");
            total.textContent = "Total: " + money(order.total);

            const delivery = document.createElement("p");
            delivery.textContent =
                "Delivery: " + order.deliveryDate + " (" + order.deliveryTime + ")";

            const status = document.createElement("span");
            status.className = "order-status";
            status.textContent = order.status;

            const track = document.createElement("button");
            track.type = "button";
            track.textContent = "Track Order";

            track.addEventListener("click", function () {
                show(
                    "checkoutMessage",
                    "Order " + order.id + " status: " + order.status +
                    ". This is a simulated tracking status."
                );
            });

            card.append(title, products, total, delivery, status, track);
            container.appendChild(card);
        });
    }

    // 8. ADMIN LOGIN
    // Demo credentials only; this is not secure authentication.
    $("#adminLoginBtn").addEventListener("click", function () {
        if ($("#adminUsername").value === "admin" &&
            $("#adminPassword").value === "Blossom123") {
            sessionStorage.setItem("bgAdmin", "true");
            $("#adminPanel").hidden = false;
            show("adminMessage", "Demo admin login successful.");
            renderAdmin();
        } else {
            show("adminMessage", "Incorrect demo admin credentials.");
        }
    });

    $("#adminLogoutBtn").addEventListener("click", function () {
        sessionStorage.removeItem("bgAdmin");
        $("#adminPanel").hidden = true;
        show("adminMessage", "Admin logged out.");
    });

    function isAdmin() {
        return sessionStorage.getItem("bgAdmin") === "true";
    }

    // 9. ADMIN ADD PRODUCT
    $("#addProductBtn").addEventListener("click", function () {
        if (!isAdmin()) {
            show("adminProductMessage", "Please log in as admin first.");
            return;
        }

        const name = $("#newProductName").value.trim();
        const category = $("#newProductCategory").value;
        const price = Number($("#newProductPrice").value);
        const occasion = $("#newProductOccasion").value;
        const description = $("#newProductDescription").value.trim();

        if (!name || !description || !Number.isFinite(price) || price <= 0) {
            show("adminProductMessage", "Enter a product name, description, and valid price.");
            return;
        }

        const products = getProducts();

        products.push({
            id: Date.now(),
            name,
            category,
            price,
            occasion,
            description,
            emoji: category === "Bouquets" ? "💐" :
                   category === "Chocolates" ? "🍫" :
                   category === "Personalized" ? "💝" : "🎁"
        });

        write("bgProducts", products);

        $("#newProductName").value = "";
        $("#newProductPrice").value = "";
        $("#newProductDescription").value = "";

        show("adminProductMessage", "New product added successfully.");
        renderProducts();
        renderAdmin();
    });

    // 10. ADMIN PRODUCT MANAGEMENT
    function renderAdmin() {
        if (!isAdmin()) return;

        const productsContainer = $("#adminProductList");
        const customerContainer = $("#customerRecords");

        productsContainer.replaceChildren();
        customerContainer.replaceChildren();

        getProducts().forEach(product => {
            const row = document.createElement("div");
            row.className = "admin-row";

            const title = document.createElement("h4");
            title.textContent = product.name;

            const price = document.createElement("p");
            price.textContent = "Current price: " + money(product.price);

            const priceInput = document.createElement("input");
            priceInput.type = "number";
            priceInput.min = "1";
            priceInput.value = product.price;
            priceInput.setAttribute("aria-label", "New price for " + product.name);

            const update = document.createElement("button");
            update.type = "button";
            update.textContent = "Update Price";

            update.addEventListener("click", function () {
                const newPrice = Number(priceInput.value);

                if (!Number.isFinite(newPrice) || newPrice <= 0) {
                    show("adminProductMessage", "Enter a valid positive price.");
                    return;
                }

                const products = getProducts();
                const target = products.find(item => item.id === product.id);

                if (target) target.price = newPrice;

                write("bgProducts", products);
                show("adminProductMessage", "Product price updated.");
                renderProducts();
                renderAdmin();
            });

            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "Remove Product";
            remove.className = "secondary-btn";

            remove.addEventListener("click", function () {
                const products = getProducts().filter(item => item.id !== product.id);
                write("bgProducts", products);

                show("adminProductMessage", "Product removed.");
                renderProducts();
                renderCart();
                renderAdmin();
            });

            row.append(title, price, priceInput, update, remove);
            productsContainer.appendChild(row);
        });

        const records = read("bgCustomerRecords");

        if (!records.length) {
            customerContainer.textContent = "No checkout records available.";
        }

        records.forEach(record => {
            const row = document.createElement("div");
            row.className = "admin-row";

            const details = document.createElement("p");
            details.textContent =
                record.name + " | " + record.email +
                " | Phone: " + record.phone +
                " | Order: " + record.orderId +
                " | Total: " + money(record.total);

            row.appendChild(details);
            customerContainer.appendChild(row);
        });

        show(
            "storeSummary",
            "Products: " + getProducts().length +
            " | Orders: " + read("bgOrders").length +
            " | Checkout records: " + records.length
        );
    }

    // INITIALIZE
    renderProducts();
    renderCart();
    renderOrders();
    updateAccountStatus();

    if (isAdmin()) {
        $("#adminPanel").hidden = false;
        renderAdmin();
    }

    const dateInput = $("#deliveryDate");
    const todayString = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    dateInput.min = todayString;
});