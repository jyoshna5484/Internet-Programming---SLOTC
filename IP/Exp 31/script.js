// Product Prices
let prices = {
    "Fresh Milk": 60,
    "Curd": 50,
    "Cova Sweet": 250,
    "Butter": 200,
    "Ghee": 600
};

// Orders
let orders = [];

// Stock
let stocks = [];

// Vendors
let vendors = [];

// Cows
let cows = [];

// Product Order
function addOrder(product, price) {
    alert(product + " selected. Please place your order in the Order Online section.");
    document.getElementById("product").value = product;
    document.getElementById("order").scrollIntoView();
}

// Online Order
document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("customerName").value;
    let phone = document.getElementById("customerPhone").value;
    let address = document.getElementById("customerAddress").value;
    let product = document.getElementById("product").value;
    let quantity = Number(document.getElementById("quantity").value);
    let date = document.getElementById("deliveryDate").value;

    let total = prices[product] * quantity;

    orders.push({
        name: name,
        phone: phone,
        address: address,
        product: product,
        quantity: quantity,
        total: total,
        date: date
    });

    document.getElementById("orderMessage").innerHTML =
        "Order placed successfully! Total Amount: ₹" + total;

    alert("Order placed successfully!");

    this.reset();
});

// Admin Registration/Login
function showForm(type) {
    let form = `
        <form id="adminForm">
            <input type="text" placeholder="Name" required>
            <input type="email" placeholder="Email" required>
            <input type="password" placeholder="Password" required>
            <button type="submit">${type}</button>
        </form>
    `;

    let win = window.open("", "", "width=400,height=400");
    win.document.write("<h2>" + type + "</h2>" + form);
}

// Stock Entry
document.getElementById("stockForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let product = document.getElementById("stockProduct").value;
    let quantity = Number(document.getElementById("stockQuantity").value);

    stocks.push({
        product: product,
        quantity: quantity
    });

    displayStock();
    alert("Stock added successfully!");

    this.reset();
});

// Display Stock
function displayStock() {
    let table = document.getElementById("stockTable");
    table.innerHTML = "";

    stocks.forEach(function(item) {
        table.innerHTML += `
            <tr>
                <td>${item.product}</td>
                <td>${item.quantity}</td>
            </tr>
        `;
    });
}

// Reports
function showReport(type) {
    let total = orders.reduce(function(sum, order) {
        return sum + order.total;
    }, 0);

    alert(type + " Report\nTotal Orders: " + orders.length +
          "\nTotal Sales: ₹" + total);
}

// Customers
function showCustomers() {
    let table = document.getElementById("customerTable");
    table.innerHTML = "";

    orders.forEach(function(order) {
        table.innerHTML += `
            <tr>
                <td>${order.name}</td>
                <td>${order.product}</td>
                <td>${order.quantity}</td>
                <td>₹${order.total}</td>
            </tr>
        `;
    });
}

// Vendor Details
document.getElementById("vendorForm").addEventListener("submit", function(event) {
    event.preventDefault();

    vendors.push({
        name: document.getElementById("vendorName").value,
        phone: document.getElementById("vendorPhone").value,
        address: document.getElementById("vendorAddress").value,
        milk: document.getElementById("vendorMilk").value
    });

    displayVendors();
    alert("Vendor added successfully!");

    this.reset();
});

// Display Vendors
function displayVendors() {
    let table = document.getElementById("vendorTable");
    table.innerHTML = "";

    vendors.forEach(function(vendor) {
        table.innerHTML += `
            <tr>
                <td>${vendor.name}</td>
                <td>${vendor.phone}</td>
                <td>${vendor.address}</td>
                <td>${vendor.milk}</td>
            </tr>
        `;
    });
}

// Cow Details
document.getElementById("cowForm").addEventListener("submit", function(event) {
    event.preventDefault();

    cows.push({
        id: document.getElementById("cowId").value,
        breed: document.getElementById("cowBreed").value,
        milk: document.getElementById("cowMilk").value,
        health: document.getElementById("cowHealth").value
    });

    displayCows();
    alert("Cow details added successfully!");

    this.reset();
});

// Display Cows
function displayCows() {
    let table = document.getElementById("cowTable");
    table.innerHTML = "";

    cows.forEach(function(cow) {
        table.innerHTML += `
            <tr>
                <td>${cow.id}</td>
                <td>${cow.breed}</td>
                <td>${cow.milk}</td>
                <td>${cow.health}</td>
            </tr>
        `;
    });
}

// Contact Form
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Message sent successfully!");
    this.reset();
});