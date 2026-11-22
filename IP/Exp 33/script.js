// Room Availability
document.getElementById("availabilityForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let room = document.getElementById("roomType").value;
    let checkIn = document.getElementById("checkIn").value;
    let checkOut = document.getElementById("checkOut").value;

    if (checkOut <= checkIn) {
        alert("Check-out date must be after check-in date!");
        return;
    }

    document.getElementById("availabilityResult").innerHTML =
        "<h3>" + room + " is available!</h3>" +
        "<p>Check-in: " + checkIn + "</p>" +
        "<p>Check-out: " + checkOut + "</p>";
});

// Online Booking
document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("bookingName").value;
    let room = document.getElementById("bookingRoom").value;
    let start = document.getElementById("bookingStart").value;
    let end = document.getElementById("bookingEnd").value;
    let season = document.getElementById("season").value;

    if (end <= start) {
        alert("Please select a valid check-out date!");
        return;
    }

    let price = 0;

    if (room === "Single Room") {
        price = 2000;
    } else if (room === "Double Room") {
        price = 3500;
    } else {
        price = 5000;
    }

    if (season === "seasonal") {
        price = price + 1000;
    }

    document.getElementById("bookingResult").innerHTML = `
        <div class="card">
            <h3>Booking Confirmation</h3>
            <p>Customer: ${name}</p>
            <p>Room: ${room}</p>
            <p>Check-in: ${start}</p>
            <p>Check-out: ${end}</p>
            <p>Booking Type: ${season}</p>
            <p>Price Per Night: ₹${price}</p>
            <p>Status: Booking Confirmed</p>
        </div>
    `;

    alert("Room booked successfully!");
    this.reset();
});

// Customer Details
document.getElementById("customerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("customerName").value;
    let phone = document.getElementById("customerPhone").value;
    let email = document.getElementById("customerEmail").value;
    let address = document.getElementById("customerAddress").value;

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${name}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>${address}</td>
    `;

    document.getElementById("customerTable").appendChild(row);

    alert("Customer details added successfully!");
    this.reset();
});

// Admin Registration
document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("adminName").value;
    let email = document.getElementById("adminEmail").value;

    alert("Admin Registration Successful!\nName: " + name +
          "\nEmail: " + email);

    this.reset();
});

// Admin Login
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let email = document.getElementById("loginEmail").value;

    alert("Login Successful!\nWelcome " + email);

    this.reset();
});

// Contact Form
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Your message has been sent successfully!");
    this.reset();
});