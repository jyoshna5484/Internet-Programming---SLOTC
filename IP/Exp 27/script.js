let users = JSON.parse(localStorage.getItem("users")) || [];
let buses = JSON.parse(localStorage.getItem("buses")) || [];
let routes = JSON.parse(localStorage.getItem("routes")) || [];
let passes = JSON.parse(localStorage.getItem("passes")) || [];
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let locations = JSON.parse(localStorage.getItem("locations")) || [];

let currentUser = null;

// SAVE DATA
function saveData() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("buses", JSON.stringify(buses));
    localStorage.setItem("routes", JSON.stringify(routes));
    localStorage.setItem("passes", JSON.stringify(passes));
    localStorage.setItem("tickets", JSON.stringify(tickets));
    localStorage.setItem("locations", JSON.stringify(locations));
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

    if (role !== "user") {
        alert("Admin and Conductor accounts are created by Admin");
        return;
    }

    if (users.some(u => u.email === email)) {
        alert("User already registered");
        return;
    }

    users.push({
        name,
        email,
        password,
        role,
        balance: 0
    });

    saveData();

    alert("Registration successful!");
}

// LOGIN
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    // ADMIN LOGIN
    if (role === "admin" &&
        email === "admin@gmail.com" &&
        password === "admin123") {

        currentUser = {
            name: "Admin",
            email,
            role
        };

        openDashboard();
        return;
    }

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
    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("conductorPanel").classList.add("hidden");

    if (currentUser.role === "user") {
        document.getElementById("userPanel").classList.remove("hidden");

        updateBalance();
        displayTickets();
        displayMyPass();
        loadRoutes();
    }

    if (currentUser.role === "admin") {
        document.getElementById("adminPanel").classList.remove("hidden");

        displayBuses();
        displayRoutes();
        displayConductors();
        displayPassRequests();
        displayAdminPasses();
    }

    if (currentUser.role === "conductor") {
        document.getElementById("conductorPanel").classList.remove("hidden");
        displayLocations();
    }
}

// ADD MONEY
function addMoney() {
    let amount = Number(document.getElementById("money").value);

    if (amount <= 0) {
        alert("Enter a valid amount");
        return;
    }

    currentUser.balance += amount;
    saveData();
    updateBalance();

    alert("Money added to eWallet!");
}

// UPDATE BALANCE
function updateBalance() {
    document.getElementById("balance").innerText =
        currentUser.balance;
}

// ADD BUS
function addBus() {
    let number = document.getElementById("busNumber").value;
    let name = document.getElementById("busName").value;

    if (!number || !name) {
        alert("Enter bus details");
        return;
    }

    buses.push({ number, name });
    saveData();

    alert("Bus added successfully!");
    displayBuses();
}

// DISPLAY BUSES
function displayBuses() {
    document.getElementById("busList").innerHTML =
        buses.map(b => `
            <div class="item">
                Bus Number: ${b.number}<br>
                Bus Name: ${b.name}
            </div>
        `).join("") || "No buses added";
}

// ADD ROUTE
function addRoute() {
    let from = document.getElementById("routeFrom").value;
    let to = document.getElementById("routeTo").value;
    let stops = document.getElementById("routeStops").value;
    let time = document.getElementById("routeTime").value;
    let fare = document.getElementById("routeFare").value;

    if (!from || !to || !stops || !time || !fare) {
        alert("Fill all route details");
        return;
    }

    routes.push({ from, to, stops, time, fare });
    saveData();

    alert("Route created successfully!");
    displayRoutes();
}

// DISPLAY ROUTES
function displayRoutes() {
    document.getElementById("routeList").innerHTML =
        routes.map(r => `
            <div class="item">
                <b>${r.from} → ${r.to}</b><br>
                Stops: ${r.stops}<br>
                Time: ${r.time}<br>
                Fare: ₹${r.fare}
            </div>
        `).join("") || "No routes available";
}

// LOAD ROUTES INTO USER DROPDOWNS
function loadRoutes() {
    let options = routes.map((r, i) =>
        `<option value="${i}">${r.from} → ${r.to}</option>`
    ).join("");

    document.getElementById("ticketRoute").innerHTML = options;
    document.getElementById("timeRoute").innerHTML = options;
}

