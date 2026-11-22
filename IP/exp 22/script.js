let users = JSON.parse(localStorage.getItem("users")) || [];
let bins = JSON.parse(localStorage.getItem("bins")) || [];
let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let reports = JSON.parse(localStorage.getItem("reports")) || [];

let currentUser = null;

// Save data
function saveData() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("bins", JSON.stringify(bins));
    localStorage.setItem("complaints", JSON.stringify(complaints));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("reports", JSON.stringify(reports));
}

// Registration
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

// Login
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    let user = users.find(u =>
        u.email === email &&
        u.password === password &&
        u.role === role
    );

    // Demo admin login
    if (role === "admin" && email === "admin@gmail.com" && password === "admin123") {
        user = { name: "Administrator", email, role: "admin" };
    }

    if (!user) {
        alert("Invalid login details");
        return;
    }

    currentUser = user;

    document.getElementById("auth").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("welcome").innerText = "Welcome, " + user.name;

    showPanel();
}

// Show role dashboard
function showPanel() {
    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("publicPanel").classList.add("hidden");
    document.getElementById("driverPanel").classList.add("hidden");

    if (currentUser.role === "admin") {
        document.getElementById("adminPanel").classList.remove("hidden");
        displayAdmin();
    }

    if (currentUser.role === "public") {
        document.getElementById("publicPanel").classList.remove("hidden");
        displayMyComplaints();
    }

    if (currentUser.role === "driver") {
        document.getElementById("driverPanel").classList.remove("hidden");
        displayTasks();
    }
}

// Add garbage bin
function addBin() {
    let location = document.getElementById("binLocation").value;
    let type = document.getElementById("binType").value;

    if (!location || !type) {
        alert("Enter bin details");
        return;
    }

    bins.push({ id: Date.now(), location, type });
    saveData();

    document.getElementById("binLocation").value = "";
    document.getElementById("binType").value = "";

    displayAdmin();
}

// Delete bin
function deleteBin(id) {
    bins = bins.filter(b => b.id !== id);
    saveData();
    displayAdmin();
}

// Display admin data
function displayAdmin() {
    document.getElementById("binCount").innerText = bins.length;
    document.getElementById("complaintCount").innerText = complaints.length;

    let driversList = users.filter(u => u.role === "driver");
    document.getElementById("driverCount").innerText = driversList.length;

    document.getElementById("bins").innerHTML = bins.map(b => `
        <div class="item">
            <b>${b.location}</b> - ${b.type}
            <button onclick="deleteBin(${b.id})">Delete</button>
        </div>
    `).join("");

    document.getElementById("drivers").innerHTML = driversList.map(d => `
        <div class="item">${d.name} - ${d.email}</div>
    `).join("");

    document.getElementById("routeDriver").innerHTML = driversList.map(d => `
        <option value="${d.email}">${d.name}</option>
    `).join("");

    document.getElementById("adminComplaints").innerHTML = complaints.map(c => `
        <div class="item">
            <b>${c.location}</b><br>
            ${c.text}<br>
            Status: ${c.status}
            <button onclick="resolveComplaint(${c.id})">Resolve</button>
        </div>
    `).join("");

    document.getElementById("reports").innerHTML = reports.map(r => `
        <div class="item">
            Driver: ${r.driver}<br>
            Garbage Load: ${r.load} kg<br>
            Route: ${r.route}
        </div>
    `).join("");
}

// Submit complaint
function submitComplaint() {
    let location = document.getElementById("complaintLocation").value;
    let text = document.getElementById("complaintText").value;

    if (!location || !text) {
        alert("Enter complaint details");
        return;
    }

    complaints.push({
        id: Date.now(),
        email: currentUser.email,
        location,
        text,
        status: "Pending"
    });

    saveData();

    document.getElementById("complaintLocation").value = "";
    document.getElementById("complaintText").value = "";

    alert("Complaint submitted successfully");
    displayMyComplaints();
}

// Public complaints
function displayMyComplaints() {
    let my = complaints.filter(c => c.email === currentUser.email);

    document.getElementById("myComplaints").innerHTML = my.map(c => `
        <div class="item">
            <b>${c.location}</b><br>
            ${c.text}<br>
            Status: ${c.status}
        </div>
    `).join("");
}

// Resolve complaint
function resolveComplaint(id) {
    complaints = complaints.map(c =>
        c.id === id ? { ...c, status: "Resolved" } : c
    );

    saveData();
    displayAdmin();
}

// Assign route
function assignRoute() {
    let driver = document.getElementById("routeDriver").value;
    let route = document.getElementById("routeLocation").value;

    if (!driver || !route) {
        alert("Select driver and enter route");
        return;
    }

    tasks.push({ driver, route, status: "Assigned" });
    saveData();

    document.getElementById("routeLocation").value = "";
    alert("Route assigned successfully");
}

// Driver tasks
function displayTasks() {
    let myTasks = tasks.filter(t => t.driver === currentUser.email);

    document.getElementById("driverTasks").innerHTML = myTasks.map(t => `
        <div class="item">
            Route: ${t.route}<br>
            Status: ${t.status}
        </div>
    `).join("");

    document.getElementById("driverRoute").innerHTML = myTasks.map(t => `
        <option value="${t.route}">${t.route}</option>
    `).join("");
}

// Choose route
function chooseRoute() {
    let route = document.getElementById("driverRoute").value;
    if (!route) {
        alert("No route available");
        return;
    }

    alert("Selected route: " + route);
}

// Update garbage load
function updateLoad() {
    let load = document.getElementById("load").value;
    let route = document.getElementById("driverRoute").value;

    if (!load || !route) {
        alert("Enter garbage load and select route");
        return;
    }

    reports.push({
        driver: currentUser.name,
        route,
        load
    });

    saveData();
    alert("Garbage load updated successfully");
}

// Logout
function logout() {
    currentUser = null;

    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("auth").classList.remove("hidden");

    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("publicPanel").classList.add("hidden");
    document.getElementById("driverPanel").classList.add("hidden");
}