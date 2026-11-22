let users = JSON.parse(localStorage.getItem("users")) || [];
let tourism = JSON.parse(localStorage.getItem("tourism")) || [];
let foods = JSON.parse(localStorage.getItem("foods")) || [];
let hotels = JSON.parse(localStorage.getItem("hotels")) || [];
let routes = JSON.parse(localStorage.getItem("routes")) || [];
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

let currentUser = null;

// SAVE DATA
function saveData() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("tourism", JSON.stringify(tourism));
    localStorage.setItem("foods", JSON.stringify(foods));
    localStorage.setItem("hotels", JSON.stringify(hotels));
    localStorage.setItem("routes", JSON.stringify(routes));
    localStorage.setItem("bookings", JSON.stringify(bookings));
}

// REGISTER
function register() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    if (users.some(u => u.email === email)) {
        alert("User already registered");
        return;
    }

    users.push({ name, email, password, role });
    saveData();

    alert("Registration successful!");
}

// LOGIN
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    let user = users.find(u =>
        u.email === email &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
        alert("Invalid login details");
        return;
    }

    currentUser = user;

    document.getElementById("auth").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    document.getElementById("welcome").innerText =
        "Welcome, " + user.name;

    showPanel();
}

// SHOW PANEL
function showPanel() {
    document.getElementById("userPanel").classList.add("hidden");
    document.getElementById("adminPanel").classList.add("hidden");

    if (currentUser.role === "user") {
        document.getElementById("userPanel").classList.remove("hidden");

        displayTourism();
        displayFood();
        displayHotels();
        displayRoutes();
        displayMyBookings();
    }

    if (currentUser.role === "admin") {
        document.getElementById("adminPanel").classList.remove("hidden");

        displayAdminTourism();
        displayAdminFood();
        displayAdminHotels();
        displayAdminRoutes();
        displayAllBookings();
    }
}

// POST TOURISM
function postTourism() {
    let name = document.getElementById("tourName").value;
    let location = document.getElementById("tourLocation").value;
    let description = document.getElementById("tourDescription").value;

    if (!name || !location || !description) {
        alert("Please fill all tourism details");
        return;
    }

    tourism.push({ name, location, description });
    saveData();

    alert("Tourism details posted successfully!");

    displayAdminTourism();
}

// DISPLAY TOURISM
function displayTourism() {
    document.getElementById("tourismDetails").innerHTML =
        tourism.map(t => `
            <div class="item">
                <b>${t.name}</b><br>
                Location: ${t.location}<br>
                ${t.description}
            </div>
        `).join("") || "No tourism details available";
}

// ADMIN TOURISM
function displayAdminTourism() {
    document.getElementById("adminTourism").innerHTML =
        tourism.map(t => `
            <div class="item">
                <b>${t.name}</b><br>
                ${t.location}<br>
                ${t.description}
            </div>
        `).join("") || "No tourism details posted";
}

// ADD FOOD
function addFood() {
    let name = document.getElementById("foodName").value;
    let place = document.getElementById("foodPlace").value;
    let price = document.getElementById("foodPrice").value;

    if (!name || !place || !price) {
        alert("Please fill food details");
        return;
    }

    foods.push({ name, place, price });
    saveData();

    alert("Food added successfully!");
    displayAdminFood();
}

// DISPLAY FOOD
function displayFood() {
    document.getElementById("foodDetails").innerHTML =
        foods.map(f => `
            <div class="item">
                <b>${f.name}</b><br>
                Place: ${f.place}<br>
                Price: ₹${f.price}
            </div>
        `).join("") || "No food details available";
}

// ADMIN FOOD
function displayAdminFood() {
    document.getElementById("adminFood").innerHTML =
        foods.map(f => `
            <div class="item">
                <b>${f.name}</b><br>
                ${f.place} - ₹${f.price}
            </div>
        `).join("") || "No food details added";
}

// ADD HOTEL
function addHotel() {
    let name = document.getElementById("hotelName").value;
    let location = document.getElementById("hotelLocation").value;
    let price = document.getElementById("hotelPrice").value;

    if (!name || !location || !price) {
        alert("Please fill hotel details");
        return;
    }

    hotels.push({ name, location, price });
    saveData();

    alert("Hotel added successfully!");
    displayAdminHotels();
}

// DISPLAY HOTELS
function displayHotels() {
    document.getElementById("hotelDetails").innerHTML =
        hotels.map(h => `
            <div class="item">
                <b>${h.name}</b><br>
                Location: ${h.location}<br>
                Price per night: ₹${h.price}
            </div>
        `).join("") || "No hotels available";
}

// ADMIN HOTELS
function displayAdminHotels() {
    document.getElementById("adminHotels").innerHTML =
        hotels.map(h => `
            <div class="item">
                <b>${h.name}</b><br>
                ${h.location}<br>
                ₹${h.price} per night
            </div>
        `).join("") || "No hotels added";
}

// ADD ROUTE
function addRoute() {
    let from = document.getElementById("routeFrom").value;
    let to = document.getElementById("routeTo").value;
    let transport = document.getElementById("routeTransport").value;

    if (!from || !to || !transport) {
        alert("Please fill route details");
        return;
    }

    routes.push({ from, to, transport });
    saveData();

    alert("Route added successfully!");
    displayAdminRoutes();
}

// DISPLAY ROUTES
function displayRoutes() {
    document.getElementById("routeDetails").innerHTML =
        routes.map(r => `
            <div class="item">
                <b>${r.from} → ${r.to}</b><br>
                Transport: ${r.transport}
            </div>
        `).join("") || "No route details available";
}

// ADMIN ROUTES
function displayAdminRoutes() {
    document.getElementById("adminRoutes").innerHTML =
        routes.map(r => `
            <div class="item">
                <b>${r.from} → ${r.to}</b><br>
                ${r.transport}
            </div>
        `).join("") || "No routes added";
}

// BOOK ACCOMMODATION
function bookAccommodation() {
    let place = document.getElementById("bookingPlace").value;
    let hotel = document.getElementById("bookingHotel").value;
    let date = document.getElementById("bookingDate").value;
    let people = document.getElementById("bookingPeople").value;

    if (!place || !hotel || !date || !people) {
        alert("Please fill all booking details");
        return;
    }

    let booking = {
        user: currentUser.name,
        email: currentUser.email,
        place,
        hotel,
        date,
        people
    };

    bookings.push(booking);
    saveData();

    alert("Accommodation booked successfully!");
    displayMyBookings();
    displayAllBookings();
}

// MY BOOKINGS
function displayMyBookings() {
    let myBookings = bookings.filter(b => b.email === currentUser.email);

    document.getElementById("myBookings").innerHTML =
        myBookings.map(b => `
            <div class="item">
                Destination: ${b.place}<br>
                Hotel: ${b.hotel}<br>
                Date: ${b.date}<br>
                People: ${b.people}
            </div>
        `).join("") || "No bookings yet";
}

// ALL BOOKINGS
function displayAllBookings() {
    document.getElementById("allBookings").innerHTML =
        bookings.map(b => `
            <div class="item">
                User: ${b.user}<br>
                Destination: ${b.place}<br>
                Hotel: ${b.hotel}<br>
                Date: ${b.date}<br>
                People: ${b.people}
            </div>
        `).join("") || "No bookings available";
}

// LOGOUT
function logout() {
    currentUser = null;

    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("auth").classList.remove("hidden");

    document.getElementById("userPanel").classList.add("hidden");
    document.getElementById("adminPanel").classList.add("hidden");
}