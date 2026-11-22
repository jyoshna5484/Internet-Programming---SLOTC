// Laptop Purchase
function buyLaptop(name, price) {
    alert("Laptop: " + name + "\nPrice: ₹" + price);
    alert("Your laptop purchase request has been submitted!");
}

// Service Booking
document.getElementById("serviceForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("serviceName").value;
    let laptop = document.getElementById("serviceLaptop").value;
    let service = document.getElementById("serviceType").value;

    alert("Service booked successfully!\nCustomer: " + name +
          "\nLaptop: " + laptop + "\nService: " + service);

    this.reset();
});

// Service Status
function checkService() {
    alert("Your laptop service is currently under process.");
}

// Customer Information
document.getElementById("customerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("customerName").value;
    let phone = document.getElementById("customerPhone").value;
    let email = document.getElementById("customerEmail").value;
    let type = document.getElementById("customerType").value;

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${name}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>${type}</td>
    `;

    document.getElementById("customerTable").appendChild(row);

    alert("Customer information saved!");
    this.reset();
});

// Rental Agreement
document.getElementById("rentalForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("renterName").value;
    let laptop = document.getElementById("rentalLaptop").value;
    let start = document.getElementById("startDate").value;
    let end = document.getElementById("endDate").value;
    let amount = document.getElementById("rentalAmount").value;

    document.getElementById("agreement").innerHTML = `
        <div class="card">
            <h3>Rental Agreement</h3>
            <p>Customer Name: ${name}</p>
            <p>Phone: ${document.getElementById("renterPhone").value}</p>
            <p>Laptop: ${laptop}</p>
            <p>Rental Start: ${start}</p>
            <p>Rental End: ${end}</p>
            <p>Rental Amount: ₹${amount}</p>
            <p>Agreement Status: Approved</p>
        </div>
    `;

    alert("Rental agreement created successfully!");
    this.reset();
});

// Stock Maintenance
document.getElementById("stockForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let laptop = document.getElementById("stockLaptop").value;
    let quantity = document.getElementById("stockQuantity").value;
    let price = document.getElementById("stockPrice").value;

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${laptop}</td>
        <td>${quantity}</td>
        <td>₹${price}</td>
    `;

    document.getElementById("stockTable").appendChild(row);

    alert("Stock added successfully!");
    this.reset();
});

// Admin Registration
document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("adminName").value;
    let email = document.getElementById("adminEmail").value;

    alert("Admin registered successfully!\nName: " + name + "\nEmail: " + email);

    this.reset();
});

// Admin Login
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let email = document.getElementById("loginEmail").value;

    alert("Admin login successful!\nWelcome " + email);

    this.reset();
});

// Contact Form
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Your message has been sent successfully!");
    this.reset();
});

// Home Button
function showMessage(message) {
    alert(message);
}