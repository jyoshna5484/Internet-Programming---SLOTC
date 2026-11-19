let users = JSON.parse(localStorage.getItem("rrUsers")) || [];
let vehicles = JSON.parse(localStorage.getItem("rrVehicles")) || [
    {id: 1, name: "Hyundai i20", type: "Car", location: "Chennai", price: 1800, icon: "🚗"},
    {id: 2, name: "Toyota Innova", type: "SUV", location: "Chennai", price: 3000, icon: "🚙"},
    {id: 3, name: "Mahindra Thar", type: "SUV", location: "Bangalore", price: 3500, icon: "🚘"},
    {id: 4, name: "Tata Ace", type: "Truck", location: "Chennai", price: 2200, icon: "🛻"},
    {id: 5, name: "Honda City", type: "Car", location: "Hyderabad", price: 2500, icon: "🚗"},
    {id: 6, name: "Ford EcoSport", type: "SUV", location: "Bangalore", price: 2800, icon: "🚙"}
];

let bookings = JSON.parse(localStorage.getItem("rrBookings")) || [];
let reviews = JSON.parse(localStorage.getItem("rrReviews")) || [];
let currentUser = JSON.parse(localStorage.getItem("rrCurrentUser")) || null;

function saveData() {
    localStorage.setItem("rrUsers", JSON.stringify(users));
    localStorage.setItem("rrVehicles", JSON.stringify(vehicles));
    localStorage.setItem("rrBookings", JSON.stringify(bookings));
    localStorage.setItem("rrReviews", JSON.stringify(reviews));
    localStorage.setItem("rrCurrentUser", JSON.stringify(currentUser));
}

function showAuth() {
    document.getElementById("auth").scrollIntoView({behavior: "smooth"});
}

function register() {
    let name = document.getElementById("authName").value;
    let email = document.getElementById("authEmail").value;
    let phone = document.getElementById("authPhone").value;
    let address = document.getElementById("authAddress").value;
    let password = document.getElementById("authPassword").value;
    let role = document.getElementById("authRole").value;

    if (!name || !email || !phone || !address || !password) {
        alert("Please fill all fields.");
        return;
    }

    if (users.some(u => u.email === email)) {
        alert("User already registered.");
        return;
    }

    users.push({name, email, phone, address, password, role});
    saveData();

    alert("Registration successful!");
}

function login() {
    let email = document.getElementById("authEmail").value;
    let password = document.getElementById("authPassword").value;

    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    currentUser = user;
    saveData();

    document.getElementById("auth").style.display = "none";

    if (user.role === "admin") {
        document.getElementById("admin-dashboard").style.display = "block";
        document.getElementById("user-dashboard").style.display = "none";
    } else {
        document.getElementById("user-dashboard").style.display = "block";
        document.getElementById("admin-dashboard").style.display = "none";
    }

    alert("Welcome " + user.name);
}

function logout() {
    currentUser = null;
    saveData();

    document.getElementById("user-dashboard").style.display = "none";
    document.getElementById("admin-dashboard").style.display = "none";
    document.getElementById("auth").style.display = "block";

    alert("Logged out successfully.");
}

function displayVehicles(list = vehicles) {
    document.getElementById("vehicle-list").innerHTML = list.map(v => `
        <div class="vehicle-card">
            <div class="vehicle-image">${v.icon}</div>
            <div class="vehicle-info">
                <h3>${v.name}</h3>
                <p>Type: ${v.type}</p>
                <p>📍 ${v.location}</p>
                <p class="price">₹${v.price}/day</p>
                <button onclick="bookVehicle(${v.id})">Book Now</button>
            </div>
        </div>
    `).join("") || "No vehicles found.";
}

function searchVehicles() {
    let location = document.getElementById("searchLocation").value.toLowerCase();
    let type = document.getElementById("searchType").value;

    let list = vehicles.filter(v =>
        (v.location.toLowerCase().includes(location) || location === "") &&
        (type === "All" || v.type === type)
    );

    displayVehicles(list);
}