// BUY TICKET
function buyTicket() {
    let routeIndex = document.getElementById("ticketRoute").value;
    let count = Number(document.getElementById("ticketCount").value);

    if (routeIndex === "" || count <= 0) {
        alert("Select route and ticket quantity");
        return;
    }

    let route = routes[routeIndex];
    let total = Number(route.fare) * count;

    if (currentUser.balance < total) {
        alert("Insufficient wallet balance");
        return;
    }

    currentUser.balance -= total;

    let ticket = {
        id: "T" + Date.now(),
        user: currentUser.email,
        route: route.from + " to " + route.to,
        count,
        amount: total
    };

    tickets.push(ticket);
    saveData();

    alert("Ticket purchased successfully!");
    updateBalance();
    displayTickets();
}

// DISPLAY TICKETS
function displayTickets() {
    let myTickets = tickets.filter(t => t.user === currentUser.email);

    document.getElementById("myTickets").innerHTML =
        myTickets.map(t => `
            <div class="item">
                Ticket ID: ${t.id}<br>
                Route: ${t.route}<br>
                Tickets: ${t.count}<br>
                Amount: ₹${t.amount}
            </div>
        `).join("") || "No tickets purchased";
}

// APPLY BUS PASS
function applyPass() {
    let address = document.getElementById("address").value;
    let dob = document.getElementById("dob").value;
    let institution = document.getElementById("institution").value;
    let type = document.getElementById("passType").value;
    let period = Number(document.getElementById("passPeriod").value);
    let photo = document.getElementById("photo").files[0];

    if (!address || !dob || !institution || !photo) {
        alert("Please fill all pass details and upload photo");
        return;
    }

    let reader = new FileReader();

    reader.onload = function() {
        let pass = {
            id: "P" + Date.now(),
            email: currentUser.email,
            name: currentUser.name,
            address,
            dob,
            institution,
            type,
            period,
            photo: reader.result,
            approved: false,
            expiry: ""
        };

        passes.push(pass);
        saveData();

        alert("Bus pass application submitted!");
        displayMyPass();
        displayPassRequests();
    };

    reader.readAsDataURL(photo);
}

// DISPLAY MY PASS
function displayMyPass() {
    let myPass = passes.filter(p => p.email === currentUser.email);

    document.getElementById("myPass").innerHTML =
        myPass.map(p => `
            <div class="item">
                Pass ID: ${p.id}<br>
                Type: ${p.type}<br>
                Institution: ${p.institution}<br>
                Status: ${p.approved ? "Approved" : "Pending Approval"}<br>
                Validity: ${p.expiry || "Not activated"}<br>
                <img src="${p.photo}" width="100"><br>
                <div id="qr${p.id}"></div>
                ${p.approved ? `<button onclick="generateQR('${p.id}')">Generate QR Code</button>` : ""}
            </div>
        `).join("") || "No bus pass application";
}

// APPROVE PASS
function displayPassRequests() {
    document.getElementById("passRequests").innerHTML =
        passes.map(p => `
            <div class="item">
                ${p.name} - ${p.type}<br>
                Institution: ${p.institution}<br>
                Pass ID: ${p.id}<br>
                Status: ${p.approved ? "Approved" : "Pending"}<br>

                <button class="approve" onclick="approvePass('${p.id}')">
                    Approve
                </button>
            </div>
        `).join("") || "No pass requests";
}

// ADMIN PASS LIST
function displayAdminPasses() {
    document.getElementById("adminPasses").innerHTML =
        passes.map(p => `
            <div class="item">
                ${p.name}<br>
                ${p.type}<br>
                ${p.institution}<br>
                ${p.id}<br>
                Status: ${p.approved ? "Approved" : "Pending"}
            </div>
        `).join("") || "No passes available";
}

// APPROVE PASS
function approvePass(id) {
    let pass = passes.find(p => p.id === id);

    if (pass) {
        pass.approved = true;

        let today = new Date();
        today.setMonth(today.getMonth() + Number(pass.period));

        pass.expiry = today.toLocaleDateString();

        saveData();

        alert("Bus pass approved!");
        displayPassRequests();
        displayAdminPasses();
    }
}

