let users = JSON.parse(localStorage.getItem("users")) || [];
let mechanics = JSON.parse(localStorage.getItem("mechanics")) || [];
let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

let currentUser = null;

// SAVE DATA
function saveData() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("mechanics", JSON.stringify(mechanics));
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
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

    // DEMO ADMIN LOGIN
    if (role === "admin" && email === "admin@gmail.com" &&
        password === "admin123") {

        currentUser = {
            name: "Admin",
            email: email,
            role: "admin"
        };

        openDashboard();
        return;
    }

    if (!user) {
        alert("Invalid login details");
        return;
    }

    currentUser = user;
    openDashboard();
}

// OPEN DASHBOARD
function openDashboard() {
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    document.getElementById("welcome").innerText =
        "Welcome, " + currentUser.name;

    showPanel();
}

// SHOW PANEL
function showPanel() {
    document.getElementById("userPanel").classList.add("hidden");
    document.getElementById("mechanicPanel").classList.add("hidden");
    document.getElementById("adminPanel").classList.add("hidden");

    if (currentUser.role === "user") {
        document.getElementById("userPanel").classList.remove("hidden");
        displayProfile();
    }

    if (currentUser.role === "mechanic") {
        document.getElementById("mechanicPanel").classList.remove("hidden");
        displayBusiness();
        displayMechanicFeedback();
    }

    if (currentUser.role === "admin") {
        document.getElementById("adminPanel").classList.remove("hidden");
        displayAdminMechanics();
    }
}

// POST BUSINESS
function postBusiness() {
    let name = document.getElementById("businessName").value;
    let location = document.getElementById("mechanicLocation").value;
    let phone = document.getElementById("mechanicPhone").value;
    let vehicle = document.getElementById("vehicleType").value;
    let license = document.getElementById("license").value;
    let services = document.getElementById("services").value;

    if (!name || !location || !phone || !vehicle || !license || !services) {
        alert("Please fill all business details");
        return;
    }

    let existing = mechanics.find(m => m.email === currentUser.email);

    if (existing) {
        existing.name = name;
        existing.location = location;
        existing.phone = phone;
        existing.vehicle = vehicle;
        existing.license = license;
        existing.services = services;
    } else {
        mechanics.push({
            email: currentUser.email,
            name,
            location,
            phone,
            vehicle,
            license,
            services,
            approved: false
        });
    }

    saveData();

    alert("Business details submitted! Waiting for admin approval.");

    displayBusiness();
    displayAdminMechanics();
}

// DISPLAY BUSINESS
function displayBusiness() {
    let business = mechanics.find(m => m.email === currentUser.email);

    document.getElementById("myBusiness").innerHTML = business ? `
        <div class="item">
            <b>${business.name}</b><br>
            Location: ${business.location}<br>
            Phone: ${business.phone}<br>
            Vehicle: ${business.vehicle}<br>
            License: ${business.license}<br>
            Services: ${business.services}<br>
            Status: ${business.approved ? "Approved ✅" : "Pending Approval ⏳"}
        </div>
    ` : "No business details posted yet.";
}

// ADMIN VIEW
function displayAdminMechanics() {
    document.getElementById("adminMechanics").innerHTML =
        mechanics.map(m => `
            <div class="item">
                <b>${m.name}</b><br>
                Location: ${m.location}<br>
                Phone: ${m.phone}<br>
                Vehicle: ${m.vehicle}<br>
                License: ${m.license}<br>
                Services: ${m.services}<br>
                Status: ${m.approved ? "Approved" : "Pending"}<br>

                <button class="approve"
                    onclick="approveMechanic('${m.email}')">
                    Approve
                </button>

                <button class="reject"
                    onclick="rejectMechanic('${m.email}')">
                    Reject
                </button>
            </div>
        `).join("") || "No mechanic registrations";
}

// APPROVE MECHANIC
function approveMechanic(email) {
    let mechanic = mechanics.find(m => m.email === email);

    if (mechanic) {
        mechanic.approved = true;
        saveData();
        displayAdminMechanics();
        alert("Mechanic approved!");
    }
}

// REJECT MECHANIC
function rejectMechanic(email) {
    mechanics = mechanics.filter(m => m.email !== email);
    saveData();
    displayAdminMechanics();
    alert("Mechanic registration rejected!");
}

// SEARCH MECHANICS
function searchMechanics() {
    let location = document.getElementById("searchLocation").value.toLowerCase();
    let vehicle = document.getElementById("searchVehicle").value;

    let result = mechanics.filter(m =>
        m.approved &&
        (!location || m.location.toLowerCase().includes(location)) &&
        (!vehicle || m.vehicle === vehicle)
    );

    document.getElementById("mechanicResults").innerHTML =
        result.map(m => `
            <div class="item">
                <b>${m.name}</b><br>
                Location: ${m.location}<br>
                Phone: ${m.phone}<br>
                Vehicle: ${m.vehicle}<br>
                Services: ${m.services}<br>

                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.location)}"
                   target="_blank">
                   📍 View Google Location
                </a>
            </div>
        `).join("") || "No approved mechanics found.";
}

// GET USER LOCATION
function getLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        document.getElementById("locationResult").innerHTML = `
            <div class="item">
                Latitude: ${latitude}<br>
                Longitude: ${longitude}<br>

                <a href="https://www.google.com/maps?q=${latitude},${longitude}"
                   target="_blank">
                   View My Location on Google Maps
                </a>
            </div>
        `;
    }, function() {
        alert("Unable to get location. Please allow location access.");
    });
}

// POST FEEDBACK
function postFeedback() {
    let mechanic = document.getElementById("feedbackMechanic").value;
    let message = document.getElementById("feedbackText").value;

    if (!mechanic || !message) {
        alert("Please enter mechanic name and feedback");
        return;
    }

    feedbacks.push({
        user: currentUser.name,
        mechanic,
        message
    });

    saveData();

    alert("Feedback submitted successfully!");
}

// DISPLAY MECHANIC FEEDBACK
function displayMechanicFeedback() {
    let myBusiness = mechanics.find(m => m.email === currentUser.email);

    if (!myBusiness) {
        document.getElementById("mechanicFeedback").innerHTML =
            "Post your business details first.";
        return;
    }

    let result = feedbacks.filter(f =>
        f.mechanic.toLowerCase() === myBusiness.name.toLowerCase()
    );

    document.getElementById("mechanicFeedback").innerHTML =
        result.map(f => `
            <div class="item">
                <b>${f.user}</b><br>
                ${f.message}
            </div>
        `).join("") || "No feedback received yet.";
}

// MY PROFILE
function displayProfile() {
    document.getElementById("myProfile").innerHTML = `
        <div class="item">
            Name: ${currentUser.name}<br>
            Email: ${currentUser.email}<br>
            Role: ${currentUser.role}
        </div>
    `;
}

// LOGOUT
function logout() {
    currentUser = null;

    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("auth").classList.remove("hidden");

    document.getElementById("userPanel").classList.add("hidden");
    document.getElementById("mechanicPanel").classList.add("hidden");
    document.getElementById("adminPanel").classList.add("hidden");
}