function bookVehicle(id) {
    if (!currentUser) {
        alert("Please login before booking.");
        showAuth();
        return;
    }

    let vehicle = vehicles.find(v => v.id === id);

    document.getElementById("user-content").innerHTML = `
        <div class="booking-card">
            <h3>Book ${vehicle.name}</h3>
            <p>Price per day: ₹${vehicle.price}</p>

            <input id="bookingName" value="${currentUser.name}" placeholder="Name">
            <input id="bookingPhone" value="${currentUser.phone}" placeholder="Customer Number">
            <input id="bookingAddress" value="${currentUser.address}" placeholder="Address">
            <input id="bookingLocation" value="${vehicle.location}" placeholder="Pickup Location">
            <input type="date" id="bookingDate">
            <input type="number" id="bookingDays" placeholder="Rental Days" min="1">

            <h3 id="totalPrice">Total: ₹0</h3>

            <button onclick="confirmBooking(${id})">Confirm Booking</button>
        </div>
    `;

    document.getElementById("user-dashboard").style.display = "block";
    document.getElementById("user-dashboard").scrollIntoView({behavior: "smooth"});
}

function confirmBooking(id) {
    let vehicle = vehicles.find(v => v.id === id);
    let days = Number(document.getElementById("bookingDays").value);
    let date = document.getElementById("bookingDate").value;

    if (!days || days < 1 || !date) {
        alert("Please select rental date and duration.");
        return;
    }

    let booking = {
        id: Date.now(),
        user: currentUser.email,
        customerName: document.getElementById("bookingName").value,
        phone: document.getElementById("bookingPhone").value,
        address: document.getElementById("bookingAddress").value,
        location: document.getElementById("bookingLocation").value,
        vehicle: vehicle.name,
        vehicleId: vehicle.id,
        type: vehicle.type,
        date,
        days,
        total: vehicle.price * days,
        status: "Pending"
    };

    bookings.push(booking);
    saveData();

    alert("Booking submitted successfully!");
    showMyBookings();
}

function showMyBookings() {
    let myBookings = bookings.filter(b => b.user === currentUser.email);

    document.getElementById("user-content").innerHTML = `
        <h3>My Bookings</h3>
        ${myBookings.map(b => `
            <div class="booking-card">
                <h4>${b.vehicle}</h4>
                <p>Rental Date: ${b.date}</p>
                <p>Duration: ${b.days} days</p>
                <p>Total: ₹${b.total}</p>
                <p>Status: <b>${b.status}</b></p>
            </div>
        `).join("") || "No bookings found."}
    `;
}

function showHistory() {
    let oldBookings = bookings.filter(b => b.user === currentUser.email);

    document.getElementById("user-content").innerHTML = `
        <h3>Booking History</h3>
        ${oldBookings.map(b => `
            <div class="booking-card">
                <h4>${b.vehicle}</h4>
                <p>Date: ${b.date}</p>
                <p>Duration: ${b.days} days</p>
                <p>Amount: ₹${b.total}</p>
                <p>Status: ${b.status}</p>
            </div>
        `).join("") || "No booking history."}
    `;
}

function showProfile() {
    let content = currentUser ? `
        <div class="booking-card">
            <h3>My Profile</h3>
            <p>Name: ${currentUser.name}</p>
            <p>Email: ${currentUser.email}</p>
            <p>Phone: ${currentUser.phone}</p>
            <p>Address: ${currentUser.address}</p>
            <p>Role: ${currentUser.role}</p>
        </div>
    ` : "";

    if (currentUser.role === "admin") {
        document.getElementById("admin-content").innerHTML = content;
    } else {
        document.getElementById("user-content").innerHTML = content;
    }
}

// ADMIN FUNCTIONS