// RENEW PASS
function renewPass() {
    let pass = passes.find(p =>
        p.email === currentUser.email && p.approved
    );

    if (!pass) {
        alert("No approved bus pass found");
        return;
    }

    let period = Number(document.getElementById("renewPeriod").value);
    let cost = period * 300;

    if (currentUser.balance < cost) {
        alert("Insufficient wallet balance. Renewal cost: ₹" + cost);
        return;
    }

    currentUser.balance -= cost;

    let expiry = new Date(pass.expiry);
    expiry.setMonth(expiry.getMonth() + period);

    pass.expiry = expiry.toLocaleDateString();

    saveData();

    alert("Bus pass renewed successfully!");
    updateBalance();
    displayMyPass();
}

// GENERATE QR CODE
function generateQR(id) {
    let pass = passes.find(p => p.id === id);

    if (!pass) return;

    let element = document.getElementById("qr" + id);
    element.innerHTML = "";

    new QRCode(element, {
        text: pass.id,
        width: 150,
        height: 150
    });
}

// VERIFY QR
function verifyQR() {
    let id = document.getElementById("qrInput").value;

    let pass = passes.find(p => p.id === id && p.approved);
    let ticket = tickets.find(t => t.id === id);

    if (pass) {
        document.getElementById("verificationResult").innerHTML =
            `<div class="item">✅ Valid Bus Pass<br>Name: ${pass.name}<br>Pass ID: ${pass.id}</div>`;
    } else if (ticket) {
        document.getElementById("verificationResult").innerHTML =
            `<div class="item">✅ Valid Ticket<br>Ticket ID: ${ticket.id}<br>Route: ${ticket.route}</div>`;
    } else {
        document.getElementById("verificationResult").innerHTML =
            `<div class="item">❌ Invalid Pass or Ticket</div>`;
    }
}

// UPDATE LOCATION
function updateBusLocation() {
    let location = document.getElementById("busLocation").value;

    if (!location) {
        alert("Enter current bus location");
        return;
    }

    locations.push({
        conductor: currentUser.name,
        location,
        date: new Date().toLocaleString()
    });

    saveData();

    alert("Bus location updated!");
    displayLocations();
}

// DISPLAY LOCATIONS
function displayLocations() {
    document.getElementById("locationUpdates").innerHTML =
        locations.map(l => `
            <div class="item">
                Bus Location: ${l.location}<br>
                Conductor: ${l.conductor}<br>
                Updated: ${l.date}
            </div>
        `).join("") || "No location updates";
}

// MANAGE CONDUCTORS
function addConductor() {
    let name = document.getElementById("conductorName").value;
    let email = document.getElementById("conductorEmail").value;
    let password = document.getElementById("conductorPassword").value;

    if (!name || !email || !password) {
        alert("Fill all conductor details");
        return;
    }

    if (users.some(u => u.email === email)) {
        alert("Account already exists");
        return;
    }

    users.push({ name, email, password, role: "conductor" });
    saveData();

    alert("Conductor account created!");
    displayConductors();
}

// DISPLAY CONDUCTORS
function displayConductors() {
    let conductors = users.filter(u => u.role === "conductor");

    document.getElementById("conductorList").innerHTML =
        conductors.map(c => `
            <div class="item">
                Name: ${c.name}<br>
                Email: ${c.email}
            </div>
        `).join("") || "No conductors";
}

// CALCULATE TRAVEL TIME
function calculateTime() {
    let index = document.getElementById("timeRoute").value;
    let route = routes[index];

    if (!route) {
        alert("Please add routes first");
        return;
    }

    document.getElementById("timeResult").innerHTML =
        `<div class="item">Route: ${route.from} to ${route.to}<br>Expected Travel Time: ${route.time}</div>`;
}

// LOGOUT
function logout() {
    currentUser = null;

    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("auth").classList.remove("hidden");

    document.getElementById("userPanel").classList.add("hidden");
    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("conductorPanel").classList.add("hidden");
}