function showAddVehicle() {
    document.getElementById("admin-content").innerHTML = `
        <div class="booking-card">
            <h3>Add New Vehicle</h3>
            <input id="newVehicleName" placeholder="Vehicle Name">
            <select id="newVehicleType">
                <option>Car</option>
                <option>SUV</option>
                <option>Truck</option>
            </select>
            <input id="newVehicleLocation" placeholder="Location">
            <input id="newVehiclePrice" type="number" placeholder="Price per day">
            <input id="newVehicleIcon" placeholder="Emoji (🚗)">
            <button onclick="addVehicle()">Add Vehicle</button>
        </div>
    `;
}

function addVehicle() {
    let name = document.getElementById("newVehicleName").value;
    let type = document.getElementById("newVehicleType").value;
    let location = document.getElementById("newVehicleLocation").value;
    let price = Number(document.getElementById("newVehiclePrice").value);
    let icon = document.getElementById("newVehicleIcon").value || "🚗";

    if (!name || !location || !price) {
        alert("Fill all fields.");
        return;
    }

    vehicles.push({
        id: Date.now(),
        name,
        type,
        location,
        price,
        icon
    });

    saveData();
    displayVehicles();

    alert("Vehicle added successfully!");
    manageVehicles();
}

function manageVehicles() {
    document.getElementById("admin-content").innerHTML = `
        <h3>Manage Vehicles</h3>
        ${vehicles.map(v => `
            <div class="booking-card">
                <h4>${v.name}</h4>
                <p>Type: ${v.type}</p>
                <p>Location: ${v.location}</p>
                <p>Price: ₹${v.price}/day</p>
                <button onclick="deleteVehicle(${v.id})">Delete Vehicle</button>
            </div>
        `).join("")}
    `;
}

function deleteVehicle(id) {
    vehicles = vehicles.filter(v => v.id !== id);
    saveData();
    displayVehicles();
    manageVehicles();
    alert("Vehicle deleted.");
}

function manageBookings() {
    document.getElementById("admin-content").innerHTML = `
        <h3>Manage Bookings</h3>
        ${bookings.map(b => `
            <div class="booking-card">
                <h4>${b.vehicle}</h4>
                <p>Customer: ${b.customerName}</p>
                <p>Phone: ${b.phone}</p>
                <p>Address: ${b.address}</p>
                <p>Location: ${b.location}</p>
                <p>Date: ${b.date}</p>
                <p>Duration: ${b.days} days</p>
                <p>Total: ₹${b.total}</p>
                <p>Status: ${b.status}</p>
                <button onclick="approveBooking(${b.id})">Approve</button>
                <button onclick="rejectBooking(${b.id})">Reject</button>
            </div>
        `).join("") || "No bookings yet."}
    `;
}

function approveBooking(id) {
    let booking = bookings.find(b => b.id === id);
    booking.status = "Approved";
    saveData();
    manageBookings();
    alert("Booking approved.");
}

function rejectBooking(id) {
    let booking = bookings.find(b => b.id === id);
    booking.status = "Rejected";
    saveData();
    manageBookings();
    alert("Booking rejected.");
}

// REVIEWS

function showReviews() {
    document.getElementById("user-content").innerHTML = `
        <div class="booking-card">
            <h3>Post Review</h3>
            <select id="reviewRating">
                <option value="5">⭐⭐⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="2">⭐⭐</option>
                <option value="1">⭐</option>
            </select>
            <textarea id="reviewText" placeholder="Write your review"></textarea>
            <button onclick="submitReview()">Submit Review</button>
        </div>
    `;
}

function submitReview() {
    let text = document.getElementById("reviewText").value;
    let rating = document.getElementById("reviewRating").value;

    if (!text) {
        alert("Write a review.");
        return;
    }

    reviews.push({
        name: currentUser.name,
        rating,
        text
    });

    saveData();
    alert("Review submitted!");
}

displayVehicles();